@echo off
chcp 65001 >nul
echo ============================================================
echo    GOODCV - START PROJECT COMPLETE (ALL SERVICES)
echo ============================================================
echo.

:: Kiểm tra Python
echo [1/8] Kiem tra Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo    ❌ Python khong duoc tim thay! Vui long cai dat Python 3.10+
    pause
    exit /b 1
)
echo    ✅ Python OK
echo.

:: Kiểm tra Node.js
echo [2/8] Kiem tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo    ❌ Node.js khong duoc tim thay! Vui long cai dat Node.js 18+
    pause
    exit /b 1
)
echo    ✅ Node.js OK
echo.

:: Kiểm tra PostgreSQL connection (optional)
echo [3/8] Kiem tra cau hinh...
if not exist "backend\.env" (
    echo    ⚠️  File .env khong ton tai!
    echo    Dang tao file .env...
    cd backend
    python fix-env-file.py
    cd ..
)
echo    ✅ Cau hinh OK
echo.

:: Kiểm tra và cài đặt dependencies backend
echo [4/8] Kiem tra dependencies backend...
cd backend
if not exist "venv" (
    echo    Dang tao virtual environment...
    python -m venv venv
)
if not exist "venv\Scripts\activate.bat" (
    echo    ❌ Virtual environment khong hop le!
    pause
    exit /b 1
)
call venv\Scripts\activate.bat
echo    Dang kiem tra packages...
pip show django >nul 2>&1
if errorlevel 1 (
    echo    Dang cai dat packages...
    pip install -r requirements.txt --quiet
)
echo    ✅ Backend dependencies OK
cd ..
echo.

:: Kiểm tra và cài đặt dependencies frontend
echo [5/8] Kiem tra dependencies frontend...
cd frontend
if not exist "node_modules" (
    echo    Dang cai dat packages...
    call npm install --silent
)
echo    ✅ Frontend dependencies OK
cd ..
echo.

:: Chạy migrations
echo [6/8] Chay database migrations...
cd backend
call venv\Scripts\activate.bat
python manage.py migrate --no-input
if errorlevel 1 (
    echo    ❌ Migration that bai!
    pause
    exit /b 1
)
echo    ✅ Migrations OK
cd ..
echo.

:: Kiểm tra Redis (optional)
echo [7/8] Kiem tra Redis...
redis-cli ping >nul 2>&1
if errorlevel 1 (
    echo    ⚠️  Redis khong chay (khong bat buoc cho email verification)
    echo    Email se duoc gui truc tiep (khong qua Celery)
) else (
    echo    ✅ Redis dang chay
)
echo.

:: Start tất cả services
echo [8/8] Khoi dong tat ca services...
echo.

:: Tạo file log
set "LOG_DIR=logs"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

:: Start Backend Server
echo 🚀 Starting Backend Server (Port 8000)...
start "GoodCV Backend" cmd /k "cd backend && call venv\Scripts\activate.bat && python manage.py runserver && pause"

:: Đợi backend khởi động
timeout /t 3 /nobreak >nul

:: Start Frontend - Admin (Port 3003)
echo 🚀 Starting Frontend - ADMIN (Port 3003)...
start "GoodCV Admin" cmd /k "cd frontend && npm run start:admin"

:: Đợi một chút
timeout /t 2 /nobreak >nul

:: Start Frontend - Recruiter (Port 3002)
echo 🚀 Starting Frontend - RECRUITER (Port 3002)...
start "GoodCV Recruiter" cmd /k "cd frontend && npm run start:recruiter"

:: Đợi một chút
timeout /t 2 /nobreak >nul

:: Start Frontend - Candidate (Port 3001)
echo 🚀 Starting Frontend - CANDIDATE (Port 3001)...
start "GoodCV Candidate" cmd /k "cd frontend && npm run start:candidate"

:: Start Celery Worker (nếu Redis đang chạy)
redis-cli ping >nul 2>&1
if not errorlevel 1 (
    echo 🚀 Starting Celery Worker...
    start "GoodCV Celery" cmd /k "cd backend && call venv\Scripts\activate.bat && celery -A recruitment_system worker -l info && pause"
)

echo.
echo ============================================================
echo ✅ TAT CA SERVICES DA DUOC KHOI DONG!
echo ============================================================
echo.
echo 📋 URLs:
echo    Backend API:    http://localhost:8000
echo    Admin Panel:    http://localhost:3003
echo    Recruiter:      http://localhost:3002
echo    Candidate:      http://localhost:3001
echo.
echo 📝 Admin Accounts:
echo    Email: admin@goodcv.com
echo    Password: admin123
echo.
echo ⚠️  Luu y:
echo    - Cac cua so terminal se mo rieng cho moi service
echo    - De dung tat ca, dong cac cua so terminal
echo    - Backend can vai giay de khoi dong hoan toan
echo.
echo ✨ Project da san sang!
echo.
pause

