# Database Design - Hệ thống Tuyển dụng

## 1. Entities (Các thực thể chính)

### User (Người dùng)

- **id**: UUID (PK)
- **email**: String (unique)
- **password**: String (hashed)
- **name**: String
- **role**: Enum (ADMIN, RECRUITER, INTERVIEWER, CANDIDATE)
- **avatar**: String (nullable)
- **phone**: String (nullable)
- **createdAt**: DateTime
- **updatedAt**: DateTime

### Job (Vị trí tuyển dụng)

- **id**: UUID (PK)
- **title**: String
- **description**: Text
- **requirements**: Text (JD - Job Description)
- **salary**: String (nullable)
- **location**: String
- **employmentType**: Enum (FULLTIME, PARTTIME, CONTRACT, INTERN)
- **status**: Enum (DRAFT, OPEN, CLOSED, CANCELLED)
- **deadline**: DateTime
- **createdById**: UUID (FK → User)
- **createdAt**: DateTime
- **updatedAt**: DateTime

### Application (Hồ sơ ứng tuyển)

- **id**: UUID (PK)
- **jobId**: UUID (FK → Job)
- **candidateId**: UUID (FK → User)
- **cvUrl**: String (link file CV)
- **coverLetter**: Text (nullable)
- **status**: Enum (PENDING, SCREENING, INTERVIEW, OFFER, REJECTED, ACCEPTED)
- **aiScore**: Float (nullable, 0-100)
- **aiAnalysis**: JSON (nullable, kết quả AI)
- **screenerNotes**: Text (nullable)
- **appliedAt**: DateTime
- **updatedAt**: DateTime

### Interview (Lịch phỏng vấn)

- **id**: UUID (PK)
- **applicationId**: UUID (FK → Application)
- **scheduledAt**: DateTime
- **duration**: Int (minutes)
- **location**: String (nullable, phòng/link meet)
- **type**: Enum (PHONE, VIDEO, ONSITE)
- **status**: Enum (SCHEDULED, COMPLETED, CANCELLED, RESCHEDULED)
- **feedback**: Text (nullable)
- **result**: Enum (PASS, FAIL, PENDING) (nullable)
- **createdAt**: DateTime
- **updatedAt**: DateTime

### InterviewPanel (Hội đồng phỏng vấn)

- **id**: UUID (PK)
- **interviewId**: UUID (FK → Interview)
- **interviewerId**: UUID (FK → User)
- **role**: Enum (LEAD, MEMBER, OBSERVER)
- **feedback**: Text (nullable)
- **score**: Float (nullable, 0-100)
- **createdAt**: DateTime

### RecruitmentResult (Kết quả tuyển dụng)

- **id**: UUID (PK)
- **applicationId**: UUID (FK → Application) (unique)
- **finalDecision**: Enum (OFFER, REJECT)
- **offerLetterUrl**: String (nullable, link PDF thư mời)
- **salary**: String (nullable)
- **startDate**: DateTime (nullable)
- **notes**: Text (nullable)
- **decidedById**: UUID (FK → User)
- **decidedAt**: DateTime
- **createdAt**: DateTime

### Notification (Thông báo)

- **id**: UUID (PK)
- **userId**: UUID (FK → User)
- **type**: Enum (EMAIL, SYSTEM)
- **title**: String
- **content**: Text
- **isRead**: Boolean (default: false)
- **relatedId**: UUID (nullable, liên kết đến Application/Interview)
- **sentAt**: DateTime
- **createdAt**: DateTime

## 2. Relationships (Quan hệ)

```
User (1) ──────────── (N) Job
  └─ createdById          └─ Người tạo job posting

User (1) ──────────── (N) Application (as Candidate)
  └─ candidateId          └─ Ứng viên nộp hồ sơ

Job (1) ───────────── (N) Application
  └─ jobId               └─ Nhiều hồ sơ cho 1 job

Application (1) ────── (N) Interview
  └─ applicationId       └─ Nhiều vòng phỏng vấn

Interview (1) ─────── (N) InterviewPanel
  └─ interviewId        └─ Nhiều người phỏng vấn

User (1) ──────────── (N) InterviewPanel (as Interviewer)
  └─ interviewerId       └─ Người phỏng vấn

Application (1) ────── (1) RecruitmentResult
  └─ applicationId       └─ Kết quả cuối cùng

User (1) ──────────── (N) Notification
  └─ userId              └─ Thông báo cho user
```

## 3. Indexes (Đánh index để query nhanh)

```sql
-- Tìm jobs đang mở
INDEX idx_job_status ON Job(status)
INDEX idx_job_deadline ON Job(deadline)

-- Tìm applications theo job/candidate
INDEX idx_application_job ON Application(jobId, status)
INDEX idx_application_candidate ON Application(candidateId)
INDEX idx_application_status ON Application(status)

-- Tìm interviews theo ngày
INDEX idx_interview_scheduled ON Interview(scheduledAt, status)
INDEX idx_interview_application ON Interview(applicationId)

-- Notification chưa đọc
INDEX idx_notification_user ON Notification(userId, isRead, createdAt)
```

## 4. Enums (Các giá trị cố định)

```typescript
enum Role {
  ADMIN       // Quản trị hệ thống
  RECRUITER   // Nhân viên tuyển dụng
  INTERVIEWER // Người phỏng vấn
  CANDIDATE   // Ứng viên
}

enum JobStatus {
  DRAFT      // Nháp
  OPEN       // Đang tuyển
  CLOSED     // Đã đóng
  CANCELLED  // Hủy
}

enum ApplicationStatus {
  PENDING    // Chờ xử lý
  SCREENING  // Đang sàng lọc
  INTERVIEW  // Đang phỏng vấn
  OFFER      // Đã gửi offer
  REJECTED   // Từ chối
  ACCEPTED   // Đã nhận việc
}

enum InterviewType {
  PHONE      // Điện thoại
  VIDEO      // Video call
  ONSITE     // Tại văn phòng
}

enum InterviewStatus {
  SCHEDULED    // Đã đặt lịch
  COMPLETED    // Hoàn thành
  CANCELLED    // Hủy
  RESCHEDULED  // Đổi lịch
}

enum InterviewResult {
  PASS     // Đạt
  FAIL     // Không đạt
  PENDING  // Chưa có kết quả
}
```

## 5. Business Rules

1. **Application workflow:**

   - PENDING → SCREENING → INTERVIEW → OFFER/REJECTED → ACCEPTED
   - Không thể skip bước (trừ REJECTED có thể từ bất kỳ bước nào)

2. **Interview:**

   - Chỉ tạo khi Application ở status INTERVIEW
   - Phải có ít nhất 1 InterviewPanel member

3. **RecruitmentResult:**

   - Chỉ tạo khi Application = OFFER hoặc REJECTED
   - Unique per Application (1 kết quả cuối)

4. **AI Screening:**

   - Chỉ chạy cho Application status = PENDING
   - Lưu score + analysis vào Application
   - Tự động chuyển status → SCREENING

5. **Notification:**
   - Auto-send khi:
     - Application status thay đổi
     - Interview được tạo/hủy
     - RecruitmentResult được tạo
