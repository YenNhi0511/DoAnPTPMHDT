# 🚀 Hướng dẫn chạy Project - Số Terminal và Lệnh

## 📊 Tổng quan

Để chạy đầy đủ project, bạn cần **4-7 terminals** tùy theo cách bạn muốn chạy:

### Tối thiểu (Chạy cơ bản):
- **3 terminals**: Backend + Frontend (1 role) + Redis

### Đầy đủ (Chạy tất cả tính năng):
- **6 terminals**: Backend + Celery + Redis + Frontend (3 roles)

---

## 🎯 CÁCH 1: Chạy tối thiểu (3 terminals)

### Terminal 1: Redis (Docker - Background)
```bash
# Chạy Redis bằng Docker (chạy 1 lần, tự động chạy nền)
cd backend
start-redis-docker.bat
# Hoặc:
docker start redis
# Hoặc nếu chưa có:
docker run -d --name redis -p 6379:6379 redis:alpine
```

**Lưu ý:** Redis chạy nền, không cần giữ terminal này mở.

### Terminal 2: Backend (Django)
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

**URL:** http://localhost:8000

### Terminal 3: Frontend (1 role - Ví dụ: Candidate)
```bash
cd frontend
npm run start:candidate
```

**URL:** http://localhost:3001

---

## 🎯 CÁCH 2: Chạy đầy đủ (6 terminals)

### Terminal 1: Redis (Docker)
```bash
cd backend
start-redis-docker.bat
# Hoặc:
docker start redis
```

**Lưu ý:** Redis chạy nền, có thể đóng terminal này sau khi Redis đã start.

### Terminal 2: Backend (Django)
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

**URL:** http://localhost:8000

### Terminal 3: Celery Worker
```bash
cd backend
venv\Scripts\activate
celery -A recruitment_system worker -l info --pool=solo
```

**Lưu ý:** 
- `--pool=solo` chỉ cần cho Windows
- Mac/Linux: `celery -A recruitment_system worker -l info`

### Terminal 4: Frontend - Admin (Port 3000)
```bash
cd frontend
npm run start:admin
```

**URL:** http://localhost:3000

### Terminal 5: Frontend - Candidate (Port 3001)
```bash
cd frontend
npm run start:candidate
```

**URL:** http://localhost:3001

### Terminal 6: Frontend - Recruiter (Port 3002)
```bash
cd frontend
npm run start:recruiter
```

**URL:** http://localhost:3002

---

## 🎯 CÁCH 3: Sử dụng Batch Files (Tự động)

### Chạy tất cả Frontend roles cùng lúc:
```bash
# Từ thư mục root
start-all-roles.bat
```

Script này sẽ tự động mở 3 terminals cho 3 frontend roles.

Sau đó bạn vẫn cần chạy thủ công:
- **Terminal 1:** Backend
- **Terminal 2:** Celery
- **Terminal 3:** Redis (hoặc dùng Docker)

---

## 📋 Tóm tắt số lượng Terminal

| Cách chạy | Số Terminal | Ghi chú |
|-----------|-------------|---------|
| **Tối thiểu** | 3 | Backend + Frontend (1 role) + Redis (background) |
| **Cơ bản** | 4 | Backend + Celery + Frontend (1 role) + Redis (background) |
| **Đầy đủ** | 6 | Backend + Celery + Frontend (3 roles) + Redis (background) |
| **Tối đa** | 7 | Backend + Celery + Frontend (3 roles) + Redis (terminal riêng) |

---

## 🚀 Script tự động (Khuyến nghị)

Tạo file `start-all.bat` trong thư mục root:

```batch
@echo off
echo ========================================
echo Starting GoodCV - Full Stack
echo ========================================
echo.

REM Start Redis (Docker)
echo [1/6] Starting Redis...
start "Redis" cmd /k "cd backend && start-redis-docker.bat"
timeout /t 3 /nobreak >nul

REM Start Backend
echo [2/6] Starting Backend...
start "Backend" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"
timeout /t 5 /nobreak >nul

REM Start Celery
echo [3/6] Starting Celery...
start "Celery" cmd /k "cd backend && venv\Scripts\activate && celery -A recruitment_system worker -l info --pool=solo"
timeout /t 3 /nobreak >nul

REM Start Frontend - Admin
echo [4/6] Starting Frontend - Admin...
start "Frontend Admin" cmd /k "cd frontend && npm run start:admin"
timeout /t 3 /nobreak >nul

REM Start Frontend - Candidate
echo [5/6] Starting Frontend - Candidate...
start "Frontend Candidate" cmd /k "cd frontend && npm run start:candidate"
timeout /t 3 /nobreak >nul

REM Start Frontend - Recruiter
echo [6/6] Starting Frontend - Recruiter...
start "Frontend Recruiter" cmd /k "cd frontend && npm run start:recruiter"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo URLs:
echo   Backend:    http://localhost:8000
echo   Admin:      http://localhost:3000
echo   Candidate:  http://localhost:3001
echo   Recruiter:  http://localhost:3002
echo.
echo Press any key to exit...
pause >nul
```

**Cách dùng:**
```bash
# Double-click file start-all.bat
# Hoặc chạy từ terminal:
start-all.bat
```

---

## ⚡ Quick Start (Lệnh ngắn gọn)

### Tối thiểu:
```bash
# Terminal 1: Redis (1 lần, sau đó chạy nền)
docker start redis

# Terminal 2: Backend
cd backend && venv\Scripts\activate && python manage.py runserver

# Terminal 3: Frontend (chọn 1 role)
cd frontend && npm run start:candidate
```

### Đầy đủ:
```bash
# Terminal 1: Redis
docker start redis

# Terminal 2: Backend
cd backend && venv\Scripts\activate && python manage.py runserver

# Terminal 3: Celery
cd backend && venv\Scripts\activate && celery -A recruitment_system worker -l info --pool=solo

# Terminal 4-6: Frontend (3 roles)
cd frontend && npm run start:admin
cd frontend && npm run start:candidate
cd frontend && npm run start:recruiter
```

---

## 🔍 Kiểm tra các service đang chạy

### Kiểm tra Backend:
```bash
# Mở browser: http://localhost:8000/api/
# Hoặc: http://localhost:8000/admin/
```

### Kiểm tra Frontend:
```bash
# Admin: http://localhost:3000
# Candidate: http://localhost:3001
# Recruiter: http://localhost:3002
```

### Kiểm tra Redis:
```bash
docker ps | findstr redis
# Hoặc:
docker exec -it redis redis-cli ping
# Phải trả về: PONG
```

### Kiểm tra Celery:
- Xem terminal Celery, phải thấy: `celery@hostname ready`
- Nếu có task, sẽ thấy log processing

---

## ⚠️ Lưu ý quan trọng

1. **Thứ tự khởi động:**
   - Redis → Backend → Celery → Frontend
   - Đợi mỗi service khởi động xong (3-5 giây) trước khi start service tiếp theo

2. **Redis:**
   - Chỉ cần chạy 1 lần (dùng Docker)
   - Có thể đóng terminal sau khi Redis đã start
   - Kiểm tra: `docker ps` phải thấy container `redis`

3. **Celery:**
   - Cần Redis đang chạy
   - Nếu không có Celery, các tính năng async (email, AI screening) sẽ không hoạt động
   - Có thể bỏ qua nếu chỉ test UI

4. **Frontend:**
   - Có thể chạy 1, 2, hoặc 3 roles tùy nhu cầu
   - Mỗi role chạy trên port riêng
   - Có thể dùng `start-all-roles.bat` để chạy cả 3 cùng lúc

5. **Database:**
   - PostgreSQL (local hoặc Neon) phải đang chạy
   - Kiểm tra: `python backend/check_database_connection.py`

---

## 🛑 Dừng các service

### Dừng từng service:
- **Backend/Celery/Frontend:** Nhấn `Ctrl+C` trong terminal
- **Redis:** `docker stop redis`

### Dừng tất cả:
```bash
# Dừng tất cả frontend (đóng các cửa sổ terminal)
# Dừng backend và celery (Ctrl+C)
# Dừng Redis
docker stop redis
```

---

## 📝 Checklist trước khi chạy

- [ ] PostgreSQL đang chạy (local hoặc Neon)
- [ ] Redis đang chạy (`docker ps` thấy redis)
- [ ] Backend dependencies đã cài (`pip install -r requirements.txt`)
- [ ] Frontend dependencies đã cài (`npm install`)
- [ ] File `.env` đã cấu hình đúng
- [ ] Migrations đã chạy (`python manage.py migrate`)

---

## 🆘 Troubleshooting

### Lỗi "Port already in use":
- Kiểm tra port nào đang bị chiếm
- Dừng process đang dùng port đó
- Hoặc đổi port trong cấu hình

### Redis không kết nối được:
- Kiểm tra Docker có đang chạy không
- Kiểm tra Redis container: `docker ps`
- Restart Redis: `docker restart redis`

### Celery không hoạt động:
- Kiểm tra Redis có đang chạy không
- Kiểm tra connection: `python backend/test-redis-connection.py`
- Xem log Celery để biết lỗi cụ thể

### Frontend không kết nối được Backend:
- Kiểm tra Backend có đang chạy không (http://localhost:8000)
- Kiểm tra `REACT_APP_API_URL` trong `frontend/.env`
- Kiểm tra CORS settings trong backend

---

## 📚 Tài liệu tham khảo

- `HUONG-DAN-CAI-DAT.md` - Hướng dẫn cài đặt đầy đủ
- `MULTI-PORT-SETUP.md` - Chi tiết về multi-port frontend
- `backend/CELERY-SETUP.md` - Hướng dẫn Celery
- `backend/INSTALL-REDIS-WINDOWS.md` - Cài đặt Redis

