# API Endpoints Design

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-app.vercel.app/api`

## Authentication

All endpoints (trừ public) yêu cầu JWT token trong header:

```
Authorization: Bearer <token>
```

---

## 1. Authentication APIs

### POST /api/auth/register

Đăng ký tài khoản mới (CANDIDATE)

```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nguyen Van A",
  "phone": "0901234567"
}

Response: 201
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Nguyen Van A",
    "role": "CANDIDATE"
  }
}
```

### POST /api/auth/login

Đăng nhập

```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "RECRUITER"
  }
}
```

### POST /api/auth/logout

Đăng xuất (clear cookie)

---

## 2. Job Management APIs

### GET /api/jobs

Lấy danh sách jobs (public)

```
Query params:
  ?status=OPEN          // Filter by status
  &page=1               // Pagination
  &limit=10
  &search=developer     // Search in title

Response: 200
{
  "jobs": [
    {
      "id": "uuid",
      "title": "Senior Java Developer",
      "location": "Ha Noi",
      "salary": "1000-2000 USD",
      "status": "OPEN",
      "deadline": "2025-12-31T00:00:00Z",
      "createdAt": "2025-11-01T00:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

### GET /api/jobs/:id

Lấy chi tiết job (public)

```json
Response: 200
{
  "id": "uuid",
  "title": "Senior Java Developer",
  "description": "We are looking for...",
  "requirements": "- 5+ years Java\n- Spring Boot...",
  "salary": "1000-2000 USD",
  "location": "Ha Noi",
  "employmentType": "FULLTIME",
  "status": "OPEN",
  "deadline": "2025-12-31",
  "createdBy": {
    "id": "uuid",
    "name": "HR Manager"
  },
  "applicationsCount": 45
}
```

### POST /api/jobs

Tạo job mới (ADMIN, RECRUITER)

```json
Request:
{
  "title": "Senior Java Developer",
  "description": "Job description...",
  "requirements": "Requirements...",
  "salary": "1000-2000 USD",
  "location": "Ha Noi",
  "employmentType": "FULLTIME",
  "deadline": "2025-12-31"
}

Response: 201
{
  "id": "uuid",
  "title": "Senior Java Developer",
  "status": "DRAFT"
}
```

### PATCH /api/jobs/:id

Cập nhật job (ADMIN, RECRUITER)

```json
Request:
{
  "status": "OPEN"  // Publish job
}

Response: 200
{
  "id": "uuid",
  "status": "OPEN"
}
```

### DELETE /api/jobs/:id

Xóa job (ADMIN)

---

## 3. Application Management APIs

### POST /api/jobs/:jobId/apply

Nộp hồ sơ (CANDIDATE hoặc anonymous)

```
Content-Type: multipart/form-data

FormData:
  cv: File (PDF/DOCX, max 5MB)
  coverLetter: String (optional)
  candidateEmail: String (if not logged in)
  candidateName: String (if not logged in)

Response: 201
{
  "id": "uuid",
  "jobId": "uuid",
  "status": "PENDING",
  "appliedAt": "2025-11-22T10:00:00Z"
}
```

### GET /api/applications

Lấy danh sách hồ sơ (RECRUITER: all, CANDIDATE: own)

```
Query params:
  ?jobId=uuid           // Filter by job
  &status=SCREENING     // Filter by status
  &page=1
  &limit=20
  &sortBy=aiScore       // Sort by score (desc)

Response: 200
{
  "applications": [
    {
      "id": "uuid",
      "candidate": {
        "name": "Nguyen Van A",
        "email": "a@example.com"
      },
      "job": {
        "title": "Senior Java Developer"
      },
      "status": "SCREENING",
      "aiScore": 85.5,
      "appliedAt": "2025-11-22T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1
}
```

### GET /api/applications/:id

Chi tiết hồ sơ

```json
Response: 200
{
  "id": "uuid",
  "candidate": {
    "id": "uuid",
    "name": "Nguyen Van A",
    "email": "a@example.com",
    "phone": "0901234567"
  },
  "job": {
    "id": "uuid",
    "title": "Senior Java Developer"
  },
  "cvUrl": "https://blob.vercel-storage.com/cv-uuid.pdf",
  "coverLetter": "I am interested...",
  "status": "INTERVIEW",
  "aiScore": 85.5,
  "aiAnalysis": {
    "matchingSkills": ["Java", "Spring Boot", "MySQL"],
    "missingSkills": ["Kubernetes"],
    "recommendation": "accept",
    "feedback": "Strong Java background..."
  },
  "screenerNotes": "Good candidate",
  "appliedAt": "2025-11-22T10:00:00Z"
}
```

### PATCH /api/applications/:id

Cập nhật trạng thái (RECRUITER)

```json
Request:
{
  "status": "INTERVIEW",
  "screenerNotes": "Move to interview"
}

Response: 200
{
  "id": "uuid",
  "status": "INTERVIEW"
}
```

### POST /api/applications/:id/screen

Trigger AI screening (RECRUITER)

```json
Response: 200
{
  "message": "CV screening started",
  "jobId": "queue-job-id"
}
```

### POST /api/jobs/:jobId/screen-batch

Batch AI screening (RECRUITER)

```
FormData:
  cvs: File[] (multiple CVs)

Response: 202
{
  "message": "100 CVs queued for screening",
  "jobIds": ["job-1", "job-2", ...]
}
```

---

## 4. Interview Management APIs

### POST /api/interviews

Tạo lịch phỏng vấn (RECRUITER)

```json
Request:
{
  "applicationId": "uuid",
  "scheduledAt": "2025-11-25T14:00:00Z",
  "duration": 60,
  "type": "VIDEO",
  "location": "https://meet.google.com/abc-defg-hij",
  "interviewers": [
    {
      "userId": "uuid",
      "role": "LEAD"
    },
    {
      "userId": "uuid",
      "role": "MEMBER"
    }
  ]
}

Response: 201
{
  "id": "uuid",
  "scheduledAt": "2025-11-25T14:00:00Z",
  "status": "SCHEDULED"
}
```

### GET /api/interviews

Lấy danh sách phỏng vấn

```
Query params:
  ?date=2025-11-25      // Filter by date
  &status=SCHEDULED
  &interviewerId=uuid   // My interviews

Response: 200
{
  "interviews": [
    {
      "id": "uuid",
      "application": {
        "candidate": {
          "name": "Nguyen Van A"
        },
        "job": {
          "title": "Senior Java Developer"
        }
      },
      "scheduledAt": "2025-11-25T14:00:00Z",
      "duration": 60,
      "type": "VIDEO",
      "location": "https://meet.google.com/...",
      "status": "SCHEDULED",
      "interviewers": [
        {
          "name": "Interviewer 1",
          "role": "LEAD"
        }
      ]
    }
  ]
}
```

### GET /api/interviews/:id

Chi tiết phỏng vấn

### PATCH /api/interviews/:id

Cập nhật (reschedule, cancel)

```json
Request:
{
  "scheduledAt": "2025-11-26T14:00:00Z",
  "status": "RESCHEDULED"
}
```

### POST /api/interviews/:id/feedback

Submit feedback (INTERVIEWER)

```json
Request:
{
  "feedback": "Candidate has good technical skills...",
  "score": 85,
  "result": "PASS"
}

Response: 200
{
  "message": "Feedback submitted"
}
```

---

## 5. Recruitment Result APIs

### POST /api/results

Tạo kết quả cuối (RECRUITER, ADMIN)

```json
Request:
{
  "applicationId": "uuid",
  "finalDecision": "OFFER",
  "salary": "1500 USD",
  "startDate": "2025-12-01",
  "notes": "Excellent candidate"
}

Response: 201
{
  "id": "uuid",
  "offerLetterUrl": "https://storage.../offer-letter-uuid.pdf"
}
```

### GET /api/results/:applicationId

Lấy kết quả của application

### POST /api/results/:id/send-email

Gửi email kết quả đến ứng viên

```json
Response: 200
{
  "message": "Email sent successfully"
}
```

---

## 6. Notification APIs

### GET /api/notifications

Lấy thông báo của user

```
Query params:
  ?isRead=false   // Unread only

Response: 200
{
  "notifications": [
    {
      "id": "uuid",
      "type": "EMAIL",
      "title": "Application status update",
      "content": "Your application for Senior Java...",
      "isRead": false,
      "sentAt": "2025-11-22T10:00:00Z"
    }
  ],
  "unreadCount": 5
}
```

### PATCH /api/notifications/:id/read

Đánh dấu đã đọc

### POST /api/notifications/read-all

Đánh dấu tất cả đã đọc

---

## 7. Report & Analytics APIs

### GET /api/reports/dashboard

Dashboard tổng quan (ADMIN, RECRUITER)

```json
Response: 200
{
  "stats": {
    "totalJobs": 20,
    "activeJobs": 12,
    "totalApplications": 500,
    "pendingApplications": 150,
    "interviewsThisWeek": 25,
    "offersThisMonth": 10
  },
  "applicationsByStatus": [
    { "status": "PENDING", "count": 150 },
    { "status": "SCREENING", "count": 100 },
    { "status": "INTERVIEW", "count": 80 }
  ],
  "topJobs": [
    {
      "jobTitle": "Senior Java Developer",
      "applicationsCount": 45
    }
  ]
}
```

### GET /api/reports/job/:jobId

Báo cáo chi tiết job

```json
Response: 200
{
  "job": {
    "title": "Senior Java Developer",
    "totalApplications": 45,
    "avgAiScore": 65.5,
    "statusBreakdown": {
      "PENDING": 10,
      "SCREENING": 15,
      "INTERVIEW": 12,
      "OFFER": 5,
      "REJECTED": 3
    }
  },
  "topCandidates": [
    {
      "name": "Nguyen Van A",
      "aiScore": 95,
      "status": "OFFER"
    }
  ]
}
```

### GET /api/reports/export

Export báo cáo (CSV/PDF)

```
Query params:
  ?format=csv
  &jobId=uuid
  &startDate=2025-11-01
  &endDate=2025-11-30

Response: File download
```

---

## 8. Admin APIs

### GET /api/admin/users

Quản lý users (ADMIN only)

```json
Response: 200
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "RECRUITER",
      "createdAt": "2025-11-01T00:00:00Z"
    }
  ]
}
```

### PATCH /api/admin/users/:id

Cập nhật role user

```json
Request:
{
  "role": "ADMIN"
}
```

### DELETE /api/admin/users/:id

Xóa user

---

## Error Responses

Tất cả errors trả về format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {} // optional
}
```

### Status Codes

- `200` OK
- `201` Created
- `204` No Content
- `400` Bad Request (validation error)
- `401` Unauthorized (no token / invalid token)
- `403` Forbidden (insufficient permissions)
- `404` Not Found
- `409` Conflict (duplicate resource)
- `429` Too Many Requests (rate limit)
- `500` Internal Server Error

### Error Codes

```typescript
enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  DUPLICATE_EMAIL = "DUPLICATE_EMAIL",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  INVALID_FILE_TYPE = "INVALID_FILE_TYPE",
  JOB_CLOSED = "JOB_CLOSED",
  ALREADY_APPLIED = "ALREADY_APPLIED",
  INTERVIEW_CONFLICT = "INTERVIEW_CONFLICT",
}
```

---

## Rate Limiting

- **Public endpoints:** 30 requests/minute
- **Authenticated:** 100 requests/minute
- **Admin:** 200 requests/minute

Headers in response:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1637654321
```
