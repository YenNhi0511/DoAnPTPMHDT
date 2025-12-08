# Analysis Class Diagrams - Modular Approach

## Tổng quan

Đây là bộ 5 sơ đồ lớp phân tích (Analysis Class Diagrams) cho **Hệ Thống Tuyển Dụng Nhân Sự Thông Minh**, được chia theo 5 modules chức năng để dễ quản lý và hiểu.

## Cấu trúc Module

### Module 1: Authentication & User Management

**File:** `MODULE-01-AUTHENTICATION-USER.puml`

**Use Cases:** UC-01, UC-02, UC-03, UC-04, UC-24

**Entities:**

- User
- OTPVerification
- UserProfile
- JWTToken

**Controllers:**

- AuthenticationController
- ProfileController
- UserManagementController

**Chức năng chính:**

- Đăng ký và xác thực OTP
- Đăng nhập/Đăng xuất (JWT)
- Quản lý hồ sơ cá nhân
- Admin quản lý người dùng

---

### Module 2: Job Management

**File:** `MODULE-02-JOB-MANAGEMENT.puml`

**Use Cases:** UC-05, UC-06, UC-07, UC-08, UC-09

**Entities:**

- Job
- Company
- SavedJob
- JobSearchCriteria

**Controllers:**

- JobController
- JobSearchController
- SavedJobController
- CompanyController

**Chức năng chính:**

- CRUD tin tuyển dụng
- Tìm kiếm và lọc công việc
- Lưu việc làm yêu thích
- Quản lý trạng thái tin (DRAFT/OPEN/CLOSED)

---

### Module 3: Application & AI Screening

**File:** `MODULE-03-APPLICATION-AI.puml`

**Use Cases:** UC-10, UC-11, UC-12, UC-13, UC-14, UC-15, UC-16

**Entities:**

- Application
- AIAnalysis
- CVFile
- ApplicationTimeline

**Controllers:**

- ApplicationController
- AIAnalysisController
- CVFileController
- ApplicationFilterController

**External Services:**

- GeminiAPIService (Google Gemini AI)
- CeleryTaskQueue (Async processing)
- FileStorageService

**Chức năng chính:**

- Nộp hồ sơ ứng tuyển (upload CV)
- Tự động sàng lọc CV bằng AI
- Xem danh sách và chi tiết hồ sơ
- Rút hồ sơ ứng tuyển
- Xem kết quả phân tích AI

---

### Module 4: Interview Management

**File:** `MODULE-04-INTERVIEW-MANAGEMENT.puml`

**Use Cases:** UC-17, UC-18, UC-19, UC-20

**Entities:**

- Interview
- InterviewPanel
- Interviewer
- InterviewFeedback
- InterviewSchedule

**Controllers:**

- InterviewController
- InterviewEvaluationController
- InterviewScheduleController
- InterviewerController

**External Services:**

- EmailInvitationService
- CalendarIntegrationService
- VideoConferenceService

**Chức năng chính:**

- Tạo và mời phỏng vấn
- Quản lý lịch phỏng vấn (Calendar view)
- Gán Interviewer vào panel
- Đánh giá phỏng vấn (scores, feedback)
- Gửi email kết quả PV

---

### Module 5: Recruitment Decision & Analytics

**File:** `MODULE-05-DECISION-ANALYTICS.puml`

**Use Cases:** UC-21, UC-22, UC-23, UC-25

**Entities:**

- RecruitmentResult
- Notification
- Report
- Analytics
- DashboardStatistics

**Controllers:**

- ResultController
- NotificationController
- AnalyticsController
- ReportController

**External Services:**

- EmailService
- ExcelExportService
- PDFExportService
- RealtimeNotificationService (WebSocket)

**Chức năng chính:**

- Tạo quyết định OFFER/REJECT
- Hệ thống thông báo đa kênh (in-app + email + realtime)
- Dashboard thống kê (charts, metrics)
- Xuất báo cáo (Excel, PDF)
- Lịch sử quyết định tuyển dụng

---

## Inter-Module Dependencies

```
Module 1 (User)
    ↓
Module 2 (Job) ← → Module 3 (Application & AI)
    ↓                        ↓
                  Module 4 (Interview)
                             ↓
                  Module 5 (Decision & Analytics)
```

**Relationships:**

- Module 1 là foundation cho tất cả modules (User entity)
- Module 2 và Module 3 có quan hệ song song (Job ← Application)
- Module 3 → Module 4: Application chuyển sang Interview khi qua vòng AI
- Module 4 → Module 5: Interview xong → Quyết định tuyển dụng
- Module 5 phụ thuộc tất cả modules để thống kê và báo cáo

---

## Pattern sử dụng: ECB (Entity-Control-Boundary)

### Entity (màu xanh nhạt)

- Domain objects chứa data và business rules
- VD: User, Job, Application, Interview, RecruitmentResult

### Control (màu vàng)

- Business logic và use case controllers
- VD: AuthenticationController, JobController, AIAnalysisController

### Boundary (màu tím nhạt)

- UI forms, Views, External services
- VD: RegisterForm, EmailService, GeminiAPIService, DashboardView

---

## Cách sử dụng

### 1. Xem trong PlantUML Editor

- Cài extension PlantUML cho VS Code
- Mở file `.puml` và xem preview (Alt+D)

### 2. Export sang hình ảnh

```bash
# Export tất cả modules
plantuml docs/MODULE-*.puml

# Export từng module
plantuml docs/MODULE-01-AUTHENTICATION-USER.puml
```

### 3. Tích hợp vào báo cáo

Embed vào LaTeX:

```latex
\begin{figure}[h]
\centering
\includegraphics[width=\textwidth]{MODULE-01-AUTHENTICATION-USER.png}
\caption{Module 1: Authentication \& User Management}
\end{figure}
```

Embed vào Markdown:

```markdown
![Module 1: Authentication & User Management](MODULE-01-AUTHENTICATION-USER.png)
```

---

## Lợi ích của cách chia module

✅ **High Cohesion**: Mỗi module tập trung 1 chức năng rõ ràng

✅ **Low Coupling**: Giảm dependencies giữa các modules

✅ **Easy to Understand**: Mỗi diagram dễ đọc, không quá phức tạp

✅ **Scalability**: Dễ mở rộng từng module độc lập

✅ **Team Collaboration**: Mỗi team có thể phát triển 1 module riêng

✅ **Clear Testing Scope**: Test từng module một cách độc lập

---

## Thống kê

| Module                   | Use Cases | Entities | Controllers | External Services |
| ------------------------ | --------- | -------- | ----------- | ----------------- |
| 1. Authentication & User | 5         | 4        | 3           | 1                 |
| 2. Job Management        | 5         | 4        | 4           | 1                 |
| 3. Application & AI      | 7         | 4        | 4           | 3                 |
| 4. Interview Management  | 4         | 5        | 4           | 3                 |
| 5. Decision & Analytics  | 4         | 5        | 4           | 4                 |
| **TỔNG**                 | **25**    | **22**   | **19**      | **12**            |

---

## Ghi chú

- **Cấp độ:** Analysis level (Domain Model), không phải Design level
- **Mục đích:** Hiểu nghiệp vụ, xác định entities và quan hệ
- **Không bao gồm:** Implementation details, database schema, API endpoints
- **Tool:** PlantUML (text-based, version control friendly)

---

**Tác giả:** GitHub Copilot + Claude Sonnet 4.5  
**Ngày tạo:** 8/12/2025  
**Dự án:** Đồ án tốt nghiệp - Hệ Thống Tuyển Dụng Nhân Sự Thông Minh
