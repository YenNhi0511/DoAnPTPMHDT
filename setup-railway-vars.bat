@echo off
REM ========================================
REM   Setup Railway Environment Variables
REM ========================================

echo ⚙️  Railway Environment Variables Setup
echo.

REM Check if logged in
call railway whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Not logged in to Railway
    echo Please run: railway login
    pause
    exit /b 1
)

REM Check if project linked
if not exist ".railway" (
    echo ⚠️  No Railway project linked
    echo Please run: railway link
    pause
    exit /b 1
)

echo Setting environment variables...
echo.

REM Generate SECRET_KEY
echo 🔑 Generating SECRET_KEY...
python -c "import secrets; print(secrets.token_urlsafe(50))" > temp_key.txt
set /p SECRET_KEY=<temp_key.txt
del temp_key.txt
call railway variables --set "SECRET_KEY=%SECRET_KEY%"
echo ✅ SECRET_KEY set

REM Basic Django settings
call railway variables --set "DEBUG=False"
echo ✅ DEBUG=False

call railway variables --set "ALLOWED_HOSTS=*.railway.app,*.up.railway.app"
echo ✅ ALLOWED_HOSTS set

REM Optional: Ask for API keys
echo.
set /p SET_OPTIONAL="Set optional variables (Gemini, Email)? (Y/N): "
if /i "%SET_OPTIONAL%"=="Y" (
    echo.
    set /p GEMINI_KEY="GEMINI_API_KEY (press Enter to skip): "
    if not "%GEMINI_KEY%"=="" (
        call railway variables --set "GEMINI_API_KEY=%GEMINI_KEY%"
        echo ✅ GEMINI_API_KEY set
    )
    
    echo.
    set /p EMAIL_USER="EMAIL_HOST_USER (press Enter to skip): "
    if not "%EMAIL_USER%"=="" (
        call railway variables --set "EMAIL_HOST_USER=%EMAIL_USER%"
        echo ✅ EMAIL_HOST_USER set
        
        set /p EMAIL_PASS="EMAIL_HOST_PASSWORD: "
        if not "%EMAIL_PASS%"=="" (
            call railway variables --set "EMAIL_HOST_PASSWORD=%EMAIL_PASS%"
            echo ✅ EMAIL_HOST_PASSWORD set
        )
    )
)

echo.
echo ✅ Environment variables configured!
echo.
echo 📋 Current variables:
call railway variables
echo.
pause
