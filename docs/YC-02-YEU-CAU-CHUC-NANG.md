# PHẦN 2: YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

## ĐỀ TÀI: XÂY DỰNG HỆ THỐNG TUYỂN DỤNG NHÂN SỰ

---

## 2.1. Tổng Quan Yêu Cầu Chức Năng

Hệ thống tuyển dụng nhân sự bao gồm **10 yêu cầu chức năng chính** (FR1 - FR10), được thiết kế để đáp ứng toàn bộ quy trình tuyển dụng từ đăng tin đến gửi thư mời nhận việc.

### Sơ đồ tóm tắt các module chức năng:

```
┌─────────────────────────────────────────────────────────────┐
│                  HỆ THỐNG TUYỂN DỤNG                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  FR1: User Management        FR6: Interview Management      │
│  FR2: Job Management         FR7: Result Management         │
│  FR3: Application Management FR8: Notification System       │
│  FR4: CV Screening (AI)      FR9: Dashboard & Reports       │
│  FR5: Recruitment Process    FR10: Search & Filter          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## FR1: Quản Lý Người Dùng và Phân Quyền

### 2.1.1. Mô tả

Quản lý tài khoản người dùng với 4 vai trò khác nhau, đảm bảo bảo mật và phân quyền truy cập phù hợp.

### 2.1.2. Các vai trò (Roles)

| Vai trò         | Mô tả                  | Quyền hạn chính                                    |
| --------------- | ---------------------- | -------------------------------------------------- |
| **Admin**       | Quản trị viên hệ thống | Full access, quản lý user, xem tất cả dữ liệu      |
| **Recruiter**   | Nhân viên tuyển dụng   | CRUD jobs, quản lý applications, tạo interviews    |
| **Interviewer** | Giám khảo phỏng vấn    | Xem interviews được phân công, đánh giá candidates |
| **Candidate**   | Ứng viên               | Nộp hồ sơ, xem trạng thái application              |

### 2.1.3. Chức năng chi tiết

#### FR1.1: Đăng ký tài khoản (Registration)

**User story**: _"Là một ứng viên, tôi muốn đăng ký tài khoản để có thể nộp hồ sơ ứng tuyển"_

**Input**:

- Email (unique, valid format)
- Password (min 8 chars, có chữ hoa + số + ký tự đặc biệt)
- Full name
- Phone number
- Role (mặc định: Candidate)

**Process**:

1. Validate thông tin đầu vào
2. Hash password bằng bcrypt
3. Tạo verification token
4. Lưu user vào database với `is_verified=False`
5. Gửi email xác thực

**Output**:

- Thông báo "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản"
- Email chứa link xác thực (expires trong 24h)

**Validation rules**:

```python
- Email: regex ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
- Password: min_length=8, required_special_char=True, required_digit=True
- Phone: regex ^(0|\+84)[0-9]{9,10}$
- Full name: max_length=100, min_length=2
```

**Acceptance criteria**:

- ✅ User có thể đăng ký với email chưa tồn tại
- ✅ Email xác thực được gửi trong vòng 10 giây
- ✅ Password được hash trước khi lưu database
- ✅ Hiển thị lỗi rõ ràng nếu email đã tồn tại
- ❌ Không cho phép đăng nhập nếu chưa verify email

---

#### FR1.2: Xác thực email (Email Verification)

**User story**: _"Là một ứng viên mới đăng ký, tôi muốn xác thực email để kích hoạt tài khoản"_

**Input**:

- Verification token từ link email

**Process**:

1. Validate token (check expiry, signature)
2. Tìm user theo token
3. Cập nhật `is_verified=True`
4. Xóa token

**Output**:

- Chuyển hướng đến trang login
- Thông báo "Email đã được xác thực. Vui lòng đăng nhập"

**Edge cases**:

- Token hết hạn → Hiển thị button "Gửi lại email xác thực"
- Token không hợp lệ → Hiển thị lỗi
- User đã verified → Hiển thị thông báo "Tài khoản đã được xác thực trước đó"

---

#### FR1.3: Đăng nhập (Login)

**User story**: _"Là người dùng, tôi muốn đăng nhập để truy cập các chức năng theo vai trò của mình"_

**Input**:

- Email
- Password

**Process**:

1. Validate email tồn tại
2. Check `is_verified=True`
3. Verify password với hash trong DB
4. Tạo JWT access token (expires 1h) và refresh token (expires 7 days)
5. Ghi log đăng nhập

**Output**:

- JWT tokens (access + refresh)
- User profile (id, name, email, role)
- Chuyển hướng đến dashboard tương ứng vai trò:
  - Admin → `/admin/dashboard`
  - Recruiter → `/recruiter/dashboard`
  - Interviewer → `/interviewer/dashboard`
  - Candidate → `/candidate/dashboard`

**Security**:

```javascript
// JWT payload
{
  "user_id": 123,
  "email": "user@example.com",
  "role": "candidate",
  "exp": 1735560000,
  "iat": 1735556400
}
```

**Acceptance criteria**:

- ✅ Login thành công chuyển đến dashboard đúng vai trò
- ✅ Sai password hiển thị lỗi "Thông tin đăng nhập không chính xác"
- ✅ Chưa verify email hiển thị "Vui lòng xác thực email trước khi đăng nhập"
- ✅ Token được lưu vào localStorage/cookies
- ✅ Auto logout sau 1h nếu không refresh token

---

#### FR1.4: Quản lý profile (Profile Management)

**User story**: _"Là người dùng, tôi muốn cập nhật thông tin cá nhân của mình"_

**Input** (có thể cập nhật):

- Full name
- Phone number
- Avatar (upload image)
- Resume/CV (chỉ cho Candidate)

**Process**:

1. Validate dữ liệu đầu vào
2. Upload avatar/CV lên cloud storage (nếu có)
3. Cập nhật database
4. Return profile mới

**Output**:

- Profile đã cập nhật
- Thông báo "Cập nhật thông tin thành công"

**Constraints**:

- Avatar: max 5MB, formats (jpg, png, webp)
- CV: max 10MB, formats (pdf, docx)
- Không cho phép thay đổi email (cần verify lại)
- Không cho phép user tự đổi role

---

#### FR1.5: Quản lý users (Admin only)

**User story**: _"Là Admin, tôi muốn quản lý tất cả users trong hệ thống"_

**Chức năng**:

1. **Xem danh sách users**

   - Filter: role, verified status, created date
   - Sort: name, email, created_at
   - Pagination: 20 users/page

2. **Tạo user mới**

   - Tạo tài khoản cho Recruiter, Interviewer
   - Gửi email với password tạm thời
   - Bắt buộc đổi password lần đầu login

3. **Cập nhật user**

   - Đổi role
   - Kích hoạt/vô hiệu hóa tài khoản
   - Reset password

4. **Xóa user**
   - Soft delete (đánh dấu `is_active=False`)
   - Không xóa nếu user có dữ liệu liên quan (applications, interviews)

**Permissions**:

```python
# Django permission check
@permission_classes([IsAuthenticated, IsAdminUser])
def manage_users(request):
    # Only Admin can access
    pass
```

---

## FR2: Quản Lý Tin Tuyển Dụng (Job Management)

### 2.2.1. Mô tả

Recruiter tạo và quản lý các tin tuyển dụng với thông tin chi tiết về vị trí, yêu cầu và quy trình.

### 2.2.2. Chức năng chi tiết

#### FR2.1: Tạo tin tuyển dụng (Create Job Posting)

**User story**: _"Là Recruiter, tôi muốn đăng tin tuyển dụng để tìm kiếm ứng viên"_

**Input**:

```json
{
  "title": "Senior Backend Developer",
  "department": "Engineering",
  "employment_type": "FULL_TIME", // FULL_TIME, PART_TIME, CONTRACT, INTERN
  "location": "Hà Nội, Vietnam",
  "salary_range": "1500-2500 USD",
  "experience_required": "3+ years",
  "education_required": "Bachelor in Computer Science",
  "skills_required": ["Python", "Django", "PostgreSQL", "REST API"],
  "description": "We are looking for...",
  "responsibilities": "- Design and develop...\n- Collaborate with...",
  "benefits": "- Competitive salary\n- Health insurance\n- Flexible working hours",
  "application_deadline": "2024-12-31",
  "number_of_positions": 2,
  "status": "DRAFT" // DRAFT, OPEN, CLOSED, FILLED
}
```

**Process**:

1. Validate dữ liệu (required fields, date format, etc.)
2. Tạo recruitment process mặc định (3 bước):
   - Step 1: CV Screening (AI auto)
   - Step 2: Technical Interview
   - Step 3: HR Interview
3. Lưu job vào database
4. Tạo notification cho Admin

**Output**:

- Job ID
- Redirect to job detail page
- Thông báo "Tin tuyển dụng đã được tạo"

**Validation rules**:

- Title: required, max 200 chars
- Application deadline: phải >= ngày hiện tại
- Number of positions: integer, min=1, max=100
- Skills required: array, min 1 skill

---

#### FR2.2: Xem danh sách jobs

**User story**: _"Là Recruiter, tôi muốn xem tất cả tin tuyển dụng đã đăng"_

**Filters**:

- Status: Draft, Open, Closed, Filled
- Department: Engineering, Sales, Marketing, etc.
- Employment type: Full-time, Part-time, Contract, Intern
- Date range: Created from - to

**Sort options**:

- Created date (newest/oldest)
- Application deadline
- Number of applications
- Title (A-Z, Z-A)

**Display**:

```
┌────────────────────────────────────────────────────┐
│ Senior Backend Developer             [OPEN]        │
│ Engineering • Full-time • Hà Nội                   │
│ 45 applications • Deadline: 31/12/2024             │
│ [View] [Edit] [Close] [Reports]                    │
└────────────────────────────────────────────────────┘
```

---

#### FR2.3: Cập nhật job

**User story**: _"Là Recruiter, tôi muốn chỉnh sửa thông tin tin tuyển dụng"_

**Có thể cập nhật**:

- Tất cả thông tin job
- Thay đổi status:
  - DRAFT → OPEN (publish job)
  - OPEN → CLOSED (stop accepting applications)
  - OPEN → FILLED (đã tuyển đủ người)

**Không thể cập nhật nếu**:

- Job đã CLOSED hoặc FILLED và có applications
- Đã quá application deadline

**Business rules**:

- Thay đổi status OPEN → CLOSED sẽ gửi email thông báo cho ứng viên đang chờ
- Thay đổi skills_required sẽ trigger re-screening cho applications chưa được screen

---

#### FR2.4: Xóa job

**User story**: _"Là Recruiter, tôi muốn xóa tin tuyển dụng không còn cần thiết"_

**Conditions**:

- Chỉ xóa được job ở trạng thái DRAFT
- Không xóa được nếu job có applications

**Process**:

- Soft delete: `is_deleted=True, deleted_at=now()`
- Lưu lại dữ liệu để báo cáo

---

#### FR2.5: Thiết lập quy trình tuyển dụng

**User story**: _"Là Recruiter, tôi muốn tùy chỉnh quy trình tuyển dụng cho từng vị trí"_

**Input**:

```json
{
  "recruitment_process": {
    "job_id": 123,
    "steps": [
      {
        "step_number": 1,
        "step_name": "CV Screening",
        "step_type": "SCREENING", // SCREENING, INTERVIEW, TEST, OFFER
        "is_ai_enabled": true,
        "duration_days": 3
      },
      {
        "step_number": 2,
        "step_name": "Technical Interview",
        "step_type": "INTERVIEW",
        "is_ai_enabled": false,
        "duration_days": 7
      },
      {
        "step_number": 3,
        "step_name": "Final Interview",
        "step_type": "INTERVIEW",
        "is_ai_enabled": false,
        "duration_days": 5
      }
    ]
  }
}
```

**Features**:

- Thêm/xóa/sắp xếp các bước
- Bật/tắt AI cho từng bước
- Thiết lập thời gian dự kiến cho mỗi bước
- Template sẵn cho các loại vị trí (Technical, Sales, Marketing)

---

## FR3: Quản Lý Hồ Sơ Ứng Viên (Application Management)

### 2.3.1. Mô tả

Ứng viên nộp hồ sơ, Recruiter quản lý và theo dõi trạng thái các hồ sơ.

### 2.3.2. Chức năng chi tiết

#### FR3.1: Nộp hồ sơ (Submit Application)

**User story**: _"Là ứng viên, tôi muốn nộp hồ sơ cho vị trí tuyển dụng tôi quan tâm"_

**Input**:

- Job ID
- CV/Resume (upload file PDF/DOCX)
- Cover letter (optional, text)
- Additional documents (optional, max 3 files)

**Process**:

1. Validate file (format, size < 10MB)
2. Upload CV to cloud storage
3. Tạo application record:

```json
{
  "candidate_id": 456,
  "job_id": 123,
  "cv_url": "https://storage.../cv_456.pdf",
  "cover_letter": "I am applying for...",
  "status": "SUBMITTED",
  "submitted_at": "2024-11-30T10:00:00Z"
}
```

4. Trigger background job: Parse CV và AI screening
5. Gửi email xác nhận cho candidate

**Output**:

- Application ID
- Thông báo "Hồ sơ đã được nộp thành công. Chúng tôi sẽ liên hệ trong vòng 3-5 ngày làm việc"
- Email xác nhận chứa application tracking link

**Validation**:

- Một candidate chỉ nộp 1 hồ sơ cho 1 job
- Job phải ở trạng thái OPEN
- Phải trước application deadline

---

#### FR3.2: Xem danh sách applications

**User story**: _"Là Recruiter, tôi muốn xem tất cả hồ sơ đã nộp cho mỗi tin tuyển dụng"_

**View modes**:

1. **List view**: Hiển thị dạng bảng
2. **Kanban board**: Theo trạng thái (Submitted → Screening → Interview → Offer)
3. **Timeline view**: Theo thời gian nộp

**Columns**:
| Candidate | Applied Date | Status | AI Score | Actions |
|-----------|--------------|--------|----------|---------|
| Nguyễn Văn A | 28/11/2024 | Screening | 85/100 | [View] [Advance] [Reject] |

**Filters**:

- Status: Submitted, Screening, Interview, Offer, Hired, Rejected
- AI score range: 0-100
- Applied date range
- Skills match percentage

**Bulk actions**:

- Reject multiple applications
- Move to next step
- Send email to selected candidates

---

#### FR3.3: Xem chi tiết application

**User story**: _"Là Recruiter, tôi muốn xem chi tiết hồ sơ ứng viên"_

**Display sections**:

```
┌─────────────────────────────────────────────────────┐
│  NGUYỄN VĂN A                              [85/100] │
│  nguyenvana@email.com • 0901234567                  │
├─────────────────────────────────────────────────────┤
│  Status: SCREENING    Applied: 28/11/2024           │
│                                                      │
│  📄 CV: [Download] [Preview]                        │
│  📝 Cover Letter: "I am passionate about..."        │
│                                                      │
│  🤖 AI Screening Results:                           │
│    - Skills Match: 90% ✅                           │
│    - Experience: 85% ✅                             │
│    - Education: 80% ✅                              │
│    - Overall Score: 85/100                          │
│                                                      │
│  📊 Parsed CV Data:                                 │
│    - Name: Nguyễn Văn A                             │
│    - Email: nguyenvana@email.com                    │
│    - Phone: 0901234567                              │
│    - Education: Bachelor in CS, HUST 2018           │
│    - Experience:                                    │
│      • Senior Dev at ABC Corp (2020-2024)           │
│      • Junior Dev at XYZ Ltd (2018-2020)            │
│    - Skills: Python, Django, PostgreSQL, AWS        │
│                                                      │
│  [Advance to Interview] [Reject] [Send Message]     │
└─────────────────────────────────────────────────────┘
```

---

#### FR3.4: Cập nhật trạng thái application

**User story**: _"Là Recruiter, tôi muốn chuyển ứng viên sang bước tiếp theo"_

**Status flow**:

```
SUBMITTED → SCREENING → INTERVIEW_SCHEDULED →
INTERVIEW_COMPLETED → OFFER_SENT → HIRED

            ↓ (any step)
          REJECTED
```

**Actions**:

1. **Advance**: Chuyển sang step tiếp theo
   - Tự động gửi email thông báo
   - Nếu step tiếp là Interview → Hiển thị form tạo lịch
2. **Reject**: Từ chối ứng viên

   - Nhập lý do (optional)
   - Gửi email từ chối lịch sự
   - Không thể undo

3. **Put on hold**: Tạm hoãn xét duyệt
   - Dùng cho ứng viên tiềm năng nhưng chưa phù hợp ngay

**Business rules**:

- Không thể quay lui status (chỉ advance hoặc reject)
- Reject ở bất kỳ bước nào cũng được
- Mỗi lần thay đổi status phải ghi log với timestamp và user

---

## FR4: Sàng Lọc CV Tự Động Bằng AI

### 2.4.1. Mô tả

Sử dụng Google Gemini API để phân tích CV và đánh giá ứng viên tự động, giảm 70% thời gian sàng lọc thủ công.

### 2.4.2. Chức năng chi tiết

#### FR4.1: Parse CV (Trích xuất thông tin)

**User story**: _"Là hệ thống, tôi muốn tự động trích xuất thông tin từ CV PDF/DOCX"_

**Input**:

- CV file (PDF hoặc DOCX)
- Job description

**Process**:

1. Convert PDF/DOCX to text
2. Gọi Gemini API với prompt:

```
Extract the following information from this CV:
- Full name
- Email
- Phone
- Education (degree, university, year)
- Work experience (company, position, duration, responsibilities)
- Skills (technical and soft skills)
- Certifications
- Languages

CV content:
{cv_text}

Return JSON format.
```

**Output**:

```json
{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@email.com",
  "phone": "0901234567",
  "education": [
    {
      "degree": "Bachelor of Computer Science",
      "university": "HUST",
      "graduation_year": 2018
    }
  ],
  "experience": [
    {
      "company": "ABC Corp",
      "position": "Senior Backend Developer",
      "duration": "2020-2024",
      "responsibilities": ["Designed microservices", "Led team of 5"]
    }
  ],
  "skills": {
    "technical": ["Python", "Django", "PostgreSQL", "AWS"],
    "soft": ["Leadership", "Communication", "Problem-solving"]
  },
  "certifications": ["AWS Solutions Architect"],
  "languages": ["Vietnamese (native)", "English (fluent)"]
}
```

---

#### FR4.2: AI Screening (Đánh giá và chấm điểm)

**User story**: _"Là Recruiter, tôi muốn AI tự động đánh giá ứng viên dựa trên yêu cầu công việc"_

**Input**:

- Parsed CV data
- Job requirements:
  ```json
  {
    "skills_required": ["Python", "Django", "PostgreSQL"],
    "experience_required": "3+ years",
    "education_required": "Bachelor in CS"
  }
  ```

**AI Prompt**:

```
You are an expert HR recruiter. Evaluate this candidate for the job position.

Job Requirements:
- Skills: Python, Django, PostgreSQL, REST API
- Experience: 3+ years in backend development
- Education: Bachelor in Computer Science

Candidate Profile:
{parsed_cv_data}

Provide scoring (0-100) for:
1. Skills Match: How well do their skills match requirements?
2. Experience Match: Do they have relevant experience?
3. Education Match: Does their education fit?
4. Overall Recommendation: Should we interview this candidate?

Return JSON with scores and brief explanations.
```

**Output**:

```json
{
  "skills_match": {
    "score": 90,
    "explanation": "Candidate has 4/5 required skills. Strong in Python, Django, PostgreSQL. Missing experience with Redis but has MongoDB."
  },
  "experience_match": {
    "score": 85,
    "explanation": "4 years of backend experience, exceeds requirement. Worked on similar projects at ABC Corp."
  },
  "education_match": {
    "score": 80,
    "explanation": "Bachelor in Computer Science from reputable university (HUST)."
  },
  "overall_score": 85,
  "recommendation": "STRONG_YES", // STRONG_YES, YES, MAYBE, NO, STRONG_NO
  "summary": "Excellent candidate with strong technical skills and relevant experience. Recommend moving to interview stage."
}
```

**Scoring logic**:

- Overall score = (Skills _ 0.5) + (Experience _ 0.3) + (Education \* 0.2)
- Recommendation thresholds:
  - > = 80: STRONG_YES
  - 70-79: YES
  - 50-69: MAYBE
  - 30-49: NO
  - < 30: STRONG_NO

---

#### FR4.3: Trigger AI screening

**User story**: _"Là Recruiter, tôi muốn kích hoạt AI screening cho một hoặc nhiều applications"_

**Trigger points**:

1. **Auto**: Ngay sau khi candidate nộp hồ sơ (background job)
2. **Manual**: Recruiter click button "Screen with AI"
3. **Batch**: Chọn nhiều applications và screen cùng lúc

**API Endpoint**:

```python
POST /api/applications/{id}/screen/

# Celery task
@shared_task
def screen_application(application_id):
    app = Application.objects.get(id=application_id)

    # Step 1: Parse CV
    parsed_data = parse_cv(app.cv_url)

    # Step 2: AI screening
    ai_result = ai_screening(parsed_data, app.job.requirements)

    # Step 3: Save results
    app.ai_score = ai_result['overall_score']
    app.ai_recommendation = ai_result['recommendation']
    app.parsed_cv_data = parsed_data
    app.screening_result = ai_result
    app.status = 'SCREENING_COMPLETED'
    app.save()

    # Step 4: Notify recruiter
    send_notification(app.job.recruiter, f"AI screening completed for {parsed_data['name']}")
```

**Performance**:

- Parse CV: ~5-10 seconds
- AI screening: ~10-15 seconds
- Total: < 30 seconds per application
- Rate limit: 60 requests/minute (Gemini free tier)

---

#### FR4.4: Xem kết quả AI screening

**User story**: _"Là Recruiter, tôi muốn xem chi tiết đánh giá của AI"_

**Display**:

```
┌─────────────────────────────────────────────┐
│  🤖 AI SCREENING RESULTS                    │
├─────────────────────────────────────────────┤
│  Overall Score: 85/100  ⭐⭐⭐⭐⭐          │
│  Recommendation: STRONG YES                 │
│                                             │
│  📊 Detailed Scores:                        │
│  ▓▓▓▓▓▓▓▓▓░ Skills Match: 90/100           │
│  ▓▓▓▓▓▓▓▓░░ Experience: 85/100             │
│  ▓▓▓▓▓▓▓▓░░ Education: 80/100              │
│                                             │
│  💡 AI Summary:                             │
│  "Excellent candidate with strong technical │
│   skills and relevant experience. Recommend │
│   moving to interview stage."               │
│                                             │
│  ✅ Matched Skills:                         │
│  • Python ✓                                 │
│  • Django ✓                                 │
│  • PostgreSQL ✓                             │
│  • REST API ✓                               │
│                                             │
│  ⚠️ Missing Skills:                         │
│  • Redis (has MongoDB instead)              │
│                                             │
│  [Accept AI Recommendation] [Manual Review] │
└─────────────────────────────────────────────┘
```

---

## FR5: Quản Lý Quy Trình Tuyển Dụng

### 2.5.1. Mô tả

Theo dõi tiến độ ứng viên qua từng bước của quy trình tuyển dụng.

### 2.5.2. Pipeline visualization

```
SUBMITTED (50) → SCREENING (30) → INTERVIEW (15) → OFFER (5) → HIRED (2)
                            ↓
                      REJECTED (23)
```

### 2.5.3. Chức năng chi tiết

#### FR5.1: Xem pipeline overview

**User story**: _"Là Recruiter, tôi muốn xem tổng quan pipeline tuyển dụng cho mỗi job"_

**Display**:

- Funnel chart showing candidate count at each stage
- Conversion rate giữa các stage
- Average time per stage
- Bottlenecks (stages with high drop rate)

#### FR5.2: Drag & drop candidates

**User story**: _"Là Recruiter, tôi muốn kéo thả ứng viên giữa các stage"_

**Features**:

- Kanban board với các cột là stages
- Drag candidate card từ cột này sang cột khác
- Auto update status và gửi email thông báo

---

_Tiếp tục phần FR6-FR10 trong file tiếp theo để không quá dài..._

---

**Tóm tắt FR1-FR5**:

- ✅ FR1: User Management - Đăng ký, đăng nhập, phân quyền 4 roles
- ✅ FR2: Job Management - CRUD tin tuyển dụng, thiết lập quy trình
- ✅ FR3: Application Management - Nộp hồ sơ, quản lý applications
- ✅ FR4: AI Screening - Parse CV, đánh giá tự động bằng Gemini
- ✅ FR5: Recruitment Process - Theo dõi pipeline, funnel analysis

_Xem tiếp:_

- **YC-03**: Yêu cầu Phi chức năng (NFR1-NFR5)
- **YC-04**: Use Cases chi tiết
