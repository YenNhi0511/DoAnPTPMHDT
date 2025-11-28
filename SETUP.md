# 📘 Hướng dẫn Setup & Sử dụng - Hệ thống Tuyển dụng Nhân sự

Hướng dẫn đầy đủ từ setup đến deployment cho team.

---

## 📋 Mục lục

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Yêu cầu hệ thống](#2-yêu-cầu-hệ-thống)
3. [Cài đặt công cụ](#3-cài-đặt-công-cụ-cần-thiết)
4. [Setup nhanh (5 phút)](#4-setup-nhanh-5-phút)
5. [Setup chi tiết](#5-setup-chi-tiết-từng-bước)
6. [Cấu hình Environment Variables](#6-cấu-hình-environment-variables)
7. [Chạy dự án](#7-chạy-dự-án)
8. [Troubleshooting](#8-troubleshooting)
9. [Deployment](#9-deployment)
10. [Quy trình làm việc](#10-quy-trình-làm-việc)

---

## 1. Tổng quan dự án

### Tech Stack

**Backend:**
- Django 5.0 + Django REST Framework
- PostgreSQL (hỗ trợ Neon, Supabase, Railway)
- Celery + Redis (background jobs)
- Google Gemini API (AI CV screening)
- JWT Authentication

**Frontend:**
- React 18
- Tailwind CSS
- Recharts (charts & analytics)
- Axios (HTTP client)

### Tính năng chính
- ✅ Quản lý quy trình tuyển dụng
- ✅ Đăng tin tuyển dụng
- ✅ Nhận hồ sơ ứng viên (upload CV)
- ✅ Sàng lọc AI tự động
- ✅ Quản lý phỏng vấn
- ✅ Báo cáo thống kê
- ✅ Admin Panel đầy đủ

---

## 2. Yêu cầu hệ thống

- **Python:** 3.10 hoặc cao hơn
- **Node.js:** 18 hoặc cao hơn
- **PostgreSQL:** 15+ (hoặc dùng online database)
- **Git:** Đã cài đặt
- **OS:** Windows 10+, macOS 10.15+, hoặc Linux (Ubuntu 20.04+)

---

## 3. Cài đặt công cụ cần thiết

### 3.1. Python

**Windows:**
1. Tải từ https://www.python.org/downloads/
2. Chọn "Add Python to PATH"
3. Kiểm tra: `python --version` (phải >= 3.10)

**Mac:**
```bash
brew install python@3.10
```

**Linux:**
```bash
sudo apt update
sudo apt install python3.10 python3.10-venv python3-pip
```

### 3.2. Node.js

1. Tải từ https://nodejs.org/ (LTS version)
2. Kiểm tra: `node --version` (phải >= 18)
3. Kiểm tra: `npm --version`

### 3.3. Git

**Windows:** https://git-scm.com/download/win  
**Mac:** `brew install git`  
**Linux:** `sudo apt install git`

### 3.4. PostgreSQL (Optional - nếu dùng local)

**Windows:** Tải từ https://www.postgresql.org/download/windows/  
**Mac:** `brew install postgresql@15`  
**Linux:** `sudo apt install postgresql postgresql-contrib`

---

## 4. Setup nhanh (5 phút)

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd DoAnPTPMHDT
```

### Bước 2: Setup Backend

**Windows:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Tạo .env file
copy .env.example .env
# Sau đó chỉnh sửa .env với thông tin của bạn

python manage.py migrate
python manage.py createsuperuser
```

**Mac/Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Tạo .env file
cp .env.example .env
# Sau đó chỉnh sửa .env với thông tin của bạn

python manage.py migrate
python manage.py createsuperuser
```

### Bước 3: Setup Frontend

```bash
cd ../frontend
npm install

# Tạo .env file
echo REACT_APP_API_URL=http://localhost:8000/api > .env
```

### Bước 4: Chạy dự án

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

✅ **Truy cập:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Django Admin: http://localhost:8000/admin

---

## 5. Setup chi tiết từng bước

### 5.1. Clone Repository

```bash
git clone <repository-url>
cd DoAnPTPMHDT
```

### 5.2. Backend Setup

#### Bước 1: Tạo Virtual Environment

```bash
cd backend

# Windows
python -m venv venv

# Mac/Linux
python3 -m venv venv
```

#### Bước 2: Activate Virtual Environment

**Windows (CMD):**
```bash
venv\Scripts\activate.bat
```

**Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

Sau khi activate, bạn sẽ thấy `(venv)` ở đầu dòng terminal.

#### Bước 3: Cài đặt Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### Bước 4: Tạo file .env

**Windows:**
```bash
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

Sau đó chỉnh sửa file `.env` với thông tin của bạn (xem phần 6).

#### Bước 5: Chạy Migrations

```bash
python manage.py migrate
```

#### Bước 6: Tạo Superuser

```bash
python manage.py createsuperuser
```

Nhập thông tin:
- Username: `admin`
- Email: `admin@example.com`
- Password: (nhập mật khẩu mạnh)

### 5.3. Frontend Setup

#### Bước 1: Vào thư mục frontend

```bash
cd ../frontend
```

#### Bước 2: Cài đặt Dependencies

```bash
npm install
```

Nếu gặp lỗi, thử:
```bash
npm install --legacy-peer-deps
```

#### Bước 3: Tạo file .env

Tạo file `.env` trong thư mục `frontend/`:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

---

## 6. Cấu hình Environment Variables

### 6.1. Backend (.env)

Tạo file `backend/.env` với nội dung:

```env
# Django Settings
SECRET_KEY=django-insecure-your-secret-key-change-this-in-production-123456789
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database - Option 1: DATABASE_URL (cho online PostgreSQL) - KHUYẾN NGHỊ
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# Database - Option 2: Config riêng lẻ (cho local PostgreSQL)
# DB_NAME=recruitment_db
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_HOST=localhost
# DB_PORT=5432

# Email (Gmail)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# AI API (Optional)
GEMINI_API_KEY=your-gemini-api-key

# Redis (Optional - cho Celery)
REDIS_URL=redis://localhost:6379/0
```

**Lưu ý:**
- **SECRET_KEY:** Tạo key mới bằng lệnh:
  ```bash
  python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
  ```
- **EMAIL_HOST_PASSWORD:** Dùng App Password của Gmail (không phải mật khẩu thường)
  - Vào Google Account → Security → 2-Step Verification → App Passwords
- **GEMINI_API_KEY:** Lấy từ https://makersuite.google.com/app/apikey

### 6.2. Frontend (.env)

Tạo file `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### 6.3. Setup Database

#### Option 1: PostgreSQL Online (Khuyến nghị)

**Neon.tech (Miễn phí):**
1. Đăng ký tại https://neon.tech
2. Tạo project mới
3. Copy **Connection String**
4. Dán vào `DATABASE_URL` trong file `.env`

**Supabase (Miễn phí):**
1. Đăng ký tại https://supabase.com
2. Tạo project mới
3. Vào Settings → Database
4. Copy **Connection String**
5. Dán vào `DATABASE_URL` trong file `.env`

#### Option 2: PostgreSQL Local

**Tạo Database:**

**Windows (pgAdmin hoặc psql):**
```sql
CREATE DATABASE recruitment_db;
CREATE USER recruitment_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE recruitment_db TO recruitment_user;
```

**Mac/Linux:**
```bash
sudo -u postgres psql
```

Trong psql:
```sql
CREATE DATABASE recruitment_db;
CREATE USER recruitment_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE recruitment_db TO recruitment_user;
\q
```

**Cấu hình trong .env:**
```env
DB_NAME=recruitment_db
DB_USER=recruitment_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

---

## 7. Chạy dự án

### 7.1. Development Mode

**Terminal 1 - Backend Server:**
```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

python manage.py runserver
```

Backend sẽ chạy tại: http://localhost:8000

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

**Terminal 3 - Celery Worker (Optional):**

Nếu cần chạy background tasks (email, AI screening):

```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

celery -A recruitment_system worker -l info
```

**Lưu ý:** Cần cài Redis trước:
- Windows: Tải từ https://github.com/microsoftarchive/redis/releases
- Mac: `brew install redis && brew services start redis`
- Linux: `sudo apt install redis-server && sudo systemctl start redis`

### 7.2. Kiểm tra hoạt động

1. **Backend:** Mở http://localhost:8000/admin và đăng nhập
2. **Frontend:** Mở http://localhost:3000 và đăng ký/đăng nhập
3. **API:** Mở http://localhost:8000/api/jobs/ (nếu thấy JSON → API hoạt động)

---

## 8. Troubleshooting

### Lỗi: `ModuleNotFoundError: No module named 'dotenv'`

```bash
pip install python-dotenv
```

### Lỗi: `django.db.utils.OperationalError: connection refused`

- Kiểm tra PostgreSQL đang chạy
- Kiểm tra thông tin database trong `.env`
- Kiểm tra DATABASE_URL format đúng

### Lỗi: `Port 8000 already in use`

**Windows:**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:8000 | xargs kill -9
```

### Lỗi: `npm ERR! code ELIFECYCLE`

```bash
# Xóa và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: `CORS error`

Kiểm tra `CORS_ALLOWED_ORIGINS` trong `backend/recruitment_system/settings.py` có chứa `http://localhost:3000`

### Lỗi: `UnicodeDecodeError` khi load .env

File `.env` bị encoding sai. Tạo lại bằng:
- Windows: Notepad → Save As → Encoding: UTF-8
- Mac/Linux: `echo "..." > .env` (UTF-8)

### Lỗi: `401 Unauthorized` khi đăng ký/đăng nhập

- Kiểm tra backend đang chạy
- Kiểm tra `REACT_APP_API_URL` trong frontend `.env` đúng
- Kiểm tra CORS settings

---

## 9. Deployment

### 9.1. Backend Deployment

#### Railway (Khuyến nghị)

1. Đăng ký tại https://railway.app
2. Tạo New Project → Deploy from GitHub repo
3. Add PostgreSQL service
4. Set environment variables:
   - `SECRET_KEY`
   - `DEBUG=False`
   - `ALLOWED_HOSTS=your-domain.com`
   - `DATABASE_URL` (tự động từ PostgreSQL service)
5. Set start command: `python manage.py runserver 0.0.0.0:$PORT`
6. Deploy tự động khi push code

#### Render

1. Đăng ký tại https://render.com
2. New → Web Service → Connect GitHub repo
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `gunicorn recruitment_system.wsgi:application`
5. Add PostgreSQL database
6. Set environment variables

#### Heroku

```bash
heroku login
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS=your-app.herokuapp.com
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

### 9.2. Frontend Deployment

#### Vercel (Khuyến nghị)

1. Đăng ký tại https://vercel.com
2. Import GitHub repo
3. Framework Preset: Create React App
4. Root Directory: `frontend`
5. Build Command: `npm run build`
6. Output Directory: `build`
7. Environment Variables:
   - `REACT_APP_API_URL=https://your-api-domain.com/api`
8. Deploy tự động

#### Netlify

1. Đăng ký tại https://netlify.com
2. New site from Git
3. Base directory: `frontend`
4. Build command: `npm run build`
5. Publish directory: `frontend/build`
6. Environment Variables:
   - `REACT_APP_API_URL=https://your-api-domain.com/api`

### 9.3. Post-Deployment Checklist

- [ ] Database migrations đã chạy
- [ ] Superuser đã tạo
- [ ] Environment variables đã set
- [ ] `DEBUG=False`
- [ ] `ALLOWED_HOSTS` đã cấu hình
- [ ] CORS đã cấu hình với domain production
- [ ] SSL/HTTPS đã setup
- [ ] Static files đã collect (nếu cần)
- [ ] Email đã test
- [ ] API endpoints hoạt động
- [ ] Frontend kết nối được với API

---

## 10. Quy trình làm việc

### 10.1. Clone và Setup

```bash
git clone <repository-url>
cd DoAnPTPMHDT
```

Làm theo hướng dẫn setup ở trên.

### 10.2. Tạo Branch mới

```bash
git checkout -b feature/ten-tinh-nang
# hoặc
git checkout -b fix/ten-bug
```

### 10.3. Code Standards

**Backend (Python/Django):**
- Tuân thủ PEP 8
- Sử dụng type hints khi có thể
- Viết docstrings cho functions/classes
- Tên biến/functions rõ ràng, tiếng Anh

**Frontend (React):**
- Sử dụng functional components
- Hooks thay vì class components
- Tên components PascalCase
- Tên files match với component name

### 10.4. Commit Messages

Format: `[type]: mô tả ngắn gọn`

Types:
- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Cập nhật documentation
- `style`: Formatting
- `refactor`: Refactor code
- `test`: Thêm/sửa tests
- `chore`: Cập nhật build, dependencies

Ví dụ:
```
feat: thêm tính năng sàng lọc CV bằng AI
fix: sửa lỗi đăng nhập không hoạt động
docs: cập nhật README với hướng dẫn setup
```

### 10.5. Testing

Trước khi commit, đảm bảo:
- Code chạy được không lỗi
- Test các tính năng đã thay đổi
- Không có console errors

### 10.6. Pull Request

1. Push code lên branch của bạn
2. Tạo Pull Request trên GitHub
3. Mô tả rõ những gì đã thay đổi
4. Đợi review từ team

---

## 📁 Cấu trúc dự án

```
DoAnPTPMHDT/
├── backend/                    # Django Backend
│   ├── recruitment_system/     # Django project settings
│   ├── accounts/               # User authentication
│   ├── jobs/                   # Job posting
│   ├── applications/           # Applications & CVs
│   ├── notifications/          # Notifications
│   ├── manage.py
│   ├── requirements.txt
│   └── .env                    # Environment variables (tạo từ .env.example)
│
├── frontend/                   # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── contexts/           # React Context (Auth)
│   │   ├── services/           # API services
│   │   └── App.js
│   ├── package.json
│   └── .env                    # Environment variables
│
├── docs/                       # Documentation
│   ├── 01-database-design.md
│   ├── 02-system-architecture.md
│   ├── 03-api-endpoints.md
│   └── ...
│
├── SETUP.md                    # File này
└── .gitignore
```

---

## ✅ Checklist Setup

- [ ] Python 3.10+ đã cài đặt
- [ ] Node.js 18+ đã cài đặt
- [ ] Git đã cài đặt
- [ ] Database đã setup (online hoặc local)
- [ ] Backend virtual environment đã tạo và activate
- [ ] Backend dependencies đã cài đặt
- [ ] Backend .env đã tạo và cấu hình
- [ ] Backend migrations đã chạy
- [ ] Backend superuser đã tạo
- [ ] Frontend dependencies đã cài đặt
- [ ] Frontend .env đã tạo
- [ ] Backend server chạy được
- [ ] Frontend server chạy được
- [ ] Có thể đăng nhập vào Django admin
- [ ] Có thể đăng nhập vào frontend

---

## 📞 Cần hỗ trợ?

Nếu gặp vấn đề:
1. Kiểm tra lại các bước trên
2. Xem phần Troubleshooting
3. Tạo issue trên GitHub với thông tin lỗi chi tiết

---

## 🎯 Quick Commands

### Backend
```bash
# Activate venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Migrations
python manage.py migrate
python manage.py makemigrations

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver

# Collect static (production)
python manage.py collectstatic
```

### Frontend
```bash
# Install
npm install

# Start dev server
npm start

# Build for production
npm run build

# Test
npm test
```

---

**Chúc bạn setup và làm việc thành công! 🎉**

