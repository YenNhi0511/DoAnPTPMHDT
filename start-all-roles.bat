@echo off
echo ========================================
echo Starting GoodCV - All Roles
echo ========================================
echo.
echo Starting ADMIN on port 3003...
start "GoodCV Admin" cmd /k "cd frontend && npm run start:admin"
timeout /t 3 /nobreak >nul

echo Starting CANDIDATE on port 3001...
start "GoodCV Candidate" cmd /k "cd frontend && npm run start:candidate"
timeout /t 3 /nobreak >nul

echo Starting RECRUITER on port 3002...
start "GoodCV Recruiter" cmd /k "cd frontend && npm run start:recruiter"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo All roles started!
echo ========================================
echo Admin:    http://localhost:3003
echo Candidate: http://localhost:3001
echo Recruiter: http://localhost:3002
echo.
pause

