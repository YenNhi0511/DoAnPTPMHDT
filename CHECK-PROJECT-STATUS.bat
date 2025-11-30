@echo off
chcp 65001 >nul
echo ============================================================
echo    GOODCV - CHECK PROJECT STATUS
echo ============================================================
echo.

:: Kiểm tra Python
echo [1/6] Kiểm tra Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo    ❌ Python không được tìm thấy
) else (
    python --version
    echo    ✅ Python OK
)
echo.

:: Kiểm tra Node.js
echo [2/6] Kiểm tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo    ❌ Node.js không được tìm thấy
) else (
    node --version
    echo    ✅ Node.js OK
)
echo.

:: Kiểm tra Backend
echo [3/6] Kiểm tra Backend...
cd backend
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    pip show django >nul 2>&1
    if errorlevel 1 (
        echo    ❌ Django chưa được cài đặt
    ) else (
        echo    ✅ Backend dependencies OK
    )
) else (
    echo    ❌ Virtual environment chưa được tạo
)
cd ..
echo.

:: Kiểm tra Frontend
echo [4/6] Kiểm tra Frontend...
cd frontend
if exist "node_modules" (
    echo    ✅ Frontend dependencies OK
) else (
    echo    ❌ Frontend dependencies chưa được cài đặt
)
cd ..
echo.

:: Kiểm tra .env
echo [5/6] Kiểm tra cấu hình...
cd backend
if exist ".env" (
    echo    ✅ File .env tồn tại
) else (
    echo    ❌ File .env không tồn tại
)
cd ..
echo.

:: Kiểm tra services đang chạy
echo [6/6] Kiểm tra services đang chạy...
echo.

netstat -aon | findstr :8000 | findstr LISTENING >nul 2>&1
if errorlevel 1 (
    echo    ❌ Backend (Port 8000): KHÔNG chạy
) else (
    echo    ✅ Backend (Port 8000): Đang chạy
)

netstat -aon | findstr :3003 | findstr LISTENING >nul 2>&1
if errorlevel 1 (
    echo    ❌ Frontend Admin (Port 3003): KHÔNG chạy
) else (
    echo    ✅ Frontend Admin (Port 3003): Đang chạy
)

netstat -aon | findstr :3002 | findstr LISTENING >nul 2>&1
if errorlevel 1 (
    echo    ❌ Frontend Recruiter (Port 3002): KHÔNG chạy
) else (
    echo    ✅ Frontend Recruiter (Port 3002): Đang chạy
)

netstat -aon | findstr :3001 | findstr LISTENING >nul 2>&1
if errorlevel 1 (
    echo    ❌ Frontend Candidate (Port 3001): KHÔNG chạy
) else (
    echo    ✅ Frontend Candidate (Port 3001): Đang chạy
)

echo.
echo ============================================================
pause

