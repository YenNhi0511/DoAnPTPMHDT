# 🔄 HƯỚNG DẪN CẬP NHẬT CODE SAU KHI PULL TỪ GITHUB

Khi bạn hoặc bạn của bạn pull code mới nhất từ GitHub, cần thực hiện các bước sau để đảm bảo hệ thống hoạt động đúng:

## 📋 CÁC BƯỚC BẮT BUỘC

### 1️⃣ **Cập nhật Dependencies Backend (Python)**

```bash
# Di chuyển vào thư mục backend
cd backend

# Kích hoạt virtual environment (nếu chưa activate)
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Cài đặt/cập nhật các package mới
pip install -r requirements.txt

# ⚠️ QUAN TRỌNG: Nếu có package mới được thêm vào requirements.txt
# Bạn cần chạy lệnh này để cài đặt
```

**Kiểm tra:**
```bash
# Kiểm tra các package quan trọng
pip list | findstr "Django faker reportlab"  # Windows
# hoặc
pip list | grep "Django faker reportlab"  # Mac/Linux
```

### 2️⃣ **Chạy Migrations Database (Nếu có thay đổi Model)**

```bash
# Đảm bảo đang ở trong thư mục backend và đã activate venv
cd backend
venv\Scripts\activate  # Windows
# hoặc: source venv/bin/activate  # Mac/Linux

# Chạy migrations để cập nhật database
python manage.py migrate

# ⚠️ LƯU Ý: Nếu có lỗi về migrations, có thể cần:
# python manage.py makemigrations
# python manage.py migrate
```

### 3️⃣ **Cập nhật Dependencies Frontend (Node.js)**

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt/cập nhật các package mới
npm install

# ⚠️ QUAN TRỌNG: Nếu có package mới được thêm vào package.json
# Bạn cần chạy lệnh này
```

**Kiểm tra:**
```bash
# Kiểm tra các package đã được cài
npm list react react-router-dom axios
```

### 4️⃣ **Kiểm tra file .env**

Đảm bảo file `.env` trong thư mục `backend/` có đầy đủ các biến môi trường:

```env
# Database
DATABASE_URL=postgresql://...  # Hoặc các biến riêng lẻ

# Django
SECRET_KEY=your-secret-key
DEBUG=True

# API Keys
GEMINI_API_KEY=your-api-key

# Email (nếu có)
EMAIL_HOST=...
EMAIL_PORT=...
EMAIL_USER=...
EMAIL_PASSWORD=...

# Frontend URL
FRONTEND_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:8000/api
```

**⚠️ LƯU Ý:** File `.env` thường không được commit lên GitHub (nằm trong `.gitignore`), nên bạn cần tự tạo hoặc copy từ người khác.

### 5️⃣ **Restart các Services**

Sau khi cập nhật code, cần **restart lại tất cả các services**:

#### **Backend (Django):**
```bash
cd backend
venv\Scripts\activate  # Windows
python manage.py runserver
```

#### **Frontend (React):**
```bash
cd frontend
npm start
# hoặc cho từng role:
npm run start:admin      # Port 3000
npm run start:candidate  # Port 3001
npm run start:recruiter  # Port 3002
```

#### **Celery Worker (nếu có):**
```bash
cd backend
venv\Scripts\activate  # Windows
celery -A recruitment_system worker -l info
```

#### **Redis (nếu chưa chạy):**
- Windows: Chạy Redis từ Docker Desktop hoặc cài đặt Redis for Windows
- Mac/Linux: `redis-server`

## 🔍 KIỂM TRA SAU KHI CẬP NHẬT

### 1. Kiểm tra Backend chạy được không:
```bash
cd backend
python manage.py check
python manage.py runserver
# Mở browser: http://localhost:8000/api/docs/
```

### 2. Kiểm tra Frontend chạy được không:
```bash
cd frontend
npm start
# Mở browser: http://localhost:3000
```

### 3. Kiểm tra Database connection:
```bash
cd backend
python check_database_connection.py
```

## ❌ CÁC LỖI THƯỜNG GẶP VÀ CÁCH SỬA

### **Lỗi: ModuleNotFoundError**
```bash
# Giải pháp: Cài đặt lại dependencies
cd backend
pip install -r requirements.txt

# Hoặc frontend:
cd frontend
npm install
```

### **Lỗi: Migration conflicts**
```bash
# Giải pháp: Reset migrations (CẨN THẬN - sẽ mất dữ liệu)
cd backend
python manage.py migrate --fake-initial
# hoặc
python manage.py migrate --run-syncdb
```

### **Lỗi: Port already in use**
```bash
# Giải pháp: Tìm và kill process đang dùng port
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

### **Lỗi: Cannot find module 'xxx'**
```bash
# Giải pháp: Xóa node_modules và cài lại
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 CHECKLIST SAU KHI PULL CODE

- [ ] Đã chạy `pip install -r requirements.txt` trong backend
- [ ] Đã chạy `npm install` trong frontend
- [ ] Đã chạy `python manage.py migrate` (nếu có thay đổi database)
- [ ] Đã kiểm tra file `.env` có đầy đủ biến môi trường
- [ ] Đã restart Backend server
- [ ] Đã restart Frontend server
- [ ] Đã restart Celery worker (nếu có)
- [ ] Đã kiểm tra không có lỗi trong console

## 🚀 LỆNH NHANH (Tất cả trong một)

**Windows:**
```bash
# Backend
cd backend
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (terminal mới)
cd frontend
npm install
npm start
```

**Mac/Linux:**
```bash
# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (terminal mới)
cd frontend
npm install
npm start
```

## 💡 TIPS

1. **Luôn pull code mới nhất trước khi làm việc:**
   ```bash
   git pull origin main
   ```

2. **Nếu có conflict, giải quyết conflict trước khi tiếp tục:**
   ```bash
   git status  # Xem các file conflict
   # Sửa các file conflict
   git add .
   git commit -m "Resolve conflicts"
   ```

3. **Kiểm tra log để tìm lỗi:**
   - Backend: Xem console output
   - Frontend: Xem browser console (F12)

4. **Nếu vẫn không chạy được:**
   - Xóa `node_modules` và `package-lock.json`, chạy lại `npm install`
   - Xóa `__pycache__` trong backend, chạy lại
   - Kiểm tra Python và Node.js version có đúng không

---

**📞 Nếu vẫn gặp vấn đề, hãy:**
1. Kiểm tra log lỗi chi tiết
2. Đảm bảo đã chạy đầy đủ các bước trên
3. Kiểm tra version Python (3.9+) và Node.js (18+)

