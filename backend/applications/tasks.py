from __future__ import absolute_import, unicode_literals
from recruitment_system.celery import app
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from .models import Application
import os
import json

@app.task(bind=True)
def send_confirmation_email_task(self, application_id):
    try:
        app_obj = Application.objects.get(id=application_id)
    except Application.DoesNotExist:
        return

    subject = f"Xác nhận hồ sơ - {app_obj.job.title}"
    to_email = [app_obj.candidate.email]
    context = {
        'candidate': app_obj.candidate,
        'job': app_obj.job,
        'application': app_obj,
    }

    # Render text and html (simple fallback)
    text_content = render_to_string('email/application_received.txt', context)
    html_content = render_to_string('email/application_received.html', context)

    msg = EmailMultiAlternatives(subject, text_content, settings.EMAIL_HOST_USER, to_email)
    if html_content:
        msg.attach_alternative(html_content, 'text/html')
    try:
        msg.send()
    except Exception as e:
        print('Failed to send confirmation email:', e)


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
    try:
        app_obj = Application.objects.get(id=application_id)
    except Application.DoesNotExist:
        return

    # If GEMINI API configured, call it, otherwise fake a result
    score = None
    analysis = app_obj.ai_analysis or {}

    from django.conf import settings
    gemini_key = getattr(settings, 'GEMINI_API_KEY', '')

    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            prompt = f"Rate candidate for job {app_obj.job.title} with JD: {app_obj.job.requirements}\nCV: {analysis.get('extracted_cv_text','')[:1000]}"
            # A very simple usage - check the API docs to implement properly
            resp = genai.generate_text(model='gemini-1.0', input=prompt)
            # Parse resp - this depends on the API's response schema (adjust accordingly)
            text = str(resp)
            # naive parsing for demo
            analysis['ai_response'] = text
            score = 50
        except Exception as e:
            print('Gemini error:', e)
            score = 50
    else:
        # Fake score
        score = 55
        analysis['ai_response'] = 'No AI key provided — generated demo score.'

    app_obj.ai_score = float(score)
    app_obj.ai_analysis = analysis
    app_obj.save()


@app.task(bind=True)
def send_result_email_task(self, result_id):
    # Placeholder for sending recruitment result emails
    from .models import RecruitmentResult
    try:
        res = RecruitmentResult.objects.get(id=result_id)
    except Exception:
        return

    to_email = [res.application.candidate.email]
    subject = f"Kết quả tuyển dụng cho {res.application.job.title}: {res.final_decision}"
    context = {'result': res}
    text_content = render_to_string('email/result_notification.txt', context)
    html_content = render_to_string('email/result_notification.html', context)

    msg = EmailMultiAlternatives(subject, text_content, settings.EMAIL_HOST_USER, to_email)
    if html_content:
        msg.attach_alternative(html_content, 'text/html')
    try:
        msg.send()
    except Exception as e:
        print('Failed to send result email:', e)


@app.task(bind=True)
def send_interview_email_task(self, interview_id):
    from applications.models import Interview
    try:
        interview = Interview.objects.select_related('application__candidate', 'application__job').get(id=interview_id)
    except Exception:
        return

    to_candidate = [interview.application.candidate.email]
    to_panel = [p.interviewer.email for p in interview.panel_set.all()] if hasattr(interview, 'panel_set') else []
    subject = f"Thông báo phỏng vấn: {interview.application.job.title}"
    context = {'interview': interview}
    text_content = render_to_string('email/interview_notification.txt', context)
    html_content = render_to_string('email/interview_notification.html', context)

    recipients = list(set(to_candidate + to_panel))
    msg = EmailMultiAlternatives(subject, text_content, settings.EMAIL_HOST_USER, recipients)
    if html_content:
        msg.attach_alternative(html_content, 'text/html')
    try:
        msg.send()
    except Exception as e:
        print('Failed to send interview email:', e)


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
