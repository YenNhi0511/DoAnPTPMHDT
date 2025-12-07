@echo off
echo ========================================
echo   🚀 Railway Full Deployment Script
echo   Deploy Backend + Frontend + Database
echo ========================================
echo.

REM Check if railway CLI is installed
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Railway CLI not found. Installing...
    npm i -g @railway/cli
)

REM Login to Railway
echo 📝 Logging in to Railway...
railway login

echo.
echo ========================================
echo   Step 1: Deploy Backend
echo ========================================
echo.

REM Initialize backend project
echo 🔧 Initializing backend project...
railway init

REM Link to project
echo 🔗 Linking to Railway project...
railway link

REM Set environment variables
echo ⚙️  Setting backend environment variables...
echo.

set /p GEMINI_API_KEY="Enter GEMINI_API_KEY: "
railway variables set GEMINI_API_KEY=%GEMINI_API_KEY%

set /p EMAIL_HOST_USER="Enter EMAIL_HOST_USER: "
railway variables set EMAIL_HOST_USER=%EMAIL_HOST_USER%

set /p EMAIL_HOST_PASSWORD="Enter EMAIL_HOST_PASSWORD: "
railway variables set EMAIL_HOST_PASSWORD=%EMAIL_HOST_PASSWORD%

echo Generating SECRET_KEY...
python -c "import secrets; print(secrets.token_urlsafe(50))" > temp_key.txt
set /p SECRET_KEY=<temp_key.txt
del temp_key.txt
railway variables set SECRET_KEY=%SECRET_KEY%

railway variables set DEBUG=False
railway variables set ALLOWED_HOSTS=*.railway.app,*.up.railway.app

REM Deploy backend
echo.
echo 🚀 Deploying backend to Railway...
railway up

echo.
echo ========================================
echo   Step 2: Add Database Services
echo ========================================
echo.
echo 📦 Please add these in Railway Dashboard:
echo    1. Go to https://railway.app/dashboard
echo    2. Select your project
echo    3. Click "New" → "Database" → "PostgreSQL"
echo    4. Click "New" → "Database" → "Redis"
echo.
pause

echo.
echo ========================================
echo   Step 3: Deploy Frontend
echo ========================================
echo.
echo 🎨 Setting up frontend service...
echo.
echo Please do the following in Railway Dashboard:
echo 1. Click "New" → "GitHub Repo"
echo 2. Select your repository
echo 3. Set "Root Directory" to: frontend
echo 4. Railway will auto-detect Dockerfile
echo 5. Set environment variable: REACT_APP_API_URL
echo    Value: https://your-backend.up.railway.app/api
echo.
pause

echo.
echo ========================================
echo   Step 4: Run Migrations
echo ========================================
echo.
echo 🗄️  Running database migrations...
railway run python backend/manage.py migrate

echo.
echo 👤 Creating superuser...
railway run python backend/manage.py createsuperuser

echo.
echo 📊 Seeding initial data (optional)...
set /p SEED="Do you want to seed data? (Y/N): "
if /i "%SEED%"=="Y" (
    railway run python backend/seed_data.py
)

echo.
echo ========================================
echo   ✅ Deployment Complete!
echo ========================================
echo.
echo Your services are now running on Railway:
echo.
echo 📍 Backend:  Check Railway Dashboard for URL
echo 📍 Frontend: Check Railway Dashboard for URL
echo 📍 Admin:    https://your-backend-url/admin
echo.
echo 🔗 Railway Dashboard: https://railway.app/dashboard
echo.
echo Next Steps:
echo 1. Update CORS_ALLOWED_ORIGINS in backend with frontend URL
echo 2. Update REACT_APP_API_URL in frontend with backend URL
echo 3. Test all services
echo.
echo 📚 Full documentation: RAILWAY-DEPLOY.md
echo ✅ Checklist: DEPLOYMENT-CHECKLIST.md
echo.
pause
