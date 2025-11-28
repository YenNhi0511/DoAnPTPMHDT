# 🎯 Hệ thống Tuyển dụng Nhân sự

Hệ thống quản lý tuyển dụng nhân sự toàn diện với AI-powered CV screening, quản lý phỏng vấn, và báo cáo thống kê.

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![Django](https://img.shields.io/badge/Django-5.0-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)

## 📋 Mục lục

- [Tính năng](#-tính-năng-chính)
- [Tech Stack](#️-tech-stack)
- [Cài đặt nhanh](#-cài-đặt-nhanh-5-phút)
- [Cài đặt chi tiết](#-cài-đặt-chi-tiết)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Environment Variables](#-environment-variables)
- [Chạy dự án](#-chạy-dự-án)
- [Troubleshooting](#-troubleshooting)
- [API Documentation](#-api-documentation)

## ✨ Tính năng chính

- ✅ **Quản lý quy trình tuyển dụng** - Tạo và quản lý các quy trình tuyển dụng tùy chỉnh
- ✅ **Đăng tin tuyển dụng** - Tạo và quản lý các tin tuyển dụng
- ✅ **Nhận hồ sơ ứng viên** - Upload và quản lý CV
- ✅ **Sàng lọc AI tự động** - Sử dụng Google Gemini API để sàng lọc CV
- ✅ **Gửi email tự động** - Thông báo kết quả, lịch phỏng vấn
- ✅ **Quản lý phỏng vấn** - Đặt lịch, quản lý hội đồng phỏng vấn
- ✅ **Kết quả tuyển dụng** - Lưu trữ và quản lý kết quả
- ✅ **Tạo thư mời nhận việc** - PDF generation
- ✅ **Báo cáo thống kê** - Dashboard với charts và analytics
- ✅ **Admin Panel** - Giao diện quản trị đầy đủ

## 🛠️ Tech Stack

### Backend

- **Django 5.0** - Web framework
- **Django REST Framework 3.14** - API framework
- **PostgreSQL** - Database (hỗ trợ Neon, Supabase, Railway)
- **Celery + Redis** - Background jobs
- **Google Gemini API** - AI CV screening
- **JWT** - Authentication

### Frontend

- **React 18** - UI library
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Recharts** - Charts & Analytics
- **Axios** - HTTP client

## 🚀 Cài đặt nhanh (5 phút)

### Yêu cầu

- Python 3.10+
- Node.js 18+
- PostgreSQL (hoặc Neon/Supabase online)
- Git

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd DoAnPTPMHDT
```

### Bước 2: Backend Setup

```bash
# Vào thư mục backend
cd backend

# Tạo virtual environment
python -m venv venv

# Activate venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Tạo file .env (xem phần Environment Variables)
# Copy .env.example và điền thông tin

# Chạy migrations
python manage.py migrate

# Tạo superuser
python manage.py createsuperuser
```

### Bước 3: Frontend Setup

```bash
# Vào thư mục frontend
cd ../frontend

# Cài đặt dependencies
npm install

# Tạo file .env (xem phần Environment Variables)
```

### Bước 4: Chạy dự án

```bash
# Terminal 1: Backend
cd backend
venv\Scripts\activate  # hoặc source venv/bin/activate
python manage.py runserver

# Terminal 2: Frontend
cd frontend
npm start
```

Truy cập: http://localhost:3000

## 📖 Cài đặt chi tiết

👉 **Xem file [SETUP.md](./SETUP.md) để có hướng dẫn đầy đủ từng bước.**

## 📁 Cấu trúc dự án

```
DoAnPTPMHDT/
├── backend/                    # Django Backend
│   ├── recruitment_system/     # Django project settings
│   ├── accounts/               # User authentication & management
│   ├── jobs/                   # Job posting management
│   ├── applications/           # Application & CV management
│   ├── notifications/          # Notification system
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
├── SETUP-GUIDE.md              # Hướng dẫn setup chi tiết
├── README.md                   # File này
└── .gitignore
```

## 🔑 Environment Variables

### Backend (.env)

Tạo file `backend/.env` từ `backend/.env.example`:

```env
# Django Settings
SECRET_KEY=your-secret-key-here-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database - Option 1: DATABASE_URL (cho online PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# Database - Option 2: Config riêng lẻ (cho local PostgreSQL)
# DB_NAME=recruitment_db
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_HOST=localhost
# DB_PORT=5432

# Email Configuration (Gmail)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# AI API
GEMINI_API_KEY=your-gemini-api-key

# Redis (cho Celery - optional)
REDIS_URL=redis://localhost:6379/0
```

### Frontend (.env)

Tạo file `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## ▶️ Chạy dự án

### Development Mode

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

**Terminal 3 - Celery Worker (Optional):**

```bash
cd backend
venv\Scripts\activate
celery -A recruitment_system worker -l info
```

### Truy cập

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **Django Admin:** http://localhost:8000/admin

## 🔧 Troubleshooting

### Lỗi: ModuleNotFoundError

```bash
# Đảm bảo đã activate venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Cài lại dependencies
pip install -r requirements.txt
```

### Lỗi: Database connection

- Kiểm tra file `.env` có đúng thông tin database
- Đảm bảo PostgreSQL đang chạy (nếu dùng local)
- Kiểm tra DATABASE_URL format đúng

### Lỗi: Port already in use

```bash
# Windows: Tìm process dùng port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

### Lỗi: npm install fails

```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

## 📚 API Documentation

Sau khi chạy backend, truy cập:

- **Swagger UI:** http://localhost:8000/api/schema/swagger-ui/
- **ReDoc:** http://localhost:8000/api/schema/redoc/

Xem chi tiết trong [docs/03-api-endpoints.md](./docs/03-api-endpoints.md)

## 👤 Default Users

Sau khi tạo superuser:

- Username: `admin`
- Password: (mật khẩu bạn đặt khi tạo superuser)

## 🧪 Testing

```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Backend (Railway/Heroku/Render)

1. Tạo PostgreSQL database online (Neon/Supabase)
2. Set environment variables trên platform
3. Deploy code

### Frontend (Vercel/Netlify)

1. Set `REACT_APP_API_URL` trong environment variables
2. Deploy code

Xem chi tiết trong [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🤝 Đóng góp

Đây là đồ án môn học. Nếu có vấn đề, vui lòng tạo issue.

## 📝 License

MIT License

## 👨‍💻 Tác giả

Nhóm đồ án - [Tên trường/Lớp]

## 📞 Liên hệ

- Email: your-email@example.com
- GitHub: [repository-url]

---

**⭐ Nếu project này hữu ích, hãy star repository!**
