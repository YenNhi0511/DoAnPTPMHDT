# 📘 Hướng dẫn Setup Chi tiết - Hệ thống Tuyển dụng Nhân sự

Hướng dẫn từng bước chi tiết để setup và chạy dự án từ đầu đến cuối.

---

## 📋 Mục lục

1. [Yêu cầu hệ thống](#1-yêu-cầu-hệ-thống)
2. [Cài đặt công cụ cần thiết](#2-cài-đặt-công-cụ-cần-thiết)
3. [Clone và chuẩn bị project](#3-clone-và-chuẩn-bị-project)
4. [Setup Database](#4-setup-database)
5. [Setup Backend](#5-setup-backend-từng-bước)
6. [Setup Frontend](#6-setup-frontend-từng-bước)
7. [Cấu hình Environment Variables](#7-cấu-hình-environment-variables)
8. [Chạy dự án](#8-chạy-dự-án)
9. [Kiểm tra hoạt động](#9-kiểm-tra-hoạt-động)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Yêu cầu hệ thống

Trước khi bắt đầu, đảm bảo máy bạn có:

- **Windows 10/11** hoặc **macOS 10.15+** hoặc **Linux (Ubuntu 20.04+)**
- **Python 3.10** hoặc cao hơn
- **Node.js 18** hoặc cao hơn
- **Git** đã cài đặt
- **PostgreSQL** (hoặc dùng database online như Neon/Supabase - khuyến nghị)

---

## 2. Cài đặt công cụ cần thiết

### 2.1. Cài đặt Python

#### Windows:

1. Truy cập: https://www.python.org/downloads/
2. Tải Python 3.10 hoặc cao hơn
3. Chạy file installer
4. **QUAN TRỌNG:** ✅ Chọn "Add Python to PATH" trước khi Install
5. Click "Install Now"
6. Đợi cài đặt xong
7. Kiểm tra: Mở Command Prompt (CMD) hoặc PowerShell, gõ:
   ```bash
   python --version
   ```
   Phải hiển thị: `Python 3.10.x` hoặc cao hơn

#### macOS:

```bash
# Cài Homebrew nếu chưa có
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Cài Python
brew install python@3.10

# Kiểm tra
python3 --version
```

#### Linux (Ubuntu):

```bash
sudo apt update
sudo apt install python3.10 python3.10-venv python3-pip

# Kiểm tra
python3 --version
```

### 2.2. Cài đặt Node.js

1. Truy cập: https://nodejs.org/
2. Tải bản **LTS** (Long Term Support)
3. Cài đặt như bình thường
4. Kiểm tra: Mở terminal, gõ:
   ```bash
   node --version
   npm --version
   ```
   Phải hiển thị: `v18.x.x` hoặc cao hơn

### 2.3. Cài đặt Git

#### Windows:
- Tải từ: https://git-scm.com/download/win
- Cài đặt với tất cả options mặc định

#### macOS:
```bash
brew install git
```

#### Linux:
```bash
sudo apt install git
```

Kiểm tra:
```bash
git --version
```

### 2.4. Cài đặt PostgreSQL (Optional - chỉ nếu dùng local)

#### Windows:
1. Tải từ: https://www.postgresql.org/download/windows/
2. Chọn PostgreSQL 15 hoặc cao hơn
3. Cài đặt, nhớ password bạn đặt (sẽ dùng sau)
4. Port mặc định: 5432

#### macOS:
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Linux:
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Lưu ý:** Nếu không muốn cài PostgreSQL local, bạn có thể dùng database online (Neon/Supabase) - xem phần 4.

---

## 3. Clone và chuẩn bị project

### Bước 1: Clone repository

Mở terminal/command prompt và chạy:

```bash
git clone <repository-url>
cd DoAnPTPMHDT
```

**Ví dụ:**
```bash
git clone https://github.com/yourusername/recruitment-system.git
cd recruitment-system
```

### Bước 2: Kiểm tra cấu trúc project

Bạn sẽ thấy các thư mục:
```
DoAnPTPMHDT/
├── backend/          # Django backend
├── frontend/         # React frontend
├── database/         # SQL schema
├── docs/             # Documentation
└── SETUP.md          # File này
```

---

## 4. Setup Database

Bạn có 2 lựa chọn: **Database Online** (khuyến nghị) hoặc **Database Local**.

### Option 1: Database Online (Khuyến nghị - Dễ nhất)

#### A. Dùng Neon.tech (Miễn phí, nhanh nhất)

1. **Đăng ký:**
   - Truy cập: https://neon.tech
   - Click "Sign Up"
   - Chọn "Continue with GitHub" (nhanh nhất)

2. **Tạo Project:**
   - Click "Create Project"
   - Điền:
     - **Project name:** `recruitment-system`
     - **Region:** `Asia Pacific (Singapore)` ← gần VN nhất
     - **Database name:** `recruitment_db`
   - Click "Create Project"

3. **Lấy Connection String:**
   - Sau khi tạo xong, Neon hiển thị **Connection Details**
   - Chọn tab **Connection string**
   - Copy chuỗi có dạng:
     ```
     postgresql://neondb_owner:xxxxx@ep-xxx-xxx-123456.ap-southeast-1.aws.neon.tech/recruitment_db?sslmode=require
     ```
   - **Lưu lại** chuỗi này, sẽ dùng ở bước sau

#### B. Dùng Supabase (Miễn phí)

1. **Đăng ký:**
   - Truy cập: https://supabase.com
   - Click "Start your project"
   - Đăng ký bằng GitHub

2. **Tạo Project:**
   - Click "New Project"
   - Điền thông tin:
     - **Name:** `recruitment-system`
     - **Database Password:** (đặt mật khẩu mạnh, nhớ lại)
     - **Region:** `Southeast Asia (Singapore)`
   - Click "Create new project"
   - Đợi 2-3 phút để setup xong

3. **Lấy Connection String:**
   - Vào **Settings** → **Database**
   - Tìm phần **Connection string**
   - Copy chuỗi **URI** (có dạng):
     ```
     postgresql://postgres:xxxxx@db.xxx.supabase.co:5432/postgres
     ```
   - **Lưu lại** chuỗi này

### Option 2: Database Local (Nếu muốn dùng PostgreSQL trên máy)

#### Tạo Database:

**Windows (dùng pgAdmin hoặc psql):**

1. Mở **pgAdmin** (cài cùng PostgreSQL)
2. Tạo database mới:
   - Right-click **Databases** → **Create** → **Database**
   - **Name:** `recruitment_db`
   - Click **Save**

Hoặc dùng Command Prompt:
```bash
psql -U postgres
```

Trong psql:
```sql
CREATE DATABASE recruitment_db;
CREATE USER recruitment_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE recruitment_db TO recruitment_user;
\q
```

**macOS/Linux:**
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

**Lưu lại thông tin:**
- Database name: `recruitment_db`
- User: `recruitment_user` (hoặc `postgres`)
- Password: (mật khẩu bạn vừa đặt)
- Host: `localhost`
- Port: `5432`

---

## 5. Setup Backend (Từng bước)

### Bước 1: Vào thư mục backend

```bash
cd backend
```

### Bước 2: Tạo Virtual Environment

**Windows:**
```bash
python -m venv venv
```

**macOS/Linux:**
```bash
python3 -m venv venv
```

**Giải thích:** Virtual environment giúp cô lập dependencies của project, tránh conflict với các project khác.

### Bước 3: Activate Virtual Environment

**Windows (CMD):**
```bash
venv\Scripts\activate.bat
```

**Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

Nếu bị lỗi "execution policy", chạy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Kiểm tra:** Bạn sẽ thấy `(venv)` ở đầu dòng terminal, ví dụ:
```
(venv) D:\DoAnPTPMHDT\backend>
```

### Bước 4: Upgrade pip

```bash
python -m pip install --upgrade pip
```

### Bước 5: Cài đặt Dependencies

```bash
pip install -r requirements.txt
```

**Lưu ý:**
- Quá trình này có thể mất 2-5 phút
- Nếu gặp lỗi trên Windows với `python-magic-bin`, có thể bỏ qua (không bắt buộc)

### Bước 6: Tạo file .env

**Windows:**
```bash
# Tạo file .env
notepad .env
```

**macOS/Linux:**
```bash
nano .env
```

**Hoặc dùng bất kỳ text editor nào** (VS Code, Notepad++, etc.)

**Nội dung file .env:**

Nếu dùng **Database Online** (Neon/Supabase):
```env
# Django Settings
SECRET_KEY=django-insecure-change-this-in-production-123456789
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database - Dùng DATABASE_URL (từ Neon/Supabase)
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# Email (Gmail) - Optional
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# AI API - Optional
GEMINI_API_KEY=your-gemini-api-key
```

**Thay thế:**
- `DATABASE_URL` = Connection string bạn đã copy từ Neon/Supabase

Nếu dùng **Database Local**:
```env
# Django Settings
SECRET_KEY=django-insecure-change-this-in-production-123456789
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database - Local PostgreSQL
DB_NAME=recruitment_db
DB_USER=recruitment_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Email (Gmail) - Optional
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# AI API - Optional
GEMINI_API_KEY=your-gemini-api-key
```

**Thay thế:**
- `DB_NAME` = `recruitment_db`
- `DB_USER` = `recruitment_user` (hoặc `postgres`)
- `DB_PASSWORD` = Mật khẩu bạn đã đặt
- `DB_HOST` = `localhost`
- `DB_PORT` = `5432`

**Lưu file** (Ctrl+S hoặc Cmd+S)

### Bước 7: Tạo SECRET_KEY mới (Khuyến nghị)

Chạy lệnh để tạo SECRET_KEY an toàn:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copy kết quả và thay vào `SECRET_KEY` trong file `.env`

### Bước 8: Chạy Migrations

```bash
python manage.py migrate
```

**Kết quả mong đợi:**
```
Operations to perform:
  Apply all migrations: accounts, admin, applications, auth, contenttypes, jobs, notifications, sessions
Running migrations:
  Applying accounts.0001_initial... OK
  Applying jobs.0001_initial... OK
  ...
```

Nếu thấy lỗi về database connection:
- Kiểm tra lại thông tin trong file `.env`
- Đảm bảo database đã được tạo (nếu dùng local)
- Đảm bảo PostgreSQL đang chạy (nếu dùng local)

### Bước 9: Tạo Superuser (Admin)

```bash
python manage.py createsuperuser
```

Nhập thông tin:
- **Username:** `admin` (hoặc tên bạn muốn)
- **Email address:** `admin@example.com`
- **Password:** (nhập mật khẩu mạnh, nhớ lại để đăng nhập)
- **Password (again):** (nhập lại mật khẩu)

**Lưu lại thông tin đăng nhập!**

### Bước 10: Kiểm tra Backend

```bash
python manage.py runserver
```

Mở trình duyệt, truy cập: http://localhost:8000/admin

- Nếu thấy trang đăng nhập Django Admin → ✅ Backend hoạt động tốt!
- Đăng nhập với superuser vừa tạo

**Dừng server:** Nhấn `Ctrl+C` trong terminal

---

## 6. Setup Frontend (Từng bước)

### Bước 1: Vào thư mục frontend

Mở terminal mới (giữ terminal backend đang chạy), chạy:

```bash
cd frontend
```

Hoặc nếu đang ở thư mục gốc:
```bash
cd DoAnPTPMHDT/frontend
```

### Bước 2: Cài đặt Dependencies

```bash
npm install
```

**Lưu ý:**
- Quá trình này có thể mất 3-5 phút
- Nếu gặp lỗi, thử:
  ```bash
  npm install --legacy-peer-deps
  ```

### Bước 3: Tạo file .env

**Windows:**
```bash
notepad .env
```

**macOS/Linux:**
```bash
nano .env
```

**Nội dung:**
```env
REACT_APP_API_URL=http://localhost:8000/api
```

**Lưu file**

### Bước 4: Kiểm tra Frontend

```bash
npm start
```

**Kết quả:**
- Terminal sẽ hiển thị: `Compiled successfully!`
- Trình duyệt tự động mở: http://localhost:3000
- Nếu thấy trang web → ✅ Frontend hoạt động tốt!

**Dừng server:** Nhấn `Ctrl+C` trong terminal

---

## 7. Cấu hình Environment Variables

### 7.1. Backend (.env)

File `backend/.env` đã tạo ở bước 5.6. Kiểm tra lại:

**Bắt buộc:**
- ✅ `SECRET_KEY` - Đã tạo ở bước 5.7
- ✅ `DATABASE_URL` hoặc `DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT` - Đã setup ở bước 4

**Optional (có thể bỏ qua):**
- `EMAIL_HOST_USER` - Email Gmail của bạn
- `EMAIL_HOST_PASSWORD` - App Password của Gmail (xem hướng dẫn bên dưới)
- `GEMINI_API_KEY` - API key từ Google Gemini (xem hướng dẫn bên dưới)

#### Cấu hình Email (Optional):

1. Vào Google Account: https://myaccount.google.com/
2. Vào **Security**
3. Bật **2-Step Verification** (nếu chưa bật)
4. Vào **App passwords**
5. Tạo App Password cho "Mail"
6. Copy password (16 ký tự)
7. Dán vào `EMAIL_HOST_PASSWORD` trong `.env`

#### Cấu hình Gemini API (Optional):

1. Truy cập: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy API key
4. Dán vào `GEMINI_API_KEY` trong `.env`

### 7.2. Frontend (.env)

File `frontend/.env` đã tạo ở bước 6.3. Nội dung:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

**Lưu ý:** Nếu deploy production, đổi thành URL backend production.

---

## 8. Chạy dự án

### Bước 1: Chạy Backend

Mở **Terminal 1**, chạy:

```bash
cd DoAnPTPMHDT/backend

# Activate venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Chạy server
python manage.py runserver
```

**Kết quả:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

✅ Backend đang chạy tại: http://localhost:8000

### Bước 2: Chạy Frontend

Mở **Terminal 2** (terminal mới), chạy:

```bash
cd DoAnPTPMHDT/frontend
npm start
```

**Kết quả:**
```
Compiled successfully!

You can now view recruitment-system in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

✅ Frontend đang chạy tại: http://localhost:3000

### Bước 3: Truy cập ứng dụng

Mở trình duyệt, truy cập:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **Django Admin:** http://localhost:8000/admin

---

## 9. Kiểm tra hoạt động

### Test 1: Đăng ký tài khoản mới

1. Truy cập: http://localhost:3000
2. Click "Đăng ký" hoặc truy cập: http://localhost:3000/register
3. Điền form:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `Test@12345` (ít nhất 8 ký tự)
   - Điền đầy đủ Họ, Tên
4. Click "Đăng ký"
5. Nếu thành công → ✅ Đăng ký hoạt động!

### Test 2: Đăng nhập

1. Truy cập: http://localhost:3000/login
2. Đăng nhập với tài khoản vừa tạo
3. Nếu vào được Dashboard → ✅ Đăng nhập hoạt động!

### Test 3: Django Admin

1. Truy cập: http://localhost:8000/admin
2. Đăng nhập với superuser đã tạo
3. Nếu thấy Django Admin interface → ✅ Admin hoạt động!

### Test 4: API Endpoints

1. Truy cập: http://localhost:8000/api/jobs/
2. Nếu thấy JSON response → ✅ API hoạt động!

---

## 10. Troubleshooting

### Lỗi: `ModuleNotFoundError: No module named 'dotenv'`

**Nguyên nhân:** Chưa cài python-dotenv

**Giải pháp:**
```bash
# Đảm bảo đã activate venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

pip install python-dotenv
```

### Lỗi: `django.db.utils.OperationalError: connection refused`

**Nguyên nhân:** Không kết nối được database

**Giải pháp:**
1. Kiểm tra file `.env` có đúng thông tin database
2. Nếu dùng local PostgreSQL:
   - Đảm bảo PostgreSQL đang chạy
   - Kiểm tra service: `services.msc` (Windows) hoặc `sudo systemctl status postgresql` (Linux)
3. Nếu dùng online database:
   - Kiểm tra DATABASE_URL format đúng
   - Kiểm tra database có đang hoạt động (vào dashboard Neon/Supabase)

### Lỗi: `Port 8000 already in use`

**Nguyên nhân:** Port 8000 đã được sử dụng

**Giải pháp:**

**Windows:**
```bash
# Tìm process dùng port 8000
netstat -ano | findstr :8000

# Kill process (thay <PID> bằng số từ lệnh trên)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:8000 | xargs kill -9
```

Hoặc chạy server trên port khác:
```bash
python manage.py runserver 8001
```

### Lỗi: `npm ERR! code ELIFECYCLE`

**Nguyên nhân:** Lỗi khi cài dependencies

**Giải pháp:**
```bash
# Xóa và cài lại
rm -rf node_modules package-lock.json
npm install

# Hoặc
npm install --legacy-peer-deps
```

### Lỗi: `CORS error` trong browser console

**Nguyên nhân:** Frontend không kết nối được với backend

**Giải pháp:**
1. Kiểm tra backend đang chạy: http://localhost:8000
2. Kiểm tra `REACT_APP_API_URL` trong `frontend/.env` = `http://localhost:8000/api`
3. Kiểm tra CORS settings trong `backend/recruitment_system/settings.py`

### Lỗi: `401 Unauthorized` khi đăng ký/đăng nhập

**Nguyên nhân:** Backend permission settings

**Giải pháp:**
- Đảm bảo backend đang chạy
- Kiểm tra `DEFAULT_PERMISSION_CLASSES` trong settings.py
- Xem lại phần setup backend

### Lỗi: `UnicodeDecodeError` khi load .env

**Nguyên nhân:** File .env bị encoding sai

**Giải pháp:**
1. Xóa file .env cũ
2. Tạo lại bằng Notepad (Windows) hoặc nano (Mac/Linux)
3. Lưu với encoding UTF-8

### Lỗi: `python: command not found` (Mac/Linux)

**Nguyên nhân:** Python chưa được cài hoặc path chưa đúng

**Giải pháp:**
```bash
# Dùng python3 thay vì python
python3 -m venv venv
python3 manage.py migrate
```

---

## ✅ Checklist Setup

Trước khi báo là setup xong, kiểm tra:

- [ ] Python 3.10+ đã cài và `python --version` hoạt động
- [ ] Node.js 18+ đã cài và `node --version` hoạt động
- [ ] Git đã cài và `git --version` hoạt động
- [ ] Database đã setup (online hoặc local)
- [ ] Backend virtual environment đã tạo và activate
- [ ] Backend dependencies đã cài (`pip install -r requirements.txt`)
- [ ] Backend .env đã tạo và điền đầy đủ
- [ ] Backend migrations đã chạy (`python manage.py migrate`)
- [ ] Backend superuser đã tạo (`python manage.py createsuperuser`)
- [ ] Backend server chạy được (`python manage.py runserver`)
- [ ] Frontend dependencies đã cài (`npm install`)
- [ ] Frontend .env đã tạo
- [ ] Frontend server chạy được (`npm start`)
- [ ] Có thể truy cập http://localhost:3000
- [ ] Có thể truy cập http://localhost:8000/admin
- [ ] Có thể đăng ký tài khoản mới
- [ ] Có thể đăng nhập

---

## 🎯 Quick Commands Reference

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

## 📞 Cần hỗ trợ?

Nếu gặp vấn đề không giải quyết được:

1. **Kiểm tra lại từng bước** trong hướng dẫn này
2. **Xem phần Troubleshooting** ở trên
3. **Kiểm tra logs** trong terminal để xem lỗi chi tiết
4. **Tạo issue trên GitHub** với:
   - Mô tả lỗi chi tiết
   - Screenshot (nếu có)
   - Logs từ terminal
   - OS và version (Windows/Mac/Linux)

---

## 🎉 Hoàn thành!

Nếu bạn đã làm theo tất cả các bước và checklist đều ✅, chúc mừng! Dự án đã sẵn sàng để phát triển.

**Bước tiếp theo:**
- Đọc [README.md](./README.md) để hiểu về dự án
- Xem [docs/](./docs/) để hiểu architecture và API
- Bắt đầu code! 🚀

---

**Chúc bạn setup thành công! 🎉**
