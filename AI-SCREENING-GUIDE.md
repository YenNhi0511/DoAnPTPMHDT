# 🤖 Hướng dẫn Tính năng AI Lọc CV

## ✅ Trạng thái hiện tại

Tính năng AI lọc CV **đã được phát triển** và sẵn sàng sử dụng!

### Backend
- ✅ Task `screen_cv_task` trong `backend/applications/tasks.py`
- ✅ Endpoint `/api/applications/{id}/screen/` trong `ApplicationViewSet`
- ✅ Hỗ trợ parse CV (PDF, DOCX)
- ✅ Tích hợp Gemini API (optional)
- ✅ Lưu AI score và analysis vào database

### Frontend
- ✅ Button "Sàng lọc AI" trong trang Applications
- ✅ Hiển thị AI score sau khi screening
- ✅ API call `screenApplication(id)`

---

## 🚀 Cách sử dụng

### 1. Upload CV khi ứng tuyển

1. Vào trang job detail
2. Click "Ứng tuyển"
3. Upload CV (PDF hoặc DOCX)
4. Điền thông tin và submit

### 2. Sàng lọc CV bằng AI

1. Vào trang **"Hồ sơ ứng tuyển"** (`/applications`)
2. Tìm application có status `PENDING`
3. Click icon **🧠 (Brain)** để bắt đầu AI screening
4. Hệ thống sẽ:
   - Parse CV để extract text
   - So sánh với job requirements
   - Tính AI score (0-100)
   - Lưu analysis vào database

### 3. Xem kết quả

- **AI Score:** Hiển thị trong danh sách applications
- **AI Analysis:** Lưu trong field `ai_analysis` của Application model
- **Status:** Tự động chuyển sang `SCREENING` khi bắt đầu

---

## ⚙️ Cấu hình

### Sử dụng Gemini API (Recommended)

1. Lấy API key từ [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Thêm vào `.env`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. Cài đặt package:
   ```bash
   pip install google-generativeai
   ```

### Không có API key (Demo mode)

- Hệ thống sẽ tự động generate demo score (50-55)
- Vẫn parse CV và lưu extracted text
- Phù hợp cho testing và demo

---

## 📊 Cách hoạt động

### Flow

```
1. User click "Sàng lọc AI"
   ↓
2. Frontend gọi POST /api/applications/{id}/screen/
   ↓
3. Backend trigger Celery task: screen_cv_task.delay()
   ↓
4. Task thực hiện:
   a. Parse CV (PDF/DOCX) → extract text
   b. Nếu có GEMINI_API_KEY:
      - Gọi Gemini API với prompt
      - Nhận response và parse score
   c. Nếu không có API key:
      - Generate demo score
   d. Lưu ai_score và ai_analysis vào database
   ↓
5. Frontend refresh để hiển thị kết quả
```

### Prompt mẫu

```
Rate candidate for job {job_title} with JD: {job_requirements}
CV: {extracted_cv_text}
```

### Response format

```json
{
  "ai_score": 75.5,
  "ai_analysis": {
    "extracted_cv_text": "...",
    "ai_response": "...",
    "matched_skills": ["Python", "Django"],
    "missing_skills": ["Kubernetes"]
  }
}
```

---

## 🔧 Cải thiện và Customization

### 1. Cải thiện Prompt

Sửa trong `backend/applications/tasks.py`:

```python
prompt = f"""
Bạn là một chuyên gia tuyển dụng. Hãy đánh giá ứng viên cho vị trí {job_title}.

Yêu cầu công việc:
{job_requirements}

CV của ứng viên:
{extracted_cv_text}

Hãy đánh giá:
1. Điểm số phù hợp (0-100)
2. Kỹ năng phù hợp
3. Kỹ năng còn thiếu
4. Đề xuất

Trả về JSON format:
{{
  "score": 75,
  "matched_skills": ["Python", "Django"],
  "missing_skills": ["Kubernetes"],
  "recommendation": "..."
}}
"""
```

### 2. Thêm các AI Provider khác

Có thể tích hợp:
- OpenAI GPT
- Anthropic Claude
- Local LLM (Ollama, LM Studio)

### 3. Cải thiện CV Parsing

- Sử dụng thư viện tốt hơn: `pdfplumber`, `python-docx`
- Extract structured data (skills, experience, education)
- Support nhiều format hơn (images, tables)

---

## 📝 Database Schema

### Application Model

```python
ai_score = models.FloatField(null=True, blank=True)  # 0-100
ai_analysis = models.JSONField(default=dict)  # Store analysis data
```

### Example ai_analysis

```json
{
  "extracted_cv_text": "Nguyễn Văn A...",
  "ai_response": "Candidate has 5 years experience...",
  "matched_skills": ["Python", "Django", "PostgreSQL"],
  "missing_skills": ["Kubernetes", "AWS"],
  "score_breakdown": {
    "experience": 80,
    "skills": 70,
    "education": 90
  }
}
```

---

## 🧪 Testing

### Test với CV mẫu

1. Sử dụng CVs trong `backend/sample_cvs/`
2. Upload CV khi ứng tuyển
3. Click "Sàng lọc AI"
4. Kiểm tra:
   - AI score có được tạo không?
   - Analysis có đầy đủ không?
   - Status có update không?

### Test với Gemini API

1. Thêm `GEMINI_API_KEY` vào `.env`
2. Chạy Celery worker:
   ```bash
   celery -A recruitment_system worker -l info
   ```
3. Trigger screening và kiểm tra logs

---

## 🐛 Troubleshooting

### Vấn đề: AI score không được tạo

**Nguyên nhân:**
- Celery worker không chạy
- Task bị lỗi

**Giải pháp:**
1. Kiểm tra Celery worker đang chạy
2. Xem logs: `celery -A recruitment_system worker -l info`
3. Kiểm tra database có update không

### Vấn đề: CV không được parse

**Nguyên nhân:**
- Format không hỗ trợ
- File bị corrupt

**Giải pháp:**
1. Kiểm tra CV là PDF hoặc DOCX
2. Thử với CV khác
3. Xem logs để biết lỗi cụ thể

### Vấn đề: Gemini API không hoạt động

**Nguyên nhân:**
- API key sai
- Quota hết
- Network issue

**Giải pháp:**
1. Kiểm tra API key trong `.env`
2. Test API key trực tiếp
3. Kiểm tra quota trong Google AI Studio

---

## 📚 Tài liệu tham khảo

- [Gemini API Docs](https://ai.google.dev/docs)
- [Celery Documentation](https://docs.celeryproject.org/)
- [PyPDF2 Documentation](https://pypdf2.readthedocs.io/)

---

## ✅ Checklist

- [x] Backend task `screen_cv_task`
- [x] API endpoint `/screen/`
- [x] Frontend button và UI
- [x] CV parsing (PDF, DOCX)
- [x] Gemini API integration
- [x] Demo mode (không cần API key)
- [x] Database storage (ai_score, ai_analysis)
- [ ] Advanced prompt engineering
- [ ] Multiple AI providers
- [ ] Better CV parsing
- [ ] Real-time updates (WebSocket)

---

**Tính năng đã sẵn sàng sử dụng! 🎉**

