# Hướng dẫn Setup Chi tiết - Hệ thống Tuyển dụng

# Django + Django REST Framework + React + PostgreSQL

## 📋 Mục lục

1. [Cài đặt Prerequisites](#1-cài-đặt-prerequisites)
2. [Setup Backend (Django)](#2-setup-backend-django)
3. [Setup Frontend (React)](#3-setup-frontend-react)
4. [Chạy ứng dụng](#4-chạy-ứng-dụng)
5. [Testing & Verification](#5-testing--verification)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Cài đặt Prerequisites

### 1.1. Python 3.10+

```cmd
# Kiểm tra Python version
python --version

# Nếu chưa có, download từ: https://www.python.org/downloads/
# Chọn "Add Python to PATH" khi cài đặt
```

### 1.2. Node.js 18+

```cmd
# Kiểm tra Node version
node --version
npm --version

# Nếu chưa có, download từ: https://nodejs.org/
```

### 1.3. PostgreSQL 15+

```cmd
# Download từ: https://www.postgresql.org/download/windows/

# Sau khi cài, tạo database:
# 1. Mở SQL Shell (psql)
# 2. Login với password của postgres user
# 3. Chạy lệnh:
CREATE DATABASE recruitment_db;
CREATE USER recruitment_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE recruitment_db TO recruitment_user;
ALTER USER recruitment_user CREATEDB;
```

### 1.4. Redis (cho Celery)

**Cách 1: Docker (khuyến nghị)**

```cmd
# Cài Docker Desktop: https://www.docker.com/products/docker-desktop

# Sau khi cài Docker, chạy Redis:
docker run -d -p 6379:6379 redis:alpine
```

**Cách 2: Windows native**

```cmd
# Download Redis cho Windows từ:
# https://github.com/microsoftarchive/redis/releases
# Hoặc dùng WSL2
```

### 1.5. Git

```cmd
git --version

# Nếu chưa có: https://git-scm.com/download/win
```

---

## 2. Setup Backend (Django)

### 2.1. Di chuyển vào thư mục backend

```cmd
cd d:\DoAnPTPMHDT\backend
```

### 2.2. Tạo Python Virtual Environment

```cmd
# Tạo virtual environment
python -m venv venv

# Activate (Windows CMD)
venv\Scripts\activate

# Activate (Windows PowerShell)
venv\Scripts\Activate.ps1

# Nếu gặp lỗi PowerShell execution policy:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2.3. Cài đặt Dependencies

```cmd
# Upgrade pip
python -m pip install --upgrade pip

# Cài đặt tất cả packages
pip install -r requirements.txt

# Nếu gặp lỗi psycopg2:
pip install psycopg2-binary --force-reinstall
```

### 2.4. Tạo file .env

Tạo file `backend\.env` với nội dung:

```env
# Django
SECRET_KEY=django-insecure-change-this-in-production-12345
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=recruitment_db
DB_USER=recruitment_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379/0

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password

# AI API
GEMINI_API_KEY=your_gemini_api_key

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Media files
MEDIA_URL=/media/
MEDIA_ROOT=media
```

**Lưu ý:**

- Gmail App Password: https://myaccount.google.com/apppasswords
- Gemini API Key: https://makersuite.google.com/app/apikey

### 2.5. Tạo Django Project và Apps

```cmd
# Tạo Django project (nếu chưa có)
django-admin startproject recruitment_system .

# Tạo các apps
python manage.py startapp accounts
python manage.py startapp jobs
python manage.py startapp applications
python manage.py startapp notifications
python manage.py startapp reports
```

**Lưu ý:** Các file models.py, admin.py đã được tạo sẵn ở bước trước.

### 2.6. Cấu hình settings.py

Thay thế nội dung `recruitment_system/settings.py`:

```python
from pathlib import Path
import os
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost').split(',')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'drf_spectacular',
    'django_celery_beat',

    # Local apps
    'accounts',
    'jobs',
    'applications',
    'notifications',
    'reports',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'recruitment_system.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'recruitment_system.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# Custom User Model
AUTH_USER_MODEL = 'accounts.User'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Ho_Chi_Minh'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files
MEDIA_URL = config('MEDIA_URL', default='/media/')
MEDIA_ROOT = BASE_DIR / config('MEDIA_ROOT', default='media')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# JWT Settings
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

# CORS Settings
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000').split(',')
CORS_ALLOW_CREDENTIALS = True

# Celery Configuration
CELERY_BROKER_URL = config('REDIS_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = config('REDIS_URL', default='redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('EMAIL_HOST_USER', default='noreply@recruitment.com')

# API Documentation
SPECTACULAR_SETTINGS = {
    'TITLE': 'Recruitment System API',
    'DESCRIPTION': 'API documentation for Recruitment Management System',
    'VERSION': '1.0.0',
}

# AI Configuration
GEMINI_API_KEY = config('GEMINI_API_KEY', default='')
```

### 2.7. Chạy Migrations

```cmd
# Tạo migration files
python manage.py makemigrations

# Áp dụng migrations
python manage.py migrate

# Nếu gặp lỗi, reset database:
python manage.py flush --noinput
python manage.py migrate
```

### 2.8. Tạo Superuser

```cmd
python manage.py createsuperuser

# Nhập thông tin:
# Email: admin@recruitment.com
# Username: admin
# Password: admin123
# Confirm password: admin123
```

### 2.9. Collect Static Files

```cmd
python manage.py collectstatic --noinput
```

### 2.10. Test chạy server

```cmd
python manage.py runserver

# Truy cập:
# - API: http://localhost:8000/
# - Admin: http://localhost:8000/admin/
```

---

## 3. Setup Frontend (React)

### 3.1. Mở terminal mới (giữ backend chạy)

```cmd
# Di chuyển vào thư mục gốc
cd d:\DoAnPTPMHDT
```

### 3.2. Tạo React App

```cmd
npx create-react-app frontend
cd frontend
```

### 3.3. Cài đặt Dependencies

```cmd
# Core dependencies
npm install axios react-router-dom

# UI libraries
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Form handling
npm install react-hook-form

# Charts
npm install recharts

# Date handling
npm install date-fns

# Icons
npm install lucide-react
```

### 3.4. Cấu hình Tailwind CSS

Sửa file `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Sửa file `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3.5. Tạo file .env

Tạo file `frontend\.env`:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### 3.6. Test chạy frontend

```cmd
npm start

# Truy cập: http://localhost:3000
```

---

## 4. Chạy ứng dụng

### 4.1. Terminal 1 - Backend

```cmd
cd d:\DoAnPTPMHDT\backend
venv\Scripts\activate
python manage.py runserver
```

### 4.2. Terminal 2 - Frontend

```cmd
cd d:\DoAnPTPMHDT\frontend
npm start
```

### 4.3. Terminal 3 - Celery Worker (optional)

```cmd
cd d:\DoAnPTPMHDT\backend
venv\Scripts\activate
celery -A recruitment_system worker -l info --pool=solo

# Note: --pool=solo for Windows
```

### 4.4. Terminal 4 - Redis (nếu dùng Docker)

```cmd
docker start redis
# Hoặc nếu chưa có:
docker run -d --name redis -p 6379:6379 redis:alpine
```

---

## 5. Testing & Verification

### 5.1. Kiểm tra Backend

```cmd
# Test API
curl http://localhost:8000/api/

# Test Admin
# Truy cập http://localhost:8000/admin/
# Login với: admin@recruitment.com / admin123
```

### 5.2. Kiểm tra Database

```cmd
# Mở psql
psql -U recruitment_user -d recruitment_db

# Kiểm tra tables
\dt

# Kiểm tra users
SELECT * FROM users;

# Thoát
\q
```

### 5.3. Tạo dữ liệu test

Tạo file `backend/seed_data.py`:

```python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruitment_system.settings')
django.setup()

from accounts.models import User
from jobs.models import Job
from datetime import datetime, timedelta

# Tạo users
admin = User.objects.create_superuser(
    email='admin@recruitment.com',
    username='admin',
    password='admin123',
    first_name='Admin',
    last_name='User',
    role=User.Role.ADMIN
)

recruiter = User.objects.create_user(
    email='recruiter@recruitment.com',
    username='recruiter',
    password='recruiter123',
    first_name='Recruiter',
    last_name='User',
    role=User.Role.RECRUITER
)

candidate = User.objects.create_user(
    email='candidate@recruitment.com',
    username='candidate',
    password='candidate123',
    first_name='Candidate',
    last_name='User',
    role=User.Role.CANDIDATE
)

# Tạo jobs
Job.objects.create(
    title='Senior Java Developer',
    description='We are looking for an experienced Java developer...',
    requirements='- 5+ years Java\n- Spring Boot\n- MySQL/PostgreSQL',
    salary='1000-2000 USD',
    location='Ha Noi',
    employment_type=Job.EmploymentType.FULLTIME,
    status=Job.Status.OPEN,
    deadline=datetime.now() + timedelta(days=30),
    created_by=recruiter
)

Job.objects.create(
    title='Frontend React Developer',
    description='Join our frontend team...',
    requirements='- 3+ years React\n- TypeScript\n- Tailwind CSS',
    salary='800-1500 USD',
    location='Ho Chi Minh',
    employment_type=Job.EmploymentType.FULLTIME,
    status=Job.Status.OPEN,
    deadline=datetime.now() + timedelta(days=45),
    created_by=recruiter
)

print("✅ Seed data created successfully!")
print("Users:")
print(f"  - Admin: {admin.email} / admin123")
print(f"  - Recruiter: {recruiter.email} / recruiter123")
print(f"  - Candidate: {candidate.email} / candidate123")
```

Chạy:

```cmd
cd backend
python seed_data.py
```

---

## 6. Troubleshooting

### 6.1. Lỗi: "No module named 'psycopg2'"

```cmd
pip install psycopg2-binary --force-reinstall
```

### 6.2. Lỗi: "Connection refused" khi connect PostgreSQL

```cmd
# Kiểm tra PostgreSQL đang chạy
# Windows: Services → PostgreSQL
# Hoặc:
pg_isready -U postgres

# Restart service nếu cần
```

### 6.3. Lỗi: "Redis connection failed"

```cmd
# Kiểm tra Redis
redis-cli ping
# Phải trả về: PONG

# Nếu lỗi, restart Redis:
docker restart redis
```

### 6.4. Lỗi: "Port 8000 already in use"

```cmd
# Tìm process đang dùng port
netstat -ano | findstr :8000

# Kill process (thay PID)
taskkill /PID <process_id> /F

# Hoặc dùng port khác:
python manage.py runserver 8001
```

### 6.5. Lỗi: CORS khi call API từ React

Kiểm tra `CORS_ALLOWED_ORIGINS` trong `settings.py` có chứa `http://localhost:3000`

### 6.6. Lỗi: "SECRET_KEY not found"

Đảm bảo file `.env` đã tạo và có biến `SECRET_KEY`

---

## 📚 Tài liệu tham khảo

- Django: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- React: https://react.dev/
- PostgreSQL: https://www.postgresql.org/docs/
- Celery: https://docs.celeryq.dev/

---

## ✅ Checklist hoàn thành setup

- [ ] Python, Node.js, PostgreSQL, Redis đã cài đặt
- [ ] Backend: virtual environment đã tạo
- [ ] Backend: dependencies đã cài (pip install -r requirements.txt)
- [ ] Backend: file .env đã tạo với đầy đủ biến
- [ ] Backend: migrations đã chạy
- [ ] Backend: superuser đã tạo
- [ ] Backend: server chạy thành công (http://localhost:8000)
- [ ] Backend: admin panel truy cập được (http://localhost:8000/admin)
- [ ] Frontend: dependencies đã cài (npm install)
- [ ] Frontend: file .env đã tạo
- [ ] Frontend: app chạy thành công (http://localhost:3000)
- [ ] Database: có thể query được tables
- [ ] Seed data: đã chạy thành công

---

## 🎯 Next Steps

Sau khi hoàn thành setup, xem:

1. `docs/03-api-endpoints.md` - Danh sách API endpoints
2. `docs/01-database-design.md` - Database schema
3. Start implementing features theo roadmap trong README.md
