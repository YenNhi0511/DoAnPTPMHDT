@echo off
echo ========================================
echo Starting GoodCV - Minimal Setup
echo ========================================
echo.
echo This will start:
echo   - Redis (Docker)
echo   - Backend (Django)
echo   - Frontend - Candidate only
echo.

REM Start Redis (Docker)
echo [1/3] Starting Redis...
start "Redis" cmd /k "cd backend && start-redis-docker.bat"
timeout /t 3 /nobreak >nul

REM Start Backend
echo [2/3] Starting Backend...
start "Backend" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"
timeout /t 5 /nobreak >nul

REM Start Frontend - Candidate only
echo [3/3] Starting Frontend - Candidate...
start "Frontend Candidate" cmd /k "cd frontend && npm run start:candidate"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo Services started!
echo ========================================
echo.
echo URLs:
echo   Backend:    http://localhost:8000
echo   Candidate:  http://localhost:3001
echo.
echo Note: Celery is not started (optional for basic testing)
echo.
echo Press any key to exit...
pause >nul

