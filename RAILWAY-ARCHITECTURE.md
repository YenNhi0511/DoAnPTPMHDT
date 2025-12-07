# 🏗️ Railway Deployment Architecture

## 🎯 Overview

Toàn bộ application được deploy **100% trên Railway Platform**, bao gồm:

```
┌─────────────────────────────────────────────────┐
│         Railway Project: Recruitment           │
├─────────────────────────────────────────────────┤
│                                                 │
│  🗄️  PostgreSQL                                 │
│      ├─ Persistent storage                      │
│      ├─ Auto-backups                            │
│      └─ DATABASE_URL (auto-injected)            │
│                                                 │
│  📦  Redis                                       │
│      ├─ Cache + Session storage                 │
│      ├─ Celery message broker                   │
│      └─ REDIS_URL (auto-injected)               │
│                                                 │
│  🐍  Backend Service (Django)                   │
│      ├─ REST API                                │
│      ├─ Admin Panel                             │
│      ├─ JWT Authentication                      │
│      └─ URL: backend.up.railway.app             │
│                                                 │
│  ⚛️  Frontend Service (React + Nginx)           │
│      ├─ Static build (production)               │
│      ├─ Nginx web server                        │
│      ├─ Gzip compression                        │
│      └─ URL: frontend.up.railway.app            │
│                                                 │
│  👷  Celery Worker                               │
│      ├─ Background tasks                        │
│      ├─ AI CV processing                        │
│      └─ Email sending                           │
│                                                 │
│  ⏰  Celery Beat (Optional)                      │
│      └─ Scheduled tasks                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 📦 Services Breakdown

### 1. PostgreSQL Database
- **Type**: Managed Database Plugin
- **Purpose**: Main application database
- **Auto-features**:
  - Automatic backups
  - Connection pooling
  - SSL/TLS encryption
  - Health monitoring

### 2. Redis Cache
- **Type**: Managed Database Plugin
- **Purpose**: Cache + Celery broker
- **Features**:
  - In-memory data store
  - Session management
  - Task queue (Celery)
  - High performance

### 3. Backend Service
- **Tech Stack**: Django + Gunicorn
- **Build**: Nixpacks (auto-detect)
- **Port**: 8000 (internal)
- **Features**:
  - REST API endpoints
  - JWT authentication
  - Admin dashboard
  - Static files (WhiteNoise)
  - CORS configured

### 4. Frontend Service
- **Tech Stack**: React + Nginx
- **Build**: Docker multi-stage
- **Port**: 80 (internal)
- **Features**:
  - SPA (Single Page App)
  - Optimized production build
  - Gzip compression
  - React Router support
  - Static asset caching

### 5. Celery Worker
- **Purpose**: Background job processing
- **Tasks**:
  - AI CV screening (Gemini API)
  - Email notifications
  - Data processing
  - Report generation

### 6. Celery Beat (Optional)
- **Purpose**: Scheduled tasks
- **Examples**:
  - Daily reports
  - Cleanup old data
  - Reminder notifications

## 🔄 Data Flow

```
User Browser
     ↓
Frontend (React)
     ↓
Backend API (Django)
     ↓
┌────┴────┬────────┬──────────┐
↓         ↓        ↓          ↓
PostgreSQL Redis  Worker   Gemini AI
```

## 🚀 Deployment Process

### Initial Setup
```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Deploy
./deploy-railway.bat  # Windows
./deploy-railway.sh   # Linux/Mac
```

### Service Creation Order
1. ✅ Create PostgreSQL database
2. ✅ Create Redis cache
3. ✅ Deploy backend service
4. ✅ Deploy frontend service
5. ✅ Deploy celery worker
6. ✅ (Optional) Deploy celery beat

### Environment Variables Flow

**Backend Service**:
```env
DATABASE_URL=${PostgreSQL.DATABASE_URL}
REDIS_URL=${Redis.REDIS_URL}
SECRET_KEY=<generated>
GEMINI_API_KEY=<your-key>
FRONTEND_URL=${Frontend.RAILWAY_PUBLIC_DOMAIN}
```

**Frontend Service**:
```env
REACT_APP_API_URL=${Backend.RAILWAY_PUBLIC_DOMAIN}/api
```

## 🔐 Security Features

### Railway Platform Level
- ✅ Automatic HTTPS/SSL
- ✅ Private networking between services
- ✅ Environment variable encryption
- ✅ GitHub OAuth integration
- ✅ Role-based access control

### Application Level
- ✅ JWT authentication
- ✅ CORS restrictions
- ✅ SQL injection protection (Django ORM)
- ✅ XSS protection (React)
- ✅ CSRF tokens
- ✅ Password hashing (Django)

## 📊 Monitoring & Logs

### Per-Service Monitoring
```
Railway Dashboard → Select Service
├─ Logs (real-time)
├─ Metrics (CPU, Memory, Network)
├─ Health checks
└─ Build history
```

### Viewing Logs
```bash
# All services
railway logs

# Specific service
railway logs --service backend
railway logs --service frontend
railway logs --service celery-worker
```

## 💰 Cost Estimation

### Railway Pricing
- **Hobby Plan**: $5 free credit/month
- **Developer Plan**: $20/month

### Estimated Usage
| Service | Monthly Cost |
|---------|-------------|
| PostgreSQL | $1-2 |
| Redis | $0.5-1 |
| Backend | $1-2 |
| Frontend | $0.5-1 |
| Workers | $0.5-1 |
| **Total** | **$4-7** |

> ✅ Fits within FREE $5 credit for small projects!

## 🔄 CI/CD Pipeline

### Automatic Deployment
```
GitHub Push
     ↓
Railway Webhook
     ↓
Detect Changes
     ↓
┌────┴────┬────────┬──────────┐
↓         ↓        ↓          ↓
Backend  Frontend Worker   Beat
(build)  (rebuild) (restart) (restart)
     ↓         ↓        ↓          ↓
   Deploy   Deploy   Deploy   Deploy
(rolling) (instant) (zero-dt) (zero-dt)
```

### Rollback Strategy
```bash
# View deployments
railway deployments

# Rollback to previous
railway rollback <deployment-id>
```

## 🌐 Network Architecture

### Public Access
```
Internet
   ↓
Railway Edge Network
   ↓
┌──────┴──────┐
↓             ↓
Frontend    Backend
(public)    (public)
```

### Private Network
```
Backend
   ↓
┌──────┴──────┬────────┬──────┐
↓             ↓        ↓      ↓
PostgreSQL   Redis   Worker  Beat
(private)   (private) (private) (private)
```

## 📁 File Structure

```
DoAnPTPMHDT/
├── backend/
│   ├── Dockerfile (optional)
│   ├── requirements.txt
│   └── recruitment_system/
│       └── settings.py (Railway config)
│
├── frontend/
│   ├── Dockerfile ✨ (new)
│   ├── nginx.conf ✨ (new)
│   ├── railway.json ✨ (new)
│   └── src/
│
├── Procfile (backend processes)
├── railway.json (backend config)
├── nixpacks.toml (build config)
├── runtime.txt (Python version)
│
└── Documentation
    ├── RAILWAY-DEPLOY.md (full guide)
    ├── DEPLOYMENT-CHECKLIST.md
    ├── QUICK-DEPLOY.md
    └── deploy-railway.bat/.sh (scripts)
```

## 🎯 Key Benefits

### Single Platform Advantages
✅ **Unified Dashboard** - Tất cả services ở 1 nơi  
✅ **Shared Environment** - Variables dễ quản lý  
✅ **Private Network** - Services giao tiếp nội bộ  
✅ **Cost Effective** - 1 subscription thay vì nhiều platforms  
✅ **Simplified Monitoring** - 1 dashboard cho tất cả  
✅ **Easy Rollback** - Rollback toàn bộ hoặc từng service  

### Developer Experience
✅ **One-Click Deploy** - GitHub integration  
✅ **Auto-Scaling** - Railway handles load  
✅ **Zero Config** - Auto-detect frameworks  
✅ **Hot Reload** - Changes deploy instantly  
✅ **Team Collaboration** - Shared projects  

## 📚 Documentation

- 📖 [RAILWAY-DEPLOY.md](./RAILWAY-DEPLOY.md) - Hướng dẫn chi tiết
- ✅ [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md) - Checklist
- ⚡ [QUICK-DEPLOY.md](./QUICK-DEPLOY.md) - Quick start
- 🌐 [Railway Docs](https://docs.railway.app)

## 🆘 Support

- Railway Community: https://discord.gg/railway
- Railway Status: https://status.railway.app
- Railway Blog: https://blog.railway.app

---

**Last Updated**: December 8, 2025  
**Deployment Target**: 100% Railway Platform  
**Status**: ✅ Production Ready
