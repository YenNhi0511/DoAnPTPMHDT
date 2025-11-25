# Architecture Diagrams (Activity, Sequence, Collaboration, Class, ERD, LDM, DFD)

Tài liệu này chứa các biểu đồ kiến trúc chính cho hệ thống: luồng hoạt động, sơ đồ tuần tự, sơ đồ tương tác (communication), sơ đồ lớp, sơ đồ quan hệ thực thể (ERD), mô hình cơ sở dữ liệu logic (LDM) và sơ đồ luồng dữ liệu (DFD) levels 0..2.

---

## 1) Activity Diagram (Sơ đồ hoạt động) — Flow: Apply for Job

Mô tả: quy trình nộp hồ sơ (ứng viên) và xử lý phía server (sync + async).

```text
Người dùng     Frontend       Backend API      Database       Worker(Celery)     External
------------   ----------     -------------    -----------    ---------------    ---------
Fill form &    POST /api/     validate & create  INSERT         emit signal       call Gemini
upload CV      jobs/{id}/      Application        application    (parse_cv,         send email
               apply/                          (201 Created)   screen_cv)         via SMTP

Luồng:
1) Người dùng -> Frontend: Fill form & Upload CV
2) Frontend -> Backend API: POST /api/jobs/{id}/apply/
3) Backend API validates -> save to Database (Application)
4) Backend API triggers Signals -> Worker (Celery)
5) Worker (Celery) executes: parse_cv_task -> screen_cv_task (call Gemini)
6) Worker updates Database with ai_score & ai_analysis
7) Worker triggers send_confirmation_email_task -> SMTP (External)
8) Recruiter sees updates on Recruiter Dashboard
```

> Ghi chú: các tác vụ Celery chạy bất đồng bộ. Mũi tên biểu thị luồng và tương tác giữa UI, API, DB, Worker, và các dịch vụ ngoài.

---

## 2) Sequence Diagram (Sơ đồ tuần tự) — Apply Flow

```text
Candidate        Frontend           Backend(API)       DB          Celery Worker       Gemini / SMTP
-----------------------------------------------------------------------------------------------
Fill form &      POST /api/jobs/{id}/apply/ -->
upload CV        --> Backend(API): create Application
                                --> DB: INSERT application
                                <- 201 Created
                                --> Celery: send_confirmation_email_task
                                --> Celery: parse_cv_task, screen_cv_task
Celery Worker    reads CV from DB
                 calls Gemini --> Gemini returns ai_score & ai_analysis
                 updates DB with ai_*
                 triggers SMTP: send email -> delivered
```

---

## 3) Collaboration / Communication Diagram (Tập trung vào quan hệ giữa đối tượng)

Sử dụng flowchart để thể hiện quan hệ: Client, API, Model, Worker, External Services.

```text
Candidate --> Frontend (apply)
Frontend --> Backend(API): POST /api/jobs/{id}/apply/
Backend(API) --> Application Model: create application
Application Model --emits--> Celery Worker (parse_cv_task, screen_cv_task)
Celery Worker --> Gemini / SMTP: call AI / send emails
Recruiter --> Backend(API): view / action (review apps)
```

> Collaboration: công việc phân chia giữa frontend (gửi request), backend (tạo record), worker (xử lý background), external services (AI, SMTP).

---

## 4) Class Diagram (Sơ đồ lớp) — Models & Methods (bắt buộc)

```text
                  +---------------------+   +-------------------+   +-------------------------+
                  |        User         |   |        Job        |   |      Application         |
                  +---------------------+   +-------------------+   +-------------------------+
                  | id: UUID            |   | id: UUID          |   | id: UUID                |
                  | email: String       |   | title: String     |   | job_id: FK -> Job       |
                  | username: String    |   | description: Text |   | candidate_id: FK -> User|
                  | role: String        |   | status: String    |   | status: String          |
                  | createApplication() |   | deadline: date    |   | cv_file_path: String    |
                  +---------------------+   | publish(), close()|   | ai_score: Float         |
                                             +-------------------+   | ai_analysis: JSONB      |
                                                                       +-------------------------+

Relationships:
User 1..*  <-- applies -->  Application
Job  1..*  <-- has      -->  Application
Application 1..*  <-- schedules --> Interview
Interview 1..*  <-- has panels --> InterviewPanel
Application 1..1  <-- has --> RecruitmentResult

Other model brief:
Interview: id, application_id (FK), scheduled_at, duration, mode
InterviewPanel: id, interview_id (FK), user_id (FK), role
RecruitmentResult: id, application_id (FK), final_decision, offered_salary, pdf_path
```

> Ghi chú: các lớp có phương thức chính (controller-like) để biểu diễn các hành vi quan trọng.

---

## 5) ERD — Entity Relationship Diagram (bắt buộc)

```text
ERD Entities & Relationships (ASCII):

USERS
|-- id (PK)
|-- email
|-- username
|-- role

JOBS
|-- id (PK)
|-- title
|-- description
|-- status
|-- deadline

APPLICATIONS
|-- id (PK)
|-- job_id (FK -> JOBS.id)
|-- candidate_id (FK -> USERS.id)
|-- status
|-- cv_file_path
|-- ai_analysis
|-- ai_score

INTERVIEWS
|-- id (PK)
|-- application_id (FK -> APPLICATIONS.id)
|-- scheduled_at
|-- duration
|-- mode

INTERVIEW_PANELS
|-- id (PK)
|-- interview_id (FK -> INTERVIEWS.id)
|-- user_id (FK -> USERS.id)
|-- role

RECRUITMENT_RESULTS
|-- id (PK)
|-- application_id (FK -> APPLICATIONS.id)
|-- final_decision
|-- offered_salary
|-- pdf_path

Relationships:
USERS 1..* <-- APPLICATIONS
JOBS  1..* <-- APPLICATIONS
APPLICATIONS 1..* <-- INTERVIEWS
INTERVIEWS 1..* <-- INTERVIEW_PANELS
APPLICATIONS 1..1 <-- RECRUITMENT_RESULTS
```

---

## 6) Logical Database Model (LDM) — Bảng & quan hệ logic

Mô tả các bảng chính và các trường chính (SQL-like schema):

- jobs

  - id UUID PK
  - title varchar
  - description text
  - status varchar
  - deadline timestamp
  - created_at timestamp
  - updated_at timestamp

- users

  - id UUID PK
  - email varchar
  - username varchar
  - password_hash varchar
  - role varchar
  - is_active boolean

- applications

  - id UUID PK
  - job_id UUID FK -> jobs.id
  - candidate_id UUID FK -> users.id
  - status varchar
  - cv_file varchar
  - ai_score numeric
  - ai_analysis jsonb
  - created_at timestamp

- interviews

  - id UUID PK
  - application_id UUID FK -> applications.id
  - scheduled_at timestamp
  - duration integer
  - mode varchar

- interview_panels

  - id UUID PK
  - interview_id UUID FK -> interviews.id
  - user_id UUID FK -> users.id
  - role varchar

- recruitment_results
  - id UUID PK
  - application_id UUID FK -> applications.id
  - final_decision varchar
  - offered_salary numeric
  - pdf_path varchar
  - created_at timestamp

> Ghi chú: tạo các index trên FK và các trường filter phổ biến như `status`, `ai_score`, `created_at`.

---

## 7) Data Flow Diagram (DFD)

- DFD Level 0: High-level context diagram

```text
DFD Level 0: High-level context (ASCII)

  Candidate
    |
    | apply
    v
  +----------------------+        +----------------------+
  | Hệ thống Tuyển dụng  | <----> |   Database (Storage) |
  +----------------------+        +----------------------+
    ^     |    ^
    |     |    |
 manage|   |call|send email
    |     v    |
  Recruiter    Gemini / SMTP (External)
```

- DFD Level 1: Decompose Application Management & Screening

```text
DFD Level 1: Application Management & Screening (ASCII)

Candidate -> Frontend UI
Frontend -> Backend(API): POST /api/jobs/{id}/apply/
Backend(API) -> DB: create Application record
Backend(API) -> Celery Worker: trigger parse_cv_task & screen_cv_task
Celery Worker -> Extractor: parse CV -> store extracted_text to DB
Celery Worker -> AI Engine (Gemini) -> store ai_analysis & ai_score to DB
DB -> Recruiter Dashboard -> Recruiter reviews applications
```

- DFD Level 2: Decompose AI Screening flow

```text
DFD Level 2: AI Screening decomposition (ASCII)

Celery Worker -> load CV from Storage (Media)
Storage -> Extractor (PDF/DOCX) -> extracted_text
Extractor -> AI Engine (build prompt & call Gemini)
AI Engine -> DB: store ai_analysis & ai_score
AI Engine -> Heuristics: fallback analysis if API unavailable
```

---

## 8) Notes & Tools

- Các sơ đồ trên dùng Mermaid — bạn có thể copy/paste vào draw.io Mermaid plugin (hoặc sử dụng live editor) để export PNG/SVG/Draw.io
- Nếu bạn muốn file `.drawio` XML, tôi có thể tạo skeleton export (nhu cầu: shapes, layout, labels + translations ra tiếng Việt)

---

Nếu bạn muốn tôi tiếp tục: (A) Tạo file `.drawio` skeleton từ các sơ đồ trên; (B) Xuất từng sơ đồ thành PNG/SVG; (C) Tạo checklist/actionable tasks từ các sơ đồ (tức chuyển UseCase -> issue list); hoặc (D) Triển khai một phần như LDM -> SQL migration / Django models, hãy chọn và tôi sẽ tiếp tục.
