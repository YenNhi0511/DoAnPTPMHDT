# 🎯 Hệ thống Tuyển dụng Nhân sự

> Django 5.0 + React 18 + PostgreSQL + AI Screening (Google Gemini)

## ✨ Chức năng chính

| Vai trò         | Chức năng                                                                    |
| --------------- | ---------------------------------------------------------------------------- |
| **Candidate**   | Đăng ký/đăng nhập, tìm kiếm việc làm, nộp CV, theo dõi trạng thái ứng tuyển  |
| **Recruiter**   | Đăng tin tuyển dụng, xem CV + điểm AI, lên lịch phỏng vấn, gửi kết quả email |
| **Interviewer** | Xem lịch phỏng vấn, chấm điểm ứng viên                                       |
| **Admin**       | Quản lý user, công ty, tin tuyển dụng, xem thống kê                          |
| **AI**          | Tự động sàng lọc CV, chấm điểm phù hợp với job (Google Gemini)               |

## 📋 Yêu cầu

- **Python** 3.10+
- **Node.js** 18+
- **Git**

## 🚀 Cài đặt & Chạy (Copy paste theo thứ tự)

### 1. Clone project

```bash
git clone https://github.com/YenNhi0511/DoAnPTPMHDT.git
cd DoAnPTPMHDT
```

### 2. Tạo file cấu hình (.env)

**Backend** - Tạo file `backend/.env`:

```env
DATABASE_URL=postgresql://neondb_owner:xxx@xxx.neon.tech/recruitment_db?sslmode=require
SECRET_KEY=django-insecure-your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
GEMINI_API_KEY=your_gemini_api_key

# Email API (Recommended)
RESEND_API_KEY=re_your_resend_api_key  # Get from https://resend.com (100 emails/day free)

# Email SMTP (Optional backup)
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True

FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
```

**Frontend** - Tạo file `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

> ⚠️ Liên hệ nhóm trưởng để lấy nội dung file `.env` thật

### 3. Setup Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
```

### 4. Setup Frontend

```bash
cd ../frontend
npm install
```

### 5. Chạy toàn bộ project

```bash
start-all.bat
```

> Lệnh này sẽ tự động chạy Backend + Frontend cùng lúc

### 6. Chạy thủ công (nếu cần)

**Terminal 1 - Backend:**

```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run start:admin
```

### 7. Truy cập

| Role      | URL                   | Tài khoản                     |
| --------- | --------------------- | ----------------------------- |
| Admin     | http://localhost:3003 | admin@goodcv.com / admin123   |
| Recruiter | http://localhost:3002 | recruiter@goodcv.com / 123456 |
| Candidate | http://localhost:3001 | (tự đăng ký)                  |

---

## ⚡ Chạy nhanh (Windows)

Double-click file `START-PROJECT-COMPLETE.bat` → Tự động chạy tất cả

---

## 🔧 Các lệnh khác

```bash
# Chạy từng role riêng
npm run start:admin      # Port 3003
npm run start:recruiter  # Port 3002
npm run start:candidate  # Port 3001

# Chạy Celery Worker (AI screening)
cd backend
celery -A recruitment_system worker -l info
```

---

## 📁 Cấu trúc

```
DoAnPTPMHDT/
├── backend/          # Django REST API
├── frontend/         # React App
├── docs/             # Tài liệu yêu cầu nghiệp vụ
└── database/         # Database scripts
```

---

## ❓ Lỗi thường gặp

| Lỗi                   | Cách sửa                           |
| --------------------- | ---------------------------------- |
| `ModuleNotFoundError` | Chạy `venv\Scripts\activate` trước |
| `npm not found`       | Cài Node.js từ https://nodejs.org  |
| Port 8000 đã dùng     | `taskkill /F /IM python.exe`       |
| Port 3000 đã dùng     | `taskkill /F /IM node.exe`         |

---

## 👨‍💻 Nhóm thực hiện

Đồ án môn Phát triển phần mềm hướng đối tượng
