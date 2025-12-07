@echo off
REM ========================================
REM   Quick Railway Deploy - Backend Only
REM ========================================

echo 🚀 Quick Railway Backend Deploy
echo.

REM Check Railway CLI
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Railway CLI...
    call npm i -g @railway/cli
)

REM Login if needed
echo Checking Railway login...
call railway whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Please login to Railway...
    call railway login
    timeout /t 3 /nobreak >nul
)

echo.
echo ✅ Ready to deploy!
echo.

REM Create project if needed
if not exist ".railway" (
    echo Creating new project...
    call railway init --name recruitment-backend
)

echo.
echo 🚀 Deploying backend...
call railway up

echo.
echo ✅ Backend deployment initiated!
echo.
echo 📋 Next steps:
echo 1. Add PostgreSQL: railway add
echo 2. Add Redis: railway add
echo 3. Set variables: railway variables set KEY=VALUE
echo 4. View logs: railway logs
echo.
pause
