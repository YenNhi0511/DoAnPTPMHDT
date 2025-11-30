# 📊 SƠ ĐỒ PLANTUML - HỆ THỐNG TUYỂN DỤNG NHÂN SỰ

File này chứa code PlantUML ngắn gọn cho tất cả các sơ đồ chính. Copy code vào [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/) để xem sơ đồ.

---

## 1. USE CASE DIAGRAM - TỔNG QUAN

```plantuml
@startuml
left to right direction

actor Candidate
actor Guest
actor Recruiter
actor Interviewer
actor Admin
actor System

rectangle "Authentication" {
  usecase "Register" as UC1
  usecase "Login" as UC2
  usecase "Logout" as UC3
  usecase "View Profile" as UC4
  usecase "Update Profile" as UC5
}

rectangle "Job Management" {
  usecase "View Jobs" as UC6
  usecase "Search Jobs" as UC7
  usecase "Create Job" as UC8
  usecase "Update Job" as UC9
  usecase "Delete Job" as UC10
  usecase "Publish Job" as UC11
}

rectangle "Application Management" {
  usecase "Apply for Job" as UC12
  usecase "View Applications" as UC13
  usecase "Filter Applications" as UC14
  usecase "Update Application Status" as UC15
}

rectangle "AI & Screening" {
  usecase "Parse CV" as UC16
  usecase "AI Screening" as UC17
}

rectangle "Interview Management" {
  usecase "Schedule Interview" as UC18
  usecase "Create Interview Panel" as UC19
  usecase "Add Panel Members" as UC20
  usecase "View Interviews" as UC21
  usecase "Submit Interview Score" as UC22
  usecase "Send Interview Result Email" as UC23
}

rectangle "Recruitment Result" {
  usecase "Make Recruitment Decision" as UC24
  usecase "Generate Offer PDF" as UC25
  usecase "View Results" as UC26
  usecase "Send Result Email" as UC27
}

rectangle "Admin Management" {
  usecase "Manage Companies" as UC28
  usecase "Manage Interviewers" as UC29
  usecase "Manage Jobs" as UC30
  usecase "View Dashboard" as UC31
  usecase "View Reports" as UC32
}

' Associations
Candidate --> UC1
Candidate --> UC2
Candidate --> UC3
Candidate --> UC4
Candidate --> UC5
Candidate --> UC6
Candidate --> UC7
Candidate --> UC12
Candidate --> UC21
Candidate --> UC26

Guest --> UC6
Guest --> UC7
Guest --> UC12

Recruiter --> UC2
Recruiter --> UC3
Recruiter --> UC4
Recruiter --> UC5
Recruiter --> UC6
Recruiter --> UC7
Recruiter --> UC8
Recruiter --> UC9
Recruiter --> UC10
Recruiter --> UC11
Recruiter --> UC13
Recruiter --> UC14
Recruiter --> UC15
Recruiter --> UC18
Recruiter --> UC19
Recruiter --> UC20
Recruiter --> UC21
Recruiter --> UC23
Recruiter --> UC24
Recruiter --> UC25
Recruiter --> UC27
Recruiter --> UC31
Recruiter --> UC32

Interviewer --> UC2
Interviewer --> UC3
Interviewer --> UC4
Interviewer --> UC5
Interviewer --> UC21
Interviewer --> UC22

Admin --> UC2
Admin --> UC3
Admin --> UC4
Admin --> UC5
Admin --> UC6
Admin --> UC7
Admin --> UC8
Admin --> UC9
Admin --> UC10
Admin --> UC11
Admin --> UC13
Admin --> UC14
Admin --> UC15
Admin --> UC18
Admin --> UC19
Admin --> UC20
Admin --> UC21
Admin --> UC23
Admin --> UC24
Admin --> UC25
Admin --> UC27
Admin --> UC28
Admin --> UC29
Admin --> UC30
Admin --> UC31
Admin --> UC32

System --> UC16
System --> UC17
System --> UC25

UC12 ..> UC16 : triggers
UC16 ..> UC17 : triggers
UC22 ..> UC23 : triggers
UC24 ..> UC25 : includes
UC24 ..> UC27 : triggers

@enduml
```

---

## 2. USE CASE DIAGRAM - CHI TIẾT THEO ACTOR

### 2.1. Candidate Use Cases

```plantuml
@startuml
left to right direction

actor Candidate

rectangle "Job Search" {
  usecase "Browse Jobs" as UC1
  usecase "Search by Keywords" as UC2
  usecase "Filter by Location" as UC3
  usecase "Filter by Category" as UC4
  usecase "Filter by Salary" as UC5
  usecase "Save Job" as UC6
  usecase "View Saved Jobs" as UC7
}

rectangle "Application" {
  usecase "Apply for Job" as UC8
  usecase "Upload CV" as UC9
  usecase "Write Cover Letter" as UC10
  usecase "View Application Status" as UC11
}

rectangle "Interview" {
  usecase "View Interview Schedule" as UC12
  usecase "View Interview Result" as UC13
}

rectangle "Profile" {
  usecase "View Profile" as UC14
  usecase "Update Profile" as UC15
  usecase "Change Password" as UC16
}

rectangle "Notifications" {
  usecase "View Notifications" as UC17
  usecase "Mark as Read" as UC18
}

Candidate --> UC1
Candidate --> UC2
Candidate --> UC3
Candidate --> UC4
Candidate --> UC5
Candidate --> UC6
Candidate --> UC7
Candidate --> UC8
Candidate --> UC9
Candidate --> UC10
Candidate --> UC11
Candidate --> UC12
Candidate --> UC13
Candidate --> UC14
Candidate --> UC15
Candidate --> UC16
Candidate --> UC17
Candidate --> UC18

UC8 ..> UC9 : includes
UC8 ..> UC10 : includes

@enduml
```

### 2.2. Recruiter Use Cases

```plantuml
@startuml
left to right direction

actor Recruiter

rectangle "Job Management" {
  usecase "Create Job Posting" as UC1
  usecase "Edit Job Posting" as UC2
  usecase "Publish Job" as UC3
  usecase "Close Job" as UC4
  usecase "View Job Statistics" as UC5
}

rectangle "Application Management" {
  usecase "View Applications" as UC6
  usecase "Filter Applications" as UC7
  usecase "View CV" as UC8
  usecase "View AI Score" as UC9
  usecase "Update Application Status" as UC10
  usecase "Add Screener Notes" as UC11
}

rectangle "Interview Management" {
  usecase "Schedule Interview" as UC12
  usecase "Create Interview Panel" as UC13
  usecase "Add Panel Members" as UC14
  usecase "View Interview Schedule" as UC15
  usecase "Send Interview Invitation" as UC16
  usecase "Send Interview Result Email" as UC17
}

rectangle "Recruitment Result" {
  usecase "Create Recruitment Result" as UC18
  usecase "Generate Offer Letter" as UC19
  usecase "Send Result Email" as UC20
}

rectangle "Dashboard" {
  usecase "View Dashboard" as UC21
  usecase "View Statistics" as UC22
  usecase "View Reports" as UC23
}

Recruiter --> UC1
Recruiter --> UC2
Recruiter --> UC3
Recruiter --> UC4
Recruiter --> UC5
Recruiter --> UC6
Recruiter --> UC7
Recruiter --> UC8
Recruiter --> UC9
Recruiter --> UC10
Recruiter --> UC11
Recruiter --> UC12
Recruiter --> UC13
Recruiter --> UC14
Recruiter --> UC15
Recruiter --> UC16
Recruiter --> UC17
Recruiter --> UC18
Recruiter --> UC19
Recruiter --> UC20
Recruiter --> UC21
Recruiter --> UC22
Recruiter --> UC23

UC12 ..> UC16 : includes
UC13 ..> UC14 : includes
UC18 ..> UC19 : includes
UC18 ..> UC20 : triggers

@enduml
```

### 2.3. Interviewer Use Cases

```plantuml
@startuml
left to right direction

actor Interviewer

rectangle "Interview" {
  usecase "View Assigned Interviews" as UC1
  usecase "View Interview Details" as UC2
  usecase "View Candidate CV" as UC3
  usecase "Submit Interview Score" as UC4
  usecase "Submit Interview Feedback" as UC5
}

rectangle "Panel Management" {
  usecase "View Panel Members" as UC6
  usecase "View Panel Scores" as UC7
  usecase "View Average Score" as UC8
}

rectangle "Profile" {
  usecase "View Profile" as UC9
  usecase "Update Profile" as UC10
}

Interviewer --> UC1
Interviewer --> UC2
Interviewer --> UC3
Interviewer --> UC4
Interviewer --> UC5
Interviewer --> UC6
Interviewer --> UC7
Interviewer --> UC8
Interviewer --> UC9
Interviewer --> UC10

UC4 ..> UC5 : includes

@enduml
```

### 2.4. Admin Use Cases

```plantuml
@startuml
left to right direction

actor Admin

rectangle "User Management" {
  usecase "Manage Companies" as UC1
  usecase "Manage Interviewers" as UC2
  usecase "View All Users" as UC3
  usecase "Disable User" as UC4
}

rectangle "Job Management" {
  usecase "View All Jobs" as UC5
  usecase "Manage Job Postings" as UC6
  usecase "View Job Statistics" as UC7
}

rectangle "System Management" {
  usecase "View Dashboard" as UC8
  usecase "View Reports" as UC9
  usecase "View Statistics" as UC10
  usecase "Export Data" as UC11
}

Admin --> UC1
Admin --> UC2
Admin --> UC3
Admin --> UC4
Admin --> UC5
Admin --> UC6
Admin --> UC7
Admin --> UC8
Admin --> UC9
Admin --> UC10
Admin --> UC11

@enduml
```

---

## 3. ACTIVITY DIAGRAM - ĐĂNG KÝ & ĐĂNG NHẬP

### 3.1. Đăng ký (Register)

```plantuml
@startuml
start
:User điền form đăng ký;
:Frontend validate input;
if (Input hợp lệ?) then (no)
  :Hiển thị lỗi;
  stop
else (yes)
endif

:Frontend gửi POST /api/users/register/;
:Backend validate:
  - Email chưa tồn tại
  - Password đủ mạnh
  - Username chưa tồn tại;

if (Validation passed?) then (no)
  :Return error;
  stop
else (yes)
endif

:Backend tạo User;
:Backend set is_email_verified = True;
:Backend hash password;
:Backend lưu vào Database;
:Backend tạo JWT tokens;
:Backend return tokens + user info;
:Frontend lưu tokens vào localStorage;
:Frontend redirect đến trang chủ;
stop
@enduml
```

### 3.2. Đăng nhập (Login)

```plantuml
@startuml
start
:User nhập email & password;
:Frontend gửi POST /api/users/login/;
:Backend tìm user theo email;
if (User tồn tại?) then (no)
  :Return error: "Email không tồn tại";
  stop
else (yes)
endif

:Backend verify password;
if (Password đúng?) then (no)
  :Return error: "Mật khẩu sai";
  stop
else (yes)
endif

:Backend set is_email_verified = True;
:Backend tạo JWT tokens;
:Backend return tokens + user info;
:Frontend lưu tokens vào localStorage;
if (Role = CANDIDATE?) then (yes)
  :Redirect đến /careers;
else (Role = RECRUITER/ADMIN?)
  :Redirect đến /dashboard;
else (Role = INTERVIEWER?)
  :Redirect đến /interviews;
endif
stop
@enduml
```

---

## 4. ACTIVITY DIAGRAM - ỨNG VIÊN GỬI CV

```plantuml
@startuml
start
:Candidate xem chi tiết job;
:Candidate chọn "Nộp hồ sơ";
:Candidate điền form:
  - Upload CV (PDF/DOCX)
  - Viết thư xin việc (optional);
:Frontend validate:
  - File type: PDF/DOCX
  - File size <= 10MB;

if (File hợp lệ?) then (no)
  :Hiển thị lỗi;
  stop
else (yes)
endif

:Frontend gửi POST /api/jobs/{id}/apply/;
:Backend validate:
  - Job status = OPEN
  - Deadline chưa qua
  - Chưa nộp hồ sơ cho job này;

if (Validation passed?) then (no)
  :Return error;
  stop
else (yes)
endif

:Backend tạo Application (status=PENDING);
:Backend lưu CV file;
:Backend tạo Notification cho Recruiter;
:Backend trigger Celery tasks;
:Return 201 Created;

fork
  :Celery: parse_cv_task;
  :Đọc CV file;
  :Extract text (PDF/DOCX);
  :Lưu extracted_text vào ai_analysis;
end fork

fork
  :Celery: screen_cv_task;
  :Gọi Gemini API với:
    - Job requirements
    - CV text;
  :Nhận kết quả: {score, strengths, weaknesses};
  :Cập nhật ai_score, ai_analysis;
  :Cập nhật status = SCREENING;
  :Tạo notification cho Recruiter;
end fork

:Recruiter xem Dashboard;
:Recruiter thấy application với AI score;
stop
@enduml
```

---

## 5. ACTIVITY DIAGRAM - LUỒNG HOẠT ĐỘNG NHÀ TUYỂN DỤNG

```plantuml
@startuml
start
:Recruiter đăng nhập;
:Recruiter xem Dashboard;
:Recruiter xem danh sách Applications;

if (Có application mới?) then (yes)
  :Recruiter xem CV;
  :Recruiter xem AI Score;
  :Recruiter quyết định;

  if (Phù hợp?) then (yes)
    :Recruiter mời phỏng vấn;
    :Cập nhật status = INTERVIEW;
    :Tạo Notification cho Candidate;

    fork
      :Lên lịch phỏng vấn;
      :Tạo Interview;
      :Chọn panel members (INTERVIEWER);
      :Gửi email mời phỏng vấn;
      :Tạo Notification;
    end fork

    :Interview diễn ra;
    :Panel members chấm điểm;

    if (Tất cả members đã chấm?) then (yes)
      :Tính điểm trung bình (có trọng số);
      if (Điểm >= 70?) then (yes)
        :Tự động set result = PASS;
        :Tự động tạo OFFER;
        :Gửi email kết quả;
        :Tạo Notification;
      else (no)
        :Tự động set result = FAIL;
        :Gửi email kết quả;
        :Tạo Notification;
      endif
    else (no)
      :Chờ các members chấm điểm;
    endif

  else (no)
    :Recruiter từ chối;
    :Cập nhật status = REJECTED;
    :Tạo Notification;
  endif
else (no)
  :Không có action;
endif

:Recruiter tạo kết quả tuyển dụng;
:Recruiter generate Offer PDF;
:Recruiter gửi email kết quả;
stop
@enduml
```

---

## 6. ACTIVITY DIAGRAM - LUỒNG HOẠT ĐỘNG ADMIN

```plantuml
@startuml
start
:Admin đăng nhập;
:Admin xem Dashboard;

fork
  :Quản lý Companies;
  :Xem danh sách RECRUITER;
  :Xem thông tin công ty;
  :Disable/Enable company;
end fork

fork
  :Quản lý Interviewers;
  :Tạo Interviewer mới;
  :Chỉnh sửa Interviewer;
  :Xóa Interviewer;
end fork

fork
  :Quản lý Job Postings;
  :Xem tất cả jobs;
  :Edit/Delete jobs;
end fork

fork
  :Xem Reports;
  :Xem Statistics;
  :Export data;
end fork

stop
@enduml
```

---

## 7. SEQUENCE DIAGRAM - ĐĂNG KÝ & ĐĂNG NHẬP

### 7.1. Đăng ký

```plantuml
@startuml
actor User
participant Frontend
participant "Backend API" as API
database Database

User -> Frontend: Fill registration form
Frontend -> Frontend: Validate input
User -> Frontend: Submit form
Frontend -> API: POST /api/users/register/
API -> Database: Check email exists
Database --> API: Email not found
API -> Database: Check username exists
Database --> API: Username not found
API -> API: Hash password
API -> API: Set is_email_verified = True
API -> Database: INSERT user
Database --> API: User created
API -> API: Generate JWT tokens
API --> Frontend: 201 Created + tokens + user
Frontend -> Frontend: Save tokens to localStorage
Frontend -> Frontend: Redirect to home
Frontend --> User: Show success message
@enduml
```

### 7.2. Đăng nhập

```plantuml
@startuml
actor User
participant Frontend
participant "Backend API" as API
database Database

User -> Frontend: Enter email & password
User -> Frontend: Click Login
Frontend -> API: POST /api/users/login/
API -> Database: SELECT user WHERE email
Database --> API: User found
API -> API: Verify password
alt Password correct
  API -> API: Set is_email_verified = True
  API -> API: Generate JWT tokens
  API --> Frontend: 200 OK + tokens + user
  Frontend -> Frontend: Save tokens to localStorage
  alt Role = CANDIDATE
    Frontend -> Frontend: Redirect to /careers
  else Role = RECRUITER/ADMIN
    Frontend -> Frontend: Redirect to /dashboard
  else Role = INTERVIEWER
    Frontend -> Frontend: Redirect to /interviews
  end
  Frontend --> User: Show dashboard
else Password incorrect
  API --> Frontend: 401 Unauthorized
  Frontend --> User: Show error message
end
@enduml
```

---

## 8. SEQUENCE DIAGRAM - ỨNG VIÊN GỬI CV

```plantuml
@startuml
actor Candidate
participant Frontend
participant "Backend API" as API
database Database
participant "Celery Worker" as Worker
participant "Gemini API" as Gemini

Candidate -> Frontend: Fill form & Upload CV
Frontend -> Frontend: Validate file (PDF/DOCX, max 10MB)
Candidate -> Frontend: Submit application
Frontend -> API: POST /api/jobs/{id}/apply/
API -> Database: Check job status = OPEN
API -> Database: Check deadline not passed
API -> Database: Check unique (job_id, candidate_id)
API -> Database: INSERT application (status=PENDING)
API -> Database: CREATE notification
API --> Frontend: 201 Created
API -> Worker: trigger parse_cv_task
API -> Worker: trigger screen_cv_task

Worker -> Database: SELECT application
Worker -> Database: Read CV file
Worker -> Worker: Parse PDF/DOCX
Worker -> Database: UPDATE ai_analysis['extracted_text']

Worker -> Gemini: POST /v1/models/gemini-1.5-pro
Gemini --> Worker: {score, strengths, weaknesses}
Worker -> Database: UPDATE ai_score, ai_analysis, status=SCREENING
Worker -> Database: CREATE notification

actor Recruiter
Recruiter -> Frontend: View Dashboard
Frontend -> API: GET /api/applications/
API -> Database: SELECT applications
Database --> API: Applications with AI scores
API --> Frontend: Response
Frontend --> Recruiter: Display applications
@enduml
```

---

## 9. SEQUENCE DIAGRAM - PHỎNG VẤN VỚI HỘI ĐỒNG

```plantuml
@startuml
actor Recruiter
participant Frontend
participant "Backend API" as API
database Database

Recruiter -> Frontend: Chọn application để mời phỏng vấn
Frontend -> API: POST /api/applications/{id}/invite_interview/
API -> Database: UPDATE application status = INTERVIEW
API -> Database: CREATE notification
API --> Frontend: Success

Recruiter -> Frontend: Lên lịch phỏng vấn
Frontend -> API: POST /api/interviews/
API -> Database: INSERT interview
API -> Database: CREATE notification
API --> Frontend: Interview created

Recruiter -> Frontend: Tạo hội đồng phỏng vấn
Frontend -> API: POST /api/interview-panels/
loop For each panel member
  API -> Database: INSERT interview_panel
end
API --> Frontend: Panel created

Recruiter -> Frontend: Gửi email mời phỏng vấn
Frontend -> API: POST /api/interviews/{id}/send_email/
API -> API: Send email to candidate
API -> Database: CREATE notification
API --> Frontend: Email sent

actor Interviewer1
actor Interviewer2

Interviewer1 -> Frontend: Xem interview được assign
Frontend -> API: GET /api/interviews/
API -> Database: SELECT interviews WHERE panels.interviewer = user
API --> Frontend: Interviews list
Frontend --> Interviewer1: Show interviews

Interviewer1 -> Frontend: Chấm điểm
Frontend -> API: PATCH /api/interview-panels/{id}/
API -> Database: UPDATE panel (score, feedback)

alt All panel members scored
  API -> API: Calculate weighted average
  API -> API: If avg >= 70: result = PASS, else result = FAIL
  API -> Database: UPDATE interview (result, status = COMPLETED)
  alt Result = PASS
    API -> Database: CREATE recruitment_result (OFFER)
    API -> Database: UPDATE application status = OFFER
    API -> API: Send email offer notification
    API -> Database: CREATE notification
  else Result = FAIL
    API -> Database: UPDATE application status = REJECTED
    API -> API: Send email rejection notification
    API -> Database: CREATE notification
  end
end

API --> Frontend: Score saved
Frontend --> Interviewer1: Show success

Recruiter -> Frontend: Gửi email kết quả phỏng vấn
Frontend -> API: POST /api/interviews/{id}/send_result_email/
API -> API: Send result email (PASS/FAIL)
API -> Database: CREATE notification
API --> Frontend: Email sent
@enduml
```

---

## 10. SEQUENCE DIAGRAM - GỬI EMAIL KẾT QUẢ PHỎNG VẤN

```plantuml
@startuml
actor Recruiter
participant Frontend
participant "Backend API" as API
database Database
cloud "Email Service" as Email

Recruiter -> Frontend: Chọn interview có kết quả
Recruiter -> Frontend: Click "Gửi email & thông báo kết quả"
Frontend -> Frontend: Confirm action
Frontend -> API: POST /api/interviews/{id}/send_result_email/

API -> Database: SELECT interview
Database --> API: Interview with result (PASS/FAIL)

alt Interview result = PASS
  API -> API: Load template: interview_result_pass.html
  API -> API: Prepare context (candidate, job, feedback)
  API -> Email: Send email (subject: "Chúc mừng! Bạn đã vượt qua...")
  Email --> API: Email sent
  API -> Database: CREATE notification (title: "Chúc mừng! Bạn đã vượt qua...")
else Interview result = FAIL
  API -> API: Load template: interview_result_fail.html
  API -> API: Prepare context (candidate, job, feedback)
  API -> Email: Send email (subject: "Kết quả phỏng vấn...")
  Email --> API: Email sent
  API -> Database: CREATE notification (title: "Kết quả phỏng vấn...")
end

API --> Frontend: 200 OK + message
Frontend --> Recruiter: Show success message

actor Candidate
Candidate -> Frontend: Check email
Candidate -> Frontend: View notifications
Frontend -> API: GET /api/notifications/
API -> Database: SELECT notifications WHERE user = candidate
Database --> API: Notifications list
API --> Frontend: Notifications
Frontend --> Candidate: Show notification
@enduml
```

---

## 11. COMPONENT DIAGRAM - PHÂN RÃ CHỨC NĂNG

```plantuml
@startuml
package "Frontend (React)" {
  [React App] as Frontend
  [Candidate UI]
  [Recruiter UI]
  [Interviewer UI]
  [Admin UI]
  [Auth Service]
  [API Service]
}

package "Backend (Django REST)" {
  [Django REST API] as API
  [User Service]
  [Job Service]
  [Application Service]
  [Interview Service]
  [Interview Panel Service]
  [Result Service]
  [Notification Service]
  [Email Service]
}

package "Background Jobs (Celery)" {
  [Celery Worker] as Worker
  [CV Parser]
  [AI Screening]
  [Email Sender]
}

database "PostgreSQL" as DB

cloud "External Services" {
  [Gemini API] as Gemini
  [SMTP Server] as SMTP
}

Frontend --> API : HTTP/REST
API --> DB : ORM
API --> Worker : Task Queue
Worker --> DB : ORM
Worker --> Gemini : HTTP API
Email Service --> SMTP : SMTP
Worker --> Email Service : Send emails

@enduml
```

---

## 12. DEPLOYMENT DIAGRAM - KIẾN TRÚC TỔNG QUAN

```plantuml
@startuml
node "Client Browser" {
  [React Frontend] as Frontend
}

node "Web Server" {
  [Django Backend] as Backend
  [Nginx] as Nginx
}

node "Database Server" {
  database PostgreSQL
}

node "Cache & Queue" {
  [Redis] as Redis
}

node "Worker Server" {
  [Celery Workers] as Workers
}

node "File Storage" {
  [Media Files] as Storage
}

cloud "External APIs" {
  [Gemini API] as Gemini
  [SMTP Server] as SMTP
}

Frontend --> Nginx : HTTPS
Nginx --> Backend : HTTP
Backend --> PostgreSQL : SQL
Backend --> Redis : Queue
Workers --> Redis : Queue
Workers --> PostgreSQL : SQL
Workers --> Gemini : HTTPS
Backend --> Storage : File I/O
Workers --> Storage : File I/O
Backend --> SMTP : SMTP
Workers --> SMTP : SMTP

@enduml
```

---

## 13. CLASS DIAGRAM

```plantuml
@startuml
class User {
  +UUID id
  +String email
  +String username
  +String password_hash
  +String role
  +String first_name
  +String last_name
  +String phone
  +String company_name
  +Boolean is_email_verified
  +Boolean is_active
  +DateTime created_at
  +DateTime updated_at
}

class Job {
  +UUID id
  +String title
  +String description
  +String requirements
  +String salary
  +String location
  +String employment_type
  +String status
  +DateTime deadline
  +DateTime created_at
  +DateTime updated_at
  +publish()
  +close()
}

class Application {
  +UUID id
  +UUID job_id
  +UUID candidate_id
  +FileField cv_file
  +String cover_letter
  +String status
  +Float ai_score
  +JSON ai_analysis
  +String screener_notes
  +DateTime applied_at
  +DateTime updated_at
}

class Interview {
  +UUID id
  +UUID application_id
  +DateTime scheduled_at
  +Integer duration
  +String location
  +String interview_type
  +String status
  +String feedback
  +String result
  +DateTime created_at
  +DateTime updated_at
}

class InterviewPanel {
  +UUID id
  +UUID interview_id
  +UUID interviewer_id
  +String role
  +String feedback
  +Float score
  +DateTime created_at
}

class RecruitmentResult {
  +UUID id
  +UUID application_id
  +String final_decision
  +FileField offer_letter_file
  +String salary
  +Date start_date
  +String notes
  +UUID decided_by_id
  +DateTime decided_at
  +DateTime created_at
}

class Notification {
  +UUID id
  +UUID user_id
  +String notification_type
  +String title
  +String content
  +Boolean is_read
  +UUID related_id
  +DateTime sent_at
  +DateTime created_at
}

' Relationships
User "1" --> "*" Job : creates
User "1" --> "*" Application : applies
Job "1" --> "*" Application : receives
Application "1" --> "*" Interview : has
Interview "1" --> "*" InterviewPanel : contains
User "1" --> "*" InterviewPanel : participates
Application "1" --> "1" RecruitmentResult : results_in
User "1" --> "*" RecruitmentResult : decides
User "1" --> "*" Notification : receives

@enduml
```

---

## 14. STATE DIAGRAM - APPLICATION STATUS

```plantuml
@startuml
[*] --> PENDING : Apply for Job

PENDING --> SCREENING : AI Screening starts
SCREENING --> INTERVIEW : Recruiter invites
SCREENING --> REJECTED : Recruiter rejects

INTERVIEW --> OFFER : Interview passed (auto)
INTERVIEW --> REJECTED : Interview failed (auto)
INTERVIEW --> PENDING : Reschedule

OFFER --> ACCEPTED : Candidate accepts
OFFER --> REJECTED : Candidate declines

REJECTED --> [*]
ACCEPTED --> [*]

note right of PENDING
  Initial state after
  application submission
end note

note right of SCREENING
  AI analysis in progress
  or completed
end note

note right of INTERVIEW
  Interview scheduled
  or completed
end note

note right of OFFER
  Auto-created when
  interview result = PASS
end note
@enduml
```

---

## 📝 GHI CHÚ

- ✅ Tất cả sơ đồ đã **BỎ** email verification và OTP
- ✅ Authentication chỉ còn: **Register** và **Login** với username/password
- ✅ User đăng ký xong có thể đăng nhập ngay (không cần verify)
- ✅ Đã thêm chức năng **Hội đồng phỏng vấn** với chấm điểm tự động
- ✅ Đã thêm **Gửi email kết quả phỏng vấn** (PASS/FAIL)
- ✅ Đã thêm **Tự động tạo OFFER** khi interview result = PASS
- ✅ Đã thêm **Quản lý Interviewers** (Admin)
- ✅ Đã thêm **Tính điểm trung bình có trọng số** (LEAD = 1.5, MEMBER = 1.0)
- 📄 Copy code vào [PlantUML Online](http://www.plantuml.com/plantuml/uml/) để xem sơ đồ

---

## 🛠️ CÁCH SỬ DỤNG

1. Mở [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)
2. Copy code từ bất kỳ sơ đồ nào ở trên
3. Paste vào editor
4. Click "Submit" để xem sơ đồ
5. Export PNG/SVG nếu cần

---

## 📚 TÀI LIỆU THAM KHẢO

- Chi tiết đầy đủ: `TONG-HOP-MO-TA-SO-DO.md`
- Use Cases: `docs/05-use-cases-and-bfd.md`
- Architecture: `docs/06-architecture-diagrams.md`
