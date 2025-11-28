@echo off
echo ========================================
echo   SETUP FRONTEND - Recruitment System
echo ========================================
echo.

cd frontend

echo [1/3] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo [2/3] Creating .env file...
if not exist .env (
    echo REACT_APP_API_URL=http://localhost:8000/api > .env
    echo .env file created!
) else (
    echo .env file already exists.
)

echo [3/3] Setup completed!
echo.
echo Next step: Run 'npm start' to start the development server
echo.
pause

