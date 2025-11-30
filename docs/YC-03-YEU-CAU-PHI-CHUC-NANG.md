# PHẦN 3: YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)

## ĐỀ TÀI: XÂY DỰNG HỆ THỐNG TUYỂN DỤNG NHÂN SỰ

---

## 3.1. Tổng Quan Yêu Cầu Phi Chức Năng

Yêu cầu phi chức năng (NFR) xác định **chất lượng** của hệ thống, không phải **chức năng** cụ thể. Bao gồm 5 nhóm chính:

```
┌─────────────────────────────────────────────────┐
│         NON-FUNCTIONAL REQUIREMENTS             │
├─────────────────────────────────────────────────┤
│  NFR1: Authentication & Authorization (Security)│
│  NFR2: Performance & Scalability                │
│  NFR3: Reliability & Availability               │
│  NFR4: Usability & Accessibility                │
│  NFR5: Maintainability & Observability          │
└─────────────────────────────────────────────────┘
```

---

## NFR1: Xác Thực và Phân Quyền (Authentication & Authorization)

### 3.1.1. Mô tả

Đảm bảo chỉ người dùng hợp lệ mới truy cập được hệ thống và chỉ thực hiện các hành động được phép.

### 3.1.2. Yêu cầu chi tiết

#### NFR1.1: Authentication (Xác thực)

**Mục tiêu**: Xác minh danh tính người dùng

**Kỹ thuật**:

- **JWT (JSON Web Token)** cho stateless authentication
- **Access token**: Expires sau 1 giờ
- **Refresh token**: Expires sau 7 ngày, lưu trong httpOnly cookie
- **Password hashing**: bcrypt với salt rounds = 12
- **Email verification**: Token expires sau 24 giờ

**Security measures**:

```python
# Password policy
MIN_LENGTH = 8
REQUIRE_UPPERCASE = True
REQUIRE_LOWERCASE = True
REQUIRE_DIGIT = True
REQUIRE_SPECIAL_CHAR = True
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION = 15  # minutes
```

**Token structure**:

```javascript
// Access token payload
{
  "user_id": 123,
  "email": "user@example.com",
  "role": "recruiter",
  "exp": 1735560000,  // 1 hour from issue
  "iat": 1735556400,
  "token_type": "access"
}

// Refresh token payload
{
  "user_id": 123,
  "exp": 1736160000,  // 7 days from issue
  "iat": 1735556400,
  "token_type": "refresh"
}
```

**Acceptance criteria**:

- ✅ Password được hash trước khi lưu database
- ✅ Token được sign với secret key an toàn
- ✅ Tự động logout sau khi access token hết hạn
- ✅ Refresh token chỉ được dùng để lấy access token mới
- ✅ Khóa tài khoản sau 5 lần đăng nhập sai

---

#### NFR1.2: Authorization (Phân quyền)

**Mục tiêu**: Kiểm soát quyền truy cập dựa trên vai trò

**RBAC Matrix** (Role-Based Access Control):

| Resource/Action     | Admin | Recruiter | Interviewer | Candidate |
| ------------------- | ----- | --------- | ----------- | --------- |
| **Users**           |       |           |             |           |
| View all users      | ✅    | ❌        | ❌          | ❌        |
| Create user         | ✅    | ❌        | ❌          | ❌        |
| Update user role    | ✅    | ❌        | ❌          | ❌        |
| Delete user         | ✅    | ❌        | ❌          | ❌        |
| **Jobs**            |       |           |             |           |
| View all jobs       | ✅    | ✅        | ✅          | ✅        |
| Create job          | ✅    | ✅        | ❌          | ❌        |
| Update job          | ✅    | ✅ (own)  | ❌          | ❌        |
| Delete job          | ✅    | ✅ (own)  | ❌          | ❌        |
| **Applications**    |       |           |             |           |
| View all apps       | ✅    | ✅        | ❌          | ❌        |
| View own apps       | ✅    | ✅        | ✅          | ✅        |
| Create app          | ✅    | ❌        | ❌          | ✅        |
| Update app status   | ✅    | ✅        | ❌          | ❌        |
| AI screening        | ✅    | ✅        | ❌          | ❌        |
| **Interviews**      |       |           |             |           |
| View all interviews | ✅    | ✅        | ❌          | ❌        |
| View assigned       | ✅    | ✅        | ✅          | ✅ (own)  |
| Create interview    | ✅    | ✅        | ❌          | ❌        |
| Submit feedback     | ✅    | ✅        | ✅          | ❌        |
| **Results**         |       |           |             |           |
| Create result       | ✅    | ✅        | ❌          | ❌        |
| View all results    | ✅    | ✅        | ❌          | ❌        |
| View own result     | ✅    | ✅        | ✅          | ✅        |
| Generate offer      | ✅    | ✅        | ❌          | ❌        |

**Implementation (Django)**:

```python
from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'

class IsRecruiter(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['admin', 'recruiter']

class IsInterviewer(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['admin', 'recruiter', 'interviewer']

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

# Usage
@permission_classes([IsAuthenticated, IsRecruiter])
class JobViewSet(viewsets.ModelViewSet):
    # Only authenticated recruiters can access
    pass
```

**Acceptance criteria**:

- ✅ Mỗi API endpoint kiểm tra quyền trước khi xử lý
- ✅ Frontend ẩn UI elements nếu user không có quyền
- ✅ Trả về HTTP 403 Forbidden nếu không đủ quyền
- ✅ Admin có full access mọi tài nguyên
- ✅ User chỉ xem được dữ liệu thuộc về mình (trừ Admin/Recruiter)

---

#### NFR1.3: Data Privacy & Protection

**Mục tiêu**: Bảo vệ thông tin cá nhân ứng viên

**GDPR Compliance**:

- ✅ **Right to access**: Candidate có thể xem tất cả dữ liệu của mình
- ✅ **Right to rectification**: Candidate có thể sửa thông tin cá nhân
- ✅ **Right to erasure**: Candidate có thể yêu cầu xóa dữ liệu (sau khi kết thúc tuyển dụng)
- ✅ **Data portability**: Export dữ liệu dạng JSON/PDF
- ✅ **Consent**: Checkbox đồng ý xử lý dữ liệu khi đăng ký

**Sensitive data handling**:

```python
# Encrypt sensitive fields
from django.db import models
from encrypted_model_fields.fields import EncryptedCharField

class Application(models.Model):
    # Regular fields
    job = models.ForeignKey(Job)
    candidate = models.ForeignKey(User)

    # Encrypted fields (SSN, ID number, etc.)
    national_id = EncryptedCharField(max_length=20, null=True)
    passport_number = EncryptedCharField(max_length=20, null=True)

    # CV stored in secure cloud storage with signed URLs
    cv_url = models.URLField()
```

**Data retention policy**:

- Active applications: Retain indefinitely
- Rejected applications: Retain for 1 year (for analytics)
- After 1 year: Auto-anonymize personal data
- User can request immediate deletion

**Access logging**:

```python
# Log every access to sensitive data
class ApplicationAccessLog(models.Model):
    application = models.ForeignKey(Application)
    accessed_by = models.ForeignKey(User)
    accessed_at = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=50)  # 'view', 'download_cv', 'update'
    ip_address = models.GenericIPAddressField()
```

**Acceptance criteria**:

- ✅ Passwords không bao giờ được lưu plaintext
- ✅ CV và tài liệu chỉ accessible qua signed URLs (expires 1 hour)
- ✅ Sensitive fields được encrypt at rest
- ✅ HTTPS bắt buộc cho mọi requests
- ✅ API không trả về full SSN/passport (chỉ last 4 digits)

---

## NFR2: Hiệu Năng và Khả Năng Mở Rộng (Performance & Scalability)

### 3.2.1. Mô tả

Hệ thống phải đáp ứng nhanh, xử lý được lượng lớn người dùng đồng thời và dễ dàng scale.

### 3.2.2. Yêu cầu chi tiết

#### NFR2.1: Response Time

**Mục tiêu**: Người dùng không cảm thấy chờ đợi

**Performance targets**:
| Action | Max Response Time | Target |
|--------|-------------------|--------|
| Page load (initial) | 3s | < 2s |
| API calls (simple) | 500ms | < 200ms |
| API calls (complex) | 2s | < 1s |
| AI CV screening | 30s | < 20s |
| Database queries | 100ms | < 50ms |
| Search results | 1s | < 500ms |

**Optimization techniques**:

1. **Database optimization**:

```python
# Add indexes on frequently queried fields
class Application(models.Model):
    job = models.ForeignKey(Job, db_index=True)
    candidate = models.ForeignKey(User, db_index=True)
    status = models.CharField(max_length=20, db_index=True)
    ai_score = models.IntegerField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=['job', 'status']),
            models.Index(fields=['candidate', 'created_at']),
            models.Index(fields=['-ai_score']),  # Descending
        ]
```

2. **Query optimization**:

```python
# Bad: N+1 query problem
applications = Application.objects.filter(job_id=123)
for app in applications:
    print(app.candidate.name)  # Extra query for each candidate

# Good: Use select_related
applications = Application.objects.filter(job_id=123).select_related('candidate', 'job')
for app in applications:
    print(app.candidate.name)  # No extra queries
```

3. **Caching**:

```python
from django.core.cache import cache

# Cache frequently accessed data
def get_active_jobs():
    jobs = cache.get('active_jobs')
    if not jobs:
        jobs = Job.objects.filter(status='OPEN').select_related('recruiter')
        cache.set('active_jobs', jobs, timeout=300)  # 5 minutes
    return jobs
```

4. **Pagination**:

```python
# Always paginate large lists
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
```

**Acceptance criteria**:

- ✅ 95% API calls respond < 500ms (p95 latency)
- ✅ Dashboard loads < 2s on 4G connection
- ✅ AI screening completes < 30s per CV
- ✅ Search returns results < 1s for 10,000+ records

---

#### NFR2.2: Throughput

**Mục tiêu**: Xử lý được nhiều requests đồng thời

**Targets**:

- **Concurrent users**: 500 users online đồng thời
- **Requests per second**: 1,000 RPS (peak load)
- **Database connections**: Max 100 concurrent connections
- **Background jobs**: Process 100 CVs/minute

**Load testing** (using Locust):

```python
from locust import HttpUser, task, between

class RecruitmentUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def view_jobs(self):
        self.client.get("/api/jobs/")

    @task(2)
    def view_applications(self):
        self.client.get("/api/applications/")

    @task(1)
    def submit_application(self):
        self.client.post("/api/applications/", json={
            "job_id": 123,
            "cv_url": "https://storage.../cv.pdf"
        })
```

**Targets**:

- 500 concurrent users with avg response time < 1s
- Error rate < 1%
- No database connection pool exhaustion

---

#### NFR2.3: Scalability

**Mục tiêu**: Dễ dàng tăng capacity khi cần

**Horizontal scaling**:

```
┌─────────────┐
│  Load       │
│  Balancer   │
└──────┬──────┘
       │
   ┌───┴───┬───────┬───────┐
   │       │       │       │
┌──▼──┐ ┌──▼──┐ ┌──▼──┐ ┌──▼──┐
│Web  │ │Web  │ │Web  │ │Web  │
│App 1│ │App 2│ │App 3│ │App 4│
└──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘
   │       │       │       │
   └───┬───┴───────┴───────┘
       │
   ┌───▼────────┐
   │ PostgreSQL │
   │  (Shared)  │
   └────────────┘
```

**Stateless design**:

- No session stored on server (use JWT)
- All state in database/cache
- Any web server can handle any request

**Database scaling**:

1. **Read replicas**: Route read queries to replicas
2. **Connection pooling**: PgBouncer (max 100 connections)
3. **Query optimization**: Proper indexes, avoid N+1

**Background jobs scaling**:

```
Celery Workers (Auto-scale):
- Min workers: 2
- Max workers: 10
- Scale up when queue > 50 jobs
- Scale down when idle > 5 minutes
```

**Acceptance criteria**:

- ✅ Add more web servers without code changes
- ✅ Database handles 1000+ connections
- ✅ Background jobs auto-scale based on queue length
- ✅ No single point of failure

---

#### NFR2.4: Resource Utilization

**Mục tiêu**: Sử dụng tài nguyên hiệu quả

**Targets**:
| Resource | Normal Load | Peak Load | Max |
|----------|-------------|-----------|-----|
| CPU | < 50% | < 70% | 80% |
| Memory | < 60% | < 75% | 85% |
| Database | < 50% | < 70% | 80% |
| Storage | - | - | 100GB |

**Monitoring**:

```python
# Prometheus metrics
from prometheus_client import Counter, Histogram

request_count = Counter('http_requests_total', 'Total HTTP requests')
request_duration = Histogram('http_request_duration_seconds', 'HTTP request duration')

@request_duration.time()
def process_request(request):
    request_count.inc()
    # Handle request
```

---

## NFR3: Độ Tin Cậy và Khả Dụng (Reliability & Availability)

### 3.3.1. Mô tả

Hệ thống hoạt động ổn định, ít downtime, tự động phục hồi sau lỗi.

### 3.3.2. Yêu cầu chi tiết

#### NFR3.1: Uptime & Availability

**Mục tiêu**: Hệ thống luôn sẵn sàng phục vụ

**Target SLA** (Service Level Agreement):

- **Uptime**: 99.5% (~ 3.6 hours downtime/month)
- **Planned maintenance**: < 4 hours/month (outside business hours)
- **Unplanned downtime**: < 1 hour/month

**High availability setup**:

```
┌───────────────────────────────────┐
│  CDN (Cloudflare)                 │
│  - Static assets                  │
│  - DDoS protection                │
└──────────┬────────────────────────┘
           │
┌──────────▼────────────────────────┐
│  Load Balancer (HA Proxy)         │
│  - Health checks every 10s        │
│  - Auto failover                  │
└──────────┬────────────────────────┘
           │
      ┌────┴────┐
┌─────▼────┐ ┌──▼──────┐
│  Web1    │ │  Web2   │  (Active-Active)
│  Primary │ │  Standby│
└─────┬────┘ └──┬──────┘
      │         │
      └────┬────┘
           │
┌──────────▼────────────────────────┐
│  PostgreSQL (Neon Cloud)          │
│  - Automatic backups              │
│  - Point-in-time recovery         │
└───────────────────────────────────┘
```

**Health checks**:

```python
# /api/health/ endpoint
def health_check(request):
    checks = {
        "database": check_database(),
        "redis": check_redis(),
        "celery": check_celery(),
        "storage": check_storage(),
    }

    if all(checks.values()):
        return JsonResponse({"status": "healthy", "checks": checks}, status=200)
    else:
        return JsonResponse({"status": "unhealthy", "checks": checks}, status=503)
```

**Acceptance criteria**:

- ✅ Hệ thống up >= 99.5% mỗi tháng
- ✅ Health check endpoint responds < 100ms
- ✅ Load balancer tự động remove unhealthy nodes
- ✅ Planned maintenance được thông báo trước 48h

---

#### NFR3.2: Error Handling

**Mục tiêu**: Xử lý lỗi gracefully, không crash application

**Error types & handling**:

1. **Validation errors** (400 Bad Request):

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "details": {
    "email": ["Enter a valid email address"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

2. **Authentication errors** (401 Unauthorized):

```json
{
  "error": "AUTHENTICATION_ERROR",
  "message": "Invalid credentials"
}
```

3. **Permission errors** (403 Forbidden):

```json
{
  "error": "PERMISSION_DENIED",
  "message": "You do not have permission to perform this action"
}
```

4. **Not found errors** (404):

```json
{
  "error": "NOT_FOUND",
  "message": "Job with id 999 not found"
}
```

5. **Server errors** (500 Internal Server Error):

```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred. Please try again later.",
  "error_id": "ERR_2024_11_30_1234" // For support tracking
}
```

**Global error handler** (Django):

```python
from rest_framework.views import exception_handler
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        # Unhandled exception
        error_id = generate_error_id()
        logger.error(f"Unhandled exception [{error_id}]: {exc}", exc_info=True)

        return Response({
            "error": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred",
            "error_id": error_id
        }, status=500)

    return response
```

**Retry logic for external services**:

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10)
)
def call_gemini_api(prompt):
    response = requests.post(GEMINI_API_URL, json={"prompt": prompt})
    response.raise_for_status()
    return response.json()
```

**Acceptance criteria**:

- ✅ Không có uncaught exceptions (500 errors < 0.1%)
- ✅ Error responses có format nhất quán
- ✅ Sensitive info không bị leak trong error messages
- ✅ External API failures được retry tối đa 3 lần
- ✅ All errors được log với stack trace

---

#### NFR3.3: Data Integrity

**Mục tiêu**: Dữ liệu luôn đúng, nhất quán

**Database constraints**:

```sql
-- Unique constraints
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
ALTER TABLE applications ADD CONSTRAINT unique_application UNIQUE (candidate_id, job_id);

-- Foreign key constraints (ON DELETE behaviors)
ALTER TABLE applications
  ADD CONSTRAINT fk_job
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;

-- Check constraints
ALTER TABLE jobs
  ADD CONSTRAINT check_deadline
  CHECK (application_deadline >= created_at);

ALTER TABLE applications
  ADD CONSTRAINT check_ai_score
  CHECK (ai_score >= 0 AND ai_score <= 100);
```

**Transactions**:

```python
from django.db import transaction

@transaction.atomic
def create_interview_with_panel(interview_data, interviewer_ids):
    # All or nothing: if any step fails, rollback everything
    interview = Interview.objects.create(**interview_data)

    for interviewer_id in interviewer_ids:
        InterviewPanel.objects.create(
            interview=interview,
            interviewer_id=interviewer_id
        )

    # Update application status
    interview.application.status = 'INTERVIEW_SCHEDULED'
    interview.application.save()

    return interview
```

**Backup & recovery**:

- **Automatic backups**: Daily at 2 AM UTC
- **Retention**: 30 days
- **Point-in-time recovery**: Restore to any point in last 7 days
- **Backup testing**: Monthly restore drill

**Acceptance criteria**:

- ✅ No data loss even if server crashes
- ✅ Foreign key constraints prevent orphaned records
- ✅ Transactions ensure atomicity (all or nothing)
- ✅ Backups tested monthly
- ✅ Can restore database in < 1 hour

---

## NFR4: Khả Năng Sử Dụng và Truy Cập (Usability & Accessibility)

### 3.4.1. Mô tả

Giao diện dễ dùng, trực quan, accessible cho mọi người.

### 3.4.2. Yêu cầu chi tiết

#### NFR4.1: User Experience

**Mục tiêu**: Người dùng hoàn thành tasks dễ dàng

**UX principles**:

1. **Consistency**: Cùng 1 action có cùng 1 cách thực hiện
2. **Feedback**: Mọi action đều có phản hồi (success/error message)
3. **Simplicity**: Ít clicks nhất để đạt mục tiêu
4. **Error prevention**: Validate input real-time, confirm destructive actions

**Task completion metrics**:
| Task | Max Steps | Max Time |
|------|-----------|----------|
| Register account | 3 | 2 min |
| Submit application | 4 | 5 min |
| Create job posting | 5 | 10 min |
| Schedule interview | 4 | 3 min |
| Submit feedback | 3 | 5 min |

**Acceptance criteria**:

- ✅ New user có thể đăng ký và nộp hồ sơ trong < 10 phút
- ✅ Recruiter có thể tạo job posting trong < 15 phút
- ✅ Mọi form đều có validation và error hints
- ✅ Loading states cho mọi async actions
- ✅ Confirmation dialogs cho destructive actions (delete, reject)

---

#### NFR4.2: Responsive Design

**Mục tiêu**: Giao diện đẹp và hoạt động tốt trên mọi thiết bị

**Breakpoints** (Tailwind CSS):

```css
/* Mobile first approach */
.container {
  padding: 1rem; /* Mobile: 16px */
}

@media (min-width: 640px) {
  /* Tablet */
  .container {
    padding: 1.5rem;
  }
}

@media (min-width: 1024px) {
  /* Desktop */
  .container {
    padding: 2rem;
  }
}

@media (min-width: 1280px) {
  /* Large desktop */
  .container {
    max-width: 1280px;
    margin: 0 auto;
  }
}
```

**Device support**:

- **Mobile**: 320px - 640px (iPhone SE to iPhone Pro Max)
- **Tablet**: 640px - 1024px (iPad)
- **Desktop**: 1024px+ (Laptop, desktop monitors)

**Touch-friendly**:

- Buttons min 44x44px (iOS guideline)
- Adequate spacing between clickable elements (min 8px)
- Swipe gestures cho mobile (optional)

**Acceptance criteria**:

- ✅ Layout không bị vỡ trên viewport 320px - 1920px
- ✅ Touch targets >= 44x44px
- ✅ Text readable without zoom (font-size >= 16px)
- ✅ Images responsive và optimized (lazy loading)

---

#### NFR4.3: Accessibility (WCAG 2.1 Level AA)

**Mục tiêu**: Người khuyết tật có thể sử dụng hệ thống

**WCAG compliance checklist**:

1. **Perceivable**:

   - ✅ Alt text cho tất cả images
   - ✅ Color contrast ratio >= 4.5:1 (text vs background)
   - ✅ Text can be resized up to 200% without loss of functionality

2. **Operable**:

   - ✅ All functionality available via keyboard
   - ✅ Focus visible (outline on focused elements)
   - ✅ No keyboard traps
   - ✅ Skip to main content link

3. **Understandable**:

   - ✅ Error messages clear and helpful
   - ✅ Form labels always visible
   - ✅ Consistent navigation across pages

4. **Robust**:
   - ✅ Valid HTML5 markup
   - ✅ ARIA labels for screen readers
   - ✅ Compatible with assistive technologies

**Implementation examples**:

```html
<!-- Good: Accessible form -->
<form>
  <label for="email">Email Address</label>
  <input
    type="email"
    id="email"
    name="email"
    aria-required="true"
    aria-describedby="email-error"
  />
  <span id="email-error" role="alert" class="error">
    Please enter a valid email
  </span>
</form>

<!-- Good: Accessible button -->
<button aria-label="Submit application" aria-busy="false">
  <span>Submit</span>
  <svg aria-hidden="true"><use xlink:href="#icon-arrow" /></svg>
</button>

<!-- Good: Skip to main content -->
<a href="#main-content" class="skip-link">Skip to main content</a>
<main id="main-content">...</main>
```

**Testing tools**:

- axe DevTools (automated testing)
- NVDA/JAWS (screen reader testing)
- Keyboard-only navigation testing

**Acceptance criteria**:

- ✅ Pass WCAG 2.1 Level AA automated tests (axe)
- ✅ All interactive elements keyboard accessible
- ✅ Screen reader can navigate entire application
- ✅ Color contrast >= 4.5:1 for all text

---

#### NFR4.4: Internationalization (i18n)

**Mục tiêu**: Hỗ trợ tiếng Việt và tiếng Anh

**Languages**:

- Vietnamese (default)
- English

**Implementation** (React i18next):

```javascript
// translations/vi.json
{
  "common": {
    "submit": "Nộp hồ sơ",
    "cancel": "Hủy",
    "save": "Lưu"
  },
  "auth": {
    "login": "Đăng nhập",
    "register": "Đăng ký",
    "email": "Địa chỉ email",
    "password": "Mật khẩu"
  }
}

// translations/en.json
{
  "common": {
    "submit": "Submit Application",
    "cancel": "Cancel",
    "save": "Save"
  },
  "auth": {
    "login": "Log In",
    "register": "Sign Up",
    "email": "Email Address",
    "password": "Password"
  }
}

// Usage in component
import { useTranslation } from 'react-i18next';

function LoginForm() {
  const { t } = useTranslation();

  return (
    <form>
      <label>{t('auth.email')}</label>
      <input type="email" />
      <button>{t('auth.login')}</button>
    </form>
  );
}
```

**Date/time formatting**:

```javascript
// Vietnamese: 30/11/2024, 14:00
// English: Nov 30, 2024, 2:00 PM

import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";

const locale = language === "vi" ? vi : enUS;
format(new Date(), "PPpp", { locale });
```

**Acceptance criteria**:

- ✅ All UI text có bản dịch đầy đủ
- ✅ User có thể switch language (lưu preference)
- ✅ Date/time/currency format theo locale
- ✅ Email templates có 2 ngôn ngữ

---

## NFR5: Khả Năng Bảo Trì và Quan Sát (Maintainability & Observability)

### 3.5.1. Mô tả

Code dễ đọc, dễ sửa, dễ mở rộng. Monitoring và logging đầy đủ.

### 3.5.2. Yêu cầu chi tiết

#### NFR5.1: Code Quality

**Mục tiêu**: Code sạch, tuân thủ best practices

**Coding standards**:

**Python (Backend)**:

- Follow PEP 8 style guide
- Type hints cho functions
- Docstrings cho classes và functions
- Max line length: 88 chars (Black formatter)
- Max function length: 50 lines
- Max function complexity: 10 (cyclomatic complexity)

```python
from typing import List, Optional
from datetime import datetime

def get_active_jobs(
    department: Optional[str] = None,
    employment_type: Optional[str] = None,
    limit: int = 20
) -> List[Job]:
    """
    Retrieve active job postings with optional filters.

    Args:
        department: Filter by department name (e.g., "Engineering")
        employment_type: Filter by type (e.g., "FULL_TIME")
        limit: Maximum number of jobs to return (default: 20)

    Returns:
        List of active Job objects matching the filters

    Raises:
        ValueError: If limit is negative or > 100
    """
    if limit < 0 or limit > 100:
        raise ValueError("Limit must be between 0 and 100")

    queryset = Job.objects.filter(status='OPEN')

    if department:
        queryset = queryset.filter(department=department)

    if employment_type:
        queryset = queryset.filter(employment_type=employment_type)

    return queryset[:limit]
```

**JavaScript (Frontend)**:

- ESLint + Prettier
- TypeScript (type safety)
- Functional components với hooks
- Max component length: 200 lines
- Props có PropTypes/TypeScript types

```typescript
interface ApplicationCardProps {
  application: Application;
  onAdvance: (id: number) => void;
  onReject: (id: number) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onAdvance,
  onReject,
}) => {
  // Component implementation
};
```

**Linting & formatting**:

```bash
# Backend
black .  # Auto-format
flake8 .  # Lint
mypy .  # Type checking

# Frontend
npm run lint  # ESLint
npm run format  # Prettier
npm run type-check  # TypeScript
```

**Acceptance criteria**:

- ✅ 0 linting errors
- ✅ Test coverage >= 80%
- ✅ All functions have docstrings/JSDoc
- ✅ No functions > 50 lines
- ✅ No code duplication (DRY principle)

---

#### NFR5.2: Testing

**Mục tiêu**: High test coverage, prevent regressions

**Test pyramid**:

```
        ┌──────────┐
        │   E2E    │  10% - Full user flows
        └──────────┘
      ┌──────────────┐
      │  Integration │  20% - API endpoints, DB
      └──────────────┘
    ┌──────────────────┐
    │   Unit Tests     │  70% - Functions, utils
    └──────────────────┘
```

**Coverage targets**:

- Overall: >= 80%
- Critical paths (auth, payment): >= 95%
- Utilities: >= 90%
- UI components: >= 70%

**Test types**:

1. **Unit tests** (pytest):

```python
def test_ai_screening_score_calculation():
    """Test that overall score is calculated correctly."""
    scores = {
        'skills_match': 90,
        'experience_match': 80,
        'education_match': 70
    }

    overall = calculate_overall_score(scores)

    # (90 * 0.5) + (80 * 0.3) + (70 * 0.2) = 83
    assert overall == 83
```

2. **Integration tests** (Django TestCase):

```python
class ApplicationAPITest(APITestCase):
    def test_submit_application_requires_auth(self):
        """Unauthenticated users cannot submit applications."""
        response = self.client.post('/api/applications/', {
            'job_id': 123,
            'cv_url': 'https://...'
        })

        self.assertEqual(response.status_code, 401)

    def test_submit_application_success(self):
        """Authenticated candidate can submit application."""
        self.client.force_authenticate(user=self.candidate)

        response = self.client.post('/api/applications/', {
            'job_id': self.job.id,
            'cv_url': 'https://...'
        })

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Application.objects.count(), 1)
```

3. **E2E tests** (Playwright):

```typescript
test("candidate can submit application", async ({ page }) => {
  // Login
  await page.goto("/login");
  await page.fill('[name="email"]', "candidate@test.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');

  // Navigate to job
  await page.goto("/jobs/123");
  await page.click('button:has-text("Apply Now")');

  // Upload CV
  await page.setInputFiles('input[type="file"]', "test-cv.pdf");
  await page.fill('textarea[name="cover_letter"]', "I am interested...");
  await page.click('button:has-text("Submit Application")');

  // Assert success
  await expect(page.locator(".success-message")).toContainText(
    "Application submitted"
  );
});
```

**CI/CD integration**:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run backend tests
        run: |
          pip install -r requirements.txt
          pytest --cov=. --cov-report=xml
      - name: Run frontend tests
        run: |
          npm install
          npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

**Acceptance criteria**:

- ✅ All tests pass on CI/CD
- ✅ Coverage >= 80% overall
- ✅ No failing tests in main branch
- ✅ Tests run in < 5 minutes
- ✅ E2E tests cover critical user flows

---

#### NFR5.3: Logging

**Mục tiêu**: Track all important events for debugging

**Log levels**:

```python
import logging

logger = logging.getLogger(__name__)

# DEBUG: Detailed info for debugging
logger.debug(f"Parsing CV: {cv_url}")

# INFO: General informational messages
logger.info(f"Application {app_id} submitted by user {user_id}")

# WARNING: Something unexpected but not an error
logger.warning(f"AI score below threshold: {score}/100")

# ERROR: An error occurred but app continues
logger.error(f"Failed to send email to {email}", exc_info=True)

# CRITICAL: Serious error, app may not recover
logger.critical(f"Database connection lost")
```

**Structured logging** (JSON format):

```json
{
  "timestamp": "2024-11-30T10:15:30Z",
  "level": "INFO",
  "logger": "applications.views",
  "message": "Application submitted",
  "context": {
    "application_id": 789,
    "candidate_id": 456,
    "job_id": 123,
    "user_agent": "Mozilla/5.0...",
    "ip_address": "192.168.1.1"
  }
}
```

**What to log**:

- ✅ All API requests (endpoint, user, status, duration)
- ✅ Authentication events (login, logout, failed attempts)
- ✅ Business events (application submitted, interview scheduled)
- ✅ External API calls (Gemini, email service)
- ✅ Errors and exceptions (with stack traces)
- ❌ Sensitive data (passwords, tokens, SSN)

**Log retention**:

- Production logs: 90 days
- Development logs: 7 days
- Audit logs (security): 1 year

---

#### NFR5.4: Monitoring & Alerting

**Mục tiêu**: Detect issues before users notice

**Metrics to monitor** (Prometheus):

```python
from prometheus_client import Counter, Histogram, Gauge

# Request metrics
http_requests_total = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
http_request_duration = Histogram('http_request_duration_seconds', 'HTTP request duration')

# Business metrics
applications_submitted = Counter('applications_submitted_total', 'Total applications submitted')
ai_screenings_completed = Counter('ai_screenings_completed_total', 'AI screenings completed')
interviews_scheduled = Counter('interviews_scheduled_total', 'Interviews scheduled')

# System metrics
active_users = Gauge('active_users', 'Number of active users')
celery_queue_length = Gauge('celery_queue_length', 'Number of pending background jobs')
```

**Dashboards** (Grafana):

```
┌───────────────────────────────────────────────┐
│  📊 RECRUITMENT SYSTEM DASHBOARD              │
├───────────────────────────────────────────────┤
│  System Health:                               │
│  CPU: 45% ██████████░░░░░░░░░░                │
│  Memory: 60% ███████████████░░░░░             │
│  Disk: 30% ████████░░░░░░░░░░░░░░             │
│                                               │
│  API Performance:                             │
│  Requests/sec: 150                            │
│  Avg response time: 180ms                     │
│  Error rate: 0.2%                             │
│                                               │
│  Business Metrics (Today):                    │
│  Applications: 45 ▲ +12%                      │
│  AI Screenings: 38 ▲ +8%                      │
│  Interviews: 12 ▼ -5%                         │
│                                               │
│  Background Jobs:                             │
│  Queue length: 5                              │
│  Processing rate: 10 jobs/min                 │
└───────────────────────────────────────────────┘
```

**Alerts** (via email/Slack):
| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| High error rate | > 5% errors for 5 min | Critical | Page on-call engineer |
| Slow responses | p95 latency > 2s for 5 min | High | Investigate immediately |
| Database down | Health check fails 3 times | Critical | Auto-failover + page |
| Disk full | > 90% disk usage | High | Free up space |
| Queue backlog | > 100 pending jobs for 10 min | Medium | Scale up workers |
| Gemini API errors | > 10 failures in 1 min | Medium | Check API status |

**Acceptance criteria**:

- ✅ All critical metrics monitored 24/7
- ✅ Alerts sent within 1 minute of issue
- ✅ Grafana dashboards accessible by team
- ✅ Monthly uptime reports generated
- ✅ Incident response time < 15 minutes

---

## Tổng Kết Yêu Cầu Phi Chức Năng

| NFR  | Tên             | Metrics                           | Priority |
| ---- | --------------- | --------------------------------- | -------- |
| NFR1 | Security        | JWT auth, RBAC, encryption        | Critical |
| NFR2 | Performance     | < 500ms API, 500 concurrent users | High     |
| NFR3 | Reliability     | 99.5% uptime, daily backups       | High     |
| NFR4 | Usability       | WCAG AA, responsive, i18n         | Medium   |
| NFR5 | Maintainability | 80% test coverage, monitoring     | Medium   |

---

_Xem tiếp:_

- **YC-04**: Use Cases chi tiết
- **YC-05**: Quy trình Nghiệp vụ
- **YC-06**: Yêu cầu Kỹ thuật
