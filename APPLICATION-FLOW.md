# 📋 Hướng dẫn Chức năng Nộp Hồ sơ và AI Screening

## ✅ Trạng thái hiện tại

**Chức năng nộp hồ sơ đã được hoàn thiện và hoạt động tự động!**

---

## 🎯 Tổng quan Flow

```
1. User nộp hồ sơ
   ↓
2. CV được lưu vào backend/media/cvs/
   ↓
3. Django Signals tự động trigger:
   - Gửi email xác nhận
   - Parse CV (extract text)
   - AI Screening với Gemini
   ↓
4. Kết quả được lưu vào database
```

---

## 📍 1. Nơi lưu CV

### Đường dẫn lưu trữ

**Local:**
```
backend/media/cvs/[filename]
```

**Cấu hình trong `settings.py`:**
```python
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

**Trong Model:**
```python
cv_file = models.FileField(upload_to='cvs/', help_text='CV file (PDF/DOCX)')
```

### Ví dụ đường dẫn đầy đủ

```
D:\DoAnPTPMHDT\backend\media\cvs\CV_Nguyen_Van_A.pdf
```

### Truy cập CV qua URL

```
http://localhost:8000/media/cvs/CV_Nguyen_Van_A.pdf
```

**Lưu ý:** Cần cấu hình URL routing trong `urls.py` để serve media files.

---

## 🔧 2. Nơi xử lý

### Frontend

**File:** `frontend/src/pages/JobDetail.jsx`

**Chức năng:**
- Form nộp hồ sơ (dòng 219-289)
- Upload CV file
- Gửi request đến API

**API Call:**
```javascript
await applyToJob(id, applyData);
```

### Backend

#### 2.1. API Endpoint

**File:** `backend/jobs/views.py`

**Endpoint:** `POST /api/jobs/{id}/apply/`

**Code:**
```python
@action(detail=True, methods=['post'], permission_classes=[IsAuthenticatedOrReadOnly])
def apply(self, request, pk=None):
    """Public application endpoint (allow anonymous)"""
    job = self.get_object()
    serializer = ApplicationCreateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        application = serializer.save()
        return Response(ApplicationSerializer(application).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

#### 2.2. Serializer

**File:** `backend/applications/serializers.py`

**Class:** `ApplicationCreateSerializer`

**Chức năng:**
- Validate dữ liệu
- Tạo Application object
- Lưu CV file
- Tự động tạo user nếu anonymous

#### 2.3. Django Signals (Tự động xử lý)

**File:** `backend/applications/signals.py`

**Chức năng:**
- Tự động trigger khi Application được tạo
- Gọi 3 Celery tasks:
  1. `send_confirmation_email_task` - Gửi email xác nhận
  2. `parse_cv_task` - Parse CV để extract text
  3. `screen_cv_task` - AI screening với Gemini

**Code:**
```python
@receiver(post_save, sender=Application)
def application_created(sender, instance, created, **kwargs):
    if created:
        send_confirmation_email_task.delay(str(instance.id))
        parse_cv_task.delay(str(instance.id))
        screen_cv_task.delay(str(instance.id))
```

#### 2.4. Celery Tasks

**File:** `backend/applications/tasks.py`

**Tasks:**
- `parse_cv_task` - Parse PDF/DOCX để extract text
- `screen_cv_task` - AI screening với Gemini API
- `send_confirmation_email_task` - Gửi email xác nhận

---

## 🤖 3. Gemini AI - Dùng để làm gì?

### Mục đích

**Gemini được dùng để:**
1. ✅ **Sàng lọc CV tự động** - Đánh giá CV phù hợp với job requirements
2. ✅ **Tính điểm AI Score** (0-100) - Đánh giá mức độ phù hợp
3. ✅ **Phân tích CV** - Extract thông tin, skills, experience
4. ✅ **So sánh với JD** - So sánh CV với job description và requirements

### Cách hoạt động

**File:** `backend/applications/tasks.py` - `screen_cv_task()`

**Flow:**
```
1. Parse CV → Extract text
   ↓
2. Lấy job requirements
   ↓
3. Gọi Gemini API với prompt:
   "Rate candidate for job {title} with JD: {requirements}
    CV: {extracted_text}"
   ↓
4. Nhận response từ Gemini
   ↓
5. Parse và tính điểm (0-100)
   ↓
6. Lưu vào database:
   - ai_score: Float (0-100)
   - ai_analysis: JSON (analysis data)
```

### Prompt mẫu

```
Rate candidate for job Senior Full Stack Developer 
with JD: - 5+ years experience
         - JavaScript, React, Node.js
         - Python/Django
CV: [extracted CV text]
```

### Kết quả

**Lưu trong Application model:**
```python
ai_score = 75.5  # Điểm từ 0-100
ai_analysis = {
    "extracted_cv_text": "...",
    "ai_response": "Candidate has 5 years experience...",
    "matched_skills": ["Python", "Django", "React"],
    "missing_skills": ["Kubernetes"]
}
```

---

## 🚀 4. Có dùng Gemini được không?

### ✅ Có, đã được tích hợp sẵn!

### Cách sử dụng

#### Option 1: Với Gemini API Key (Recommended)

1. **Lấy API key:**
   - Truy cập: https://makersuite.google.com/app/apikey
   - Tạo API key mới

2. **Thêm vào `.env`:**
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Cài đặt package:**
   ```bash
   pip install google-generativeai
   ```

4. **Chạy Celery worker:**
   ```bash
   celery -A recruitment_system worker -l info
   ```

5. **Kết quả:**
   - Gemini sẽ tự động phân tích CV
   - Tính điểm AI score chính xác
   - Phân tích chi tiết

#### Option 2: Không có API Key (Demo mode)

- Hệ thống tự động generate demo score (50-55)
- Vẫn parse CV và lưu extracted text
- Phù hợp cho testing và demo

---

## 📊 5. Database Schema

### Application Model

```python
class Application(models.Model):
    cv_file = models.FileField(upload_to='cvs/')  # Lưu trong media/cvs/
    ai_score = models.FloatField(null=True)  # Điểm AI (0-100)
    ai_analysis = models.JSONField(null=True)  # Phân tích chi tiết
    status = models.CharField(...)  # PENDING, SCREENING, etc.
```

### Ví dụ dữ liệu

```json
{
  "id": "uuid",
  "job": "job_uuid",
  "candidate": "user_uuid",
  "cv_file": "cvs/CV_Nguyen_Van_A.pdf",
  "ai_score": 75.5,
  "ai_analysis": {
    "extracted_cv_text": "Nguyễn Văn A...",
    "ai_response": "Candidate has strong Python skills...",
    "matched_skills": ["Python", "Django"],
    "missing_skills": ["Kubernetes"]
  },
  "status": "SCREENING"
}
```

---

## 🔄 6. Flow hoàn chỉnh

### Khi user nộp hồ sơ:

```
1. User điền form và upload CV
   ↓
2. Frontend gọi POST /api/jobs/{id}/apply/
   ↓
3. Backend tạo Application object
   - Lưu CV vào media/cvs/
   - Tạo user nếu anonymous
   ↓
4. Django Signal trigger
   ↓
5. Celery Tasks chạy song song:
   ├─ send_confirmation_email_task
   │  └─ Gửi email xác nhận
   ├─ parse_cv_task
   │  └─ Parse CV → Extract text
   └─ screen_cv_task
      ├─ Nếu có GEMINI_API_KEY:
      │  └─ Gọi Gemini API
      │  └─ Tính điểm AI score
      └─ Nếu không có:
         └─ Generate demo score
   ↓
6. Kết quả lưu vào database
   - ai_score: 75.5
   - ai_analysis: {...}
   - status: SCREENING
   ↓
7. Admin xem trong Applications page
   - Thấy AI score
   - Có thể xem chi tiết analysis
```

---

## 🧪 7. Test Flow

### Test nộp hồ sơ:

1. **Chạy servers:**
   ```bash
   # Terminal 1: Backend
   python manage.py runserver
   
   # Terminal 2: Celery
   celery -A recruitment_system worker -l info
   
   # Terminal 3: Frontend
   npm start
   ```

2. **Nộp hồ sơ:**
   - Login với user account
   - Vào job detail
   - Click "Ứng tuyển"
   - Upload CV từ `sample_cvs/`
   - Submit

3. **Kiểm tra:**
   - CV được lưu trong `backend/media/cvs/`
   - Email xác nhận được gửi (console)
   - AI score được tạo (sau vài giây)
   - Xem trong Applications page

---

## 📝 8. Checklist

- [x] Frontend form nộp hồ sơ
- [x] Backend API endpoint
- [x] File storage (media/cvs/)
- [x] Django Signals tự động trigger
- [x] Parse CV task
- [x] AI Screening với Gemini
- [x] Email confirmation
- [x] Database lưu ai_score và ai_analysis
- [x] Frontend hiển thị AI score

---

## 🐛 Troubleshooting

### Vấn đề: CV không được lưu

**Giải pháp:**
1. Kiểm tra `MEDIA_ROOT` trong settings
2. Đảm bảo thư mục `media/cvs/` tồn tại
3. Kiểm tra quyền ghi file

### Vấn đề: AI score không được tạo

**Giải pháp:**
1. Kiểm tra Celery worker đang chạy
2. Xem logs: `celery -A recruitment_system worker -l info`
3. Kiểm tra `GEMINI_API_KEY` trong `.env`

### Vấn đề: Signals không trigger

**Giải pháp:**
1. Kiểm tra `apps.py` có import signals không
2. Restart Django server
3. Kiểm tra Celery worker

---

## 📚 Tài liệu liên quan

- [AI Screening Guide](./AI-SCREENING-GUIDE.md) - Chi tiết về AI screening
- [Setup Guide](./SETUP.md) - Hướng dẫn setup project

---

**Tất cả đã sẵn sàng và hoạt động tự động! 🎉**

