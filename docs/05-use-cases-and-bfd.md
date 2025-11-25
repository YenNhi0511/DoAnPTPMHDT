# Tài liệu Phân tích - Thiết kế: BFD, Use Case Diagram và Use Case Descriptions

Tài liệu này cung cấp:

1. BFD — Business Function Diagram (Sơ đồ chức năng nghiệp vụ tổng quan theo khối chức năng)
2. Use Case Diagram (Actors, Use Cases và các quan hệ include/extend/association)
3. Use Case Description (Đặc tả chi tiết các Use Case chính)

Sử dụng tài liệu này để vẽ sơ đồ trực tiếp trong draw.io hoặc bất kỳ công cụ nào.

---

## 1) BFD – Business Function Diagram (Sơ đồ chức năng nghiệp vụ)

Mục tiêu: tóm tắt các khối chức năng chính của hệ thống tuyển dụng nhân sự.

### Khối chức năng chính

- **Người dùng & Xác thực (User & Auth)**

  - Đăng ký, Đăng nhập, Quản lý role & quyền
  - Actor: Admin, Recruiter, Interviewer, Candidate

- **Quản lý Tin tuyển dụng (Job Management)**

  - Tạo/Chỉnh sửa/Xóa/Publish/Close Job
  - Quản lý deadline, trạng thái, search/filters

- **Quản lý Hồ sơ ứng tuyển (Application Management)**

  - Quản lý trạng thái hồ sơ (PENDING, SCREENING, INTERVIEW, OFFER, REJECTED, ACCEPTED)

  - Trích xuất nội dung CV (PDF/DOCX), gọi AI (Gemini/OpenAI) để chấm điểm & phân tích
  - Lưu `ai_score` và `ai_analysis` cho từng application

- **Quản lý Phỏng vấn (Interview Management)**

- **Thông báo & Email (Notifications & Email)**

- **Báo cáo & Phân tích (Reports & Analytics)**

### Gợi ý vẽ BFD (draw.io / Mermaid):

- Kết nối các khối bằng mũi tên biểu thị luồng: e.g., Application Management → Screening & AI (trigger), Interview → Notifications (trigger), etc.

````mermaid
  UI --> INTERVIEW[Quản lý Phỏng vấn (Interview Management)]
  UI --> RESULT[Kết quả Tuyển dụng & Offer (Recruitment Result & Offer)]
  UI --> USER[Người dùng & Vai trò (User & Role Management)]

  INTERVIEW --> NOTI
  RESULT --> NOTI
  CELERY --> DB[(Cơ sở dữ liệu)]
  APP --> DB
  INTERVIEW --> DB

### 1.2 Chi tiết mô tả cho BFD (Sơ đồ chức năng hệ thống và các phần)

#### 1.2.1 Sơ đồ chức năng hệ thống (chi tiết)

- **Mục tiêu:** Vẽ sơ đồ chức năng hiển thị mối quan hệ giữa các khối nghiệp vụ, luồng dữ liệu chính, và các dịch vụ bên ngoài.
- **Vị trí & bố cục:**
  - Bên trái: Actors / Clients (Candidate, Recruiter, Interviewer, Admin, Guest).
  - Trung tâm: các khối nghiệp vụ - Quản lý Tin tuyển dụng (Job Management), Quản lý Hồ sơ ứng tuyển (Application Management), Quản lý Phỏng vấn (Interview Management), Kết quả & Offer (Result & Offer), Thông báo & Email (Notifications & Email), Báo cáo & Phân tích (Reports & Analytics), Người dùng & Xác thực (User & Auth).
  - Phía trên/phải: External services (Gemini API, SMTP, S3/Storage).
  - Dưới cùng: Database (PostgreSQL).
  - Góc dưới: Xử lý nền (Celery + Redis).

- **Ký hiệu & chú thích:**
  - Hình chữ nhật: Khối chức năng nghiệp vụ (Business function)
  - Hình trụ: Cơ sở dữ liệu (Database)
  - Biểu tượng đám mây: Dịch vụ bên ngoài (External API/Service)
  - Hình chữ nhật bo góc / Lục giác: Tác vụ nền (Background jobs, ví dụ Celery)
  - Mũi tên đậm (→): Hành động đồng bộ hoặc request/response
  - Mũi tên đứt quãng (- - ->): Kích hoạt bất đồng bộ / sự kiện
  - Mũi tên hai chiều (↔): Đọc/ghi dữ liệu

- **Luồng chính:**
  - Ứng viên → Giao diện người dùng → Quản lý Hồ sơ ứng tuyển (Application Management) — (nộp CV)
  - Quản lý Hồ sơ ứng tuyển → (bất đồng bộ) `Celery.parse_cv_task` (tách text từ CV) → `Celery.screen_cv_task` (AI Screening) → Dịch vụ Gemini (API)
  - Nhà tuyển dụng → Giao diện người dùng → Quản lý Tin tuyển dụng / Quản lý Hồ sơ
  - Nhà tuyển dụng → Giao diện → Quản lý Phỏng vấn → Thông báo → Ứng viên & Ban phỏng vấn
  - Nhà tuyển dụng → Giao diện → Kết quả Tuyển dụng → `Celery.generate_offer_task` (tạo offer PDF) → Lưu trữ (MEDIA) → Thông báo

#### 1.2.2 Chức năng & nhiệm vụ của từng bộ phận (Responsibilities)

- **User / Client layer:**
  - Candidate: Tìm job, nộp hồ sơ, xem trạng thái ứng tuyển
  - Guest: Duyệt job, nộp hồ sơ (nếu hệ thống cho phép)
  - Recruiter: Tạo/Cập nhật/Duyệt job, xem/lọc hồ sơ, phân công phỏng vấn, quyết định offer
  - Interviewer: Nhận email mời, xem tài liệu ứng viên, submit feedback
  - Admin: Quản lý người dùng, cấp quyền, xem báo cáo thống kê

+ **Backend (Chức năng nghiệp vụ):**
  - Quản lý Tin tuyển dụng (Job Management): Tạo/Đọc/Sửa/Xóa tin tuyển dụng, publish/close, stats endpoints
  - Quản lý Hồ sơ ứng tuyển (Application Management): Tiếp nhận hồ sơ, lưu CV, kiểm tra trùng lặp
  - Parse & AI Screening: Tác vụ nền tách CV và gọi Gemini hoặc fallback heuristics
  - Quản lý Phỏng vấn (Interview Management): Lên lịch phỏng vấn, thêm thành viên hội đồng, thông báo người tham gia
  - Thông báo (Notifications): Gửi email & nhắc nhở, quản lý templates
  - Quản lý Kết quả (Result Management): Tạo offer, generate offer PDF, gửi email ứng viên
  - Báo cáo & Phân tích (Reporting/Analytics): metrics & charts cho dashboard recruiter/admin

#### 1.2.3 Danh sách các yêu cầu (functional & non-functional)

- **Yêu cầu chức năng (Functional Requirements):**
  - FR1: CRUD job management by Recruiter/Admin
  - FR2: Candidate can view/publish jobs and apply with CV
  - FR3: Application unique per job per candidate; duplicate prevention
  - FR4: Automatic confirmation email on application submission
  - FR5: Background CV parsing & AI scoring
  - FR6: Recruiter can filter & manage applications and schedule interviews
  - FR7: Interviewers submit feedback for a given interview
  - FR8: Recruiters create recruitment result; if offer, produce PDF and send via email
  - FR9: Admin & Recruiter roles & permissions management
  - FR10: Reporting endpoints for jobs & pipeline analytics

- **Yêu cầu phi chức năng (Non-Functional):**
  - NFR1: Authentication: JWT / session management, role-based access control
  - NFR2: Scalability: Celery & Redis cho tác vụ nền (background jobs). HTTP server behind load balancer
  - NFR3: File storage: scale to S3-like solution for CV & offer PDFs
  - NFR4: Security: Password hashing, TLS, secrets in env and vaults for prod
  - NFR5: Observability: request logs, task metrics, error tracking

#### 1.2.4 Danh sách các biểu mẫu (Forms) – chi tiết fields & validation

- **Job Form**
  - Fields: title, description (HTML/Markdown), requirements, salary_range, location, employment_type, benefits, deadline, status
  - Validation: title not empty; deadline future

- **Apply Form (Candidate)**
  - Fields: candidate_email (if guest), candidate_name, cv_file (PDF/DOCX), cover_letter (optional), phone (optional)
  - Validation: CV type & size <= 5MB; email valid format; check duplicate per job

- **Auth Forms**
  - Register: email, username, password, first_name, last_name
  - Login: email, password
  - Validation: password complexity (min 8 chars, letters + numbers); email uniqueness at registration

- **Interview Form**
  - Fields: application_id, scheduled_at (tz aware), duration, mode (online/in-person), location/url, panel_members (list of user ids), notes

- **Recruitment Result Form**
  - Fields: application_id, final_decision {OFFER, REJECT}, offered_salary, start_date, offer_notes

---

## 2) Use Case Diagram (Actors, Use Cases, Relations)


- **Admin**: Quản lý toàn hệ thống (user, report, manage all).
- **System**: Actor ảo đại diện cho tác vụ nền (background jobs), AI, gửi email.

2. View Job (Xem list & detail)
3. Apply for Job (Nộp hồ sơ - Candidate/Guest)
4. Confirm Application (send confirmation email) — include by Apply
6. AI Screening (score CV) — triggered async
7. Manage Applications (filter, view, update status)
11. Submit Interview Feedback (Interviewer)
12. Make Recruitment Decision (Offer/Reject)
16. User Management (Admin)
17. Authentication & Authorization
- **Apply for Job** INCLUDE **Confirm Application** (nộp hồ sơ kèm gửi email xác nhận)
- **Apply for Job** TRIGGERS **Parse CV** and **AI Screening** (asynchronous) — mapped to Celery tasks
- **Make Recruitment Decision** INCLUDE **Generate Offer PDF** & TRIGGERS **Send Result Email**
- **Manage Applications** USES **AI Screening** output (Extend - hiển thị nếu có)
```mermaid
%% Use Case Diagram in Mermaid-like format (simplified)
actor Candidate
actor Recruiter
actor Interviewer
actor Admin
actor Guest
actor System

Candidate --o ApplyForJob
Guest --o ApplyForJob
ApplyForJob ..> ConfirmApplication : include
ApplyForJob ..> ParseCV : triggers
ParseCV ..> AIScreening : triggers
Recruiter --o ManageJob
Recruiter --o ManageApplications
Recruiter --o ScheduleInterview
ScheduleInterview ..> NotifyInterview : include
Interviewer --o SubmitInterviewFeedback
Recruiter --o MakeDecision
MakeDecision ..> GenerateOfferPDF : include
MakeDecision ..> SendResultEmail : triggers
Admin --o ManageUsers
Admin --o Reporting
System ..> SendResultEmail
System ..> ParseCV
System ..> AIScreening
````

> Lưu ý: Draw.io không hỗ trợ Mermaid Use Case native; bạn dùng shapes: actors (stickmen), use cases (oval), các mũi tên, ghi chú include/extend.

---

## 3) Use Case Description (Đặc tả các Use Case) — Template

Mỗi Use Case sẽ có phần sau:

- **Tên Use Case**
- **Actor chính**
- **Mục tiêu** (Goal / Purpose)
- **Điều kiện vào** (Preconditions)
- **Điều kiện ra** (Postconditions)
- **Main Success Scenario** (Dòng sự kiện chính) — số thứ tự các bước
- **Alternate Flows / Exceptions** (Dòng sự kiện phụ)
- **Business Rules** (Luật nghiệp vụ, constraint)
- **Mapping** (API endpoints + tasks + templates + frontend components)

### UC: Apply for Job (Nộp hồ sơ)

- **Actor**: Candidate (đăng nhập) / Guest
- **Mục tiêu**: Ứng viên gửi hồ sơ ứng tuyển (CV) cho một Job.
- **Preconditions**:
  - Job tồn tại và trạng thái `OPEN`.
  - File CV thuộc loại hợp lệ (pdf/docx) và dung lượng nhỏ hơn giới hạn (ví dụ 5MB).
- **Postconditions**:
  - Application object được tạo (status=PENDING).
  - Email xác nhận gửi tới candidate.
  - Tasks `parse_cv`, `ai_screening` được xếp hàng và trả về `ai_score` và `ai_analysis`.
- **Main Success Scenario**:
  1. Candidate chọn Job và gửi form nộp CV (multipart/form-data).
  2. Server validate input và file.
  3. Server tạo `Application` record.
  4. Server response với 201 + Application detail.
  5. Server signal triggers: `send_confirmation_email_task`, `parse_cv_task`, `screen_cv_task` (Celery).
- **Alternate flows**:
  - A1: File invalid / too big: return 400, message error, no Application created.
  - A2: Duplicate application: return 400 hoặc 409.
  - A3: Email invalid (anonymous): 400.
- **Business Rules**:
  - Một candidate chỉ nộp 1 lần cho 1 job.
- **Mapping**:
  - API: `POST /api/jobs/{id}/apply/` OR `POST /api/applications/`
  - Serializer: `ApplicationCreateSerializer`
  - Tasks: `send_confirmation_email_task`, `parse_cv_task`, `screen_cv_task`
  - Frontend: `ApplyForm.jsx` component

### UC: Confirm Application (Send Confirmation Email)

- **Actor**: System (Celery)
- **Mục tiêu**: Gửi email xác nhận tới candidate sau khi Application được tạo.
- **Preconditions**: Application created with candidate email.
- **Postconditions**: Candidate receives confirmation email; log success/fail.
- **Main Success Scenario**:
  1. Signal post_save on Application calls `send_confirmation_email_task`.
  2. Task loads `application`, renders template `email/application_received.html`, sends email via SMTP.
- **Alternate flows**: SMTP error → log & retry (optional)
- **Mapping**: `applications.tasks.send_confirmation_email_task`

### UC: Parse CV (extract text)

- **Actor**: System (Celery)
- **Mục tiêu**: Trích text từ CV để phục vụ AI analysis và tìm từ khóa.
- **Preconditions**: CV file lưu trên `MEDIA_ROOT`.
- **Postconditions**: `ai_analysis['extracted_cv_text']` updated in `application.ai_analysis`.
- **Main**:
  1. Task `parse_cv_task` opens file.
  2. If PDF: use PyPDF2; if DOCX: use mammoth.
  3. Extract text & store to `ai_analysis`.
- **Exceptions**: file corrupted → set extracted text empty & log error.
- **Mapping**: `parse_cv_task`

### UC: AI Screening

- **Actor**: System (Celery + Gemini)
- **Mục tiêu**: Sinh `ai_score` và `ai_analysis` cho application.
- **Preconditions**: `ai_analysis` has extracted text; GEMINI_API_KEY present OR uses fake score fallback.
- **Postconditions**: Update `application.ai_score` & `ai_analysis`.
- **Main**:
  1. Task `screen_cv_task` builds prompt from job JD & extracted CV text.
  2. Call Gemini API to get summary & score.
  3. Save results into DB.
- **Alternate**: No API key → fallback to default score; API error → log and fallback.
- **Mapping**: `screen_cv_task` (applications.tasks)

### UC: Manage Job

- **Actor**: Recruiter, Admin
- **Goal**: Tạo / sửa / publish / close job.
- **Preconditions**: Recruiter logged in (or admin).
- **Postconditions**: Job created/updated; if published, visible to candidates.
- **Mapping**: `jobs` app endpoints: `JobViewSet` (create/update/publish/close)

### UC: Manage Applications & Filtering

- **Actor**: Recruiter, Admin
- **Goal**: View app list, filter for status/ai_score, change status.
- **Preconditions**: Recruiter authenticated.
- **Mapping**: `GET /api/applications/`, `PATCH /api/applications/{id}/update_status/`

### UC: Schedule Interview (with Panel)

- **Actor**: Recruiter
- **Goal**: Schedule interview, add panel, notify participants.
- **Preconditions**: Application exist; recruiter has permission.
- **Postconditions**: Interview created; `send_interview_email_task` scheduled.
- **Mapping**: `POST /api/interviews/` (InterviewViewSet), `send_interview_email_task` (applications.tasks)

### UC: Submit Interview Feedback

- **Actor**: Interviewer
- **Goal**: Submit feedback and result.
- **Preconditions**: Interview exists and interviewer in panel.
- **Mapping**: `InterviewViewSet.submit_feedback`

### UC: Make Recruitment Decision & Offer

- **Actor**: Recruiter, Admin
- **Goal**: Create RecruitmentResult with final_decision; generate offer PDF; notify candidate.
- **Preconditions**: Completed interviews & feedback OR recruiter’s decision.
- **Postconditions**: Result saved; if OFFER → PDF generated & attached; email sent.
- **Mapping**: `POST /api/results/` → `generate_offer_task` → `send_result_email_task`.

### UC: Reporting & Analytics

- **Actor**: Admin/Recruiter
- **Goal**: Provide summary statistics
- **Mapping**: `GET /api/jobs/stats/` (JobsViewSet.stats) and additional endpoints as needed

---

### UC: Authentication — Login / Logout / Register

#### UC: Login

- **Actor**: Candidate/Recruiter/Interviewer/Admin
- **Goal**: Securely authenticate user and return JWT tokens
- **Preconditions**: User exists, correct credentials
- **Main Flow**:
  1. User posts email & password to `POST /api/token/`.
  2. Server verifies and returns access & refresh tokens.
  3. Client stores access token (localStorage) and uses it on subsequent API calls.
- **Alternate Flows**: incorrect credentials -> 401; account inactive -> 403
- **Mapping**: `rest_framework_simplejwt` or equivalent endpoints

#### UC: Logout

- **Actor**: Authenticated user
- **Goal**: Invalidate user session/token
- **Main Flow**:
  1. Client discards local tokens & optional server-side blacklist endpoint called to revoke refresh tokens.
  2. Server invalidates refresh tokens if blacklisting is enabled.

#### UC: Register

- **Actor**: Candidate (or Admin to create other role types)
- **Goal**: Create new account
- **Preconditions**: Email is unique, password meets policy
- **Main Flow**:
  1. POST /api/users/ with registration fields
  2. Server validates & creates User record with appropriate role
  3. Option: send verify email or onboarding flow

### UC: Quản lý Tin tuyển dụng — chi tiết

#### UC: Publish/Close Job (extra validation)

- **Actor**: Recruiter/Admin
- **Goal**: Toggle the job listing visibility
- **Business Rules**: published job must have a deadline & required fields; closing job sets status CLOSED and notifies recruiter

### UC: Apply flow - Additional Alternates

- **Alternate**: If candidate uploads an unsupported CV type or the extractor fails, create application with `ai_analysis` empty and notify recruiter to review manually.
- **Alternate**: If candidate is logged in with existing application, return 409 to prevent duplicates.

### UC: AI Integration - Additional Behavior

- **Edge Cases**:
  - If Gemini API fails or rate-limited -> schedule a retry and mark `ai_status=error`, provide UI overlays.
  - For confidential info or PII, avoid sending raw CV text to external APIs if not permitted in prod; use tokenization or hosted LLM private instances.

### UC: Offer PDF Format Details

- **Fields to populate**: candidate_name, offered_salary, start_date, job_title, recruiter_name, signature image, logo
- **Storage**: store as MEDIA with UUID filename; link to `application` or `result` model; log generation event

---

## 4) Gợi ý vẽ diagram chi tiết trong draw.io

- Actors: stickmen trên trái;
- Use cases: oval shapes cho từng Use Case;
  -- Relations: solid lines = association; dashed/<<include>> text near arrow for includes; arrows for triggers:
  - Nộp hồ sơ (Apply) -> (solid) -> Xác nhận hồ sơ (Confirm Application) [include]
  - Nộp hồ sơ (Apply) -> (mũi tên) -> Tách CV (Parse CV) -> Sàng lọc AI (AI Screening) [trigger]
  - Lên lịch phỏng vấn (Schedule Interview) -> Thông báo phỏng vấn (Notify Interview) [include]
  - Quyết định tuyển dụng (Make Decision) -> Tạo Offer (Generate Offer) [include] -> Gửi kết quả (Send Result) [trigger]

---

## 5) Bản đồ tới hiện trạng repo: Endpoints/Tasks/Components (Rough mapping)

- Backend endpoints:
  - `jobs` app: `JobViewSet` (+ /apply/ and /stats/)
  - `applications` app: `ApplicationViewSet`, `InterviewViewSet`, `RecruitmentResultViewSet`
- Celery tasks (in `applications.tasks`):
  - `send_confirmation_email_task`, `parse_cv_task`, `screen_cv_task`, `send_interview_email_task`, `send_result_email_task`, `generate_offer_task`.
- Frontend components:
  - `ApplyForm.jsx`, `JobList.jsx`, `Job detail` (to implement), `Recruiter dashboard` (to implement)

---

## 6) Ghi chú & Implementation tips

- Khi vẽ: ưu tiên vẽ khối nghiệp vụ chính trước (BFD), sau đó vẽ Use Case Diagram, cuối cùng là Use Case Descriptions.
- Dùng một màu khác hoặc style khác để nhóm các use case vào khối nghiệp vụ tương ứng (ví dụ: Nhóm Quản lý Hồ sơ ứng tuyển chứa các Use Case: Nộp hồ sơ, Xác nhận hồ sơ, Tách CV, Sàng lọc AI).
- Sắp xếp các use case theo thứ tự luồng: Apply -> Confirm -> Parse -> AI -> Recruiter Actions -> Interview -> Result.
- Khi vẽ relations: dùng <<include>> cho mandatory steps (e.g., confirm application), và dùng <<extend>> khi optional (ví dụ, AI Screening extend Apply nếu AI key present).

---

Nếu bạn muốn, tôi có thể:

- Tạo file `.drawio` mẫu (XML) sắp xếp các shapes tự động (nếu bạn muốn tôi vẽ và xuất).
- Hoặc chuyển một số Use Case mô tả thành PNG/SVG để chèn vào báo cáo.

Bạn muốn tôi tiếp theo: (A) Tạo file `.drawio` mẫu; (B) Tạo các vị trí endpoint & tasks checklist để bạn tick khi hoàn thành; hay (C) Bắt đầu triển khai Option A/B/C từ lộ trình thực thi code tiếp theo?
