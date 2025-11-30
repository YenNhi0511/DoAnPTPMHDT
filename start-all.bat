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
echo   Admin:      http://localhost:3003
echo   Candidate:  http://localhost:3001
echo   Recruiter:  http://localhost:3002
echo.
echo Press any key to exit...
pause >nul

