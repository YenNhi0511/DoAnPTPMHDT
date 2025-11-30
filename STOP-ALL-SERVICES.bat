@echo off
chcp 65001 >nul
echo ============================================================
echo    GOODCV - STOP ALL SERVICES
echo ============================================================
echo.

echo Đang dừng tất cả services...
echo.

:: Dừng processes trên các port
echo [1/4] Dừng Backend (Port 8000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/4] Dừng Frontend Admin (Port 3003)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3003 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [3/4] Dừng Frontend Recruiter (Port 3002)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3002 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [4/4] Dừng Frontend Candidate (Port 3001)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: Dừng Celery
echo Dừng Celery workers...
taskkill /F /IM celery.exe >nul 2>&1

:: Dừng Node processes
echo Dừng Node processes...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo ✅ Đã dừng tất cả services!
echo.
pause

