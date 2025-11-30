@echo off
echo ========================================
echo Starting GoodCV - Simple Setup (1 Port)
echo ========================================
echo.
echo This will start:
echo   - Redis (Docker - background)
echo   - Backend (Django)
echo   - Celery Worker
echo   - Frontend (Port 3000 - All roles)
echo.
echo You can test 3 roles by:
echo   1. Open 3 browser tabs
echo   2. Login with different accounts (Admin, Candidate, Recruiter)
echo   3. Each tab will show the interface for that role
echo.

REM Start Redis (Docker)
echo [1/4] Starting Redis...
start "Redis" cmd /k "cd backend && start-redis-docker.bat"
timeout /t 3 /nobreak >nul

REM Start Backend
echo [2/4] Starting Backend...
start "Backend" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"
timeout /t 5 /nobreak >nul

REM Start Celery
echo [3/4] Starting Celery Worker...
start "Celery" cmd /k "cd backend && venv\Scripts\activate && celery -A recruitment_system worker -l info --pool=solo"
timeout /t 3 /nobreak >nul

REM Start Frontend (1 port - all roles)
echo [4/4] Starting Frontend (Port 3000 - All roles)...
start "Frontend" cmd /k "cd frontend && npm start"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo URLs:
echo   Backend:    http://localhost:8000
echo   Frontend:   http://localhost:3000 (All roles)
echo.
echo How to test 3 roles:
echo   1. Open http://localhost:3000 in 3 browser tabs
echo   2. Tab 1: Login as ADMIN
echo   3. Tab 2: Login as CANDIDATE
echo   4. Tab 3: Login as RECRUITER
echo   5. Each tab will show the interface for that role
echo.
echo Press any key to exit...
pause >nul

