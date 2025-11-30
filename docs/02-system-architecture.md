# System Architecture - Hệ thống Tuyển dụng

## 1. Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Admin UI    │  │ Recruiter UI │  │ Candidate UI │         │
│  │  Dashboard   │  │  Dashboard   │  │   Portal     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                  │                 │
│         └──────────────────┴──────────────────┘                 │
│                           │                                     │
│                    Next.js 14 App                               │
│                  (React Server Components)                      │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │  API Routes    │  │ Server Actions │  │  Middleware     │  │
│  │  /api/...      │  │ (Form submit)  │  │  (Auth/RBAC)    │  │
│  └────────────────┘  └────────────────┘  └─────────────────┘  │
│          │                   │                    │             │
│          └───────────────────┴────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Database   │   │  Queue/Jobs  │   │  AI Service  │
│  PostgreSQL  │   │   BullMQ     │   │   Gemini/    │
│   + Prisma   │   │  (Redis)     │   │   OpenAI     │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        │                   ▼                   │
        │          ┌──────────────┐             │
        │          │   Worker     │             │
        │          │  Process     │◄────────────┘
        │          │ (Background) │
        │          └──────────────┘
        │                   │
        └───────────────────┴──────────────┐
                                           │
                                           ▼
                                  ┌──────────────┐
                                  │ File Storage │
                                  │ Vercel Blob  │
                                  │ (CV files)   │
                                  └──────────────┘
```

## 2. Tech Stack chi tiết

### Frontend

- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **State:** React Server Components + Server Actions (minimal client state)
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts (báo cáo thống kê)
- **Calendar:** React Big Calendar (lịch phỏng vấn)

### Backend

- **Framework:** Next.js API Routes + Server Actions
- **ORM:** Prisma 5
- **Validation:** Zod schemas
- **Auth:** NextAuth.js v5 (credentials + JWT)
- **File Upload:** Vercel Blob Storage API

### Database

- **Primary DB:** PostgreSQL 15+
- **ORM:** Prisma (type-safe queries)
- **Hosting:** Neon.tech (free tier) hoặc Supabase

### Queue & Background Jobs

- **Queue:** BullMQ (Redis-based)
- **Redis:** Upstash Redis (free tier) hoặc Redis Cloud
- **Use cases:**
  - Batch CV screening
  - Email sending
  - Report generation

### AI & ML

- **Primary:** Google Gemini API (free 1500 req/day)
- **Fallback:** OpenAI GPT-3.5/4 (paid)
- **Local:** Rule-based screening (không cần API)
- **PDF Parsing:** pdf-parse (Node.js)

### External Services

- **PDF Generation:** jsPDF hoặc react-pdf
- **Monitoring:** Sentry (errors), Vercel Analytics

### Deployment

- **Platform:** Vercel (auto-deploy from Git)
- **CI/CD:** Vercel Git integration
- **Environment:** Production + Preview environments

## 3. Data Flow - CV Screening (Use case chính)

```
┌──────────┐
│ Recruiter│ Upload 100 CVs
└────┬─────┘
     │
     ▼
┌─────────────────────────────────┐
│  POST /api/jobs/123/screen-batch│
│  (Next.js API Route)            │
└────┬────────────────────────────┘
     │
     ├─► Upload files to Vercel Blob
     │
     ├─► Create Application records in DB
     │
     └─► Add jobs to BullMQ queue
         (cv-screening queue)
              │
              ▼
┌──────────────────────────────────┐
│  Background Worker               │
│  (Separate Node process)         │
└────┬─────────────────────────────┘
     │
     ├─► Fetch CV from Blob
     │
     ├─► Parse PDF → extract text
     │
     ├─► Stage 1: Rule-based filter
     │   (quick reject < 30 score)
     │
     ├─► Stage 2: AI screening
     │   (Gemini API for qualified CVs)
     │
     ├─► Save results to DB
     │   (aiScore, aiAnalysis, status)
     │
     └─► Send notification email
         (via Resend)
              │
              ▼
┌──────────────────────────────────┐
│  Recruiter Dashboard             │
│  Real-time progress updates      │
│  (WebSocket or polling)          │
└──────────────────────────────────┘
```

## 4. Modules (Phân chia chức năng)

### Module 1: Authentication & Authorization

- Login/Logout (NextAuth.js)
- Role-based access (ADMIN, RECRUITER, INTERVIEWER, CANDIDATE)
- Middleware protect routes

### Module 2: Job Management

- CRUD jobs (ADMIN, RECRUITER)
- Publish/Close jobs
- View applications per job

### Module 3: Application Management

- Candidate apply (upload CV)
- Recruiter view/filter applications
- Status workflow management
- AI screening trigger

### Module 4: Interview Scheduling

- Create interview schedule
- Assign interview panel
- Calendar view (React Big Calendar)
- Send calendar invites (email)

### Module 5: Interview Panel & Feedback

- Interviewer submit feedback
- Scoring system
- Final decision aggregation

### Module 6: Recruitment Results

- Generate offer letter (PDF)
- Send result emails
- Archive results

### Module 7: Notifications

- System notifications (in-app)
- Real-time updates

### Module 8: Reports & Analytics

- Dashboard charts:
  - Applications per job
  - Status distribution
  - Interview success rate
  - Time-to-hire metrics
- Export reports (CSV/PDF)

## 5. Security & Performance

### Security

- **Auth:** JWT tokens (httpOnly cookies)
- **RBAC:** Middleware check roles per route
- **File Upload:**
  - Max size: 5MB per CV
  - Allowed: PDF, DOCX only
  - Virus scan (optional: ClamAV)
- **API Rate Limiting:** 100 req/min per IP
- **SQL Injection:** Prisma ORM (parameterized queries)
- **XSS:** React auto-escape + Content Security Policy

### Performance

- **Cache:**
  - Redis cache for frequent queries (job listings)
  - Vercel Edge Cache for static pages
- **Database:**
  - Indexes on foreign keys
  - Query optimization (Prisma select only needed fields)
- **File Storage:**
  - CDN for CV files (Vercel Blob)
  - Lazy load large files
- **AI:**
  - Batch API calls (reduce cost)
  - Cache AI results (same CV → same score)
  - Queue system (avoid timeout)

## 6. Deployment Architecture

```
GitHub Repo
    │
    ├─ Push to main branch
    │
    ▼
┌────────────────────────┐
│  Vercel CI/CD          │
│  - Build Next.js       │
│  - Run Prisma migrate  │
│  - Deploy to Edge      │
└───────┬────────────────┘
        │
        ▼
┌────────────────────────────────────┐
│  Production Environment            │
│                                    │
│  ┌──────────────┐                 │
│  │  Vercel Edge │ (Next.js app)   │
│  └──────┬───────┘                 │
│         │                          │
│         ├─► Neon PostgreSQL        │
│         ├─► Upstash Redis          │
│         ├─► Vercel Blob Storage    │
│         ├─► Gemini API             │
│         └─► Resend Email           │
│                                    │
│  Worker (Background Jobs):         │
│  - Run on Vercel Cron (hourly)    │
│  - Or separate Railway/Render      │
└────────────────────────────────────┘
```

## 7. Cost Estimate (Free tier max)

| Service         | Free Tier         | Monthly Cost |
| --------------- | ----------------- | ------------ |
| Vercel Hosting  | 100GB bandwidth   | **$0**       |
| Neon PostgreSQL | 3GB storage       | **$0**       |
| Upstash Redis   | 10K commands/day  | **$0**       |
| Vercel Blob     | 500MB storage     | **$0**       |
| Gemini API      | 1500 requests/day | **$0**       |
| Resend Email    | 100 emails/day    | **$0**       |
| **TOTAL**       | Đủ cho đồ án demo | **$0/month** |

_Nếu vượt free tier: ~$5-10/month_
