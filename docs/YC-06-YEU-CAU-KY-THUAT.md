# PHẦN 6: YÊU CẦU KỸ THUẬT (TECHNICAL REQUIREMENTS)

## ĐỀ TÀI: XÂY DỰNG HỆ THỐNG TUYỂN DỤNG NHÂN SỰ

---

## 6.1. Kiến Trúc Hệ Thống (System Architecture)

### 6.1.1. Tổng Quan Kiến Trúc

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌────────────┐   ┌────────────┐   ┌────────────┐         │
│   │  Admin     │   │ Recruiter  │   │ Candidate  │         │
│   │  Portal    │   │  Portal    │   │  Portal    │         │
│   │  (React)   │   │  (React)   │   │  (React)   │         │
│   └─────┬──────┘   └─────┬──────┘   └─────┬──────┘         │
│         │                 │                 │                │
│         └─────────────────┴─────────────────┘                │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                     API GATEWAY LAYER                        │
├──────────────────────────────────────────────────────────────┤
│   - Authentication (JWT)                                     │
│   - Rate Limiting                                            │
│   - Request Logging                                          │
│   - CORS Handling                                            │
└───────────────────────────┬──────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                    APPLICATION LAYER                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │          Django REST Framework (Backend)            │   │
│   ├─────────────────────────────────────────────────────┤   │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────┐ │   │
│   │  │ Users   │  │  Jobs   │  │  Apps   │  │Reports│ │   │
│   │  │ Module  │  │ Module  │  │ Module  │  │Module │ │   │
│   │  └─────────┘  └─────────┘  └─────────┘  └───────┘ │   │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐            │   │
│   │  │Interview│  │ Results │  │  Notif  │            │   │
│   │  │ Module  │  │ Module  │  │ Module  │            │   │
│   │  └─────────┘  └─────────┘  └─────────┘            │   │
│   └──────────────────────┬───────────────────────────────┘   │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  PostgreSQL  │   │    Redis     │   │    Celery    │
│  (Database)  │   │   (Cache)    │   │   (Tasks)    │
└──────────────┘   └──────────────┘   └──────────────┘
        │
        │
┌───────▼───────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                          │
├───────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Google     │  │    Gmail     │  │  Cloud       │        │
│  │   Gemini AI  │  │    SMTP      │  │  Storage     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└───────────────────────────────────────────────────────────────┘
```

### 6.1.2. Architecture Pattern

**Pattern**: Monolithic với microservices-ready structure

**Rationale**:

- ✅ Đơn giản cho dự án vừa và nhỏ
- ✅ Dễ deploy và maintain
- ✅ Code structure modular, dễ tách thành microservices sau này
- ✅ Shared database giảm complexity

**Future Evolution**:

```
Phase 1 (Current):    Monolith
                      - All modules in one Django app
                      - Single database

Phase 2 (6 months):   Modular Monolith
                      - Django apps as modules
                      - API contracts between modules

Phase 3 (1 year):     Microservices
                      - AI Screening service (separate)
                      - Notification service (separate)
                      - Core API (Django)
```

---

## 6.2. Technology Stack

### 6.2.1. Backend

#### Core Framework

```yaml
Django: 5.0.10
  - Python web framework
  - ORM for database
  - Admin interface
  - Authentication

Django REST Framework: 3.14.0
  - RESTful API
  - Serialization
  - ViewSets và Routers
  - Permission classes
```

#### Database

```yaml
PostgreSQL: 14+
  - Relational database
  - ACID compliance
  - JSON support
  - Full-text search

Provider: Neon (Cloud PostgreSQL)
  - Serverless
  - Auto-scaling
  - Built-in connection pooling
  - Daily backups
```

#### Background Jobs

```yaml
Celery: 5.3+
  - Asynchronous task queue
  - Distributed task processing
  - Retry logic
  - Scheduling

Redis: 7+
  - Message broker for Celery
  - Caching layer
  - Session storage
```

#### Authentication & Security

```yaml
djangorestframework-simplejwt: 5.3+
  - JWT token authentication
  - Token refresh
  - Blacklisting

django-cors-headers: 4.3+
  - CORS configuration
  - Whitelist frontend origins

python-decouple: 3.8
  - Environment variables
  - Secret management
```

#### AI & External APIs

```yaml
google-generativeai: 0.3+
  - Gemini API client
  - CV parsing
  - AI screening

requests: 2.31+
  - HTTP client
  - API calls
```

#### File Processing

```yaml
PyPDF2: 3.0+
  - PDF parsing
  - Text extraction

python-docx: 1.1+
  - DOCX parsing
  - Word document reading

Pillow: 10.1+
  - Image processing
  - Avatar upload
```

#### Testing

```yaml
pytest: 7.4+
  - Unit tests
  - Integration tests

pytest-django: 4.7+
  - Django integration
  - Database fixtures

factory-boy: 3.3+
  - Test data generation
  - Fixtures

coverage: 7.3+
  - Code coverage reporting
```

---

### 6.2.2. Frontend

#### Core Framework

```yaml
React: 18.2+
  - Component-based UI
  - Virtual DOM
  - Hooks API

React Router: 6.20+
  - Client-side routing
  - Protected routes
  - Nested routes
```

#### UI & Styling

```yaml
Tailwind CSS: 3.3+
  - Utility-first CSS
  - Responsive design
  - Custom components

Headless UI: 1.7+
  - Accessible components
  - Dropdown, Modal, Dialog
  - No styling constraints

Heroicons: 2.0+
  - SVG icons
  - Consistent design
```

#### State Management

```yaml
React Context API:
  - Global state (auth, user)
  - Theme management

React Query: 4.36+
  - Server state management
  - Caching
  - Auto refetch
  - Optimistic updates
```

#### Forms & Validation

```yaml
React Hook Form: 7.48+
  - Form management
  - Validation
  - Error handling

Yup: 1.3+
  - Schema validation
  - Custom validators
```

#### HTTP Client

```yaml
Axios: 1.6+
  - HTTP requests
  - Interceptors
  - Request/response transformation
  - Auto JWT token injection
```

#### Charts & Visualization

```yaml
Recharts: 2.10+
  - Line charts
  - Bar charts
  - Pie charts
  - Responsive charts
```

#### Build Tools

```yaml
Vite: 5.0+
  - Fast HMR
  - Optimized builds
  - ES modules

ESLint: 8.54+
  - Code linting
  - Style enforcement

Prettier: 3.1+
  - Code formatting
  - Consistent style
```

---

### 6.2.3. DevOps & Infrastructure

#### Version Control

```yaml
Git: 2.40+
  - Source control
  - Branching strategy: Git Flow

GitHub:
  - Code hosting
  - Pull requests
  - GitHub Actions (CI/CD)
```

#### Containerization

```yaml
Docker: 24+
  - Container runtime
  - Development environment
  - Production deployment

Docker Compose: 2.23+
  - Multi-container setup
  - Local development
  - Service orchestration
```

#### CI/CD

```yaml
GitHub Actions:
  - Automated testing
  - Linting
  - Build & deploy
  - Docker image publishing
```

#### Cloud Services

```yaml
Neon PostgreSQL:
  - Managed database
  - Auto-scaling
  - Backups

Cloudinary / AWS S3:
  - File storage (CV, avatars)
  - CDN delivery
  - Image optimization

Gmail SMTP:
  - Email delivery
  - App passwords
  - SPF/DKIM setup
```

#### Monitoring & Logging

```yaml
Sentry:
  - Error tracking
  - Performance monitoring
  - User feedback

Prometheus + Grafana (Optional):
  - Metrics collection
  - Dashboards
  - Alerting
```

---

## 6.3. Database Design

### 6.3.1. Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │
│ email (unique)  │
│ password        │
│ full_name       │
│ phone           │
│ role            │─┐
│ is_verified     │ │
│ is_active       │ │
│ created_at      │ │
└────────┬────────┘ │
         │          │
         │ 1        │
         │          │
         │ *        │
         │          │
┌────────▼────────┐ │
│      Job        │ │
├─────────────────┤ │
│ id (PK)         │ │
│ recruiter_id(FK)├─┘
│ title           │
│ description     │
│ requirements    │
│ status          │
│ deadline        │
│ created_at      │
└────────┬────────┘
         │
         │ 1
         │
         │ *
         │
┌────────▼────────────┐
│   Application       │
├─────────────────────┤
│ id (PK)             │
│ job_id (FK)         │────────┐
│ candidate_id (FK)   │────┐   │
│ cv_url              │    │   │
│ cover_letter        │    │   │
│ status              │    │   │
│ ai_score            │    │   │
│ screening_result    │    │   │
│ submitted_at        │    │   │
└─────────────────────┘    │   │
                           │   │
         ┌─────────────────┘   │
         │                     │
         │ *                   │ *
         │                     │
┌────────▼────────┐   ┌────────▼────────┐
│   Interview     │   │RecruitmentResult│
├─────────────────┤   ├─────────────────┤
│ id (PK)         │   │ id (PK)         │
│ application(FK) │   │ application(FK) │
│ interview_type  │   │ decision        │
│ scheduled_date  │   │ offered_salary  │
│ location        │   │ offer_letter_url│
│ status          │   │ start_date      │
│ notes           │   │ created_at      │
└────────┬────────┘   └─────────────────┘
         │
         │ 1
         │
         │ *
         │
┌────────▼──────────┐
│ InterviewPanel    │
├───────────────────┤
│ id (PK)           │
│ interview_id (FK) │
│ interviewer_id(FK)│───┐
│ feedback          │   │
│ scores            │   │
│ recommendation    │   │
└───────────────────┘   │
                        │
         ┌──────────────┘
         │
         │ *
         │
         │ (references User)
```

### 6.3.2. Key Tables

#### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Hashed
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'recruiter', 'interviewer', 'candidate')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Jobs Table

```sql
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    recruiter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    employment_type VARCHAR(20) CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN')),
    location VARCHAR(255),
    salary_range VARCHAR(100),
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    responsibilities TEXT,
    benefits TEXT,
    skills_required JSONB,  -- Array of skills
    experience_required VARCHAR(50),
    education_required VARCHAR(100),
    number_of_positions INTEGER DEFAULT 1,
    application_deadline DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'OPEN', 'CLOSED', 'FILLED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_recruiter ON jobs(recruiter_id);
CREATE INDEX idx_jobs_deadline ON jobs(application_deadline);
```

#### Applications Table

```sql
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    cv_url TEXT NOT NULL,
    cover_letter TEXT,
    additional_docs JSONB,  -- Array of URLs
    status VARCHAR(30) DEFAULT 'SUBMITTED' CHECK (status IN (
        'SUBMITTED', 'SCREENING', 'SCREENING_COMPLETED',
        'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED',
        'OFFER_SENT', 'HIRED', 'REJECTED', 'WITHDRAWN'
    )),
    ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 100),
    ai_recommendation VARCHAR(20),
    parsed_cv_data JSONB,
    screening_result JSONB,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, candidate_id)  -- One application per job per candidate
);

CREATE INDEX idx_apps_job ON applications(job_id);
CREATE INDEX idx_apps_candidate ON applications(candidate_id);
CREATE INDEX idx_apps_status ON applications(status);
CREATE INDEX idx_apps_score ON applications(ai_score DESC);
```

#### Interviews Table

```sql
CREATE TABLE interviews (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    interview_type VARCHAR(20) CHECK (interview_type IN ('TECHNICAL', 'HR', 'FINAL')),
    interview_mode VARCHAR(20) CHECK (interview_mode IN ('ONLINE', 'ONSITE')),
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    location TEXT,  -- Meeting room or Zoom link
    notes TEXT,
    status VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN (
        'SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULE_REQUESTED'
    )),
    aggregate_score DECIMAL(3,1),  -- Average of all panel scores
    aggregate_recommendation VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interviews_app ON interviews(application_id);
CREATE INDEX idx_interviews_date ON interviews(scheduled_date);
CREATE INDEX idx_interviews_status ON interviews(status);
```

#### InterviewPanel Table

```sql
CREATE TABLE interview_panels (
    id SERIAL PRIMARY KEY,
    interview_id INTEGER REFERENCES interviews(id) ON DELETE CASCADE,
    interviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    feedback_submitted BOOLEAN DEFAULT FALSE,
    scores JSONB,  -- {technical: 8, communication: 7, ...}
    strengths TEXT,
    weaknesses TEXT,
    recommendation VARCHAR(20) CHECK (recommendation IN (
        'STRONG_HIRE', 'HIRE', 'MAYBE', 'NO_HIRE', 'STRONG_NO_HIRE'
    )),
    comments TEXT,
    submitted_at TIMESTAMP,
    UNIQUE(interview_id, interviewer_id)
);

CREATE INDEX idx_panel_interview ON interview_panels(interview_id);
CREATE INDEX idx_panel_interviewer ON interview_panels(interviewer_id);
```

---

## 6.4. API Design

### 6.4.1. RESTful API Conventions

**Base URL**: `https://api.recruitment.example.com/api/v1/`

**Authentication**: JWT Bearer token in `Authorization` header

**Response Format**:

```json
// Success (200, 201)
{
  "data": { ... },
  "message": "Operation successful"
}

// Error (4xx, 5xx)
{
  "error": "ERROR_CODE",
  "message": "Human-readable message",
  "details": { ... }  // Optional
}
```

### 6.4.2. Key Endpoints

#### Authentication

```
POST   /auth/register/              # Register new user
POST   /auth/login/                 # Login (get tokens)
POST   /auth/refresh/               # Refresh access token
POST   /auth/logout/                # Logout (blacklist token)
POST   /auth/verify-email/          # Verify email with token
POST   /auth/forgot-password/       # Request password reset
POST   /auth/reset-password/        # Reset password with token
```

#### Users

```
GET    /users/                      # List users (Admin only)
GET    /users/{id}/                 # Get user detail
PUT    /users/{id}/                 # Update user
DELETE /users/{id}/                 # Delete user (soft delete)
GET    /users/me/                   # Get current user profile
PUT    /users/me/                   # Update current user profile
```

#### Jobs

```
GET    /jobs/                       # List jobs (with filters)
POST   /jobs/                       # Create job (Recruiter)
GET    /jobs/{id}/                  # Get job detail
PUT    /jobs/{id}/                  # Update job
DELETE /jobs/{id}/                  # Delete job (soft delete)
GET    /jobs/{id}/applications/     # Get all applications for job
POST   /jobs/{id}/close/            # Close job posting
```

#### Applications

```
GET    /applications/               # List applications (filtered by role)
POST   /applications/               # Submit application
GET    /applications/{id}/          # Get application detail
PUT    /applications/{id}/          # Update application
POST   /applications/{id}/screen/   # Trigger AI screening
POST   /applications/{id}/advance/  # Advance to next stage
POST   /applications/{id}/reject/   # Reject application
GET    /applications/{id}/timeline/ # Get status history
```

#### Interviews

```
GET    /interviews/                 # List interviews
POST   /interviews/                 # Create interview
GET    /interviews/{id}/            # Get interview detail
PUT    /interviews/{id}/            # Update interview
DELETE /interviews/{id}/            # Cancel interview
POST   /interviews/{id}/reschedule/ # Reschedule interview
POST   /interviews/{id}/feedback/   # Submit feedback (Interviewer)
```

#### Reports

```
GET    /reports/dashboard/          # Dashboard overview
GET    /reports/recruitment-funnel/ # Funnel analysis
GET    /reports/time-to-hire/       # Time metrics
GET    /reports/source-of-hire/     # Source analysis
POST   /reports/export/             # Export report (PDF/Excel)
```

#### Notifications

```
GET    /notifications/              # List notifications
GET    /notifications/unread-count/ # Get unread count
POST   /notifications/{id}/read/    # Mark as read
POST   /notifications/mark-all-read/# Mark all as read
```

### 6.4.3. Example API Call

**Request**:

```http
POST /api/v1/applications/ HTTP/1.1
Host: api.recruitment.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "job_id": 123,
  "cv_url": "https://storage.example.com/cv/456.pdf",
  "cover_letter": "I am very interested in this position..."
}
```

**Response**:

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "data": {
    "id": 789,
    "job_id": 123,
    "candidate_id": 456,
    "status": "SUBMITTED",
    "submitted_at": "2024-11-30T10:00:00Z",
    "tracking_url": "https://recruitment.example.com/applications/789/track"
  },
  "message": "Application submitted successfully. You will receive an email confirmation shortly."
}
```

---

## 6.5. Security Requirements

### 6.5.1. Authentication & Authorization

**JWT Configuration**:

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': settings.SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

**Password Policy**:

```python
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 8}
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
```

### 6.5.2. Data Protection

**Encryption**:

- Passwords: bcrypt (cost factor 12)
- Sensitive fields: AES-256
- Database: Encryption at rest (Neon built-in)
- Transit: TLS 1.3

**CORS Configuration**:

```python
CORS_ALLOWED_ORIGINS = [
    "https://recruitment.example.com",
    "https://admin.recruitment.example.com",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
```

**Rate Limiting**:

```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}
```

### 6.5.3. Input Validation

**File Upload Validation**:

```python
# CV upload
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_CV_FORMATS = ['pdf', 'docx']

# Avatar upload
MAX_AVATAR_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp']

# Validation
def validate_cv_file(file):
    if file.size > MAX_UPLOAD_SIZE:
        raise ValidationError("File size must be less than 10MB")

    ext = file.name.split('.')[-1].lower()
    if ext not in ALLOWED_CV_FORMATS:
        raise ValidationError("Only PDF and DOCX files are allowed")

    # Virus scan (optional, using ClamAV)
    if has_virus(file):
        raise ValidationError("File contains malicious content")
```

---

## 6.6. Deployment Architecture

### 6.6.1. Development Environment

```
┌─────────────────────────────────────────┐
│      Developer Machine (localhost)      │
├─────────────────────────────────────────┤
│  ┌────────────────────────────────┐     │
│  │  Docker Compose                │     │
│  ├────────────────────────────────┤     │
│  │  - Backend (Django):5001       │     │
│  │  - Frontend (React):3000       │     │
│  │  - PostgreSQL:5432             │     │
│  │  - Redis:6379                  │     │
│  │  - Celery Worker               │     │
│  │  - Celery Beat (scheduler)     │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
```

**docker-compose.yml**:

```yaml
version: "3.8"

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: recruitment_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/recruitment_db
      - REDIS_URL=redis://redis:6379/0

  celery:
    build: ./backend
    command: celery -A config worker -l info
    volumes:
      - ./backend:/app
    depends_on:
      - db
      - redis

  frontend:
    build: ./frontend
    command: npm run dev
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:8000/api/v1

volumes:
  postgres_data:
```

### 6.6.2. Production Environment

```
┌────────────────────────────────────────────────────────┐
│                    CLOUDFLARE CDN                      │
│                    (SSL/TLS, DDoS)                     │
└──────────────────────┬─────────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────────┐
│                  LOAD BALANCER                         │
│                  (Nginx / AWS ALB)                     │
└──────────┬───────────────────────┬─────────────────────┘
           │                       │
    ┌──────▼──────┐         ┌─────▼──────┐
    │  Frontend   │         │  Backend   │
    │  (Vercel/   │         │  (Railway/ │
    │   Netlify)  │         │   Render)  │
    └─────────────┘         └─────┬──────┘
                                  │
                     ┌────────────┼────────────┐
                     │            │            │
              ┌──────▼─────┐ ┌───▼────┐ ┌────▼─────┐
              │ PostgreSQL │ │ Redis  │ │  Celery  │
              │   (Neon)   │ │(Upstash│ │ Workers  │
              └────────────┘ └────────┘ └──────────┘
                     │
              ┌──────▼───────────────────────┐
              │    External Services         │
              ├──────────────────────────────┤
              │ - Google Gemini AI           │
              │ - Gmail SMTP                 │
              │ - Cloud Storage (S3)         │
              │ - Sentry (Monitoring)        │
              └──────────────────────────────┘
```

**Hosting Options**:

**Backend**:

- **Railway**: $5-20/month, easy deployment
- **Render**: Free tier available, auto-deploy from Git
- **Heroku**: $7/month, mature platform
- **AWS EC2**: More control, $10-50/month

**Frontend**:

- **Vercel**: Free tier, optimized for React
- **Netlify**: Free tier, auto-deploy from Git
- **Cloudflare Pages**: Free, global CDN

**Database**:

- **Neon**: Free tier 3GB, auto-scaling
- **Supabase**: Free tier 500MB
- **AWS RDS**: $15-50/month

---

## 6.7. Performance Optimization

### 6.7.1. Database Optimization

**Indexing Strategy**:

```sql
-- Frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_jobs_status_deadline ON jobs(status, application_deadline);
CREATE INDEX idx_apps_job_status ON applications(job_id, status);
CREATE INDEX idx_apps_score ON applications(ai_score DESC);

-- Full-text search
CREATE INDEX idx_jobs_search ON jobs USING gin(to_tsvector('english', title || ' ' || description));
```

**Query Optimization**:

```python
# Bad: N+1 queries
applications = Application.objects.filter(job_id=123)
for app in applications:
    print(app.candidate.name)  # Extra query each time

# Good: select_related (for ForeignKey)
applications = Application.objects.filter(job_id=123).select_related('candidate', 'job')
for app in applications:
    print(app.candidate.name)  # No extra queries

# Good: prefetch_related (for reverse ForeignKey, ManyToMany)
interviews = Interview.objects.prefetch_related('interview_panels__interviewer')
```

**Connection Pooling**:

```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'recruitment_db',
        'CONN_MAX_AGE': 600,  # Keep connections open for 10 minutes
        'OPTIONS': {
            'pool_size': 20,
            'max_overflow': 0,
        }
    }
}
```

### 6.7.2. Caching Strategy

**Redis Caching**:

```python
from django.core.cache import cache

# Cache active jobs (5 minutes)
def get_active_jobs():
    cache_key = 'active_jobs'
    jobs = cache.get(cache_key)

    if not jobs:
        jobs = Job.objects.filter(status='OPEN').select_related('recruiter')
        cache.set(cache_key, jobs, timeout=300)

    return jobs

# Invalidate cache when job is updated
@receiver(post_save, sender=Job)
def invalidate_job_cache(sender, instance, **kwargs):
    cache.delete('active_jobs')
    cache.delete(f'job_{instance.id}')
```

**API Response Caching**:

```python
from rest_framework.decorators import action
from django.views.decorators.cache import cache_page

class JobViewSet(viewsets.ModelViewSet):
    @cache_page(60 * 5)  # Cache for 5 minutes
    @action(detail=False, methods=['get'])
    def public_list(self, request):
        # Public job listings (cacheable)
        jobs = Job.objects.filter(status='OPEN')
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)
```

### 6.7.3. Frontend Optimization

**Code Splitting**:

```javascript
// React lazy loading
import { lazy, Suspense } from "react";

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const RecruiterDashboard = lazy(() => import("./pages/RecruiterDashboard"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
      </Routes>
    </Suspense>
  );
}
```

**Image Optimization**:

```javascript
// Use lazy loading for images
<img
  src={avatarUrl}
  loading="lazy"
  alt="User avatar"
  width={64}
  height={64}
/>

// Use WebP format with fallback
<picture>
  <source srcSet="avatar.webp" type="image/webp" />
  <img src="avatar.jpg" alt="Avatar" />
</picture>
```

**Asset Optimization**:

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["@headlessui/react", "@heroicons/react"],
        },
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
      },
    },
  },
};
```

---

## 6.8. Testing Strategy

### 6.8.1. Test Coverage Goals

```
Overall Coverage: >= 80%

Backend:
├─ Models: >= 90%
├─ Views/API: >= 85%
├─ Serializers: >= 80%
├─ Utils/Helpers: >= 95%
└─ Background Tasks: >= 75%

Frontend:
├─ Components: >= 70%
├─ Hooks: >= 80%
├─ Utils: >= 90%
└─ API Client: >= 85%
```

### 6.8.2. Test Types

**Unit Tests** (70%):

```python
# test_models.py
def test_application_cannot_duplicate():
    """One candidate can only apply once for same job"""
    job = JobFactory()
    candidate = UserFactory(role='candidate')

    # First application succeeds
    app1 = Application.objects.create(job=job, candidate=candidate, cv_url="...")
    assert app1.id is not None

    # Second application fails
    with pytest.raises(IntegrityError):
        Application.objects.create(job=job, candidate=candidate, cv_url="...")
```

**Integration Tests** (20%):

```python
# test_api.py
def test_submit_application_flow(api_client, candidate, job):
    """Test complete application submission flow"""
    api_client.force_authenticate(user=candidate)

    # Submit application
    response = api_client.post('/api/applications/', {
        'job_id': job.id,
        'cv_url': 'https://storage.example.com/cv.pdf',
        'cover_letter': 'I am interested...'
    })

    assert response.status_code == 201
    assert response.data['status'] == 'SUBMITTED'

    # Verify background job was triggered
    assert screen_application.delay.called

    # Verify email was sent
    assert len(mail.outbox) == 1
    assert 'Application submitted' in mail.outbox[0].subject
```

**E2E Tests** (10%):

```typescript
// test/e2e/application-flow.spec.ts
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
  await page.setInputFiles('input[type="file"]', "fixtures/test-cv.pdf");
  await page.fill('textarea[name="cover_letter"]', "I am very interested...");

  // Submit
  await page.click('button:has-text("Submit Application")');

  // Assert success
  await expect(page.locator(".success-message")).toContainText(
    "Application submitted successfully"
  );
});
```

---

**Tổng kết**: Đã hoàn thành toàn bộ 6 phần tài liệu yêu cầu nghiệp vụ chi tiết! 🎉

_Xem tiếp: Tổng hợp và Phụ lục_
