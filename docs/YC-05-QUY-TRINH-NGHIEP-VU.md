# PHẦN 5: QUY TRÌNH NGHIỆP VỤ (BUSINESS PROCESSES)

## ĐỀ TÀI: XÂY DỰNG HỆ THỐNG TUYỂN DỤNG NHÂN SỰ

---

## 5.1. Quy Trình Tuyển Dụng Tổng Quan

### 5.1.1. Recruitment Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    QUY TRÌNH TUYỂN DỤNG TOÀN DIỆN               │
└─────────────────────────────────────────────────────────────────┘

  PHASE 1           PHASE 2           PHASE 3          PHASE 4
  Planning          Sourcing          Selection        Onboarding
     │                 │                  │                │
     ▼                 ▼                  ▼                ▼
┌──────────┐    ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Define   │    │ Post Job │     │ Screen   │     │ Offer    │
│ Position │───>│ Opening  │────>│ CV (AI)  │────>│ Letter   │
└──────────┘    └──────────┘     └──────────┘     └──────────┘
                      │                 │                │
                      ▼                 ▼                ▼
                ┌──────────┐     ┌──────────┐     ┌──────────┐
                │ Receive  │     │Technical │     │Candidate │
                │ Applications│  │Interview │     │Accepts   │
                └──────────┘     └──────────┘     └──────────┘
                                      │                │
                                      ▼                ▼
                                ┌──────────┐     ┌──────────┐
                                │  HR      │     │ Start    │
                                │Interview │     │ Date     │
                                └──────────┘     └──────────┘
                                      │
                                      ▼
                                ┌──────────┐
                                │  Final   │
                                │ Decision │
                                └──────────┘

TIMELINE:         1-3 days      3-7 days        7-14 days      7-14 days
TOTAL TIME-TO-HIRE: ~18-28 days (average: 21 days)
```

---

## 5.2. Chi Tiết Từng Giai Đoạn

### PHASE 1: Planning & Job Definition

#### 5.2.1. Xác định nhu cầu tuyển dụng

**Actors**: Hiring Manager, Recruiter

**Steps**:

1. **Identify need**
   - Hiring Manager xác định vị trí cần tuyển (new position hoặc replacement)
   - Đánh giá budget và headcount approval
2. **Define job requirements**
   - Position title, level (Junior/Mid/Senior)
   - Department và reporting line
   - Required skills (technical & soft skills)
   - Experience level (years)
   - Education requirements
   - Salary range
3. **Create recruitment process**
   - Số vòng phỏng vấn (thường 2-3 vòng)
   - Loại interview (Technical, HR, Final)
   - Timeline dự kiến cho mỗi vòng
   - Interview panel (ai sẽ phỏng vấn)

**Output**: Job Requisition Form (approved by Hiring Manager)

**Timeline**: 1-2 days

---

### PHASE 2: Sourcing & Application Collection

#### 5.2.2. Đăng tin tuyển dụng

**Actor**: Recruiter

**Workflow**:

```
[Start]
   │
   ▼
┌──────────────────────┐
│ Recruiter creates    │
│ job posting in system│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Fill job details:    │
│ - Title, Description │
│ - Requirements       │
│ - Salary, Benefits   │
│ - Deadline           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Setup recruitment    │
│ process (3 steps)    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Status: DRAFT        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐     Yes
│ Preview & Review OK? ├────────┐
└──────────┬───────────┘        │
           │ No                  │
           │                     ▼
           │              ┌──────────────────────┐
           └─────────────>│ Publish job          │
                          │ Status: OPEN         │
                          └──────────┬───────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │ Job visible to       │
                          │ candidates           │
                          └──────────────────────┘
                                     │
                                     ▼
                                  [End]
```

**Business Rules**:

- Job phải được approve trước khi publish
- Application deadline >= 7 days from posting date
- Salary range phải realistic (market research)

**Timeline**: 0.5-1 day (để tạo và review job posting)

---

#### 5.2.3. Candidate nộp hồ sơ

**Actor**: Candidate

**Workflow**:

```
Candidate              System                  Background Job
    │                     │                          │
    ├─Browse jobs─────────>│                         │
    │                     │                          │
    ├─Click "Apply"───────>│                         │
    │                     │                          │
    │<────Show form────────┤                         │
    │                     │                          │
    ├─Upload CV───────────>│                         │
    ├─Fill cover letter───>│                         │
    │                     │                          │
    ├─Submit──────────────>│                         │
    │                     │                          │
    │                  ┌──┴──┐                       │
    │                  │Validate                     │
    │                  │- File format                │
    │                  │- File size                  │
    │                  │- Not duplicate              │
    │                  └──┬──┘                       │
    │                     │                          │
    │                  ┌──▼──┐                       │
    │                  │Upload CV                    │
    │                  │to Storage                   │
    │                  └──┬──┘                       │
    │                     │                          │
    │                  ┌──▼──┐                       │
    │                  │Create                       │
    │                  │Application                  │
    │                  │Record                       │
    │                  └──┬──┘                       │
    │                     │                          │
    │                     ├──Trigger AI Screening────>│
    │                     │                          │
    │                     ├──Send Email──────────────>│
    │                     │                          │
    │<─Success message────┤                          │
    │ (Tracking link)     │                       ┌──▼──┐
    │                     │                       │Parse CV│
    │                     │                       │Score  │
    │                     │                       └──┬───┘
    │                     │                          │
    │                     │<─Update score────────────┤
    │                     │                          │
    │<─Email confirmation─┤                          │
    │                     │                          │
```

**Data Flow**:

```json
// Application record
{
  "id": 789,
  "job_id": 123,
  "candidate_id": 456,
  "cv_url": "https://storage.example.com/cv/789.pdf",
  "cover_letter": "I am very interested in...",
  "status": "SUBMITTED",
  "submitted_at": "2024-11-30T10:00:00Z",
  "ai_score": null, // Will be filled by background job
  "screening_result": null
}
```

**Timeline**: 5-10 phút (cho candidate nộp hồ sơ)

---

### PHASE 3: Screening & Selection

#### 5.2.4. AI CV Screening (Automated)

**Actor**: System (Background Job)

**Detailed Workflow**:

```
[Application Submitted]
         │
         ▼
┌─────────────────────┐
│ Celery Task Queued  │
│ Priority: High      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Download CV from    │
│ Cloud Storage       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Convert PDF/DOCX    │
│ to Text             │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Call Gemini API     │
│ Prompt: Parse CV    │
└──────────┬──────────┘
           │
           ├───Success───┐
           │             ▼
           │      ┌─────────────────────┐
           │      │ Extract:            │
           │      │ - Name, Email       │
           │      │ - Education         │
           │      │ - Experience        │
           │      │ - Skills            │
           │      └──────────┬──────────┘
           │                 │
           │                 ▼
           │      ┌─────────────────────┐
           │      │ Save Parsed Data    │
           │      └──────────┬──────────┘
           │                 │
           │                 ▼
           │      ┌─────────────────────┐
           │      │ Call Gemini API     │
           │      │ Prompt: Evaluate    │
           │      │ against Job Reqs    │
           │      └──────────┬──────────┘
           │                 │
           │                 ▼
           │      ┌─────────────────────┐
           │      │ Calculate Scores:   │
           │      │ - Skills: 90/100    │
           │      │ - Experience: 85/100│
           │      │ - Education: 80/100 │
           │      │ - Overall: 85/100   │
           │      └──────────┬──────────┘
           │                 │
           │                 ▼
           │      ┌─────────────────────┐
           │      │ Determine           │
           │      │ Recommendation:     │
           │      │ STRONG_YES          │
           │      └──────────┬──────────┘
           │                 │
           │                 ▼
           │      ┌─────────────────────┐
           │      │ Save Result to DB   │
           │      └──────────┬──────────┘
           │                 │
           │                 ▼
           │      ┌─────────────────────┐
           │      │ Update Application  │
           │      │ Status: SCREENING   │
           │      │         _COMPLETED  │
           │      └──────────┬──────────┘
           │                 │
           │                 ▼
           │      ┌─────────────────────┐
           │      │ Notify Recruiter    │
           │      └─────────────────────┘
           │
           ├───Failure (API)───┐
           │                   ▼
           │         ┌─────────────────────┐
           │         │ Retry (3 times)     │
           │         │ Exponential Backoff │
           │         └──────────┬──────────┘
           │                    │
           │                    ├─Success──>(Continue)
           │                    │
           │                    ▼
           │         ┌─────────────────────┐
           │         │ Mark as FAILED      │
           │         │ Notify Admin        │
           │         └─────────────────────┘
           │
           ▼
        [End]
```

**AI Evaluation Criteria**:

```yaml
Skills Match (50% weight):
  - Required skills found in CV: 4/5 = 80%
  - Proficiency level match: 90%
  - → Skills Score: 85/100

Experience Match (30% weight):
  - Years of experience: 4 years (required 3+) = 100%
  - Relevant job titles: 85%
  - → Experience Score: 92/100

Education Match (20% weight):
  - Degree level: Bachelor (required Bachelor) = 100%
  - Major relevance: Computer Science = 100%
  - University reputation: 80%
  - → Education Score: 93/100

Overall Score = (85*0.5) + (92*0.3) + (93*0.2) = 88.1/100

Recommendation: STRONG_YES (score >= 80)
```

**Timeline**: 20-30 giây per CV

**SLA**:

- 95% of CVs screened within 30 seconds
- 99% of CVs screened within 60 seconds

---

#### 5.2.5. Recruiter review & shortlist

**Actor**: Recruiter

**Workflow**:

```
Recruiter Dashboard
         │
         ▼
┌─────────────────────────────┐
│ View Applications           │
│ - Sort by AI score (desc)   │
│ - Filter: Score >= 70       │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ For each high-score app:    │
│ 1. View AI analysis         │
│ 2. Read CV manually         │
│ 3. Check parsed data        │
└──────────┬──────────────────┘
            │
            ▼
       ┌────┴────┐
       │Decision?│
       └────┬────┘
            │
   ┌────────┼────────┐
   │        │        │
   ▼        ▼        ▼
[Advance] [Hold]  [Reject]
   │                 │
   │                 ▼
   │        ┌─────────────────┐
   │        │ Update status:  │
   │        │ REJECTED        │
   │        │ Send email      │
   │        └─────────────────┘
   │
   ▼
┌─────────────────────────────┐
│ Update status:              │
│ READY_FOR_INTERVIEW         │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Schedule Interview          │
│ (UC-14)                     │
└─────────────────────────────┘
```

**Decision Matrix**:
| AI Score | AI Recommendation | Manual Review | Action |
|----------|-------------------|---------------|--------|
| >= 85 | STRONG_YES | Quick check | Advance to interview |
| 70-84 | YES | Thorough review | Likely advance |
| 50-69 | MAYBE | Deep review | Case by case |
| 30-49 | NO | Optional review | Likely reject |
| < 30 | STRONG_NO | Auto reject | Reject |

**Timeline**: 2-5 phút per application

---

#### 5.2.6. Technical Interview

**Actors**: Candidate, Interviewer(s)

**Workflow**:

```
BEFORE INTERVIEW:
─────────────────
Recruiter                  System                Interviewer
    │                        │                       │
    ├─Schedule interview─────>│                      │
    │                        │                       │
    │                        ├─Send email───────────>│
    │                        │ (Candidate profile)   │
    │                        │                       │
    │                        ├─Send email───────────>│
    │                        │ (Interview details)   │
    │                        │                       │
    │                        ├─Reminder (24h)───────>│
    │                        │                       │


DURING INTERVIEW:
─────────────────
Candidate arrives/joins meeting
    │
    ▼
┌──────────────────────────┐
│ Introduction (5 min)     │
│ - Interviewer intro      │
│ - Candidate intro        │
│ - Agenda overview        │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│ Technical Questions      │
│ (30-40 min)              │
│ - Coding problems        │
│ - System design          │
│ - Past experience        │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│ Behavioral Questions     │
│ (10 min)                 │
│ - Teamwork               │
│ - Problem solving        │
│ - Communication          │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│ Q&A Session (10 min)     │
│ - Candidate asks         │
│ - About company, team    │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│ Wrap up (5 min)          │
│ - Next steps             │
│ - Timeline               │
└────────────────────────────┘


AFTER INTERVIEW:
────────────────
Interviewer               System                 Recruiter
    │                        │                       │
    ├─Submit feedback────────>│                      │
    │ (Within 24h)           │                       │
    │                        │                       │
    │                     ┌──▼──┐                    │
    │                     │Check: All                │
    │                     │panels                    │
    │                     │submitted?                │
    │                     └──┬──┘                    │
    │                        │                       │
    │                        ├─Yes: Calculate────────>│
    │                        │  aggregate score       │
    │                        │                       │
    │                        ├─Notify───────────────>│
    │                        │                       │
```

**Interview Evaluation Form**:

```
┌──────────────────────────────────────────┐
│ TECHNICAL INTERVIEW SCORECARD            │
├──────────────────────────────────────────┤
│ Candidate: Nguyễn Văn A                  │
│ Position: Senior Backend Developer       │
│ Date: 05/12/2024                         │
│                                          │
│ TECHNICAL SKILLS (1-10):                 │
│ ▪ Data Structures & Algorithms:  [ 8 ]  │
│ ▪ System Design:                 [ 9 ]  │
│ ▪ Coding Quality:                [ 8 ]  │
│ ▪ Problem Solving:               [ 9 ]  │
│                                          │
│ SOFT SKILLS (1-10):                      │
│ ▪ Communication:                 [ 7 ]  │
│ ▪ Collaboration:                 [ 8 ]  │
│                                          │
│ STRENGTHS:                               │
│ - Strong system design thinking          │
│ - Clean, readable code                   │
│ - Good understanding of trade-offs       │
│                                          │
│ WEAKNESSES:                              │
│ - Needs improvement in communication     │
│ - Could explain thought process better   │
│                                          │
│ RECOMMENDATION:                          │
│ ⦿ Strong Hire  ○ Hire  ○ Maybe          │
│ ○ No Hire  ○ Strong No Hire             │
│                                          │
│ COMMENTS:                                │
│ Solid technical candidate. Demonstrated  │
│ excellent problem-solving skills...      │
│                                          │
│ [Submit Feedback]                        │
└──────────────────────────────────────────┘
```

**Timeline**: 60 phút interview + 24h feedback submission

---

#### 5.2.7. HR Interview

**Actor**: HR/Recruiter, Candidate

**Purpose**:

- Assess cultural fit
- Discuss compensation expectations
- Clarify employment terms
- Answer candidate questions

**Typical Questions**:

```
ABOUT CANDIDATE:
1. Why are you looking for a new job?
2. What are your career goals (1, 3, 5 years)?
3. What's your ideal work environment?
4. How do you handle stress/pressure?
5. Tell me about a conflict you resolved

ABOUT EXPECTATIONS:
1. Salary expectation?
2. Notice period at current company?
3. Earliest start date?
4. Any concerns about the role?
5. What matters most to you in a job?

ABOUT COMPANY:
1. Our culture and values
2. Team structure
3. Growth opportunities
4. Benefits package
5. Working arrangements (remote/hybrid)
```

**Timeline**: 30-45 phút

---

### PHASE 4: Offer & Onboarding

#### 5.2.8. Decision Making Process

**Actors**: Recruiter, Hiring Manager, Interviewers

**Workflow**:

```
[All interviews completed]
         │
         ▼
┌─────────────────────────────┐
│ Debrief Meeting             │
│ - Review all feedback       │
│ - Discuss concerns          │
│ - Compare with other cands  │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Hiring Manager Decision     │
└──────────┬──────────────────┘
            │
       ┌────┴────┐
       │         │
       ▼         ▼
    [HIRE]   [REJECT]
       │         │
       │         ▼
       │  ┌─────────────────────────────┐
       │  │ Send rejection email        │
       │  │ - Thank candidate           │
       │  │ - Keep door open            │
       │  │ - Store in talent pool      │
       │  └─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Prepare Offer Details:      │
│ - Position & level          │
│ - Salary (base + bonus)     │
│ - Benefits                  │
│ - Start date                │
│ - Probation period          │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Get Approval:               │
│ - HR Director               │
│ - Finance (budget)          │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Generate Offer Letter (PDF) │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Send to Candidate           │
│ - Email with offer letter   │
│ - Deadline: 7 days          │
│ - [Accept] [Decline] links  │
└──────────┬──────────────────┘
            │
            ▼
      [Wait for response]
```

**Offer Letter Template** (Summary):

```
OFFER LETTER

Dear [Candidate Name],

We are pleased to offer you the position of [Job Title]
at [Company Name].

COMPENSATION:
• Base Salary: $X,XXX USD/month
• Performance Bonus: Up to X months salary/year
• Stock Options: X,XXX shares (if applicable)

BENEFITS:
• Health Insurance (full coverage)
• Annual Leave: 12 days/year
• Sick Leave: 12 days/year
• Learning Budget: $X,XXX/year
• Remote Work: X days/week

START DATE: [Date]
PROBATION: X months

Please confirm your acceptance by [Deadline Date].

[ACCEPT OFFER] [DECLINE OFFER] [REQUEST NEGOTIATION]

Best regards,
[Recruiter Name]
```

**Timeline**: 2-3 days (để prepare và approve offer)

---

#### 5.2.9. Offer Acceptance/Rejection

**Scenario 1: Candidate Accepts**

```
Candidate clicks [Accept Offer]
         │
         ▼
┌─────────────────────────────┐
│ Update status: OFFER_ACCEPTED│
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Send confirmation email     │
│ - Welcome message           │
│ - Next steps                │
│ - Documents needed          │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Trigger Onboarding Process  │
│ (Out of scope)              │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Update job posting:         │
│ - Filled: +1                │
│ - Check if all filled       │
│ - If yes: Close job         │
└─────────────────────────────┘
```

**Scenario 2: Candidate Declines**

```
Candidate clicks [Decline Offer]
         │
         ▼
┌─────────────────────────────┐
│ Optional: Reason survey     │
│ - Salary too low            │
│ - Accepted another offer    │
│ - Personal reasons          │
│ - Other (text input)        │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Update status: OFFER_DECLINED│
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Notify Recruiter & HM       │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Decision:                   │
│ - Move to 2nd choice cand?  │
│ - Reopen position?          │
└─────────────────────────────┘
```

**Scenario 3: Negotiation**

```
Candidate clicks [Request Negotiation]
         │
         ▼
┌─────────────────────────────┐
│ Fill negotiation form:      │
│ - Desired salary            │
│ - Other requests            │
│ - Justification             │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Status: OFFER_NEGOTIATING   │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Notify Recruiter            │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Recruiter reviews:          │
│ - Discuss with HM           │
│ - Check budget              │
│ - Counter offer             │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Send revised offer          │
│ (Repeat cycle)              │
└─────────────────────────────┘
```

---

## 5.3. Luồng Xử Lý Ngoại Lệ (Exception Flows)

### 5.3.1. Candidate withdraws application

```
At any stage before offer accepted:
         │
         ▼
┌─────────────────────────────┐
│ Candidate clicks            │
│ "Withdraw Application"      │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Confirmation dialog         │
│ "Are you sure?"             │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Update status: WITHDRAWN    │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Notify Recruiter            │
│ (if interview scheduled)    │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Cancel scheduled interviews │
│ Notify interviewers         │
└─────────────────────────────┘
```

---

### 5.3.2. Job position cancelled

```
While applications are in process:
         │
         ▼
┌─────────────────────────────┐
│ Recruiter/Admin cancels job │
│ Reason: Budget cut, freeze  │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Update job status: CANCELLED│
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Get all active applications │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Update all apps status:     │
│ CANCELLED_BY_COMPANY        │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Send email to all candidates│
│ - Apologize                 │
│ - Explain situation         │
│ - Keep CVs in talent pool   │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Cancel all interviews       │
│ Notify interviewers         │
└─────────────────────────────┘
```

---

### 5.3.3. Candidate no-show for interview

```
Interview scheduled time passes:
         │
         ▼
┌─────────────────────────────┐
│ Interviewer reports no-show │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ System waits 15 minutes     │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Still no show?              │
└──────────┬──────────────────┘
            │ Yes
            ▼
┌─────────────────────────────┐
│ Interview status: NO_SHOW   │
└──────────┬──────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Send email to candidate:    │
│ "We noticed you missed..."  │
│ [Reschedule?] [Withdraw?]   │
└──────────┬──────────────────┘
            │
       ┌────┴────┐
       │         │
       ▼         ▼
 [Reschedule] [No response for 48h]
       │              │
       │              ▼
       │     ┌─────────────────────────────┐
       │     │ Application status: REJECTED│
       │     │ Reason: No-show             │
       │     └─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Schedule new interview      │
│ (One-time only)             │
└─────────────────────────────┘
```

---

## 5.4. Metrics & KPIs

### 5.4.1. Process Metrics

| Metric                             | Formula                                    | Target    |
| ---------------------------------- | ------------------------------------------ | --------- |
| **Time-to-Hire**                   | Avg days from job posted to offer accepted | < 21 days |
| **Time-to-Fill**                   | Avg days from job posted to start date     | < 35 days |
| **Application-to-Interview Ratio** | Interviews / Applications                  | 10-15%    |
| **Interview-to-Offer Ratio**       | Offers / Interviews                        | 30-40%    |
| **Offer Accept Rate**              | Accepted / Total offers                    | >= 80%    |
| **Cost-per-Hire**                  | Total recruitment cost / Hires             | < $2,500  |
| **Source of Hire**                 | Hires by source (direct, referral)         | Track     |
| **Quality of Hire**                | Performance rating after 6 months          | >= 4/5    |

### 5.4.2. Funnel Analysis

```
┌─────────────────────────────────────────────┐
│         RECRUITMENT FUNNEL                  │
├─────────────────────────────────────────────┤
│                                             │
│  Applications: 100           100%           │
│  ████████████████████████████████████████   │
│                                             │
│  AI Screened: 80             80%            │
│  ████████████████████████████████           │
│                                             │
│  Recruiter Shortlist: 20     20%            │
│  ████████                                   │
│                                             │
│  Technical Interview: 15     15%            │
│  ██████                                     │
│                                             │
│  HR Interview: 10            10%            │
│  ████                                       │
│                                             │
│  Offers Sent: 3              3%             │
│  █                                          │
│                                             │
│  Offers Accepted: 2          2%             │
│  ▌                                          │
│                                             │
└─────────────────────────────────────────────┘

Conversion Rates:
• App → Screen: 80%
• Screen → Shortlist: 25%
• Shortlist → Tech Interview: 75%
• Tech → HR: 67%
• HR → Offer: 30%
• Offer → Accept: 67%

Overall: 2% application-to-hire (100 apps → 2 hires)
```

---

## 5.5. Tổng Kết Timeline

```
Week 1:
├─ Day 1-2: Job posting created and published
└─ Day 3-7: Applications coming in, AI screening running

Week 2:
├─ Day 8-10: Recruiter reviews top candidates
└─ Day 11-14: Schedule and conduct technical interviews

Week 3:
├─ Day 15-17: HR interviews
├─ Day 18-19: Debrief and decision making
└─ Day 20-21: Prepare and send offer

Week 4:
├─ Day 22-28: Wait for candidate decision
└─ Day 28: Candidate accepts

Week 5+:
└─ Onboarding preparation (out of scope)

TOTAL: ~28 days (4 weeks)
Best case: 18 days
Worst case: 35 days
```

---

_Xem tiếp:_

- **YC-06**: Yêu cầu Kỹ thuật (Tech Stack, Architecture, Deployment)
