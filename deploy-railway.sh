#!/bin/bash

echo "========================================"
echo "  🚀 Railway Full Deployment Script"
echo "  Deploy Backend + Frontend + Database"
echo "========================================"
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null
then
    echo "⚠️  Railway CLI not found. Installing..."
    npm i -g @railway/cli
fi

# Login to Railway
echo "📝 Logging in to Railway..."
railway login

echo ""
echo "========================================"
echo "  Step 1: Deploy Backend"
echo "========================================"
echo ""

# Initialize project if not exists
echo "🔧 Initializing Railway project..."
railway init

# Link to project
echo "🔗 Linking to Railway project..."
railway link

# Set environment variables
echo "⚙️  Setting backend environment variables..."
echo "Please enter the following values:"
echo ""

read -p "GEMINI_API_KEY: " GEMINI_API_KEY
railway variables set GEMINI_API_KEY="$GEMINI_API_KEY"

read -p "EMAIL_HOST_USER: " EMAIL_HOST_USER
railway variables set EMAIL_HOST_USER="$EMAIL_HOST_USER"

read -p "EMAIL_HOST_PASSWORD: " EMAIL_HOST_PASSWORD
railway variables set EMAIL_HOST_PASSWORD="$EMAIL_HOST_PASSWORD"

read -p "SECRET_KEY (press Enter to generate): " SECRET_KEY
if [ -z "$SECRET_KEY" ]; then
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))")
    echo "Generated SECRET_KEY: $SECRET_KEY"
fi
railway variables set SECRET_KEY="$SECRET_KEY"

railway variables set DEBUG="False"
railway variables set ALLOWED_HOSTS="*.railway.app,*.up.railway.app"

# Deploy backend
echo ""
echo "🚀 Deploying backend to Railway..."
railway up

echo ""
echo "========================================"
echo "  Step 2: Add Database Services"
echo "========================================"
echo ""
echo "📦 Please add these in Railway Dashboard:"
echo "   1. Go to https://railway.app/dashboard"
echo "   2. Select your project"
echo "   3. Click 'New' → 'Database' → 'PostgreSQL'"
echo "   4. Click 'New' → 'Database' → 'Redis'"
echo ""
read -p "Press Enter when databases are added..."

echo ""
echo "========================================"
echo "  Step 3: Deploy Frontend"
echo "========================================"
echo ""
echo "🎨 Setting up frontend service..."
echo ""
echo "Please do the following in Railway Dashboard:"
echo "1. Click 'New' → 'GitHub Repo'"
echo "2. Select your repository"
echo "3. Set 'Root Directory' to: frontend"
echo "4. Railway will auto-detect Dockerfile"
echo "5. Set environment variable: REACT_APP_API_URL"
echo "   Value: https://your-backend.up.railway.app/api"
echo ""
read -p "Press Enter when frontend is configured..."

echo ""
echo "========================================"
echo "  Step 4: Run Migrations"
echo "========================================"
echo ""
echo "🗄️  Running database migrations..."
railway run python backend/manage.py migrate

echo ""
echo "👤 Creating superuser..."
railway run python backend/manage.py createsuperuser

echo ""
echo "📊 Seeding initial data (optional)..."
read -p "Do you want to seed data? (y/N): " SEED
if [ "$SEED" = "y" ] || [ "$SEED" = "Y" ]; then
    railway run python backend/seed_data.py
fi

echo ""
echo "========================================"
echo "  ✅ Deployment Complete!"
echo "========================================"
echo ""
echo "Your services are now running on Railway:"
echo ""
echo "📍 Backend:  Check Railway Dashboard for URL"
echo "📍 Frontend: Check Railway Dashboard for URL"
echo "📍 Admin:    https://your-backend-url/admin"
echo ""
echo "🔗 Railway Dashboard: https://railway.app/dashboard"
echo ""
echo "Next Steps:"
echo "1. Update CORS_ALLOWED_ORIGINS in backend with frontend URL"
echo "2. Update REACT_APP_API_URL in frontend with backend URL"
echo "3. Test all services"
echo ""
echo "📚 Full documentation: RAILWAY-DEPLOY.md"
echo "✅ Checklist: DEPLOYMENT-CHECKLIST.md"
echo ""
