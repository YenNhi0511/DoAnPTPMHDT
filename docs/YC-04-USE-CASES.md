# PHẦN 4: USE CASES CHI TIẾT

## ĐỀ TÀI: XÂY DỰNG HỆ THỐNG TUYỂN DỤNG NHÂN SỰ

---

## 4.1. Use Case Diagram Tổng Quan

```
                    HỆ THỐNG TUYỂN DỤNG NHÂN SỰ

    ┌─────────────────────────────────────────────────────────────┐
    │                                                             │
    │    Candidate                Admin               Recruiter  │
    │       👤                      👤                    👤      │
    │       │                       │                     │       │
    │       │                       │                     │       │
    │       ├──(Register)           ├──(Manage Users)    │       │
    │       ├──(Login)              ├──(View Reports)    │       │
    │       ├──(Search Jobs)        │                    │       │
    │       ├──(Submit App)         │                    │       │
    │       ├──(Track Status)       │                    ├──(Create Job)
    │       │                       │                    ├──(Screen CV)
    │       │                       │                    ├──(Schedule Interview)
    │       │                       │                    ├──(Make Decision)
    │       │                       │                    │       │
    │       │    Interviewer        │                    │       │
    │       │       👤              │                    │       │
    │       │       │               │                    │       │
    │       │       ├──(View Schedule)                   │       │
    │       │       ├──(Submit Feedback)                 │       │
    │       │       │               │                    │       │
    └───────┴───────┴───────────────┴────────────────────┴───────┘
```

---

## 4.2. Use Cases Theo Vai Trò

### 4.2.1. Candidate (Ứng viên)

| UC ID | Use Case Name               | Priority  |
| ----- | --------------------------- | --------- |
| UC-01 | Đăng ký tài khoản           | Must have |
| UC-02 | Đăng nhập hệ thống          | Must have |
| UC-03 | Tìm kiếm việc làm           | Must have |
| UC-04 | Xem chi tiết tin tuyển dụng | Must have |
| UC-05 | Nộp hồ sơ ứng tuyển         | Must have |
| UC-06 | Theo dõi trạng thái hồ sơ   | Must have |
| UC-07 | Xem lịch phỏng vấn          | Must have |
| UC-08 | Chấp nhận/Từ chối offer     | Must have |

### 4.2.2. Recruiter (Nhân viên tuyển dụng)

| UC ID | Use Case Name             | Priority    |
| ----- | ------------------------- | ----------- |
| UC-09 | Tạo tin tuyển dụng        | Must have   |
| UC-10 | Quản lý tin tuyển dụng    | Must have   |
| UC-11 | Xem danh sách ứng viên    | Must have   |
| UC-12 | Sàng lọc CV bằng AI       | Must have   |
| UC-13 | Đánh giá và chấm điểm     | Should have |
| UC-14 | Tạo lịch phỏng vấn        | Must have   |
| UC-15 | Tạo quyết định tuyển dụng | Must have   |
| UC-16 | Tạo thư mời nhận việc     | Must have   |
| UC-17 | Xem báo cáo tuyển dụng    | Should have |

### 4.2.3. Interviewer (Giám khảo phỏng vấn)

| UC ID | Use Case Name                     | Priority  |
| ----- | --------------------------------- | --------- |
| UC-18 | Xem lịch phỏng vấn được phân công | Must have |
| UC-19 | Xem hồ sơ ứng viên                | Must have |
| UC-20 | Ghi nhận kết quả phỏng vấn        | Must have |

### 4.2.4. Admin (Quản trị viên)

| UC ID | Use Case Name           | Priority    |
| ----- | ----------------------- | ----------- |
| UC-21 | Quản lý người dùng      | Must have   |
| UC-22 | Phân quyền vai trò      | Must have   |
| UC-23 | Xem dashboard tổng quan | Should have |
| UC-24 | Xuất báo cáo tổng hợp   | Should have |

---

## 4.3. Use Cases Chi Tiết

### UC-01: Đăng Ký Tài Khoản

**Actor**: Candidate (Ứng viên)

**Mô tả**: Ứng viên tạo tài khoản mới để sử dụng hệ thống

**Preconditions**:

- Ứng viên chưa có tài khoản trong hệ thống
- Email chưa được đăng ký

**Postconditions**:

- Tài khoản mới được tạo với trạng thái `is_verified=False`
- Email xác thực được gửi đến địa chỉ email đã đăng ký

**Main Flow**:

1. Ứng viên truy cập trang đăng ký
2. Hệ thống hiển thị form đăng ký
3. Ứng viên nhập thông tin:
   - Email
   - Mật khẩu
   - Xác nhận mật khẩu
   - Họ tên đầy đủ
   - Số điện thoại
4. Ứng viên tick checkbox "Đồng ý xử lý dữ liệu cá nhân"
5. Ứng viên click "Đăng ký"
6. Hệ thống validate thông tin:
   - Email hợp lệ và chưa tồn tại
   - Mật khẩu >= 8 ký tự, có chữ hoa + số + ký tự đặc biệt
   - Mật khẩu khớp với xác nhận
   - Số điện thoại đúng định dạng
7. Hệ thống hash mật khẩu
8. Hệ thống tạo tài khoản với role="candidate"
9. Hệ thống tạo verification token
10. Hệ thống gửi email xác thực
11. Hệ thống hiển thị thông báo: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản"
12. Use case kết thúc

**Alternative Flows**:

**A1: Email đã tồn tại** (tại bước 6)

- 6a. Hệ thống kiểm tra và phát hiện email đã được đăng ký
- 6b. Hệ thống hiển thị lỗi: "Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập"
- 6c. Quay lại bước 3

**A2: Mật khẩu không đủ mạnh** (tại bước 6)

- 6a. Hệ thống kiểm tra và phát hiện mật khẩu không đáp ứng yêu cầu
- 6b. Hệ thống hiển thị lỗi: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
- 6c. Quay lại bước 3

**A3: Gửi email thất bại** (tại bước 10)

- 10a. Hệ thống không thể gửi email (SMTP error)
- 10b. Hệ thống log lỗi
- 10c. Hệ thống hiển thị: "Đã có lỗi xảy ra. Vui lòng thử lại sau"
- 10d. Hệ thống xóa tài khoản vừa tạo
- 10e. Use case kết thúc

**Exception Flows**:

- **E1**: Server error → Hiển thị "Lỗi hệ thống, vui lòng thử lại"
- **E2**: Network timeout → Hiển thị "Kết nối bị gián đoạn"

**Business Rules**:

- BR-01: Một email chỉ có thể đăng ký một tài khoản
- BR-02: Verification token hết hạn sau 24 giờ
- BR-03: Tài khoản chưa verify không thể đăng nhập

**UI Mockup**:

```
┌──────────────────────────────────────┐
│  📝 ĐĂNG KÝ TÀI KHOẢN                │
├──────────────────────────────────────┤
│  Email: [________________]           │
│  Mật khẩu: [________________]        │
│  Xác nhận mật khẩu: [________]       │
│  Họ tên: [___________________]       │
│  Số điện thoại: [____________]       │
│                                      │
│  ☑ Tôi đồng ý với điều khoản        │
│     xử lý dữ liệu cá nhân            │
│                                      │
│  [     ĐĂNG KÝ     ]                 │
│                                      │
│  Đã có tài khoản? Đăng nhập          │
└──────────────────────────────────────┘
```

---

### UC-05: Nộp Hồ Sơ Ứng Tuyển

**Actor**: Candidate (Ứng viên đã đăng nhập)

**Mô tả**: Ứng viên nộp hồ sơ cho một vị trí tuyển dụng

**Preconditions**:

- Ứng viên đã đăng nhập
- Tin tuyển dụng đang ở trạng thái OPEN
- Chưa quá application deadline
- Ứng viên chưa nộp hồ sơ cho vị trí này

**Postconditions**:

- Application được tạo với status="SUBMITTED"
- CV được upload lên cloud storage
- Email xác nhận được gửi cho ứng viên
- Background job AI screening được trigger
- Notification được tạo cho Recruiter

**Main Flow**:

1. Ứng viên tìm kiếm và chọn tin tuyển dụng quan tâm
2. Ứng viên click "Apply Now"
3. Hệ thống kiểm tra:
   - User đã đăng nhập
   - Job status = OPEN
   - Chưa quá deadline
   - Chưa apply trước đó
4. Hệ thống hiển thị form nộp hồ sơ
5. Ứng viên upload CV (PDF/DOCX)
6. Ứng viên nhập cover letter (optional)
7. Ứng viên upload tài liệu bổ sung (optional, max 3 files)
8. Ứng viên click "Submit Application"
9. Hệ thống validate:
   - CV file format (PDF hoặc DOCX)
   - CV file size < 10MB
   - Additional files size < 5MB mỗi file
10. Hệ thống upload CV lên cloud storage
11. Hệ thống tạo application record trong database
12. Hệ thống trigger Celery task: `screen_application.delay(app_id)`
13. Hệ thống gửi email xác nhận cho ứng viên
14. Hệ thống tạo notification cho Recruiter
15. Hệ thống hiển thị trang success với application tracking link
16. Use case kết thúc

**Alternative Flows**:

**A1: Ứng viên chưa đăng nhập** (tại bước 3)

- 3a. Hệ thống phát hiện user chưa đăng nhập
- 3b. Hệ thống redirect đến trang login với return URL
- 3c. Sau khi login thành công, quay lại bước 3

**A2: Đã nộp hồ sơ trước đó** (tại bước 3)

- 3a. Hệ thống phát hiện ứng viên đã apply cho job này
- 3b. Hệ thống hiển thị: "Bạn đã nộp hồ sơ cho vị trí này vào ngày DD/MM/YYYY"
- 3c. Hiển thị link "Xem trạng thái hồ sơ"
- 3d. Use case kết thúc

**A3: Job đã đóng** (tại bước 3)

- 3a. Hệ thống phát hiện job status != OPEN hoặc quá deadline
- 3b. Hệ thống hiển thị: "Tin tuyển dụng này đã đóng hoặc hết hạn nhận hồ sơ"
- 3c. Use case kết thúc

**A4: File không hợp lệ** (tại bước 9)

- 9a. Hệ thống kiểm tra và phát hiện file không đúng định dạng hoặc quá lớn
- 9b. Hệ thống hiển thị lỗi cụ thể:
  - "CV phải là file PDF hoặc DOCX"
  - "File CV không được vượt quá 10MB"
- 9c. Quay lại bước 5

**A5: Upload file thất bại** (tại bước 10)

- 10a. Cloud storage service trả về lỗi
- 10b. Hệ thống retry 2 lần
- 10c. Nếu vẫn thất bại:
  - Hiển thị: "Không thể upload file. Vui lòng thử lại"
  - Log error với chi tiết
- 10d. Quay lại bước 5

**Exception Flows**:

- **E1**: Database error khi tạo application → Rollback, xóa uploaded files, hiển thị lỗi
- **E2**: Email service down → Application vẫn được tạo, nhưng log warning về email failure

**Business Rules**:

- BR-01: Một candidate chỉ nộp được 1 hồ sơ cho 1 job
- BR-02: CV bắt buộc, cover letter optional
- BR-03: Application tự động được screen bởi AI trong vòng 30 giây
- BR-04: Candidate nhận email xác nhận trong vòng 10 giây

**Sequence Diagram**:

```
Candidate    Frontend    Backend    Storage    Celery    Email
   │            │           │          │         │         │
   ├─Click Apply───>│       │          │         │         │
   │            ├─POST /applications──>│         │         │
   │            │           ├─Validate │         │         │
   │            │           ├─Upload CV────>│    │         │
   │            │           │<─URL───────────┘    │         │
   │            │           ├─Create App    │     │         │
   │            │           ├─Trigger AI────────>│         │
   │            │           ├─Send Email──────────────────>│
   │            │<─Success──┤          │         │         │
   │<─Show Success Page─────┘          │         │         │
   │            │           │          │    ┌────┴─────┐   │
   │            │           │          │    │AI Screen │   │
   │            │           │          │    │(async)   │   │
   │            │           │          │    └──────────┘   │
```

**Performance Requirements**:

- Upload CV < 5 seconds (file 5MB)
- Create application < 1 second
- Email sent < 10 seconds

---

### UC-12: Sàng Lọc CV Bằng AI

**Actor**: Recruiter (hoặc System auto-trigger)

**Mô tả**: Sử dụng AI (Google Gemini) để phân tích và đánh giá CV tự động

**Preconditions**:

- Application đã được tạo và có CV URL
- Job requirements đã được định nghĩa
- Gemini API key hợp lệ

**Postconditions**:

- CV được parse thành structured data
- AI screening result được lưu (scores, recommendation)
- Application status → SCREENING_COMPLETED
- Notification được tạo cho Recruiter

**Main Flow**:

1. Recruiter chọn một hoặc nhiều applications
2. Recruiter click "Screen with AI"
3. Hệ thống hiển thị loading indicator
4. Backend tạo Celery task `screen_application`
5. Task download CV từ cloud storage
6. Task convert PDF/DOCX to text
7. Task gọi Gemini API với prompt parse CV:
   ```
   Extract: name, email, phone, education, experience, skills, certifications
   ```
8. Gemini trả về parsed CV data (JSON)
9. Task lưu parsed data vào database
10. Task gọi Gemini API lần 2 với prompt screening:
    ```
    Evaluate candidate against job requirements:
    - Skills match score (0-100)
    - Experience match score (0-100)
    - Education match score (0-100)
    - Overall recommendation (STRONG_YES/YES/MAYBE/NO/STRONG_NO)
    ```
11. Gemini trả về screening result
12. Task tính overall score: `(skills*0.5 + exp*0.3 + edu*0.2)`
13. Task lưu screening result vào database
14. Task update application status → SCREENING_COMPLETED
15. Task tạo notification cho Recruiter
16. Frontend poll hoặc receive WebSocket update
17. Hệ thống hiển thị kết quả screening
18. Use case kết thúc

**Alternative Flows**:

**A1: Gemini API rate limit** (tại bước 7 hoặc 10)

- 7a. Gemini API trả về 429 Too Many Requests
- 7b. Task retry với exponential backoff (4s, 8s, 16s)
- 7c. Nếu thành công → Tiếp tục flow
- 7d. Nếu thất bại sau 3 lần:
  - Update application status → SCREENING_FAILED
  - Log error: "Gemini API rate limit exceeded"
  - Notify admin
- 7e. Use case kết thúc

**A2: CV không parse được** (tại bước 8)

- 8a. Gemini không thể extract đủ thông tin từ CV
- 8b. Task lưu partial data
- 8c. Task đánh dấu screening_confidence = "LOW"
- 8d. Notify Recruiter: "CV cần review thủ công"
- 8e. Tiếp tục bước 10 (screening vẫn chạy với data có sẵn)

**A3: CV file bị corrupt** (tại bước 6)

- 6a. Không thể convert file to text
- 6b. Task retry download file 2 lần
- 6c. Nếu vẫn lỗi:
  - Update status → SCREENING_FAILED
  - Reason: "CV file corrupted or inaccessible"
  - Notify Recruiter
- 6d. Use case kết thúc

**Exception Flows**:

- **E1**: Gemini API completely down → Queue task for retry later (max 24h)
- **E2**: Task timeout (>60s) → Terminate task, mark as failed, allow manual retry
- **E3**: Database connection lost → Task retry với exponential backoff

**Business Rules**:

- BR-01: AI screening phải complete trong vòng 30 giây (p95)
- BR-02: Nếu AI confidence < 70%, cần manual review
- BR-03: Overall score = (Skills*50% + Experience*30% + Education\*20%)
- BR-04: Recommendation thresholds:
  - > = 80: STRONG_YES
  - 70-79: YES
  - 50-69: MAYBE
  - 30-49: NO
  - < 30: STRONG_NO

**Activity Diagram**:

```
    [Start]
       │
       ▼
  ┌─────────────┐
  │Download CV  │
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │Convert to   │
  │Text         │
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐     Success
  │Parse CV     ├─────────────┐
  │(Gemini API) │             │
  └──────┬──────┘             │
         │ Fail               │
         ▼                    ▼
  ┌─────────────┐      ┌─────────────┐
  │Retry (3x)   │      │Save Parsed  │
  └──────┬──────┘      │Data         │
         │             └──────┬──────┘
         │ Still Fail         │
         │                    ▼
         │             ┌─────────────┐
         │             │AI Screening │
         │             │(Gemini API) │
         │             └──────┬──────┘
         │                    │
         │                    ▼
         │             ┌─────────────┐
         │             │Calculate    │
         │             │Score        │
         │             └──────┬──────┘
         │                    │
         ▼                    ▼
  ┌─────────────┐      ┌─────────────┐
  │Mark Failed  │      │Save Result  │
  └──────┬──────┘      └──────┬──────┘
         │                    │
         │                    ▼
         │             ┌─────────────┐
         │             │Notify       │
         │             │Recruiter    │
         │             └──────┬──────┘
         │                    │
         └────────────────────┘
                │
                ▼
             [End]
```

**Performance Metrics**:
| Metric | Target | Max |
|--------|--------|-----|
| Parse CV | 10s | 20s |
| AI Screening | 15s | 25s |
| Total time | 20s | 30s |
| Success rate | 95% | - |

---

### UC-14: Tạo Lịch Phỏng Vấn

**Actor**: Recruiter

**Mô tả**: Recruiter tạo lịch phỏng vấn cho ứng viên đã qua vòng sàng lọc

**Preconditions**:

- Application ở trạng thái SCREENING_COMPLETED hoặc cao hơn
- Có ít nhất 1 interviewer available
- Recruiter có quyền quản lý job này

**Postconditions**:

- Interview record được tạo
- InterviewPanel records được tạo cho các interviewers
- Application status → INTERVIEW_SCHEDULED
- Email thông báo được gửi cho candidate và interviewers
- Calendar events được tạo (optional)

**Main Flow**:

1. Recruiter vào trang chi tiết application
2. Recruiter click "Schedule Interview"
3. Hệ thống hiển thị form tạo lịch phỏng vấn với:
   - Interview type (dropdown): Technical/HR/Final
   - Interview mode (radio): Online/Onsite
   - Date picker
   - Time picker
   - Duration (dropdown): 30/45/60/90/120 min
   - Location/Meeting link (text)
   - Interview panel (multi-select với available interviewers)
   - Notes (textarea)
4. Recruiter chọn date
5. Hệ thống load và hiển thị available time slots dựa trên:
   - Working hours (8:00-18:00)
   - Interviewers' existing appointments
6. Recruiter chọn time slot
7. Recruiter chọn interviewers (min 1, max 5)
8. Hệ thống check conflicts realtime khi chọn mỗi interviewer
9. Recruiter nhập location/link và notes
10. Recruiter click "Schedule Interview"
11. Hệ thống validate:
    - Date >= today
    - Time trong working hours
    - Duration hợp lệ
    - Không có conflict với lịch của interviewers
    - Application ở trạng thái hợp lệ
12. Hệ thống tạo Interview record
13. Hệ thống tạo InterviewPanel records (1 cho mỗi interviewer)
14. Hệ thống update application.status → INTERVIEW_SCHEDULED
15. Hệ thống gửi email cho candidate với:
    - Thông tin lịch phỏng vấn
    - Location/Meeting link
    - [Confirm] và [Request Reschedule] buttons
16. Hệ thống gửi email cho interviewers với:
    - Thông tin lịch phỏng vấn
    - Candidate profile link
    - Notes from recruiter
17. (Optional) Hệ thống tạo Google Calendar events
18. Hệ thống hiển thị success message
19. Hệ thống redirect về interview list
20. Use case kết thúc

**Alternative Flows**:

**A1: Interviewer conflict** (tại bước 11)

- 11a. Hệ thống phát hiện interviewer đã có lịch khác cùng thời điểm
- 11b. Hệ thống hiển thị lỗi: "Interviewer [Name] không available vào thời gian này"
- 11c. Hệ thống suggest các time slots khác mà tất cả interviewers đều available
- 11d. Quay lại bước 6

**A2: Candidate request reschedule** (sau bước 15)

- 15a. Candidate click [Request Reschedule] trong email
- 15b. Hệ thống hiển thị form với lý do và preferred dates
- 15c. Candidate submit request
- 15d. Hệ thống notify Recruiter
- 15e. Interview status → RESCHEDULE_REQUESTED
- 15f. Recruiter xem request và reschedule (UC-14A: Reschedule Interview)

**A3: Email gửi thất bại** (tại bước 15 hoặc 16)

- 15a. SMTP service trả về lỗi
- 15b. Hệ thống retry 3 lần với delay 5s
- 15c. Nếu vẫn thất bại:
  - Log error với recipient email
  - Interview vẫn được tạo
  - Hiển thị warning: "Lịch phỏng vấn đã được tạo nhưng email không gửi được. Vui lòng thông báo thủ công"
  - Tạo task retry gửi email sau 10 phút
- 15d. Tiếp tục flow

**A4: No available interviewers** (tại bước 7)

- 7a. Hệ thống không tìm thấy interviewer nào available
- 7b. Hệ thống hiển thị: "Không có interviewer nào available. Vui lòng chọn ngày khác hoặc thêm interviewer mới"
- 7c. Recruiter có option:
  - Chọn ngày khác
  - Proceed anyway (override check)
- 7d. Quay lại bước 4

**Exception Flows**:

- **E1**: Database transaction failed → Rollback tất cả changes, không tạo interview
- **E2**: Calendar API timeout → Interview vẫn được tạo, log warning về calendar sync

**Business Rules**:

- BR-01: Interview phải schedule trước ít nhất 2 giờ
- BR-02: Không schedule quá 2 interviews/ngày cho 1 candidate
- BR-03: Mỗi interviewer max 5 interviews/ngày
- BR-04: Candidate phải confirm hoặc request reschedule trước 24h
- BR-05: Email reminder tự động gửi 24h trước interview

**State Diagram**:

```
  [DRAFT]
     │
     ▼
  [SCHEDULED] ──────> [RESCHEDULE_REQUESTED]
     │                       │
     │<──────────────────────┘
     │
     ├──> [CANCELLED]
     │
     ▼
  [COMPLETED] ──> [FEEDBACK_SUBMITTED]
```

**UI Mockup**:

```
┌──────────────────────────────────────────────┐
│  📅 TẠO LỊCH PHỎNG VẤN                       │
├──────────────────────────────────────────────┤
│  Ứng viên: Nguyễn Văn A                      │
│  Vị trí: Senior Backend Developer            │
│                                              │
│  Interview Type: [Technical Interview ▼]     │
│  Mode: ⦿ Online  ○ Onsite                    │
│                                              │
│  Date: [📅 05/12/2024]                       │
│  Time: [⏰ 14:00 ▼]  Duration: [60 min ▼]   │
│                                              │
│  Available Time Slots:                       │
│  ○ 09:00-10:00  ⦿ 14:00-15:00               │
│  ○ 10:00-11:00  ○ 15:00-16:00               │
│                                              │
│  Interview Panel:                            │
│  ☑ Trần Văn B (available)                    │
│  ☑ Lê Thị C (available)                      │
│  ☐ Phạm Văn D (busy 14:00-15:00)            │
│                                              │
│  Location/Link: [___Zoom Meeting Room 3A___] │
│                                              │
│  Notes: [Focus on system design & algos___]  │
│                                              │
│  [Cancel]  [Schedule Interview]              │
└──────────────────────────────────────────────┘
```

---

### UC-20: Ghi Nhận Kết Quả Phỏng Vấn

**Actor**: Interviewer

**Mô tả**: Interviewer đánh giá và ghi nhận kết quả sau buổi phỏng vấn

**Preconditions**:

- Interview đã hoàn thành (date + time < now)
- Interviewer là thành viên của interview panel
- Interviewer chưa submit feedback

**Postconditions**:

- InterviewPanel.feedback được lưu
- Nếu tất cả panel members đã submit → Interview status = COMPLETED
- Aggregate scores được tính
- Notification gửi cho Recruiter

**Main Flow**:

1. Interviewer login và vào trang "My Interviews"
2. Hệ thống hiển thị danh sách interviews (đã và sắp tới)
3. Interviewer chọn interview đã hoàn thành
4. Interviewer click "Submit Feedback"
5. Hệ thống hiển thị form feedback với:
   - Candidate info (readonly)
   - Rating scales (1-10): Technical skills, Communication, Problem solving, Cultural fit
   - Overall rating (1-10)
   - Strengths (textarea)
   - Weaknesses (textarea)
   - Recommendation (radio): Strong Hire/Hire/Maybe/No Hire/Strong No Hire
   - Comments (textarea)
6. Interviewer điền form
7. Interviewer preview feedback
8. Interviewer click "Submit"
9. Hệ thống validate:
   - Tất cả rating scales đã được chọn
   - Recommendation đã được chọn
   - Strengths và weaknesses không để trống
10. Hệ thống lưu feedback vào InterviewPanel
11. Hệ thống check xem tất cả panel members đã submit chưa
12. Nếu YES:
    - Calculate aggregate scores (average của tất cả ratings)
    - Calculate aggregate recommendation
    - Update interview.status → COMPLETED
    - Update application.status → INTERVIEW_COMPLETED
    - Notify Recruiter: "All feedback submitted for [Candidate Name]"
13. Nếu NO:
    - Notify other panel members: "[Your name] đã submit feedback"
14. Hệ thống hiển thị success message
15. Hệ thống redirect về interview list
16. Use case kết thúc

**Alternative Flows**:

**A1: Edit feedback after submission** (sau bước 10)

- 10a. Interviewer realize cần sửa feedback
- 10b. Interviewer click "Edit Feedback"
- 10c. Hệ thống check:
  - Nếu Recruiter chưa xem → Allow edit
  - Nếu Recruiter đã xem → Show warning: "Recruiter đã xem feedback. Bạn chắc chắn muốn sửa?"
- 10d. Interviewer confirm
- 10e. Hệ thống unlock form
- 10f. Log action: "Feedback edited by [Interviewer] at [timestamp]"
- 10g. Quay lại bước 6

**A2: Interview not yet completed** (tại bước 4)

- 4a. Interviewer cố submit feedback trước khi interview diễn ra
- 4b. Hệ thống block submit button
- 4c. Hiển thị: "Bạn chỉ có thể submit feedback sau khi interview hoàn thành"
- 4d. Use case kết thúc

**A3: Interviewer late submission** (sau 24h)

- 4a. Interview đã complete > 24h nhưng interviewer chưa submit
- 4b. Hệ thống hiển thị warning banner: "⚠️ Vui lòng submit feedback càng sớm càng tốt"
- 4c. Auto reminder email đã được gửi sau 24h
- 4d. Tiếp tục normal flow

**Exception Flows**:

- **E1**: Database save failed → Show error, allow retry
- **E2**: Network timeout during submit → Implement optimistic UI update, retry in background

**Business Rules**:

- BR-01: Feedback phải được submit trong vòng 48h sau interview
- BR-02: Không thể edit feedback sau khi Recruiter đã tạo decision
- BR-03: Overall score = average của 4 rating scales
- BR-04: Aggregate recommendation được tính bằng weighted voting
- BR-05: Feedback bắt buộc phải có ít nhất 50 từ trong comments

**Recommendation Aggregation Logic**:

```python
# Mapping recommendations to numeric values
STRONG_HIRE = 5
HIRE = 4
MAYBE = 3
NO_HIRE = 2
STRONG_NO_HIRE = 1

# Calculate average
recommendations = [panel.recommendation for panel in interview.panels]
numeric_values = [RECOMMENDATION_MAP[r] for r in recommendations]
avg = sum(numeric_values) / len(numeric_values)

# Map back to recommendation
if avg >= 4.5: final = STRONG_HIRE
elif avg >= 3.5: final = HIRE
elif avg >= 2.5: final = MAYBE
elif avg >= 1.5: final = NO_HIRE
else: final = STRONG_NO_HIRE
```

**UI Mockup**:

```
┌──────────────────────────────────────────────┐
│  📝 ĐÁNH GIÁ PHỎNG VẤN                       │
├──────────────────────────────────────────────┤
│  Ứng viên: Nguyễn Văn A                      │
│  Vị trí: Senior Backend Developer            │
│  Ngày PV: 05/12/2024, 14:00-15:00           │
│                                              │
│  ĐÁNH GIÁ:                                   │
│  Technical Skills:                           │
│  1 ──○────────── 10                          │
│                                              │
│  Communication:                              │
│  1 ──────○────── 10                          │
│                                              │
│  Problem Solving:                            │
│  1 ────────○──── 10                          │
│                                              │
│  Cultural Fit:                               │
│  1 ──────○────── 10                          │
│                                              │
│  Overall Rating: 1 ────○────── 10            │
│                                              │
│  Điểm mạnh:                                  │
│  [_____Strong system design skills_______]   │
│  [_____Good problem-solving approach_____]   │
│                                              │
│  Điểm yếu:                                   │
│  [_____Needs improvement in communication]   │
│                                              │
│  Recommendation:                             │
│  ○ Strong Hire  ⦿ Hire  ○ Maybe             │
│  ○ No Hire  ○ Strong No Hire                │
│                                              │
│  Comments:                                   │
│  [___Candidate demonstrated excellent____]   │
│  [___technical knowledge...___________]      │
│                                              │
│  [Cancel]  [Preview]  [Submit Feedback]      │
└──────────────────────────────────────────────┘
```

---

## 4.4. Traceability Matrix

### Mapping Use Cases to Functional Requirements

| Use Case            | Related FRs                         | Priority    |
| ------------------- | ----------------------------------- | ----------- |
| UC-01, UC-02        | FR1 (User Management)               | Must have   |
| UC-03, UC-04        | FR2 (Job Management), FR10 (Search) | Must have   |
| UC-05               | FR3 (Application Management)        | Must have   |
| UC-06               | FR3, FR8 (Notifications)            | Must have   |
| UC-12               | FR4 (AI Screening)                  | Must have   |
| UC-14, UC-18, UC-19 | FR6 (Interview Management)          | Must have   |
| UC-20               | FR6 (Interview Management)          | Must have   |
| UC-15, UC-16        | FR7 (Result Management)             | Must have   |
| UC-17, UC-23, UC-24 | FR9 (Dashboard & Reports)           | Should have |
| UC-21, UC-22        | FR1 (User Management)               | Must have   |

---

## 4.5. Test Cases Tóm Tắt

### UC-05: Nộp Hồ Sơ - Test Cases

| Test ID  | Test Case                          | Expected Result                 | Status     |
| -------- | ---------------------------------- | ------------------------------- | ---------- |
| TC-05-01 | Submit với CV hợp lệ (PDF, 2MB)    | Application created, email sent | ✅ Pass    |
| TC-05-02 | Submit với CV > 10MB               | Error: "File too large"         | ✅ Pass    |
| TC-05-03 | Submit với file .txt               | Error: "Invalid format"         | ✅ Pass    |
| TC-05-04 | Submit khi chưa login              | Redirect to login               | ✅ Pass    |
| TC-05-05 | Submit khi đã apply trước đó       | Error: "Already applied"        | ✅ Pass    |
| TC-05-06 | Submit khi job closed              | Error: "Job closed"             | ✅ Pass    |
| TC-05-07 | Submit với cover letter 5000 chars | Application created             | ✅ Pass    |
| TC-05-08 | Cloud storage unavailable          | Retry logic, eventual error     | 🔄 Testing |

### UC-12: AI Screening - Test Cases

| Test ID  | Test Case                      | Expected Result                      | Status     |
| -------- | ------------------------------ | ------------------------------------ | ---------- |
| TC-12-01 | Screen CV với đầy đủ thông tin | Score 80+, STRONG_YES                | ✅ Pass    |
| TC-12-02 | Screen CV thiếu experience     | Score 40-60, MAYBE                   | ✅ Pass    |
| TC-12-03 | Screen CV không match skills   | Score <40, NO                        | ✅ Pass    |
| TC-12-04 | Gemini API rate limit          | Retry with backoff, eventual success | ✅ Pass    |
| TC-12-05 | CV file corrupted              | Status FAILED, notify recruiter      | ✅ Pass    |
| TC-12-06 | Screening timeout (>60s)       | Task terminated, allow retry         | 🔄 Testing |
| TC-12-07 | Parse 100 CVs concurrently     | All completed within 5 min           | 🔄 Testing |

---

_Xem tiếp:_

- **YC-05**: Quy trình Nghiệp vụ
- **YC-06**: Yêu cầu Kỹ thuật
