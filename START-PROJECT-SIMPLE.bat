@echo off
chcp 65001 >nul
echo ============================================================
echo    GOODCV - START PROJECT (SIMPLE - 1 FRONTEND)
echo ============================================================
echo.

:: Kiểm tra Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python không được tìm thấy!
    pause
    exit /b 1
)

:: Kiểm tra Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js không được tìm thấy!
    pause
    exit /b 1
)

:: Setup backend
cd backend
if not exist "venv" (
    echo Đang tạo virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
if not exist ".env" (
    echo Đang tạo file .env...
    python fix-env-file.py
)
pip show django >nul 2>&1
if errorlevel 1 (
    echo Đang cài đặt packages backend...
    pip install -r requirements.txt --quiet
)
python manage.py migrate --no-input
echo ✅ Backend ready
cd ..

:: Setup frontend
cd frontend
if not exist "node_modules" (
    echo Đang cài đặt packages frontend...
    call npm install --silent
)
echo ✅ Frontend ready
cd ..

:: Start services
echo.
echo 🚀 Starting services...
echo.

:: Backend
start "Backend" cmd /k "cd backend && call venv\Scripts\activate.bat && python manage.py runserver"
timeout /t 3 /nobreak >nul

:: Frontend (default - port 3000)
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ Services đã được khởi động!
echo    Backend:  http://localhost:8000
echo    Frontend: http://localhost:3000
echo.
pause

