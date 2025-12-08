# SƠ ĐỒ CLASS - HỆ THỐNG TUYỂN DỤNG NHÂN SỰ

## 1. Sơ đồ Class Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLASS DIAGRAM                                    │
│                   Hệ thống Tuyển dụng Nhân sự Thông minh                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                           CORE ENTITIES (Lớp chính)                           │
└──────────────────────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃         User             ┃ ◄──────────────┐
┃   (AbstractUser)         ┃                │
┣━━━━━━━━━━━━━━━━━━━━━━━━━┫                │
┃ - id: UUID (PK)          ┃                │
┃ - email: Email (unique)  ┃                │
┃ - role: Enum             ┃                │
┃   • ADMIN                ┃                │
┃   • RECRUITER            ┃                │
┃   • INTERVIEWER          ┃                │
┃   • CANDIDATE            ┃                │
┃ - avatar: Image          ┃                │
┃ - phone: String          ┃                │
┃ - is_email_verified: Bool┃                │
┃ - otp_code: String       ┃                │
┃ - otp_sent_at: DateTime  ┃                │
┃ - company_name: String   ┃                │
┃ - tax_id: String         ┃                │
┃ - website: URL           ┃                │
┃ - address: Text          ┃                │
┣━━━━━━━━━━━━━━━━━━━━━━━━━┫                │
┃ + get_full_name()        ┃                │
┃ + name (property)        ┃                │
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛                │
      │                                      │
      │ 1                                    │
      │                                      │ 1
      │ creates                        owns  │
      ▼ *                                    │
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓                │
┃  RecruitmentProcess      ┃                │
┣━━━━━━━━━━━━━━━━━━━━━━━━━┫                │
┃ - id: UUID (PK)          ┃                │
┃ - name: String           ┃                │
┃ - description: Text      ┃                │
┃ - is_default: Bool       ┃                │
┃ - created_by: FK(User)   ┃ ───────────────┘
┃ - created_at: DateTime   ┃
┃ - updated_at: DateTime   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
      │ 1
      │ has
      │
      ▼ *
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃      ProcessStep         ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ - id: UUID (PK)          ┃
┃ - process: FK            ┃
┃ - name: String           ┃
┃ - step_type: Enum        ┃
┃   • SCREENING            ┃
┃   • PHONE_INTERVIEW      ┃
┃   • TECHNICAL_TEST       ┃
┃   • INTERVIEW            ┃
┃   • FINAL_INTERVIEW      ┃
┃   • OFFER                ┃
┃ - order: Integer         ┃
┃ - duration_days: Integer ┃
┃ - is_required: Bool      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛


┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃          Job             ┃ ◄──────────────┐
┣━━━━━━━━━━━━━━━━━━━━━━━━━┫                │
┃ - id: UUID (PK)          ┃                │
┃ - title: String          ┃                │ 1
┃ - department: String     ┃                │
┃ - description: Text      ┃                │
┃ - requirements: Text (JD)┃                │
┃ - salary_min: Decimal    ┃           belongs to
┃ - salary_max: Decimal    ┃                │
┃ - salary: String         ┃                │
┃ - location: String       ┃                │
┃ - employment_type: Enum  ┃            ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   • FULLTIME             ┃            ┃         User             ┃
┃   • PARTTIME             ┃            ┃      (RECRUITER)         ┃
┃   • CONTRACT             ┃            ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
┃   • INTERN               ┃
┃ - positions_count: Int   ┃
┃ - experience_years: Int  ┃
┃ - status: Enum           ┃
┃   • DRAFT                ┃
┃   • OPEN                 ┃
┃   • CLOSED               ┃
┃ - deadline: DateTime     ┃
┃ - process: FK            ┃
┃ - created_by: FK(User)   ┃ ───────────────┘
┃ - created_at: DateTime   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
      │ 1
      │ has
      │
      ▼ *
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃      Application         ┃ ◄──────────────┐
┣━━━━━━━━━━━━━━━━━━━━━━━━━┫                │
┃ - id: UUID (PK)          ┃                │ 1
┃ - job: FK(Job)           ┃                │
┃ - candidate: FK(User)    ┃ ───────────────┤
┃ - cv_file: File          ┃            applies
┃ - cover_letter: Text     ┃                │
┃ - status: Enum           ┃                │
┃   • PENDING              ┃            ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   • SCREENING            ┃            ┃         User             ┃
┃   • INTERVIEW            ┃            ┃      (CANDIDATE)         ┃
┃   • OFFER                ┃            ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
┃   • REJECTED             ┃
┃   • ACCEPTED             ┃
┃ - ai_score: Float        ┃
┃ - ai_analysis: JSON      ┃
┃ - screener_notes: Text   ┃
┃ - applied_at: DateTime   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
      │ 1
      │ has
      │
      ▼ *
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃       Interview          ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ - id: UUID (PK)          ┃
┃ - application: FK        ┃
┃ - scheduled_at: DateTime ┃
┃ - duration: Integer (min)┃
┃ - location: String       ┃
┃ - type: Enum             ┃
┃   • PHONE                ┃
┃   • VIDEO                ┃
┃   • ONSITE               ┃
┃ - status: Enum           ┃
┃   • SCHEDULED            ┃
┃   • COMPLETED            ┃
┃   • CANCELLED            ┃
┃ - feedback: Text         ┃
┃ - result: Enum           ┃
┃   • PASS                 ┃
┃   • FAIL                 ┃
┃   • PENDING              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
      │ 1
      │ evaluated by
      │
      ▼ *
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     InterviewPanel       ┃ ◄──────────────┐
┣━━━━━━━━━━━━━━━━━━━━━━━━━┫                │
┃ - id: UUID (PK)          ┃                │ 1
┃ - interview: FK          ┃                │
┃ - interviewer: FK(User)  ┃ ───────────────┤
┃ - role: Enum             ┃          evaluates
┃   • LEAD                 ┃                │
┃   • MEMBER               ┃                │
┃   • OBSERVER             ┃            ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ - feedback: Text         ┃            ┃         User             ┃
┃ - score: Float (0-100)   ┃            ┃     (INTERVIEWER)        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛            ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛


┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   RecruitmentResult      ┃ ◄────┐
┣━━━━━━━━━━━━━━━━━━━━━━━━━┫      │ 1
┃ - id: UUID (PK)          ┃      │
┃ - application: FK (1-1)  ┃ ─────┤ has one
┃ - final_decision: Enum   ┃      │
┃   • OFFER                ┃  ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   • REJECT               ┃  ┃      Application         ┃
┃ - offer_letter_file: File┃  ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
┃ - salary: String         ┃
┃ - start_date: Date       ┃      ┌─────────────┐
┃ - notes: Text            ┃      │             │ 1
┃ - decided_by: FK(User)   ┃ ─────┤  decided by │
┃ - decided_at: DateTime   ┃      │             │
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛      └─────────────┘
                                         │
                                         ▼
                                 ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
                                 ┃         User             ┃
                                 ┃      (RECRUITER)         ┃
                                 ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛


┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃      Notification        ┃ ◄──────────────┐
┣━━━━━━━━━━━━━━━━━━━━━━━━━┫                │
┃ - id: UUID (PK)          ┃                │ 1
┃ - user: FK(User)         ┃ ───────────────┤
┃ - type: Enum             ┃          receives
┃   • EMAIL                ┃                │
┃   • SYSTEM               ┃                │
┃ - title: String          ┃            ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ - content: Text          ┃            ┃         User             ┃
┃ - is_read: Bool          ┃            ┃        (ALL)             ┃
┃ - related_id: UUID       ┃            ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
┃ - sent_at: DateTime      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛


┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃       SavedJob           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ - id: UUID (PK)          ┃
┃ - user: FK(User)         ┃ ◄─────── Candidate
┃ - job: FK(Job)           ┃ ◄─────── Job
┃ - saved_at: DateTime     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
      (Many-to-Many relationship)
```

---

## 2. Mô tả chi tiết các Class

### 2.1. User (Lớp người dùng)

**Mục đích:** Quản lý tất cả người dùng trong hệ thống với 4 vai trò khác nhau

**Thuộc tính chính:**

- `id`: UUID làm khóa chính
- `email`: Email duy nhất dùng để đăng nhập
- `role`: Vai trò (ADMIN, RECRUITER, INTERVIEWER, CANDIDATE)
- `avatar`: Ảnh đại diện
- `phone`: Số điện thoại
- `is_email_verified`: Trạng thái xác thực email
- `otp_code`: Mã OTP 6 số để xác thực
- `otp_sent_at`: Thời gian gửi OTP
- `company_name`: Tên công ty (cho Recruiter)
- `tax_id`: Mã số thuế (cho Recruiter)
- `website`: Website công ty
- `address`: Địa chỉ công ty
- `company_description`: Mô tả công ty

**Phương thức:**

- `get_full_name()`: Trả về họ tên đầy đủ
- `name` (property): Lấy tên hiển thị

**Mối quan hệ:**

- **1-to-Many** với `Job`: Một Recruiter tạo nhiều công việc
- **1-to-Many** với `Application`: Một Candidate nộp nhiều hồ sơ
- **1-to-Many** với `InterviewPanel`: Một Interviewer đánh giá nhiều phỏng vấn
- **1-to-Many** với `RecruitmentResult`: Một Recruiter quyết định nhiều kết quả
- **1-to-Many** với `Notification`: Một User nhận nhiều thông báo
- **Many-to-Many** với `Job` (qua SavedJob): Candidate lưu nhiều Job

---

### 2.2. RecruitmentProcess (Quy trình tuyển dụng)

**Mục đích:** Định nghĩa quy trình tuyển dụng gồm nhiều bước

**Thuộc tính:**

- `id`: UUID
- `name`: Tên quy trình
- `description`: Mô tả
- `is_default`: Quy trình mặc định hay không
- `created_by`: Người tạo (Recruiter)

**Mối quan hệ:**

- **1-to-Many** với `ProcessStep`: Một quy trình có nhiều bước
- **1-to-Many** với `Job`: Một quy trình được dùng cho nhiều job

---

### 2.3. ProcessStep (Bước trong quy trình)

**Mục đích:** Các bước cụ thể trong quy trình tuyển dụng

**Thuộc tính:**

- `step_type`: Loại bước (SCREENING, PHONE_INTERVIEW, TECHNICAL_TEST, INTERVIEW, FINAL_INTERVIEW, OFFER)
- `order`: Thứ tự bước
- `duration_days`: Thời gian dự kiến (ngày)
- `is_required`: Bắt buộc hay không

---

### 2.4. Job (Vị trí tuyển dụng)

**Mục đích:** Thông tin chi tiết về vị trí tuyển dụng

**Thuộc tính chính:**

- `title`: Tiêu đề công việc
- `department`: Phòng ban
- `description`: Mô tả công việc
- `requirements`: Yêu cầu ứng viên (JD)
- `salary_min`, `salary_max`: Mức lương
- `location`: Địa điểm làm việc
- `employment_type`: Loại hình (FULLTIME, PARTTIME, CONTRACT, INTERN)
- `positions_count`: Số lượng cần tuyển
- `experience_years`: Số năm kinh nghiệm
- `status`: Trạng thái (DRAFT, OPEN, CLOSED)
- `deadline`: Hạn nộp hồ sơ
- `created_by`: Recruiter tạo tin

**Mối quan hệ:**

- **Many-to-1** với `User`: Nhiều Job thuộc 1 Recruiter
- **1-to-Many** với `Application`: Một Job nhận nhiều hồ sơ
- **Many-to-1** với `RecruitmentProcess`: Nhiều Job dùng 1 quy trình

---

### 2.5. Application (Hồ sơ ứng tuyển)

**Mục đích:** Lưu thông tin hồ sơ ứng viên nộp vào job

**Thuộc tính chính:**

- `job`: Công việc ứng tuyển
- `candidate`: Ứng viên (User)
- `cv_file`: File CV (PDF/DOCX)
- `cover_letter`: Thư xin việc
- `status`: Trạng thái (PENDING, SCREENING, INTERVIEW, OFFER, REJECTED, ACCEPTED)
- `ai_score`: Điểm AI sàng lọc (0-100)
- `ai_analysis`: Kết quả phân tích AI (JSON)
- `screener_notes`: Ghi chú của người sàng lọc
- `applied_at`: Thời gian nộp

**Ràng buộc:**

- **unique_together**: Một Candidate chỉ nộp 1 lần vào 1 Job

**Mối quan hệ:**

- **Many-to-1** với `Job`: Nhiều hồ sơ cho 1 công việc
- **Many-to-1** với `User`: Nhiều hồ sơ từ 1 ứng viên
- **1-to-Many** với `Interview`: Một hồ sơ có nhiều lịch phỏng vấn
- **1-to-1** với `RecruitmentResult`: Một hồ sơ có 1 kết quả cuối cùng

---

### 2.6. Interview (Lịch phỏng vấn)

**Mục đích:** Quản lý lịch phỏng vấn cho ứng viên

**Thuộc tính:**

- `application`: Hồ sơ liên quan
- `scheduled_at`: Thời gian phỏng vấn
- `duration`: Thời lượng (phút)
- `location`: Địa điểm/Link
- `interview_type`: Loại (PHONE, VIDEO, ONSITE)
- `status`: Trạng thái (SCHEDULED, COMPLETED, CANCELLED)
- `feedback`: Phản hồi tổng quan
- `result`: Kết quả (PASS, FAIL, PENDING)

**Mối quan hệ:**

- **Many-to-1** với `Application`: Nhiều lịch PV cho 1 hồ sơ
- **1-to-Many** với `InterviewPanel`: Một buổi PV có nhiều người đánh giá

---

### 2.7. InterviewPanel (Hội đồng phỏng vấn)

**Mục đích:** Lưu điểm và feedback của từng interviewer

**Thuộc tính:**

- `interview`: Lịch phỏng vấn
- `interviewer`: Người phỏng vấn (User)
- `role`: Vai trò (LEAD, MEMBER, OBSERVER)
- `feedback`: Nhận xét chi tiết
- `score`: Điểm đánh giá (0-100)

**Ràng buộc:**

- **unique_together**: Một Interviewer chỉ đánh giá 1 lần trong 1 buổi PV

**Mối quan hệ:**

- **Many-to-1** với `Interview`: Nhiều người đánh giá 1 buổi PV
- **Many-to-1** với `User`: Nhiều đánh giá từ 1 Interviewer

---

### 2.8. RecruitmentResult (Kết quả tuyển dụng)

**Mục đích:** Quyết định cuối cùng OFFER hoặc REJECT

**Thuộc tính:**

- `application`: Hồ sơ liên quan (1-1)
- `final_decision`: OFFER hoặc REJECT
- `offer_letter_file`: File thư mời (nếu OFFER)
- `salary`: Mức lương đề nghị
- `start_date`: Ngày bắt đầu làm việc
- `notes`: Ghi chú
- `decided_by`: Người quyết định (Recruiter)
- `decided_at`: Thời gian quyết định

**Mối quan hệ:**

- **1-to-1** với `Application`: Một hồ sơ có 1 kết quả
- **Many-to-1** với `User`: Nhiều kết quả từ 1 Recruiter

---

### 2.9. Notification (Thông báo)

**Mục đích:** Gửi thông báo cho người dùng

**Thuộc tính:**

- `user`: Người nhận
- `notification_type`: EMAIL hoặc SYSTEM
- `title`: Tiêu đề
- `content`: Nội dung
- `is_read`: Đã đọc chưa
- `related_id`: ID đối tượng liên quan
- `sent_at`: Thời gian gửi

**Mối quan hệ:**

- **Many-to-1** với `User`: Nhiều thông báo cho 1 user

---

### 2.10. SavedJob (Công việc đã lưu)

**Mục đích:** Candidate lưu các job quan tâm

**Thuộc tính:**

- `user`: Candidate
- `job`: Công việc
- `saved_at`: Thời gian lưu

**Ràng buộc:**

- **unique_together**: Một User chỉ lưu 1 Job 1 lần

**Mối quan hệ:**

- **Many-to-Many**: User và Job (bảng trung gian)

---

## 3. Các mối quan hệ chính

### 3.1. One-to-Many (1-\*)

1. **User (Recruiter) → Job**

   - Một Recruiter tạo nhiều tin tuyển dụng
   - `Job.created_by` → `User.id`

2. **User (Candidate) → Application**

   - Một Candidate nộp nhiều hồ sơ
   - `Application.candidate` → `User.id`

3. **Job → Application**

   - Một Job nhận nhiều hồ sơ
   - `Application.job` → `Job.id`

4. **Application → Interview**

   - Một hồ sơ có nhiều lịch phỏng vấn (vòng 1, 2, 3...)
   - `Interview.application` → `Application.id`

5. **Interview → InterviewPanel**

   - Một buổi PV có nhiều người đánh giá
   - `InterviewPanel.interview` → `Interview.id`

6. **User (Interviewer) → InterviewPanel**

   - Một Interviewer đánh giá nhiều buổi PV
   - `InterviewPanel.interviewer` → `User.id`

7. **User (Recruiter) → RecruitmentResult**

   - Một Recruiter quyết định nhiều kết quả
   - `RecruitmentResult.decided_by` → `User.id`

8. **User → Notification**

   - Một User nhận nhiều thông báo
   - `Notification.user` → `User.id`

9. **RecruitmentProcess → ProcessStep**

   - Một quy trình có nhiều bước
   - `ProcessStep.process` → `RecruitmentProcess.id`

10. **RecruitmentProcess → Job**
    - Một quy trình dùng cho nhiều job
    - `Job.recruitment_process` → `RecruitmentProcess.id`

### 3.2. One-to-One (1-1)

1. **Application ↔ RecruitmentResult**
   - Một hồ sơ có duy nhất 1 kết quả cuối cùng
   - `RecruitmentResult.application` (OneToOneField)

### 3.3. Many-to-Many (M-N)

1. **User (Candidate) ↔ Job** (qua SavedJob)
   - Candidate lưu nhiều Job
   - Job được nhiều Candidate lưu

---

## 4. Luồng dữ liệu chính

### 4.1. Quy trình tuyển dụng hoàn chỉnh

```
1. Recruiter tạo Job
   ↓
2. Candidate nộp Application
   ↓
3. AI tự động tính ai_score và ai_analysis
   ↓
4. Application.status = SCREENING
   ↓
5. Recruiter duyệt và chuyển sang INTERVIEW
   ↓
6. Hệ thống tạo Interview
   ↓
7. Gán Interviewer vào InterviewPanel
   ↓
8. Interviewer chấm điểm và feedback
   ↓
9. Interview.result = PASS/FAIL
   ↓
10. Recruiter tạo RecruitmentResult (OFFER/REJECT)
    ↓
11. Hệ thống gửi email và Notification cho Candidate
```

### 4.2. Luồng thông báo

```
Event xảy ra (nộp hồ sơ, mời PV, kết quả...)
   ↓
Hệ thống tạo Notification (type=SYSTEM)
   ↓
Nếu user bật email notification
   ↓
Gửi email qua Resend API (type=EMAIL)
   ↓
User nhận thông báo (in-app + email)
```

---

## 5. Các ràng buộc và index quan trọng

### 5.1. Unique Constraints

- `User.email`: Unique (không trùng email)
- `Application(job, candidate)`: Unique together (1 candidate chỉ nộp 1 lần/job)
- `InterviewPanel(interview, interviewer)`: Unique together
- `ProcessStep(process, order)`: Unique together
- `SavedJob(user, job)`: Unique together

### 5.2. Database Indexes

**User:**

- `email`
- `role`

**Job:**

- `status`
- `deadline`
- `created_by`

**Application:**

- `(job, status)`
- `candidate`
- `status`
- `ai_score`

**Interview:**

- `(scheduled_at, status)`
- `application`

**Notification:**

- `(user, is_read, created_at)`
- `user`

---

## 6. Tổng kết

### Số lượng Class: 10 class chính

1. **User** (Core - Kế thừa AbstractUser)
2. **RecruitmentProcess** (Quy trình)
3. **ProcessStep** (Bước quy trình)
4. **Job** (Tin tuyển dụng)
5. **Application** (Hồ sơ ứng tuyển)
6. **Interview** (Lịch phỏng vấn)
7. **InterviewPanel** (Hội đồng PV)
8. **RecruitmentResult** (Kết quả cuối cùng)
9. **Notification** (Thông báo)
10. **SavedJob** (Công việc đã lưu)

### Đặc điểm thiết kế:

✅ **Chuẩn hóa cao:** Tránh trùng lặp dữ liệu
✅ **Tách biệt rõ ràng:** Mỗi class có trách nhiệm riêng
✅ **Hỗ trợ mở rộng:** Dễ thêm tính năng mới
✅ **Performance:** Có index hợp lý
✅ **Audit trail:** Có timestamp (created_at, updated_at)
✅ **UUID:** Dùng UUID thay vì Integer ID (bảo mật hơn)

---

_Document này mô tả đầy đủ cấu trúc class diagram của Hệ thống Tuyển dụng Nhân sự Thông minh._
