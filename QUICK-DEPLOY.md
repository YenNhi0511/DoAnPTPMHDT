# 🚀 Quick Deploy Guide - Full Railway Deployment

## Deploy Backend to Railway (5 phút)

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Deploy backend
railway up
```

## Add PostgreSQL & Redis

```bash
# In Railway Dashboard hoặc CLI:
railway add --plugin postgresql
railway add --plugin redis
```

## Set Environment Variables

```bash
# Required variables cho backend
railway variables set SECRET_KEY=your-secret-key-here
railway variables set DEBUG=False
railway variables set ALLOWED_HOSTS=*.railway.app
railway variables set GEMINI_API_KEY=your-gemini-key
railway variables set EMAIL_HOST_USER=your-email@gmail.com
railway variables set EMAIL_HOST_PASSWORD=your-app-password
```

## Deploy Frontend to Railway

```bash
# 1. Tạo Frontend Service mới trong Railway Dashboard
# 2. Connect với GitHub repo
# 3. Set Root Directory = /frontend
# 4. Railway sẽ tự động detect Dockerfile và deploy

# Hoặc dùng CLI (từ frontend folder):
cd frontend
railway init
railway up

# Set environment variable cho frontend
railway variables set REACT_APP_API_URL=https://your-backend.up.railway.app/api
```

## Run Migrations

```bash
railway run python backend/manage.py migrate
railway run python backend/manage.py createsuperuser
railway run python backend/seed_data.py
```

## ✅ Done!

**Tất cả trên Railway**:
- Backend: `https://your-backend.up.railway.app`
- Frontend: `https://your-frontend.up.railway.app`
- Admin: `https://your-backend.up.railway.app/admin`
- Database: PostgreSQL on Railway
- Cache: Redis on Railway

Xem chi tiết: [RAILWAY-DEPLOY.md](./RAILWAY-DEPLOY.md)
