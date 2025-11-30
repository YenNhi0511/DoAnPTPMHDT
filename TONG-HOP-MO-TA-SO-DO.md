# 📊 TỔNG HỢP MÔ TẢ TẤT CẢ CÁC SƠ ĐỒ HỆ THỐNG

Tài liệu này tổng hợp mô tả chi tiết tất cả các sơ đồ trong hệ thống tuyển dụng nhân sự, bao gồm: BFD, Use Case Diagram, Activity Diagram, Sequence Diagram, Communication Diagram, Class Diagram, ERD, LDM, và DFD.

---

## 📋 MỤC LỤC

1. [BFD - Business Function Diagram](#1-bfd---business-function-diagram)
2. [Use Case Diagram](#2-use-case-diagram)
3. [Activity Diagram](#3-activity-diagram)
4. [Sequence Diagram](#4-sequence-diagram)
5. [Communication Diagram](#5-communication-diagram)
6. [Class Diagram](#6-class-diagram)
7. [ERD - Entity Relationship Diagram](#7-erd---entity-relationship-diagram)
8. [LDM - Logical Database Model](#8-ldm---logical-database-model)
9. [DFD - Data Flow Diagram](#9-dfd---data-flow-diagram)

---

## 1) BFD - Business Function Diagram

**Mục đích:** Mô tả các khối chức năng nghiệp vụ chính của hệ thống và mối quan hệ giữa chúng.

### Các khối chức năng chính:

1. **Người dùng & Xác thực (User & Auth)**
   - Đăng ký, Đăng nhập
   - Quản lý role & quyền (ADMIN, RECRUITER, INTERVIEWER, CANDIDATE)
   - Quản lý profile

2. **Quản lý Tin tuyển dụng (Job Management)**
   - Tạo/Chỉnh sửa/Xóa/Publish/Close Job
   - Quản lý deadline, trạng thái
   - Search/filters

3. **Quản lý Hồ sơ ứng tuyển (Application Management)**
   - Nhận hồ sơ từ ứng viên
   - Quản lý trạng thái (PENDING, SCREENING, INTERVIEW, OFFER, REJECTED, ACCEPTED)
   - Trích xuất CV (PDF/DOCX)
   - AI Screening (Gemini API)

4. **Quản lý Phỏng vấn (Interview Management)**
   - Lên lịch phỏng vấn
   - Quản lý hội đồng phỏng vấn
   - Nhận feedback từ interviewers

5. **Kết quả Tuyển dụng & Offer (Recruitment Result & Offer)**
   - Tạo kết quả tuyển dụng (OFFER/REJECT)
   - Generate offer letter PDF
   - Lưu trữ kết quả

6. **Thông báo (Notifications)**
   - System notifications
   - In-app notifications

7. **Báo cáo & Phân tích (Reports & Analytics)**
   - Dashboard statistics
   - Charts và metrics
   - Export reports

### Luồng dữ liệu:

```
Actors: Candidate | Recruiter | Interviewer | Admin | Guest

UI ---> Quản lý Tin tuyển dụng (Job Management)
UI ---> Quản lý Hồ sơ ứng tuyển (Application Management)
UI ---> Quản lý Phỏng vấn (Interview Management)
UI ---> Kết quả Tuyển dụng & Offer (Recruitment Result & Offer)
UI ---> Người dùng & Vai trò (User & Role Management)

Quản lý Hồ sơ ứng tuyển ---> AI Screening (Celery Worker)
AI Screening ---> Database
Quản lý Phỏng vấn ---> Thông báo (Notifications)
Kết quả Tuyển dụng ---> Thông báo (Notifications)
Tác vụ nền (Celery) ---> Database
```

---

## 2) Use Case Diagram

**Mục đích:** Mô tả các actors, use cases và mối quan hệ giữa chúng.

### Actors:

- **Candidate:** Ứng viên tìm việc
- **Guest:** Người dùng chưa đăng nhập
- **Recruiter:** Nhà tuyển dụng
- **Interviewer:** Người phỏng vấn
- **Admin:** Quản trị viên hệ thống
- **System:** Actor ảo đại diện cho tác vụ nền (Celery, AI)

### Use Cases chính:

#### Nhóm: Quản lý Tin tuyển dụng
- **View Job** (Candidate, Guest, Recruiter, Admin)
- **Create Job** (Recruiter, Admin)
- **Update Job** (Recruiter, Admin)
- **Delete Job** (Recruiter, Admin)
- **Publish Job** (Recruiter, Admin)
- **Close Job** (Recruiter, Admin)

#### Nhóm: Quản lý Hồ sơ ứng tuyển
- **Apply for Job** (Candidate, Guest)
  - INCLUDE: **Confirm Application** (System gửi notification)
  - TRIGGERS: **Parse CV** (System)
  - TRIGGERS: **AI Screening** (System)
- **View Applications** (Recruiter, Admin)
- **Filter Applications** (Recruiter, Admin)
- **Update Application Status** (Recruiter, Admin)
- **Invite Interview** (Recruiter, Admin)

#### Nhóm: AI & Screening
- **Parse CV** (System)
- **AI Screening** (System)

#### Nhóm: Quản lý Phỏng vấn
- **Schedule Interview** (Recruiter, Admin)
  - INCLUDE: **Notify Interview Participants**
- **View Interviews** (Recruiter, Interviewer, Candidate, Admin)
- **Update Interview** (Recruiter, Admin)
- **Cancel Interview** (Recruiter, Admin)
- **Submit Interview Feedback** (Interviewer)

#### Nhóm: Kết quả Tuyển dụng
- **Make Recruitment Decision** (Recruiter, Admin)
  - INCLUDE: **Generate Offer PDF** (nếu OFFER)
  - TRIGGERS: **Send Result Notification** (System)
- **View Results** (Recruiter, Admin, Candidate)

#### Nhóm: Xác thực & Quản lý User
- **Register** (Candidate, Recruiter)
- **Login** (All roles)
- **Logout** (Authenticated users)
- **View Profile** (All authenticated users)
- **Update Profile** (All authenticated users)
- **Change Password** (All authenticated users)
- **Manage Users** (Admin)

#### Nhóm: Báo cáo
- **View Dashboard** (Recruiter, Admin)
- **View Reports** (Recruiter, Admin)
- **Export Reports** (Recruiter, Admin)

### Quan hệ:

- **Apply for Job** INCLUDE **Confirm Application**
- **Apply for Job** TRIGGERS **Parse CV** → **AI Screening**
- **Schedule Interview** INCLUDE **Notify Interview Participants**
- **Make Recruitment Decision** INCLUDE **Generate Offer PDF** (nếu OFFER)
- **Make Recruitment Decision** TRIGGERS **Send Result Notification**

---

## 3) Activity Diagram

**Mục đích:** Mô tả luồng hoạt động chi tiết của quy trình nộp hồ sơ.

### Flow: Apply for Job

```
Người dùng     Frontend       Backend API      Database       Worker(Celery)     External
------------   ----------     -------------    -----------    ---------------    ---------
Fill form &    POST /api/     validate & create  INSERT         emit signal       call Gemini
upload CV      jobs/{id}/      Application        application    (parse_cv,         API
               apply/                          (201 Created)   screen_cv)

Luồng chi tiết:
1) Người dùng -> Frontend: Fill form & Upload CV
2) Frontend -> Backend API: POST /api/jobs/{id}/apply/
3) Backend API validates:
   - Job status = OPEN
   - Deadline chưa qua
   - File type: PDF/DOCX
   - File size <= 10MB
   - Unique: 1 candidate/job
4) Backend API -> Database: INSERT application (status=PENDING)
5) Backend API -> Response: 201 Created
6) Backend API triggers Signals -> Celery Worker
7) Celery Worker executes:
   a) parse_cv_task: Extract text from CV
   b) screen_cv_task: Call Gemini API for AI scoring
8) Celery Worker -> Database: UPDATE application (ai_score, ai_analysis, status=SCREENING)
9) Celery Worker -> System: Create notification
10) Recruiter sees updates on Dashboard
```

---

## 4) Sequence Diagram

**Mục đích:** Mô tả tương tác tuần tự giữa các thành phần trong quy trình nộp hồ sơ.

### Flow: Apply for Job

```
Candidate        Frontend           Backend(API)       DB          Celery Worker       Gemini API
-----------------------------------------------------------------------------------------------
Fill form &      POST /api/jobs/{id}/apply/ -->
upload CV        --> Backend(API): validate input
                                --> Backend(API): create Application
                                --> DB: INSERT application
                                <-- 201 Created
                                --> Celery: parse_cv_task.delay()
                                --> Celery: screen_cv_task.delay()
                                
Celery Worker    --> DB: SELECT application
                 --> Storage: Read CV file
                 --> Extractor: Parse PDF/DOCX
                 --> DB: UPDATE ai_analysis['extracted_text']
                 
Celery Worker    --> Gemini API: POST /v1/models/gemini-1.5-pro:generateContent
                 <-- Response: {score, strengths, weaknesses, recommendation}
                 --> DB: UPDATE ai_score, ai_analysis, status=SCREENING
                 
Celery Worker    --> System: Create notification
                 
Recruiter        --> Frontend: View Dashboard
                 --> Backend(API): GET /api/applications/
                 <-- Response: Applications with AI scores
```

---

## 5) Communication Diagram

**Mục đích:** Mô tả quan hệ và tương tác giữa các đối tượng.

```
Candidate --> Frontend (apply)
Frontend --> Backend(API): POST /api/jobs/{id}/apply/
Backend(API) --> Application Model: create application
Application Model --emits signal--> Celery Worker (parse_cv_task, screen_cv_task)
Celery Worker --> Storage: read CV file
Celery Worker --> Gemini API: call AI screening
Celery Worker --> Database: update ai_score & ai_analysis
Celery Worker --> Notification Model: create notification
Recruiter --> Backend(API): GET /api/applications/
Backend(API) --> Application Model: query applications
Application Model --> Database: SELECT applications
Backend(API) --> Recruiter: return applications list
```

---

## 6) Class Diagram

**Mục đích:** Mô tả cấu trúc các lớp (models) và mối quan hệ giữa chúng.

```
                  +---------------------+   +-------------------+   +-------------------------+
                  |        User         |   |        Job        |   |      Application         |
                  +---------------------+   +-------------------+   +-------------------------+
                  | id: UUID            |   | id: UUID          |   | id: UUID                |
                  | email: String       |   | title: String     |   | job_id: FK -> Job       |
                  | username: String    |   | description: Text |   | candidate_id: FK -> User|
                  | role: String        |   | status: String    |   | status: String          |
                  | password: String   |   | deadline: DateTime |   | cv_file: FileField       |
                  | company_name: Str  |   | created_by: FK    |   | cover_letter: Text       |
                  | ...                 |   | publish(), close()|   | ai_score: Float         |
                  +---------------------+   +-------------------+   | ai_analysis: JSON       |
                          | 1                                        | applied_at: DateTime    |
                          | *                                        +-------------------------+
                          |                                                  |
                          |                                                  | 1
                          |                                                  | *
                          |                                                  |
                  +---------------------+                           +-------------------------+
                  |    Interview       |                           |  RecruitmentResult      |
                  +---------------------+                           +-------------------------+
                  | id: UUID            |                           | id: UUID                |
                  | application_id: FK  |                           | application_id: FK (1:1)|
                  | scheduled_at: DT    |                           | final_decision: String  |
                  | duration: Integer   |                           | offer_letter: FileField  |
                  | interview_type: Str |                           | salary: String          |
                  | status: String      |                           | start_date: Date        |
                  | feedback: Text      |                           | decided_by: FK          |
                  +---------------------+                           +-------------------------+
                          | 1
                          | *
                  +---------------------+
                  |  InterviewPanel    |
                  +---------------------+
                  | id: UUID            |
                  | interview_id: FK    |
                  | interviewer_id: FK |
                  | role: String        |
                  | feedback: Text      |
                  | score: Float        |
                  +---------------------+

Relationships:
- User 1..* <-- APPLICATIONS --> Application
- Job 1..* <-- APPLICATIONS --> Application
- Application 1..* <-- INTERVIEWS --> Interview
- Interview 1..* <-- PANELS --> InterviewPanel
- InterviewPanel *..1 <-- INTERVIEWER --> User
- Application 1..1 <-- RESULT --> RecruitmentResult
```

---

## 7) ERD - Entity Relationship Diagram

**Mục đích:** Mô tả cấu trúc database và quan hệ giữa các bảng.

```
USERS
|-- id (PK, UUID)
|-- email (UNIQUE)
|-- username (UNIQUE)
|-- password_hash
|-- role (ADMIN, RECRUITER, INTERVIEWER, CANDIDATE)
|-- first_name
|-- last_name
|-- phone
|-- company_name
|-- field_of_activity
|-- address
|-- is_active
|-- created_at
|-- updated_at

JOBS
|-- id (PK, UUID)
|-- title
|-- description (Text)
|-- requirements (Text)
|-- salary_min
|-- salary_max
|-- location
|-- employment_type
|-- positions_count
|-- experience_years
|-- status (DRAFT, OPEN, CLOSED, CANCELLED)
|-- deadline
|-- created_by_id (FK -> USERS.id)
|-- created_at
|-- updated_at

APPLICATIONS
|-- id (PK, UUID)
|-- job_id (FK -> JOBS.id)
|-- candidate_id (FK -> USERS.id)
|-- cv_file (FileField)
|-- cover_letter (Text)
|-- status (PENDING, SCREENING, INTERVIEW, OFFER, REJECTED, ACCEPTED)
|-- ai_score (Float)
|-- ai_analysis (JSONB)
|-- screener_notes (Text)
|-- applied_at
|-- updated_at
|-- UNIQUE(job_id, candidate_id)

INTERVIEWS
|-- id (PK, UUID)
|-- application_id (FK -> APPLICATIONS.id)
|-- scheduled_at (DateTime)
|-- duration (Integer)
|-- location (String)
|-- interview_type (PHONE, VIDEO, ONSITE)
|-- status (SCHEDULED, COMPLETED, CANCELLED, RESCHEDULED)
|-- feedback (Text)
|-- result (PASS, FAIL, PENDING)
|-- created_at
|-- updated_at

INTERVIEW_PANELS
|-- id (PK, UUID)
|-- interview_id (FK -> INTERVIEWS.id)
|-- interviewer_id (FK -> USERS.id)
|-- role (LEAD, MEMBER, OBSERVER)
|-- feedback (Text)
|-- score (Float)
|-- created_at
|-- UNIQUE(interview_id, interviewer_id)

RECRUITMENT_RESULTS
|-- id (PK, UUID)
|-- application_id (FK -> APPLICATIONS.id, UNIQUE)
|-- final_decision (OFFER, REJECT)
|-- offer_letter_file (FileField)
|-- salary (String)
|-- start_date (Date)
|-- notes (Text)
|-- decided_by_id (FK -> USERS.id)
|-- decided_at
|-- created_at

NOTIFICATIONS
|-- id (PK, UUID)
|-- user_id (FK -> USERS.id)
|-- notification_type (EMAIL, SYSTEM)
|-- title
|-- content (Text)
|-- is_read (Boolean)
|-- related_id (UUID)
|-- sent_at
|-- created_at

RECRUITMENT_PROCESSES
|-- id (PK, UUID)
|-- name
|-- description
|-- is_default (Boolean)
|-- created_by_id (FK -> USERS.id)
|-- created_at
|-- updated_at

PROCESS_STEPS
|-- id (PK, UUID)
|-- process_id (FK -> RECRUITMENT_PROCESSES.id)
|-- name
|-- step_type
|-- order (Integer)
|-- description
|-- duration_days
|-- is_required (Boolean)
|-- UNIQUE(process_id, order)

Relationships:
- USERS 1..* <-- CREATED_JOBS --> JOBS (created_by)
- USERS 1..* <-- APPLICATIONS --> APPLICATIONS (candidate)
- JOBS 1..* <-- APPLICATIONS --> APPLICATIONS
- APPLICATIONS 1..* <-- INTERVIEWS --> INTERVIEWS
- INTERVIEWS 1..* <-- PANELS --> INTERVIEW_PANELS
- USERS 1..* <-- INTERVIEWER_PANELS --> INTERVIEW_PANELS (interviewer)
- APPLICATIONS 1..1 <-- RESULT --> RECRUITMENT_RESULTS
- USERS 1..* <-- DECIDED_RESULTS --> RECRUITMENT_RESULTS (decided_by)
- USERS 1..* <-- NOTIFICATIONS --> NOTIFICATIONS
- USERS 1..* <-- CREATED_PROCESSES --> RECRUITMENT_PROCESSES
- RECRUITMENT_PROCESSES 1..* <-- STEPS --> PROCESS_STEPS
```

---

## 8) LDM - Logical Database Model

**Mục đích:** Mô tả cấu trúc logic của database (SQL-like schema).

### Bảng: users

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CANDIDATE',
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    phone VARCHAR(20),
    avatar VARCHAR(100),
    company_name VARCHAR(255),
    field_of_activity VARCHAR(255),
    tax_id VARCHAR(50),
    website VARCHAR(200),
    scale VARCHAR(100),
    address TEXT,
    company_email VARCHAR(255),
    company_description TEXT,
    business_registration_document VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Bảng: jobs

```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    salary_min DECIMAL(15,0),
    salary_max DECIMAL(15,0),
    salary VARCHAR(100),
    location VARCHAR(255) NOT NULL,
    employment_type VARCHAR(20) DEFAULT 'FULLTIME',
    positions_count INTEGER DEFAULT 1,
    experience_years INTEGER,
    status VARCHAR(20) DEFAULT 'DRAFT',
    deadline TIMESTAMP NOT NULL,
    recruitment_process_id UUID,
    created_by_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_deadline ON jobs(deadline);
CREATE INDEX idx_jobs_created_by ON jobs(created_by_id);
```

### Bảng: applications

```sql
CREATE TABLE applications (
    id UUID PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES jobs(id),
    candidate_id UUID NOT NULL REFERENCES users(id),
    cv_file VARCHAR(100) NOT NULL,
    cover_letter TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    ai_score FLOAT,
    ai_analysis JSONB,
    screener_notes TEXT,
    applied_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(job_id, candidate_id)
);

CREATE INDEX idx_applications_job_status ON applications(job_id, status);
CREATE INDEX idx_applications_candidate ON applications(candidate_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_ai_score ON applications(ai_score);
```

### Bảng: interviews

```sql
CREATE TABLE interviews (
    id UUID PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES applications(id),
    scheduled_at TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    location VARCHAR(500),
    interview_type VARCHAR(20) DEFAULT 'VIDEO',
    status VARCHAR(20) DEFAULT 'SCHEDULED',
    feedback TEXT,
    result VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_interviews_scheduled_status ON interviews(scheduled_at, status);
CREATE INDEX idx_interviews_application ON interviews(application_id);
```

### Bảng: interview_panels

```sql
CREATE TABLE interview_panels (
    id UUID PRIMARY KEY,
    interview_id UUID NOT NULL REFERENCES interviews(id),
    interviewer_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(20) DEFAULT 'MEMBER',
    feedback TEXT,
    score FLOAT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(interview_id, interviewer_id)
);

CREATE INDEX idx_panels_interview ON interview_panels(interview_id);
CREATE INDEX idx_panels_interviewer ON interview_panels(interviewer_id);
```

### Bảng: recruitment_results

```sql
CREATE TABLE recruitment_results (
    id UUID PRIMARY KEY,
    application_id UUID UNIQUE NOT NULL REFERENCES applications(id),
    final_decision VARCHAR(20) NOT NULL,
    offer_letter_file VARCHAR(100),
    salary VARCHAR(100),
    start_date DATE,
    notes TEXT,
    decided_by_id UUID NOT NULL REFERENCES users(id),
    decided_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_results_application ON recruitment_results(application_id);
CREATE INDEX idx_results_decided_by ON recruitment_results(decided_by_id);
CREATE INDEX idx_results_decided_at ON recruitment_results(decided_at);
```

### Bảng: notifications

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    notification_type VARCHAR(20) DEFAULT 'SYSTEM',
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_id UUID,
    sent_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read, created_at);
CREATE INDEX idx_notifications_user ON notifications(user_id);
```

### Bảng: recruitment_processes

```sql
CREATE TABLE recruitment_processes (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_by_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Bảng: process_steps

```sql
CREATE TABLE process_steps (
    id UUID PRIMARY KEY,
    process_id UUID NOT NULL REFERENCES recruitment_processes(id),
    name VARCHAR(255) NOT NULL,
    step_type VARCHAR(30) NOT NULL,
    order INTEGER NOT NULL,
    description TEXT,
    duration_days INTEGER DEFAULT 7,
    is_required BOOLEAN DEFAULT TRUE,
    UNIQUE(process_id, order)
);
```

---

## 9) DFD - Data Flow Diagram

**Mục đích:** Mô tả luồng dữ liệu trong hệ thống.

### DFD Level 0: High-level Context

```
DFD Level 0: High-level context

  Candidate
    |
    | apply
    v
  +----------------------+        +----------------------+
  | Hệ thống Tuyển dụng  | <----> |   Database (Storage) |
  +----------------------+        +----------------------+
    ^     |    ^
    |     |    |
 manage|   |call|
    |     v    |
  Recruiter    Gemini API (External)
```

### DFD Level 1: Application Management & Screening

```
DFD Level 1: Application Management & Screening

Candidate -> Frontend UI
Frontend -> Backend(API): POST /api/jobs/{id}/apply/
Backend(API) -> DB: create Application record
Backend(API) -> Celery Worker: trigger parse_cv_task & screen_cv_task
Celery Worker -> Storage: read CV file
Celery Worker -> Extractor: parse CV -> store extracted_text to DB
Celery Worker -> AI Engine (Gemini): call API -> store ai_analysis & ai_score to DB
DB -> Recruiter Dashboard -> Recruiter reviews applications
```

### DFD Level 2: AI Screening Decomposition

```
DFD Level 2: AI Screening decomposition

Celery Worker -> load CV from Storage (Media)
Storage -> Extractor (PDF/DOCX) -> extracted_text
Extractor -> AI Engine (build prompt & call Gemini)
AI Engine -> Gemini API: POST request with job requirements + CV text
Gemini API -> AI Engine: return JSON {score, strengths, weaknesses, recommendation}
AI Engine -> DB: store ai_analysis & ai_score
AI Engine -> Heuristics: fallback analysis if API unavailable
```

---

## 📝 GHI CHÚ

- Tất cả các sơ đồ trên đã **BỎ** chức năng xác thực bằng email và OTP
- Authentication chỉ còn: **Register** và **Login** với username/password
- Không có email verification flow
- Không có OTP verification flow
- User sau khi đăng ký có thể đăng nhập ngay (không cần verify)

---

## 🛠️ CÔNG CỤ VẼ SƠ ĐỒ

- **Draw.io / diagrams.net:** Import các mô tả trên để vẽ
- **Mermaid:** Có thể convert một số sơ đồ sang Mermaid syntax
- **PlantUML:** Có thể dùng cho Class Diagram và Sequence Diagram

---

## 📚 TÀI LIỆU THAM KHẢO

- Chi tiết Use Cases: `docs/05-use-cases-and-bfd.md`
- Chi tiết Architecture Diagrams: `docs/06-architecture-diagrams.md`
- Database Design: `docs/01-database-design.md`
- API Endpoints: `docs/03-api-endpoints.md`

