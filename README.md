# Hệ thống Tuyển dụng Nhân sự

**Tech Stack:** Django + Django REST Framework (Backend) + React (Frontend) + PostgreSQL

## 📋 Tính năng chính

- ✅ Thiết lập quy trình tuyển dụng
- ✅ Đăng thông tin tuyển dụng
- ✅ Nhận hồ sơ ứng viên (upload CV)
- ✅ Sàng lọc đánh giá tự động với AI (Gemini/OpenAI)
- ✅ Gửi thông tin kết quả đến ứng viên (email)
- ✅ Đặt lịch phỏng vấn
- ✅ Lập hội đồng tổ chức tuyển dụng
- ✅ Quản lý và lưu trữ kết quả tuyển dụng
- ✅ Tạo thư mời nhận việc (PDF)
- ✅ Báo cáo thống kê tình hình tuyển dụng

## 🛠️ Tech Stack

### Backend

- **Django 5.0** - Web framework
- **Django REST Framework 3.14** - API framework
- **PostgreSQL 15+** - Database
- **Celery + Redis** - Background jobs (email, AI screening)
- **Google Gemini API** - AI CV screening
- **Pillow** - Image processing
- **python-docx, PyPDF2** - CV parsing

### Frontend

- **React 18** - UI library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Recharts** - Charts
- **React Hook Form** - Form handling

## 📁 Cấu trúc dự án

```
DoAnPTPMHDT/
├── backend/                  # Django project
│   ├── recruitment_system/   # Django project settings
│   ├── accounts/             # User authentication
│   ├── jobs/                 # Job management
│   ├── applications/         # Application management
│   ├── interviews/           # Interview scheduling
│   ├── notifications/        # Notification system
│   ├── reports/              # Reports & analytics
│   ├── media/                # Uploaded files (CVs)
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/                 # React app
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── docs/                     # Documentation
│   ├── 01-database-design.md
│   ├── 02-system-architecture.md
│   ├── 03-api-endpoints.md
│   ├── 04-setup-guide.md
│   └── DJANGO-SETUP-GUIDE.md  ← Hướng dẫn chi tiết
│
└── README.md
```

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 15+
- Redis (cho Celery)

### 2. Backend Setup

```bash
cd backendcd
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 4. Run Celery Worker (terminal mới)

```bash
cd backend
celery -A recruitment_system worker -l info
```

## 📖 Hướng dẫn chi tiết

Xem file `docs/DJANGO-SETUP-GUIDE.md` để có hướng dẫn đầy đủ từng bước.

## 🔑 Environment Variables

### Backend (.env)

```
SECRET_KEY=your-django-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost:5432/recruitment_db
REDIS_URL=redis://localhost:6379/0
GEMINI_API_KEY=your-gemini-api-key
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:8000/api
```

## 📊 Database Schema

Xem `docs/01-database-design.md` để biết chi tiết về database design.

## 🌐 API Endpoints

Xem `docs/03-api-endpoints.md` để biết danh sách đầy đủ các API.

## 👤 Default Users (sau khi seed)

- **Admin:** admin@recruitment.com / admin123
- **Recruiter:** recruiter@recruitment.com / recruiter123
- **Candidate:** candidate@recruitment.com / candidate123

## 📸 Screenshots

(Sẽ cập nhật sau khi hoàn thành UI)

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

### Backend (Heroku/Railway)

```bash
# Heroku
heroku create recruitment-api
git push heroku main

# Railway
railway init
railway up
```

### Frontend (Vercel/Netlify)

```bash
# Vercel
vercel deploy

# Netlify
netlify deploy
```

## 🤝 Đóng góp

Đây là đồ án môn học, không nhận PR.

## 📝 License

MIT License

## 👨‍💻 Tác giả

[Tên nhóm/Sinh viên] - [Trường/Lớp]

## 📞 Liên hệ

- Email: your-email@example.com
- GitHub: https://github.com/yourusername
