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
    call npm i -g @railway/cli
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install Railway CLI
        pause
        exit /b 1
    )
)

REM Check if already logged in
echo 📝 Checking Railway login status...
call railway whoami >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Already logged in to Railway!
) else (
    echo 🔐 Not logged in. Opening browser for authentication...
    echo.
    echo 📌 IMPORTANT: 
    echo    1. Browser will open for Railway login
    echo    2. Complete the authentication in browser
    echo    3. Return to this window after seeing "Logged in"
    echo.
    pause
    
    start /wait cmd /c "railway login"
    
    timeout /t 3 /nobreak >nul
    
    REM Verify login succeeded
    call railway whoami >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ❌ Login failed or timed out
        echo.
        echo 💡 Try manual login:
        echo    1. Open a new terminal
        echo    2. Run: railway login
        echo    3. Complete authentication
        echo    4. Run this script again
        echo.
        pause
        exit /b 1
    )
    
    echo.
    echo ✅ Login successful!
)

echo.
timeout /t 1 /nobreak >nul

echo ========================================
echo   Step 1: Setup Backend Project
echo ========================================
echo.

REM Check if project already linked
if exist ".railway" (
    echo ✅ Railway project already linked
) else (
    echo 🔧 Creating new Railway project...
    echo.
    set /p PROJECT_NAME="Enter project name (default: recruitment-system): "
    if "%PROJECT_NAME%"=="" set PROJECT_NAME=recruitment-system
    
    echo Creating project: %PROJECT_NAME%
    call railway init --name "%PROJECT_NAME%"
    
    if %ERRORLEVEL% NEQ 0 (
        echo ⚠️  Failed to create project. Trying to link to existing project...
        call railway link
    )
)

echo.
echo ========================================
echo   Step 2: Set Environment Variables
echo ========================================
echo.

echo 💡 NOTE: Variables can only be set AFTER deploying a service.
echo    If you haven't deployed yet, skip this step and set them later.
echo.

set /p SET_VARS="Do you want to set environment variables now? (Y/N): "
if /i "%SET_VARS%"=="Y" (
    echo.
    echo ⚙️  Setting backend environment variables...
    echo.
    
    REM Check if service is linked
    call railway service >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo ⚠️  No service linked yet. Variables will be set after deployment.
        echo    For now, we'll prepare them.
        goto :skip_vars
    )
    
    set /p GEMINI_API_KEY="Enter GEMINI_API_KEY (or press Enter to skip): "
    if not "%GEMINI_API_KEY%"=="" (
        call railway variables --set "GEMINI_API_KEY=%GEMINI_API_KEY%"
    )
    
    set /p EMAIL_HOST_USER="Enter EMAIL_HOST_USER (or press Enter to skip): "
    if not "%EMAIL_HOST_USER%"=="" (
        call railway variables --set "EMAIL_HOST_USER=%EMAIL_HOST_USER%"
    )
    
    set /p EMAIL_HOST_PASSWORD="Enter EMAIL_HOST_PASSWORD (or press Enter to skip): "
    if not "%EMAIL_HOST_PASSWORD%"=="" (
        call railway variables --set "EMAIL_HOST_PASSWORD=%EMAIL_HOST_PASSWORD%"
    )
    
    echo.
    echo Generating SECRET_KEY...
    python -c "import secrets; print(secrets.token_urlsafe(50))" > temp_key.txt
    set /p SECRET_KEY=<temp_key.txt
    del temp_key.txt
    echo Generated SECRET_KEY
    call railway variables --set "SECRET_KEY=%SECRET_KEY%"
    
    call railway variables --set "DEBUG=False"
    call railway variables --set "ALLOWED_HOSTS=*.railway.app,*.up.railway.app"
    
    echo.
    echo ✅ Environment variables set!
) else (
    :skip_vars
    echo ⏭️  Skipping environment variables (can be set later in Railway Dashboard)
)

echo.
echo ========================================
echo   Step 3: Deploy Backend
echo ========================================
echo.
set /p DEPLOY_BACKEND="Deploy backend now? (Y/N): "
if /i "%DEPLOY_BACKEND%"=="Y" (
    echo 🚀 Deploying backend to Railway...
    call railway up
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ Backend deployed successfully!
        
        REM After deployment, set variables if not set before
        if /i "%SET_VARS%"=="N" (
            echo.
            set /p SET_VARS_NOW="Backend deployed! Set environment variables now? (Y/N): "
            if /i "%SET_VARS_NOW%"=="Y" (
                echo.
                echo ⚙️  Setting environment variables...
                
                echo Generating SECRET_KEY...
                python -c "import secrets; print(secrets.token_urlsafe(50))" > temp_key.txt
                set /p SECRET_KEY=<temp_key.txt
                del temp_key.txt
                call railway variables --set "SECRET_KEY=%SECRET_KEY%"
                
                call railway variables --set "DEBUG=False"
                call railway variables --set "ALLOWED_HOSTS=*.railway.app,*.up.railway.app"
                
                echo ✅ Basic variables set! Set others in Railway Dashboard.
            )
        )
    ) else (
        echo.
        echo ⚠️  Backend deployment had issues. Check Railway Dashboard.
    )
) else (
    echo ⏭️  Skipping backend deployment
)

echo.
echo ========================================
echo   Step 4: Add Database Services
echo ========================================
echo.
echo 📦 Add these services in Railway Dashboard:
echo    1. Open: https://railway.app/dashboard
echo    2. Select your project
echo    3. Click "New" -^> "Database" -^> "PostgreSQL"
echo    4. Click "New" -^> "Database" -^> "Redis"
echo.
echo ⚠️  After adding databases, Railway will provide:
echo    - DATABASE_URL (automatically added to backend)
echo    - REDIS_URL (automatically added to backend)
echo.
set /p DB_READY="Have you added PostgreSQL and Redis? (Y/N): "

echo.
echo ========================================
echo   Step 5: Deploy Frontend
echo ========================================
echo.
echo 🎨 To deploy frontend, please do the following:
echo.
echo IN RAILWAY DASHBOARD:
echo ├─ Click "New" -^> "GitHub Repo"
echo ├─ Select your repository
echo ├─ Set "Root Directory" = frontend
echo ├─ Railway auto-detects Dockerfile
echo └─ Add environment variable:
echo    └─ REACT_APP_API_URL = https://your-backend-url.up.railway.app/api
echo.
echo 💡 TIP: Get your backend URL from Railway Dashboard
echo.
set /p FRONTEND_READY="Have you deployed frontend? (Y/N): "

if /i "%DB_READY%"=="Y" if /i "%FRONTEND_READY%"=="Y" (
    echo.
    echo ========================================
    echo   Step 6: Run Database Migrations
    echo ========================================
    echo.
    
    set /p RUN_MIGRATIONS="Run migrations now? (Y/N): "
    if /i "%RUN_MIGRATIONS%"=="Y" (
        echo 🗄️  Running database migrations...
        call railway run python backend/manage.py migrate
        
        echo.
        echo 👤 Creating superuser...
        call railway run python backend/manage.py createsuperuser
        
        echo.
        set /p SEED="Seed sample data? (Y/N): "
        if /i "%SEED%"=="Y" (
            echo 📊 Seeding data...
            call railway run python backend/seed_data.py
        )
    )
)

echo.
echo ========================================
echo   ✅ Setup Complete!
echo ========================================
echo.
echo 📋 DEPLOYMENT SUMMARY:
echo ├─ ✅ Railway CLI installed and logged in
echo ├─ ✅ Project created/linked
if /i "%DEPLOY_BACKEND%"=="Y" (
    echo ├─ ✅ Backend deployed
) else (
    echo ├─ ⏭️  Backend deployment pending
)
if /i "%DB_READY%"=="Y" (
    echo ├─ ✅ Databases added
) else (
    echo ├─ ⏳ Databases need to be added
)
if /i "%FRONTEND_READY%"=="Y" (
    echo ├─ ✅ Frontend deployed
) else (
    echo ├─ ⏳ Frontend needs to be deployed
)
echo └─ 📝 Configuration may need updates
echo.
echo 🔗 NEXT STEPS:
echo.
echo 1. Open Railway Dashboard: https://railway.app/dashboard
echo 2. Get your service URLs:
echo    ├─ Backend URL: https://your-backend.up.railway.app
echo    └─ Frontend URL: https://your-frontend.up.railway.app
echo.
echo 3. Update environment variables:
echo    Backend:
echo    ├─ CORS_ALLOWED_ORIGINS = https://your-frontend-url
echo    └─ FRONTEND_URL = https://your-frontend-url
echo.
echo    Frontend:
echo    └─ REACT_APP_API_URL = https://your-backend-url/api
echo.
echo 4. Services will auto-redeploy after env changes
echo.
echo 📚 DOCUMENTATION:
echo ├─ Full Guide: RAILWAY-DEPLOY.md
echo ├─ Architecture: RAILWAY-ARCHITECTURE.md
echo └─ Checklist: DEPLOYMENT-CHECKLIST.md
echo.
echo 🎉 Happy deploying!
echo.
pause
