# 🛠️ Tech Stack - Hệ thống Tuyển dụng Nhân sự

## 📋 Tổng quan

Project sử dụng kiến trúc **Full-Stack** với:

- **Backend**: Django REST Framework (Python)
- **Frontend**: React (JavaScript)
- **Database**: PostgreSQL
- **Background Jobs**: Celery + Redis
- **AI/ML**: Google Gemini API

---

## 🔧 Backend Technologies

### Core Framework

- **Django 5.0** - Web framework chính
- **Django REST Framework 3.14** - API framework cho RESTful APIs
- **Python 3.10+** - Ngôn ngữ lập trình

### Database

- **PostgreSQL** - Database chính (hỗ trợ Neon, Supabase, Railway)
- **psycopg2-binary** - PostgreSQL adapter cho Python

### Authentication & Security

- **djangorestframework-simplejwt** - JWT (JSON Web Token) authentication
- **django-cors-headers** - CORS handling cho frontend
- **django-environ** - Quản lý environment variables

### Background Jobs & Task Queue

- **Celery 5.3** - Distributed task queue
- **Redis 5.0** - Message broker cho Celery
- **django-celery-beat 2.5** - Periodic tasks scheduling

### AI & Machine Learning

- **google-generativeai 0.3** - Google Gemini API cho CV screening tự động

### File Handling

- **Pillow 10.1** - Xử lý hình ảnh
- **PyPDF2 3.0** - Xử lý file PDF
- **python-docx 1.1** - Xử lý file Word (.docx)
- **python-magic-bin 0.4.14** - File type detection (Windows)

### Email

- **Django SMTP** - Gửi email qua SMTP (Gmail)
- **django-anymail[sendgrid] 10.2** - Optional: Email service provider

### API Documentation

- **drf-spectacular 0.27** - OpenAPI/Swagger documentation

### Utilities

- **python-dotenv 1.0.0** - Load environment variables từ .env file
- **python-decouple 3.8** - Configuration management
- **django-filter 23.5** - Advanced filtering cho APIs
- **python-dateutil 2.8** - Date/time utilities
- **pytz 2023.3** - Timezone support
- **reportlab 4.0** - PDF generation (thư mời nhận việc)
- **faker 20.0** - Generate fake data cho testing/seed scripts

---

## 🎨 Frontend Technologies

### Core Framework

- **React 18.2.0** - UI library chính
- **React DOM 18.2.0** - React rendering cho web
- **React Scripts 5.0.1** - Build tools và development server

### Routing

- **react-router-dom 6.20.0** - Client-side routing

### HTTP Client

- **axios 1.6.2** - HTTP client cho API calls

### Styling

- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.22** - CSS vendor prefixing

### Forms

- **react-hook-form 7.48.2** - Form management và validation

### Charts & Analytics

- **recharts 2.10.3** - Charts library cho dashboard

### Icons

- **lucide-react 0.294.0** - Icon library

### Date Handling

- **date-fns 3.0.0** - Date formatting và manipulation

### Development Tools

- **cross-env 7.0.3** - Cross-platform environment variables

### Testing

- **@testing-library/react 13.4.0** - React testing utilities
- **@testing-library/jest-dom 5.17.0** - DOM testing matchers
- **@testing-library/user-event 13.5.0** - User interaction simulation

### Performance

- **web-vitals 2.1.4** - Web performance metrics

---

## 🗄️ Database

### Primary Database

- **PostgreSQL 15+** - Relational database

### Database Features

- UUID primary keys
- Timezone-aware datetime fields
- Foreign key relationships
- Indexes cho performance

---

## 🔄 Background Processing

### Task Queue

- **Celery** - Distributed task queue
- **Redis** - Message broker

### Use Cases

- Gửi email verification
- Gửi email thông báo phỏng vấn
- AI CV screening (async)
- Scheduled tasks (periodic)

---

## ☁️ AI/ML Services

### AI Provider

- **Google Gemini API** - AI model cho:
  - CV screening tự động
  - Đánh giá ứng viên
  - Phân tích hồ sơ

---

## 📧 Email Service

### Email Backend

- **Django SMTP Backend** - Gửi email qua SMTP
- **Gmail SMTP** - Email provider (sử dụng App Password)

### Email Features

- Email verification
- Interview invitations
- Application notifications
- HTML email templates

---

## 🔐 Authentication & Authorization

### Authentication Method

- **JWT (JSON Web Tokens)** - Token-based authentication
- **Refresh Token** - Token renewal mechanism

### Authorization

- **Role-Based Access Control (RBAC)**:
  - ADMIN
  - RECRUITER
  - CANDIDATE
  - INTERVIEWER

---

## 📦 Package Management

### Backend

- **pip** - Python package manager
- **requirements.txt** - Dependencies list

### Frontend

- **npm** - Node package manager
- **package.json** - Dependencies và scripts

---

## 🚀 Deployment & Infrastructure

### Supported Platforms

- **Neon** - PostgreSQL hosting
- **Supabase** - PostgreSQL hosting
- **Railway** - Full-stack hosting
- **Local Development** - PostgreSQL local

### Environment Management

- **python-dotenv** - .env file support
- **django-environ** - Environment variables

---

## 🛠️ Development Tools

### Code Quality

- **ESLint** - JavaScript linting (React)
- **Pylint/Flake8** - Python linting (optional)

### Version Control

- **Git** - Version control system

### Build Tools

- **Create React App** - React project scaffolding
- **Django** - Django project structure

---

## 📊 Summary

### Backend Stack

```
Django 5.0
├── Django REST Framework 3.14
├── PostgreSQL (psycopg2-binary)
├── Celery + Redis
├── JWT Authentication
├── Google Gemini API
└── File Processing (Pillow, PyPDF2, python-docx)
```

### Frontend Stack

```
React 18
├── React Router DOM 6
├── Tailwind CSS 3
├── Axios
├── React Hook Form
├── Recharts
└── Lucide React Icons
```

### Infrastructure

```
PostgreSQL Database
├── Celery Workers
├── Redis Broker
└── SMTP Email Service
```

---

## 📝 Notes

- **Multi-port setup**: Frontend chạy trên nhiều port (3001, 3002, 3003) cho các role khác nhau
- **Environment-based config**: Sử dụng .env files cho configuration
- **AI-powered**: Tích hợp Google Gemini cho CV screening
- **Email verification**: Bắt buộc cho tất cả users (trừ ADMIN)
- **Role-based UI**: Frontend tự động điều chỉnh theo role
