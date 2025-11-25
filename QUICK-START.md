# 🚀 HƯỚNG DẪN CHẠY DỰ ÁN - TỪNG BƯỚC CHI TIẾT

## ⚠️ ĐỌC KỸ TRƯỚC KHI BẮT ĐẦU

File này hướng dẫn **TỪNG BƯỚC CHÍNH XÁC** để chạy được dự án.  
Làm theo **ĐÚNG THỨ TỰ**, không skip bước nào.

---

## 📝 CHECKLIST TRƯỚC KHI BẮT ĐẦU

Copy checklist này vào notepad, tick ✅ khi hoàn thành mỗi bước:

```
[ ] Đã cài Python 3.10+
[ ] Đã cài Node.js 18+
[ ] Đã cài PostgreSQL 15+
[ ] Đã cài Redis (Docker hoặc native)
[ ] Đã cài Git
[ ] Đã có Gemini API key (hoặc OpenAI)
[ ] Đã setup Gmail App Password (cho gửi email)
```

---

## BƯỚC 1: CÀI ĐẶT POSTGRESQL VÀ TẠO DATABASE

### 1.1. Cài PostgreSQL

- Download: https://www.postgresql.org/download/windows/
- Khi cài, nhớ password của postgres user
- Tick vào "pgAdmin 4" (GUI tool)

### 1.2. Tạo Database

**Cách 1: Dùng pgAdmin 4**

1. Mở pgAdmin 4
2. Connect với password đã nhập khi cài
3. Right-click "Databases" → Create → Database
4. Name: `recruitment_db`
5. Save

**Cách 2: Dùng SQL Shell (psql)**

```cmd
# Mở "SQL Shell (psql)" từ Start Menu
# Nhấn Enter để dùng default cho Server, Database, Port, Username
# Nhập password của postgres

# Sau khi login, chạy:
CREATE DATABASE recruitment_db;
CREATE USER admin WITH PASSWORD '123456';
GRANT ALL PRIVILEGES ON DATABASE recruitment_db TO admin;
ALTER USER admin CREATEDB;

# Kiểm tra:
\l
# Phải thấy recruitment_db trong list

# Thoát:
\q
```

### 1.3. Test Connection

```cmd
psql -U admin -d recruitment_db
# Nhập password: 123456
# Nếu login được → OK
\q
```

---

## BƯỚC 2: CÀI ĐẶT REDIS

### Option A: Docker (KHUYẾN NGHỊ - DỄ NHẤT)

```cmd
# 1. Cài Docker Desktop: https://www.docker.com/products/docker-desktop
# 2. Sau khi cài xong và mở Docker Desktop, chạy:

docker run -d --name redis -p 6379:6379 redis:alpine

# Kiểm tra Redis đang chạy:
docker ps
# Phải thấy container "redis"

# Test Redis:
docker exec -it redis redis-cli ping
# Phải trả về: PONG
```

### Option B: Windows Native

```cmd
# Download: https://github.com/tporadowski/redis/releases
# Tải file .msi, cài đặt
# Redis sẽ tự chạy như Windows Service

# Test:
redis-cli ping
# Phải trả về: PONG
```

---

## BƯỚC 3: SETUP BACKEND (DJANGO)

### 3.1. Mở CMD/PowerShell, di chuyển vào folder backend

```cmd
cd d:\DoAnPTPMHDT\backend
```

### 3.2. Tạo Virtual Environment

```cmd
# Tạo venv
python -m venv venv

# Activate (CMD)
venv\Scripts\activate

# Activate (PowerShell) - nếu gặp lỗi, chạy lệnh dưới trước:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
venv\Scripts\Activate.ps1

# Sau khi activate, prompt sẽ có (venv) ở đầu dòng:
# (venv) d:\DoAnPTPMHDT\backend>
```

### 3.3. Upgrade pip

```cmd
python -m pip install --upgrade pip
```

### 3.4. Cài đặt Dependencies

```cmd
pip install -r requirements.txt

# ⏱️ Quá trình này mất 2-5 phút
# Nếu gặp lỗi psycopg2, chạy:
pip install psycopg2-binary --force-reinstall
```

### 3.5. Tạo file .env

**Tạo file mới:** `backend\.env`

**Copy nội dung này vào:**

```env
# Django
SECRET_KEY=django-insecure-your-secret-key-change-this-123456789
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=recruitment_db
DB_USER=admin
DB_PASSWORD=123456
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379/0

# Email (Gmail - TẠM THỜI ĐỂ TRỐNG, SẼ CONFIG SAU)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=

# AI API (TẠM THỜI ĐỂ TRỐNG, SẼ CONFIG SAU)
GEMINI_API_KEY=

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Media
MEDIA_URL=/media/
MEDIA_ROOT=media
```

**LƯU Ý:**

- Giữ nguyên `DB_PASSWORD=123456` (hoặc password bạn đã set ở bước 1.2)
- Email và Gemini API có thể config sau

### 3.6. Tạo Django Project Structure

```cmd
# Nếu chưa có manage.py, chạy:
django-admin startproject recruitment_system .

# ⚠️ Lưu ý dấu . ở cuối
```

**Copy tất cả file đã tạo** (models.py, views.py, serializers.py, urls.py, admin.py) vào các app tương ứng.

### 3.7. Chạy Migrations

```cmd
# Tạo migrations
python manage.py makemigrations accounts
python manage.py makemigrations jobs
python manage.py makemigrations applications
python manage.py makemigrations notifications

# Áp dụng migrations
python manage.py migrate

# ⚠️ Nếu gặp lỗi "no such table", chạy:
python manage.py migrate --run-syncdb
```

### 3.8. Tạo Superuser

```cmd
python manage.py createsuperuser

# Nhập thông tin:
Email address: admin@recruitment.com
Email: admin@recruitment.com
Username: admin
First name: admin
Last name: 
Password: admin123456
Password (again): admin123456
Bypass password validation? y
```

### 3.9. TEST CHẠY SERVER

```cmd
python manage.py runserver

# Phải thấy:
# Starting development server at http://127.0.0.1:8000/
# Quit the server with CTRL-BREAK.
```

**MỞ BROWSER, TRUY CẬP:**

- http://localhost:8000/admin/

  - Login: admin@recruitment.com / admin123456
  - Phải vào được admin panel ✅

- http://localhost:8000/api/
  - Phải thấy Django REST framework API root ✅

**NẾU THẤY 2 TRANG TRÊN → BACKEND SETUP THÀNH CÔNG! 🎉**

---

## BƯỚC 4: SEED DỮ LIỆU TEST

### 4.1. Tạo file seed_data.py

**File:** `backend\seed_data.py`

**Copy nội dung từ file DJANGO-SETUP-GUIDE.md (section 5.3)**

### 4.2. Chạy seed

```cmd
# Đảm bảo vẫn ở folder backend và venv đã activate
python seed_data.py

# Phải thấy:
# ✅ Seed data created successfully!
```

### 4.3. Kiểm tra

- Vào http://localhost:8000/admin/
- Click "Jobs" → phải thấy 2 jobs
- Click "Users" → phải thấy 3 users

---

## BƯỚC 5: SETUP FRONTEND (REACT)

### 5.1. Mở Terminal MỚI (giữ backend chạy)

```cmd
cd d:\DoAnPTPMHDT\frontend
```

### 5.2. Cài đặt Dependencies

```cmd
npm install

# ⏱️ Mất 3-5 phút
```

### 5.3. Cài Tailwind CSS

```cmd
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 5.4. Tạo file .env

**File:** `frontend\.env`

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### 5.5. Cấu hình Tailwind

**File:** `frontend\tailwind.config.js`

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

**File:** `frontend\src\index.css` (thêm vào đầu file)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5.6. TEST CHẠY FRONTEND

```cmd
npm start

# Browser tự mở http://localhost:3000
# Phải thấy React logo xoay xoay ✅
```

---

## BƯỚC 6: CHẠY TẤT CẢ (FINAL SETUP)

### Bạn cần 3 terminals (CMD/PowerShell):

**Terminal 1 - Backend:**

```cmd
cd d:\DoAnPTPMHDT\backend
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 - Frontend:**

```cmd
cd d:\DoAnPTPMHDT\frontend
npm start
```

**Terminal 3 - Celery (optional, cho background jobs):**

```cmd
cd d:\DoAnPTPMHDT\backend
venv\Scripts\activate
celery -A recruitment_system worker -l info --pool=solo
```

**Terminal 4 - Redis (nếu dùng Docker):**

```cmd
docker start redis
```

---

## BƯỚC 7: KIỂM TRA HOÀN TẤT

### ✅ Checklist cuối cùng:

1. **Backend API:**

   - [ ] http://localhost:8000/api/ - Thấy API root
   - [ ] http://localhost:8000/admin/ - Login được
   - [ ] http://localhost:8000/api/jobs/ - Thấy danh sách jobs

2. **Frontend:**

   - [ ] http://localhost:3000 - React app chạy

3. **Database:**

   - [ ] pgAdmin 4 connect được
   - [ ] Thấy tables: users, jobs, applications, etc.

4. **Redis:**
   - [ ] `redis-cli ping` → PONG

---

## 🐛 TROUBLESHOOTING NHANH

### Lỗi: "ModuleNotFoundError: No module named 'xxx'"

```cmd
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Lỗi: "FATAL: password authentication failed"

```cmd
# Kiểm tra file .env:
DB_PASSWORD=123456
# Phải khớp với password trong PostgreSQL
```

### Lỗi: "Redis connection refused"

```cmd
# Kiểm tra Redis:
docker ps
redis-cli ping

# Nếu không chạy:
docker start redis
```

### Lỗi: "Port 8000 already in use"

```cmd
# Tìm và kill process:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Lỗi: "npm: command not found"

```cmd
# Cài Node.js: https://nodejs.org/
# Restart terminal sau khi cài
```

---

## 📚 NEXT STEPS - SAU KHI SETUP XONG

1. **Config Email (optional):**

   - Lấy Gmail App Password: https://myaccount.google.com/apppasswords
   - Điền vào `EMAIL_HOST_USER` và `EMAIL_HOST_PASSWORD` trong `.env`

2. **Config AI (optional):**

   - Lấy Gemini API key: https://makersuite.google.com/app/apikey
   - Điền vào `GEMINI_API_KEY` trong `.env`

3. **Bắt đầu code features:**

   - Xem `docs/03-api-endpoints.md` cho danh sách API
   - Implement React components trong `frontend/src/`

4. **Test APIs:**
   - Dùng Postman hoặc http://localhost:8000/api/docs/ (Swagger UI)

---

## 🎯 TÓM TẮT LỆNH NHANH (SAU KHI SETUP LẦN ĐẦU)

**Mỗi lần làm việc:**

```cmd
# Terminal 1 - Backend
cd d:\DoAnPTPMHDT\backend
venv\Scripts\activate
python manage.py runserver

# Terminal 2 - Frontend
cd d:\DoAnPTPMHDT\frontend
npm start

# Terminal 3 - Redis (nếu dùng Docker)
docker start redis

# Terminal 4 - Celery (optional)
cd d:\DoAnPTPMHDT\backend
venv\Scripts\activate
celery -A recruitment_system worker -l info --pool=solo
```

---

## ✅ HOÀN THÀNH!

Nếu tất cả bước trên OK, bạn đã setup thành công! 🎉

**Test thử:**

1. Vào admin: http://localhost:8000/admin/
2. Login: admin@recruitment.com / admin123
3. Click "Jobs" → thấy 2 jobs mẫu
4. Mở http://localhost:8000/api/jobs/ → thấy JSON data

**Cần hỗ trợ?**

- Đọc lại file `docs/DJANGO-SETUP-GUIDE.md`
- Check phần Troubleshooting ở trên
- Google lỗi cụ thể
