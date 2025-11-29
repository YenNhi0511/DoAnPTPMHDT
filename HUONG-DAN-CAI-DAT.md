# 🚀 HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN

File này hướng dẫn đầy đủ cách cài đặt và chạy hệ thống tuyển dụng từ đầu đến cuối.

## 📋 YÊU CẦU HỆ THỐNG

Trước khi bắt đầu, đảm bảo bạn đã cài đặt:

- **Python 3.9+** - [Download tại đây](https://www.python.org/downloads/)
- **Node.js 18+** - [Download tại đây](https://nodejs.org/)
- **PostgreSQL** (hoặc sử dụng database online như Neon/Supabase)
- **Git** - [Download tại đây](https://git-scm.com/)
- **Redis** (cho Celery) - Có thể dùng Docker hoặc cài trực tiếp

## 🔧 BƯỚC 1: CLONE REPOSITORY

```bash
git clone <repository-url>
cd DoAnPTPMHDT
```

## 🗄️ BƯỚC 2: CÀI ĐẶT DATABASE

### Option 1: Sử dụng PostgreSQL Local

1. **Cài đặt PostgreSQL:**
   - Download và cài đặt từ [postgresql.org](https://www.postgresql.org/download/)
   - Ghi nhớ password bạn đặt cho user `postgres`

2. **Tạo database:**
   ```sql
   -- Mở pgAdmin hoặc psql
   CREATE DATABASE recruitment_db;
   CREATE USER recruitment_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE recruitment_db TO recruitment_user;
   ```

### Option 2: Sử dụng Database Online (Khuyến nghị)

1. **Tạo tài khoản tại Neon hoặc Supabase:**
   - Neon: https://neon.tech
   - Supabase: https://supabase.com

2. **Copy connection string** từ dashboard của họ

## 🐍 BƯỚC 3: CÀI ĐẶT BACKEND

### 3.1. Tạo Virtual Environment

```bash
cd backend
python -m venv venv
```

### 3.2. Kích hoạt Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 3.3. Cài đặt Dependencies

```bash
pip install -r requirements.txt
```

### 3.4. Tạo file .env

Tạo file `backend/.env` với nội dung:

```env
# Database
DATABASE_URL=postgresql://recruitment_user:your_password@localhost:5432/recruitment_db
# Hoặc nếu dùng online:
# DATABASE_URL=postgresql://user:password@ep-xxx.region.neon.tech/neondb?sslmode=require

# Django Secret Key (tạo mới bằng: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
SECRET_KEY=your-secret-key-here

# Django Settings
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Settings (cho email verification)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

# Celery (Redis)
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Google Gemini API (cho AI CV screening - optional)
GEMINI_API_KEY=your-gemini-api-key-here
```

**Lưu ý:**
- Thay `your_password`, `your-secret-key-here`, `your-email@gmail.com` bằng giá trị thực tế
- Để lấy App Password cho Gmail: [Hướng dẫn](https://support.google.com/accounts/answer/185833)

### 3.5. Chạy Migrations

```bash
python manage.py migrate
```

### 3.6. Tạo Superuser (Admin)

```bash
python manage.py createsuperuser
```

Nhập thông tin:
- Email: admin@example.com
- Username: admin
- Password: (tự đặt)
- First name: Admin
- Last name: User

### 3.7. Tạo dữ liệu mẫu (Optional)

```bash
# Tạo tài khoản và jobs cơ bản
python seed_data.py

# Tạo nhiều companies và jobs đầy đủ
python seed_companies_full.py
```

## ⚛️ BƯỚC 4: CÀI ĐẶT FRONTEND

### 4.1. Cài đặt Dependencies

Mở terminal mới (giữ backend terminal đang chạy):

```bash
cd frontend
npm install
```

### 4.2. Tạo file .env

Tạo file `frontend/.env` với nội dung:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 🔴 BƯỚC 5: CÀI ĐẶT REDIS (CHO CELERY)

### Option 1: Sử dụng Docker (Khuyến nghị)

```bash
# Chạy Redis container
docker run -d --name redis -p 6379:6379 redis:alpine

# Hoặc sử dụng script có sẵn
cd backend
start-redis-docker.bat  # Windows
```

### Option 2: Cài đặt Redis trực tiếp

- **Windows:** Download từ [Memurai](https://www.memurai.com/) hoặc dùng Docker
- **Mac:** `brew install redis` sau đó `brew services start redis`
- **Linux:** `sudo apt-get install redis-server` sau đó `sudo systemctl start redis`

## 🚀 BƯỚC 6: CHẠY DỰ ÁN

Bạn cần mở **4 terminal** để chạy tất cả các service:

### Terminal 1: Backend Server

```bash
cd backend
venv\Scripts\activate  # Windows
# hoặc: source venv/bin/activate  # Mac/Linux
python manage.py runserver
```

Backend sẽ chạy tại: http://localhost:8000

### Terminal 2: Celery Worker

```bash
cd backend
venv\Scripts\activate  # Windows
celery -A recruitment_system worker -l info --pool=solo
```

**Lưu ý:** `--pool=solo` chỉ cần cho Windows. Mac/Linux không cần.

### Terminal 3: Redis (nếu không dùng Docker)

```bash
# Chỉ cần nếu không dùng Docker
redis-server
```

### Terminal 4: Frontend

```bash
cd frontend
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

## ✅ BƯỚC 7: KIỂM TRA

1. **Kiểm tra Backend:**
   - Truy cập: http://localhost:8000/api/
   - Truy cập Admin: http://localhost:8000/admin/
   - Đăng nhập với superuser đã tạo

2. **Kiểm tra Frontend:**
   - Truy cập: http://localhost:3000
   - Trang chủ sẽ hiển thị danh sách việc làm

3. **Test đăng ký/đăng nhập:**
   - Click "Đăng ký" để tạo tài khoản mới
   - Chọn "Cá nhân" hoặc "Doanh nghiệp"
   - Đăng nhập và kiểm tra các chức năng

## 📝 TÀI KHOẢN MẪU

Sau khi chạy `seed_data.py`, bạn có thể dùng các tài khoản sau:

- **Admin:**
  - Email: `admin@recruitment.com`
  - Password: `admin123`

- **Recruiter:**
  - Email: `recruiter@recruitment.com`
  - Password: `recruiter123`

- **Candidate:**
  - Email: `candidate@recruitment.com`
  - Password: `candidate123`

## 🎯 CÁC TÍNH NĂNG CHÍNH

### Cho Ứng viên (CANDIDATE):
- ✅ Tìm kiếm việc làm với bộ lọc nâng cao
- ✅ Xem chi tiết công việc
- ✅ Ứng tuyển với CV
- ✅ Xem trạng thái ứng tuyển
- ✅ Quản lý hồ sơ cá nhân

### Cho Nhà tuyển dụng (ADMIN/RECRUITER):
- ✅ Đăng tin tuyển dụng
- ✅ Quản lý hồ sơ ứng tuyển
- ✅ AI screening CV tự động
- ✅ Lên lịch phỏng vấn
- ✅ Quản lý kết quả tuyển dụng
- ✅ Xem báo cáo thống kê

## 🐛 XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi: "ModuleNotFoundError"
```bash
# Đảm bảo đã activate virtual environment
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Lỗi: "Database connection failed"
- Kiểm tra PostgreSQL đang chạy
- Kiểm tra `DATABASE_URL` trong `.env` đúng chưa
- Kiểm tra username/password

### Lỗi: "Redis connection failed"
- Kiểm tra Redis đang chạy: `redis-cli ping` (phải trả về PONG)
- Nếu dùng Docker: `docker ps` để xem container có chạy không

### Lỗi: "Port already in use"
- Backend (8000): Đổi port trong `manage.py runserver 8001`
- Frontend (3000): Hỏi khi chạy `npm start`, chọn Y để dùng port khác
- Redis (6379): Đổi port trong Docker hoặc config Redis

### Lỗi: "Email verification không gửi được"
- Kiểm tra `EMAIL_HOST_USER` và `EMAIL_HOST_PASSWORD` trong `.env`
- Với Gmail, cần dùng App Password, không dùng password thường
- Kiểm tra Celery worker đang chạy (email được gửi qua Celery)

## 📚 TÀI LIỆU THAM KHẢO

- **Backend API:** http://localhost:8000/api/
- **Django Admin:** http://localhost:8000/admin/
- **API Documentation:** Xem file `docs/03-api-endpoints.md`

## 🔐 BẢO MẬT

**Lưu ý quan trọng:**
- ⚠️ File `.env` chứa thông tin nhạy cảm, **KHÔNG** commit lên Git
- ⚠️ Trong production, đặt `DEBUG=False`
- ⚠️ Sử dụng secret key mạnh cho `SECRET_KEY`
- ⚠️ Cấu hình `ALLOWED_HOSTS` đúng domain

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Kiểm tra lại các bước trên
2. Xem file `README.md` để biết thêm chi tiết
3. Kiểm tra logs trong terminal để xem lỗi cụ thể
4. Xem các file hướng dẫn trong thư mục `backend/`:
   - `FIX-DATABASE.md` - Sửa lỗi database
   - `CELERY-SETUP.md` - Cài đặt Celery
   - `INSTALL-REDIS-WINDOWS.md` - Cài Redis trên Windows

## 🎉 HOÀN TẤT!

Nếu tất cả các bước trên đều thành công, bạn đã sẵn sàng sử dụng hệ thống!

**Truy cập:** http://localhost:3000 để bắt đầu.

---

**Chúc bạn thành công! 🚀**

