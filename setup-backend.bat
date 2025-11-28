@echo off
echo ========================================
echo   SETUP BACKEND - Recruitment System
echo ========================================
echo.

cd backend

echo [1/6] Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

echo [2/6] Activating virtual environment...
call venv\Scripts\activate.bat

echo [3/6] Upgrading pip...
python -m pip install --upgrade pip

echo [4/6] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo [5/6] Creating .env file...
if not exist .env (
    echo SECRET_KEY=django-insecure-change-this-in-production > .env
    echo DEBUG=True >> .env
    echo ALLOWED_HOSTS=localhost,127.0.0.1 >> .env
    echo DATABASE_URL= >> .env
    echo EMAIL_HOST_USER= >> .env
    echo EMAIL_HOST_PASSWORD= >> .env
    echo GEMINI_API_KEY= >> .env
    echo.
    echo .env file created! Please edit it with your configuration.
) else (
    echo .env file already exists.
)

echo [6/6] Running migrations...
python manage.py migrate
if errorlevel 1 (
    echo WARNING: Migrations failed. Please check your database configuration.
)

echo.
echo ========================================
echo   Setup completed!
echo ========================================
echo.
echo Next steps:
echo 1. Edit backend\.env with your configuration
echo 2. Run: python manage.py createsuperuser
echo 3. Run: python manage.py runserver
echo.
pause

