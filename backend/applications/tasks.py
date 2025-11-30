from __future__ import absolute_import, unicode_literals
from recruitment_system.celery import app
from .models import Application
import os
import json
import re


@app.task(bind=True)
def parse_cv_task(self, application_id):
    try:
        app_obj = Application.objects.get(id=application_id)
    except Application.DoesNotExist:
        return

    # Simple parser: extract text if PDF or DOCX
    extracted = ''
    try:
        cv_path = app_obj.cv_file.path
        ext = os.path.splitext(cv_path)[1].lower()
        if ext == '.pdf':
            from PyPDF2 import PdfReader
            reader = PdfReader(cv_path)
            for page in reader.pages:
                extracted += page.extract_text() or ''
        elif ext in ['.docx', '.doc']:
            import mammoth
            with open(cv_path, 'rb') as docx_file:
                result = mammoth.extract_raw_text(docx_file)
                extracted = result.value
        else:
            extracted = ''
    except Exception as e:
        print('Failed to parse CV:', e)

    # Store extracted text in ai_analysis (for example) without overriding AI results
    analysis = app_obj.ai_analysis or {}
    analysis['extracted_cv_text'] = extracted
    app_obj.ai_analysis = analysis
    app_obj.save()


@app.task(bind=True)
def screen_cv_task(self, application_id):
    """AI Screening CV sử dụng Google Gemini API"""
    try:
        app_obj = Application.objects.get(id=application_id)
    except Application.DoesNotExist:
        print(f'Application {application_id} not found')
        return

    # Get extracted CV text
    analysis = app_obj.ai_analysis or {}
    cv_text = analysis.get('extracted_cv_text', '')
    
    if not cv_text:
        print(f'No CV text extracted for application {application_id}')
        # Set default score if no CV text
        app_obj.ai_score = 0.0
        app_obj.ai_analysis = {
            **analysis,
            'ai_response': 'Không thể đọc được nội dung CV. Vui lòng kiểm tra lại file CV.',
            'error': 'No CV text extracted'
        }
        app_obj.status = Application.Status.SCREENING
        app_obj.save()
        return

    # Get Gemini API key from settings
    from django.conf import settings
    gemini_key = os.environ.get('GEMINI_API_KEY', getattr(settings, 'GEMINI_API_KEY', ''))

    if not gemini_key:
        print('GEMINI_API_KEY not configured, using fallback scoring')
        # Fallback: Simple rule-based scoring
        score = calculate_fallback_score(cv_text, app_obj.job)
        analysis['ai_response'] = 'AI chưa được cấu hình. Sử dụng đánh giá cơ bản.'
        analysis['method'] = 'fallback'
    else:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            
            # Use Gemini 1.5 Pro model
            model = genai.GenerativeModel('gemini-1.5-pro')
            
            # Create comprehensive prompt for CV evaluation
            prompt = f"""Bạn là chuyên gia tuyển dụng. Hãy đánh giá CV của ứng viên cho vị trí "{app_obj.job.title}".

THÔNG TIN VỊ TRÍ:
- Tiêu đề: {app_obj.job.title}
- Mô tả: {app_obj.job.description[:500]}
- Yêu cầu: {app_obj.job.requirements[:1000]}
- Kinh nghiệm yêu cầu: {app_obj.job.experience_years or 'Không yêu cầu'} năm

NỘI DUNG CV:
{cv_text[:4000]}

Hãy đánh giá CV và trả về kết quả theo format JSON:
{{
    "score": <số điểm từ 0-100>,
    "strengths": ["điểm mạnh 1", "điểm mạnh 2", ...],
    "weaknesses": ["điểm yếu 1", "điểm yếu 2", ...],
    "match_level": "<Rất phù hợp/Phù hợp/Không phù hợp>",
    "recommendation": "<Nên phỏng vấn/Nên xem xét/Không phù hợp>",
    "summary": "<tóm tắt ngắn gọn về ứng viên>"
}}

Chỉ trả về JSON, không có text thêm."""

            # Generate response
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Parse JSON response
            # Extract JSON from response (remove markdown code blocks if any)
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                response_json = json.loads(json_match.group())
                score = float(response_json.get('score', 50))
                analysis['ai_response'] = response_text
                analysis['parsed_response'] = response_json
                analysis['method'] = 'gemini-1.5-pro'
            else:
                # Fallback if JSON parsing fails
                print('Failed to parse Gemini response as JSON, using fallback')
                score = calculate_fallback_score(cv_text, app_obj.job)
                analysis['ai_response'] = response_text
                analysis['method'] = 'gemini-fallback'
                
        except json.JSONDecodeError as e:
            print(f'JSON decode error: {e}')
            score = calculate_fallback_score(cv_text, app_obj.job)
            analysis['ai_response'] = f'Lỗi phân tích phản hồi AI: {str(e)}'
            analysis['method'] = 'fallback'
        except Exception as e:
            print(f'Gemini API error: {e}')
            import traceback
            traceback.print_exc()
            # Fallback scoring
            score = calculate_fallback_score(cv_text, app_obj.job)
            analysis['ai_response'] = f'Lỗi khi gọi Gemini API: {str(e)}. Sử dụng đánh giá cơ bản.'
            analysis['error'] = str(e)
            analysis['method'] = 'fallback'

    # Update application
    app_obj.ai_score = float(score)
    app_obj.ai_analysis = analysis
    app_obj.status = Application.Status.SCREENING
    app_obj.save()
    
    print(f'✅ CV screening completed for application {application_id}: Score = {score}')


def calculate_fallback_score(cv_text, job):
    """Fallback scoring khi không có Gemini API"""
    score = 50.0  # Base score
    
    # Simple keyword matching
    cv_lower = cv_text.lower()
    job_title_lower = job.title.lower()
    job_req_lower = job.requirements.lower() if job.requirements else ''
    
    # Check if CV contains job title keywords
    title_words = job_title_lower.split()
    title_matches = sum(1 for word in title_words if len(word) > 3 and word in cv_lower)
    if title_matches > 0:
        score += min(20, title_matches * 5)
    
    # Check for experience keywords
    exp_keywords = ['kinh nghiệm', 'experience', 'năm', 'year', 'thực tập', 'intern']
    exp_matches = sum(1 for kw in exp_keywords if kw in cv_lower)
    if exp_matches > 0:
        score += min(15, exp_matches * 3)
    
    # Check for skills keywords
    skill_keywords = ['kỹ năng', 'skill', 'thành thạo', 'proficient', 'chứng chỉ', 'certificate']
    skill_matches = sum(1 for kw in skill_keywords if kw in cv_lower)
    if skill_matches > 0:
        score += min(15, skill_matches * 3)
    
    return min(100, max(0, score))


# Email tasks removed - chỉ dùng notification
# Notification được tạo trực tiếp trong views.py


@app.task(bind=True)
def generate_offer_task(self, result_id):
    try:
        from .models import RecruitmentResult
        res = RecruitmentResult.objects.get(id=result_id)
    except Exception as e:
        print('generate_offer_task: Could not find result', e)
        return

    # temporarily use reportlab to generate simple pdf
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
    except Exception as e:
        print('reportlab not installed', e)
        return

    # Build file path
    filename = f"offer_{res.id}.pdf"
    filepath = os.path.join(settings.MEDIA_ROOT, 'offer_letters')
    os.makedirs(filepath, exist_ok=True)
    fullpath = os.path.join(filepath, filename)

    c = canvas.Canvas(fullpath, pagesize=letter)
    c.setFont('Helvetica', 12)
    c.drawString(72, 720, f"Offer Letter for {res.application.candidate.get_full_name()}")
    c.drawString(72, 700, f"Position: {res.application.job.title}")
    if res.salary:
        c.drawString(72, 680, f"Salary: {res.salary}")
    if res.start_date:
        c.drawString(72, 660, f"Start Date: {res.start_date}")
    c.drawString(72, 640, "Congratulations on your offer.")
    c.save()

    # attach to model
    with open(fullpath, 'rb') as f:
        from django.core.files.base import ContentFile
        res.offer_letter_file.save(filename, ContentFile(f.read()), save=True)
