# PHẦN 2B: YÊU CẦU CHỨC NĂNG (TIẾP THEO)

## FR6-FR10: Các Chức Năng Bổ Sung

---

## FR6: Quản Lý Phỏng Vấn (Interview Management)

### 2.6.1. Mô tả

Lên lịch phỏng vấn, phân công ban giám khảo, ghi nhận kết quả đánh giá.

### 2.6.2. Chức năng chi tiết

#### FR6.1: Tạo lịch phỏng vấn

**User story**: _"Là Recruiter, tôi muốn tạo lịch phỏng vấn cho ứng viên đã qua vòng sàng lọc"_

**Input**:

```json
{
  "application_id": 789,
  "interview_type": "TECHNICAL",  // TECHNICAL, HR, FINAL
  "interview_mode": "ONLINE",     // ONLINE, ONSITE
  "scheduled_date": "2024-12-05",
  "start_time": "14:00",
  "duration_minutes": 60,
  "location": "Meeting Room 3A" // hoặc Zoom link
  "interview_panel": [101, 102],  // List of interviewer IDs
  "notes": "Focus on system design and algorithms"
}
```

**Process**:

1. Validate:
   - Application phải ở trạng thái SCREENING_COMPLETED
   - Interviewers phải available (check calendar conflicts)
   - Scheduled date phải >= ngày hiện tại
2. Tạo interview record
3. Tạo InterviewPanel records (liên kết interviewer với interview)
4. Update application status → INTERVIEW_SCHEDULED
5. Gửi email cho:
   - Candidate (thông tin lịch phỏng vấn + link join)
   - Interviewers (thông báo phân công + candidate profile)
6. Tạo calendar events (Google Calendar integration - optional)

**Output**:

- Interview ID
- Confirmation message
- Email notifications sent

**Validation rules**:

```python
- scheduled_date >= today()
- start_time: 08:00-18:00 (working hours)
- duration_minutes: 30, 45, 60, 90, 120
- interview_panel: min 1, max 5 interviewers
- No double-booking for interviewers
```

**Email template (Candidate)**:

```
Subject: Lịch phỏng vấn vị trí Senior Backend Developer

Chào Nguyễn Văn A,

Chúc mừng! Hồ sơ của bạn đã được chọn để tham gia phỏng vấn.

📅 Thời gian: 14:00 - 15:00, Thứ 5, 05/12/2024
📍 Địa điểm: Meeting Room 3A
👥 Hình thức: Phỏng vấn kỹ thuật (Technical Interview)
⏱️ Thời lượng: 60 phút

📝 Lưu ý:
- Vui lòng chuẩn bị về system design và algorithms
- Mang theo CMND/CCCD và bằng cấp liên quan

Nếu bạn không thể tham dự, vui lòng thông báo trước 24 giờ.

Chúc bạn thành công!

[Xác nhận tham dự] [Đề nghị đổi lịch]
```

---

#### FR6.2: Xem danh sách phỏng vấn

**User story**: _"Là Interviewer, tôi muốn xem các buổi phỏng vấn tôi được phân công"_

**Views**:

1. **Calendar view**: Hiển thị lịch theo tuần/tháng
2. **List view**: Danh sách interviews sắp tới
3. **Filter**: By date range, interview type, status

**Display (List view)**:

```
┌────────────────────────────────────────────────────────┐
│  🗓️ LỊCH PHỎNG VẤN CỦA TÔI                            │
├────────────────────────────────────────────────────────┤
│  📅 Thứ 5, 05/12/2024 - 14:00-15:00                    │
│  👤 Nguyễn Văn A - Senior Backend Developer            │
│  📍 Meeting Room 3A • Technical Interview              │
│  👥 Panel: Trần Văn B, Lê Thị C                        │
│  [View Profile] [Submit Feedback] [Reschedule]         │
├────────────────────────────────────────────────────────┤
│  📅 Thứ 6, 06/12/2024 - 10:00-11:00                    │
│  👤 Phạm Thị D - Frontend Developer                    │
│  📍 Zoom Meeting • HR Interview                        │
│  👥 Panel: Only me                                     │
│  [View Profile] [Submit Feedback]                      │
└────────────────────────────────────────────────────────┘
```

**Filters**:

- Status: Scheduled, Completed, Cancelled
- Date range: This week, Next week, This month
- Interview type: Technical, HR, Final

---

#### FR6.3: Ghi nhận kết quả phỏng vấn

**User story**: _"Là Interviewer, tôi muốn đánh giá ứng viên sau buổi phỏng vấn"_

**Input form**:

```json
{
  "interview_id": 555,
  "interviewer_id": 101,
  "scores": {
    "technical_skills": 8, // 1-10 scale
    "communication": 7,
    "problem_solving": 9,
    "cultural_fit": 8,
    "overall": 8
  },
  "strengths": "Strong in system design, good problem-solving approach",
  "weaknesses": "Needs improvement in communication skills",
  "recommendation": "HIRE", // STRONG_HIRE, HIRE, MAYBE, NO_HIRE, STRONG_NO_HIRE
  "comments": "Excellent technical skills. Recommend for next round."
}
```

**Process**:

1. Validate interviewer có quyền đánh giá interview này
2. Lưu feedback vào InterviewPanel
3. Nếu tất cả interviewers đã submit feedback:
   - Tính average scores
   - Update interview status → COMPLETED
   - Aggregate recommendations
4. Notify Recruiter: "Interview feedback submitted"

**Aggregation logic**:

```python
# Average scores from all interviewers
average_score = sum(panel.scores['overall'] for panel in panels) / len(panels)

# Recommendation mapping
STRONG_HIRE = 5, HIRE = 4, MAYBE = 3, NO_HIRE = 2, STRONG_NO_HIRE = 1
avg_recommendation = average(recommendation_values)

if avg_recommendation >= 4.5: final = "STRONG_HIRE"
elif avg_recommendation >= 3.5: final = "HIRE"
elif avg_recommendation >= 2.5: final = "MAYBE"
elif avg_recommendation >= 1.5: final = "NO_HIRE"
else: final = "STRONG_NO_HIRE"
```

**Output**:

```
┌──────────────────────────────────────────────┐
│  ✅ INTERVIEW FEEDBACK SUMMARY               │
├──────────────────────────────────────────────┤
│  Candidate: Nguyễn Văn A                     │
│  Position: Senior Backend Developer          │
│  Interview Date: 05/12/2024                  │
│                                              │
│  👥 Panel Feedback (2 interviewers):         │
│                                              │
│  Interviewer 1: Trần Văn B                   │
│  Overall Score: 8/10                         │
│  Recommendation: HIRE ✅                      │
│  "Strong technical skills, good fit"         │
│                                              │
│  Interviewer 2: Lê Thị C                     │
│  Overall Score: 9/10                         │
│  Recommendation: STRONG_HIRE ⭐              │
│  "Excellent problem solver"                  │
│                                              │
│  📊 FINAL RESULT:                            │
│  Average Score: 8.5/10                       │
│  Final Recommendation: HIRE ✅               │
│                                              │
│  [Move to Offer Stage] [Reject] [Schedule Final Interview] │
└──────────────────────────────────────────────┘
```

---

#### FR6.4: Reschedule/Cancel interview

**User story**: _"Là Recruiter, tôi muốn đổi lịch hoặc hủy phỏng vấn nếu cần"_

**Reschedule**:

- Chọn ngày/giờ mới
- Kiểm tra availability của panel
- Gửi email thông báo cho tất cả participants

**Cancel**:

- Nhập lý do cancel
- Update status → CANCELLED
- Gửi email xin lỗi cho candidate
- Release calendar slots

**Business rules**:

- Chỉ reschedule/cancel được nếu interview chưa bắt đầu
- Thông báo trước ít nhất 2 giờ
- Không quá 2 lần reschedule cho 1 candidate

---

## FR7: Quản Lý Kết Quả Tuyển Dụng (Recruitment Result Management)

### 2.7.1. Mô tả

Lưu trữ quyết định cuối cùng (tuyển dụng/từ chối), tạo thư mời nhận việc.

### 2.7.2. Chức năng chi tiết

#### FR7.1: Tạo quyết định tuyển dụng

**User story**: _"Là Recruiter, tôi muốn tạo quyết định chính thức sau khi hoàn thành phỏng vấn"_

**Input**:

```json
{
  "application_id": 789,
  "decision": "HIRED", // HIRED, REJECTED
  "offered_position": "Senior Backend Developer",
  "offered_salary": 2000,
  "salary_currency": "USD",
  "start_date": "2025-01-15",
  "contract_type": "FULL_TIME",
  "probation_period_months": 2,
  "decision_reason": "Excellent technical skills and cultural fit",
  "approved_by": 5 // Admin/Manager ID
}
```

**Process (HIRED)**:

1. Validate:
   - Application phải ở trạng thái INTERVIEW_COMPLETED
   - Interview recommendation >= MAYBE
2. Tạo RecruitmentResult record
3. Update application status → OFFER_SENT
4. Generate offer letter (PDF)
5. Gửi email với offer letter attachment
6. Tạo deadline để candidate accept/reject offer (7 days)

**Process (REJECTED)**:

1. Tạo RecruitmentResult với decision=REJECTED
2. Update application status → REJECTED
3. Gửi email từ chối lịch sự
4. Archive application

---

#### FR7.2: Tạo thư mời nhận việc (Offer Letter)

**User story**: _"Là hệ thống, tôi muốn tự động tạo offer letter chuyên nghiệp"_

**Template**:

```
                    [COMPANY LOGO]
              CÔNG TY CỔ PHẦN ABC TECHNOLOGY
         123 Đường XYZ, Quận 1, TP.HCM, Việt Nam

                     OFFER LETTER

Date: 30/11/2024
Ref: ABC-OFFER-2024-789

Dear Nguyễn Văn A,

We are pleased to offer you the position of Senior Backend Developer
at ABC Technology.

POSITION DETAILS:
- Position: Senior Backend Developer
- Department: Engineering
- Reports to: Engineering Manager
- Start Date: 15/01/2025
- Location: Hà Nội Office

COMPENSATION & BENEFITS:
- Base Salary: $2,000 USD per month
- Probation Period: 2 months (100% salary)
- Performance Bonus: Up to 2 months salary/year
- Annual Leave: 12 days/year
- Health Insurance: Full coverage for employee
- Lunch Allowance: 50,000 VND/day
- Transportation Allowance: 500,000 VND/month

WORK SCHEDULE:
- Working Hours: 9:00 AM - 6:00 PM, Monday - Friday
- Flexible working: 2 days remote/week

This offer is contingent upon:
1. Background verification
2. Reference checks
3. Signing of employment contract

Please confirm your acceptance by 07/12/2024 by replying to this email
or clicking the link below:

[ACCEPT OFFER] [DECLINE OFFER] [REQUEST NEGOTIATION]

We look forward to welcoming you to our team!

Sincerely,

___________________
Trần Văn Hùng
HR Manager
ABC Technology
```

**Generation process**:

1. Load template (Jinja2)
2. Fill in variables (candidate name, position, salary, etc.)
3. Generate PDF using WeasyPrint/ReportLab
4. Store PDF to cloud storage
5. Return URL

---

#### FR7.3: Candidate accept/reject offer

**User story**: _"Là ứng viên, tôi muốn chấp nhận hoặc từ chối offer"_

**Accept offer**:

- Click link trong email
- Redirect to confirmation page
- Update result status → ACCEPTED
- Update application status → HIRED
- Send notification to Recruiter/HR
- Trigger onboarding process (out of scope)

**Reject offer**:

- Click decline link
- Optional: Nhập lý do từ chối (khảo sát)
- Update result status → DECLINED
- Notify Recruiter
- Reopen job position nếu chưa đủ người

**Negotiate offer**:

- Click negotiate link
- Submit form với yêu cầu (salary, start date, etc.)
- Notify Recruiter để discussion
- Status → NEGOTIATING

---

#### FR7.4: Theo dõi offer status

**User story**: _"Là Recruiter, tôi muốn theo dõi trạng thái các offer đã gửi"_

**Dashboard**:

```
┌───────────────────────────────────────────────┐
│  📊 OFFER TRACKING                            │
├───────────────────────────────────────────────┤
│  Pending (3) • Accepted (5) • Declined (2)    │
│                                               │
│  ⏳ PENDING OFFERS (waiting for response):    │
│                                               │
│  📄 Nguyễn Văn A - Senior Backend Dev         │
│     Sent: 30/11/2024 • Deadline: 07/12/2024  │
│     Days remaining: 7                         │
│     [Send Reminder] [Extend Deadline]         │
│                                               │
│  ✅ ACCEPTED OFFERS:                          │
│                                               │
│  📄 Trần Thị B - Frontend Developer           │
│     Accepted: 28/11/2024 • Start: 01/01/2025 │
│     [View Contract] [Start Onboarding]        │
│                                               │
│  ❌ DECLINED OFFERS:                          │
│                                               │
│  📄 Lê Văn C - DevOps Engineer                │
│     Declined: 25/11/2024                      │
│     Reason: "Accepted another offer"          │
│     [Reopen Position]                         │
└───────────────────────────────────────────────┘
```

---

## FR8: Hệ Thống Thông Báo (Notification System)

### 2.8.1. Mô tả

Gửi email tự động và hiển thị in-app notifications cho các sự kiện quan trọng.

### 2.8.2. Loại thông báo

| Sự kiện                          | Người nhận               | Nội dung                            |
| -------------------------------- | ------------------------ | ----------------------------------- |
| **User registered**              | Candidate                | Email verification link             |
| **Application submitted**        | Candidate                | Confirmation + tracking link        |
| **Application screened**         | Recruiter                | AI screening completed              |
| **Interview scheduled**          | Candidate + Interviewers | Interview details                   |
| **Interview reminder**           | Candidate + Interviewers | 24h before interview                |
| **Interview feedback submitted** | Recruiter                | Feedback ready for review           |
| **Offer sent**                   | Candidate                | Offer letter + accept/decline links |
| **Offer deadline approaching**   | Candidate                | 2 days before deadline              |
| **Offer accepted**               | Recruiter + HR           | Candidate accepted offer            |
| **Application status changed**   | Candidate                | Status update notification          |

### 2.8.3. Chức năng chi tiết

#### FR8.1: Gửi email tự động

**Technology**: Celery + Django Email + Gmail SMTP

**Process**:

```python
@shared_task
def send_email_notification(notification_id):
    notif = Notification.objects.get(id=notification_id)

    # Load email template
    template = get_template(notif.template_name)
    context = notif.context_data
    html_content = template.render(context)

    # Send email
    send_mail(
        subject=notif.subject,
        message=strip_tags(html_content),
        html_message=html_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[notif.recipient_email],
        fail_silently=False
    )

    # Update notification status
    notif.status = 'SENT'
    notif.sent_at = timezone.now()
    notif.save()
```

**Email templates** (Jinja2):

```html
<!-- application_submitted.html -->
<html>
  <body>
    <h2>Xác nhận nộp hồ sơ</h2>
    <p>Chào {{ candidate_name }},</p>
    <p>
      Hồ sơ của bạn cho vị trí <strong>{{ job_title }}</strong> đã được nộp
      thành công.
    </p>
    <p>Mã hồ sơ: <code>{{ application_id }}</code></p>
    <p>
      Theo dõi trạng thái: <a href="{{ tracking_url }}">{{ tracking_url }}</a>
    </p>
    <p>Chúng tôi sẽ liên hệ trong vòng 3-5 ngày làm việc.</p>
  </body>
</html>
```

---

#### FR8.2: In-app notifications

**User story**: _"Là người dùng, tôi muốn nhận thông báo realtime trong ứng dụng"_

**Display** (Notification bell):

```
┌────────────────────────────────────┐
│  🔔 (3)                            │
├────────────────────────────────────┤
│  ● New application for Senior Dev  │
│    2 minutes ago                   │
│                                    │
│  ● Interview scheduled with Nguyễn │
│    Văn A at 14:00 today            │
│    1 hour ago                      │
│                                    │
│  ○ AI screening completed          │
│    Yesterday                       │
│                                    │
│  [Mark all as read] [View all]     │
└────────────────────────────────────┘
```

**Features**:

- Real-time updates (WebSocket - optional)
- Badge count for unread notifications
- Mark as read/unread
- Click to navigate to related page
- Auto-dismiss after 7 days

**API Endpoints**:

```
GET  /api/notifications/          # List notifications
POST /api/notifications/{id}/read/ # Mark as read
POST /api/notifications/mark-all-read/ # Mark all as read
```

---

#### FR8.3: Notification preferences

**User story**: _"Là người dùng, tôi muốn tùy chỉnh loại thông báo tôi nhận"_

**Settings page**:

```
┌──────────────────────────────────────────────┐
│  ⚙️ NOTIFICATION PREFERENCES                 │
├──────────────────────────────────────────────┤
│  Email Notifications:                        │
│  ☑ Application submitted                     │
│  ☑ Interview scheduled                       │
│  ☑ Interview reminders (24h before)          │
│  ☑ Application status changes                │
│  ☐ Weekly summary reports                    │
│                                              │
│  In-App Notifications:                       │
│  ☑ New applications (Recruiter only)         │
│  ☑ Interview assignments (Interviewer only)  │
│  ☑ Feedback requests                         │
│  ☐ System announcements                      │
│                                              │
│  [Save Preferences]                          │
└──────────────────────────────────────────────┘
```

---

## FR9: Dashboard và Báo Cáo (Dashboard & Reports)

### 2.9.1. Mô tả

Hiển thị thống kê, biểu đồ và báo cáo về hoạt động tuyển dụng.

### 2.9.2. Dashboards theo vai trò

#### FR9.1: Admin Dashboard

**Metrics**:

```
┌────────────────────────────────────────────────────┐
│  📊 ADMIN DASHBOARD                                │
├────────────────────────────────────────────────────┤
│  Overview (This Month):                            │
│                                                    │
│  👥 Total Users: 450 (+25)                         │
│  📝 Active Jobs: 12                                │
│  📄 Total Applications: 320 (+45)                  │
│  ✅ Hired: 8 (+2)                                  │
│                                                    │
│  📈 Recruitment Funnel:                            │
│  ████████████████████ 320 Applications (100%)      │
│  ████████████░░░░░░░  180 Screened (56%)          │
│  ███████░░░░░░░░░░░░   95 Interviewed (30%)       │
│  ███░░░░░░░░░░░░░░░░   25 Offered (8%)            │
│  ██░░░░░░░░░░░░░░░░░    8 Hired (2.5%)            │
│                                                    │
│  🕒 Average Time-to-Hire: 18 days                  │
│  💰 Cost-per-Hire: $2,500 USD                      │
│                                                    │
│  📊 Top Positions:                                 │
│  1. Backend Developer (85 applications)            │
│  2. Frontend Developer (60 applications)           │
│  3. DevOps Engineer (45 applications)              │
│                                                    │
│  [View Detailed Reports] [Export Data]             │
└────────────────────────────────────────────────────┘
```

**Charts**:

- Line chart: Applications over time (last 6 months)
- Pie chart: Applications by status
- Bar chart: Applications by department
- Funnel chart: Conversion rates

---

#### FR9.2: Recruiter Dashboard

**Metrics**:

```
┌────────────────────────────────────────────────────┐
│  📊 RECRUITER DASHBOARD                            │
├────────────────────────────────────────────────────┤
│  My Active Jobs (5):                               │
│                                                    │
│  📝 Senior Backend Developer                       │
│     45 applications • 12 pending review            │
│     Next interview: Today 14:00                    │
│     [View Pipeline]                                │
│                                                    │
│  📝 Frontend Developer                             │
│     28 applications • 5 interviews scheduled       │
│     [View Pipeline]                                │
│                                                    │
│  ⚠️ Action Required (8):                           │
│  • 3 AI screenings completed - review results      │
│  • 2 interview feedbacks submitted - make decision │
│  • 2 offers expiring in 2 days - follow up        │
│  • 1 interview needs scheduling                    │
│                                                    │
│  📅 Upcoming Interviews (This Week):               │
│  • 5 technical interviews                          │
│  • 3 HR interviews                                 │
│  • 2 final interviews                              │
│                                                    │
│  [Create New Job] [View All Applications]          │
└────────────────────────────────────────────────────┘
```

---

#### FR9.3: Reports & Analytics

**Available reports**:

1. **Recruitment Summary Report**

   - Time period selection
   - Overview metrics (applications, hires, rejections)
   - Funnel conversion rates
   - Export: PDF, Excel

2. **Source of Hire Report**

   - Where candidates come from (direct apply, referral, etc.)
   - Best performing sources
   - ROI by source

3. **Time-to-Hire Report**

   - Average days per stage
   - Bottleneck identification
   - Comparison by position/department

4. **Candidate Quality Report**

   - AI screening scores distribution
   - Interview feedback analysis
   - Hired vs. rejected comparison

5. **Interviewer Performance Report**
   - Number of interviews conducted
   - Average feedback scores
   - Decision accuracy (hired candidates performance)

**Export formats**:

- PDF: For presentation
- Excel: For further analysis
- CSV: For data integration

---

## FR10: Tìm Kiếm và Lọc (Search & Filter)

### 2.10.1. Mô tả

Tìm kiếm nhanh và lọc dữ liệu theo nhiều tiêu chí.

### 2.10.2. Chức năng chi tiết

#### FR10.1: Search jobs

**Search fields**:

- Title
- Department
- Location
- Skills required

**Filters**:

- Status (Draft, Open, Closed, Filled)
- Employment type (Full-time, Part-time, etc.)
- Date range (posted from - to)
- Salary range

**Sort**:

- Created date (newest/oldest)
- Application deadline
- Number of applications
- Title (A-Z)

---

#### FR10.2: Search applications

**Search fields**:

- Candidate name
- Email
- Phone
- Skills (from parsed CV)

**Filters**:

- Status (Submitted, Screening, Interview, etc.)
- AI score range (0-100)
- Applied date range
- Job position
- Recommendation (Strong Yes, Yes, Maybe, No)

**Advanced filters**:

- Experience years: 0-2, 3-5, 6-10, 10+
- Education: Bachelor, Master, PhD
- Location preference
- Availability (notice period)

---

#### FR10.3: Global search

**User story**: _"Là người dùng, tôi muốn tìm kiếm bất cứ thứ gì trong hệ thống"_

**Search scope**:

- Jobs (title, description)
- Candidates (name, email, skills)
- Interviews (date, location)
- Notifications (content)

**Implementation**:

- Elasticsearch (optional, for better performance)
- PostgreSQL full-text search (simpler approach)

**Example**:

```
Search: "python django backend"

Results:
📝 Jobs (2):
  - Senior Backend Developer (requires Python, Django)
  - Full-stack Engineer (Python, Django, React)

👤 Candidates (5):
  - Nguyễn Văn A (Python, Django, 5 years exp)
  - Trần Thị B (Backend specialist, Django expert)
  ...
```

---

## Tổng Kết 10 Yêu Cầu Chức Năng

| FR   | Tên                    | Độ ưu tiên  | Complexity |
| ---- | ---------------------- | ----------- | ---------- |
| FR1  | User Management        | Must have   | Medium     |
| FR2  | Job Management         | Must have   | Medium     |
| FR3  | Application Management | Must have   | High       |
| FR4  | AI CV Screening        | Must have   | High       |
| FR5  | Recruitment Process    | Should have | Medium     |
| FR6  | Interview Management   | Must have   | High       |
| FR7  | Result Management      | Must have   | Medium     |
| FR8  | Notification System    | Must have   | Medium     |
| FR9  | Dashboard & Reports    | Should have | Medium     |
| FR10 | Search & Filter        | Should have | Low        |

---

_Xem tiếp:_

- **YC-03**: Yêu cầu Phi chức năng (NFR1-NFR5)
- **YC-04**: Use Cases chi tiết
- **YC-05**: Quy trình Nghiệp vụ
