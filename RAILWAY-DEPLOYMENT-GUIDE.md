# 🚂 Railway.app Deployment Guide - Complete Configuration

> **Hướng dẫn đầy đủ deploy Django + React application lên Railway.app**
> 
> **Project:** Recruitment System (DoAnPTPMHDT)
> **Stack:** Django 5.0 + React 18 + PostgreSQL + Redis
> **Platform:** Railway.app (Manual Dashboard Deployment)

---

## 📋 Table of Contents

1. [Tổng quan Architecture](#tổng-quan-architecture)
2. [Prerequisites](#prerequisites)
3. [Backend Service Setup](#backend-service-setup)
4. [Frontend Service Setup](#frontend-service-setup)
5. [Database Services](#database-services)
6. [Environment Variables](#environment-variables)
7. [Custom Domain Configuration](#custom-domain-configuration)
8. [Troubleshooting](#troubleshooting)
9. [Deployment Checklist](#deployment-checklist)

---

## 🏗️ Tổng quan Architecture

### Services trên Railway:

```
┌─────────────────────────────────────────────────────┐
│                   Railway Project                    │
├──────────────┬──────────────┬──────────┬────────────┤
│   Backend    │   Frontend   │ Postgres │   Redis    │
│   (Django)   │   (React)    │   (DB)   │  (Cache)   │
└──────────────┴──────────────┴──────────┴────────────┘
```

### Repository Structure:

```
DoAnPTPMHDT/
├── backend/                    # Django Backend
│   ├── Dockerfile             # (Not used - Nixpacks auto-detect)
│   ├── nixpacks.toml          # Nixpacks build config
│   ├── Procfile               # Process definitions
│   ├── requirements.txt       # Python dependencies
│   └── recruitment_system/    # Django project
│
├── frontend/                  # React Frontend
│   ├── Dockerfile             # Docker build config
│   ├── nginx.conf             # Nginx server config
│   ├── railway.json           # Railway build config
│   ├── build/                 # Pre-built React app (in git)
│   └── src/                   # React source code
│
└── README.md
```

---

## ✅ Prerequisites

### 1. Railway Account
- Tạo tài khoản tại: https://railway.app
- Login và tạo New Project

### 2. GitHub Repository
- Push code lên GitHub repository
- Repository: `YenNhi0511/DoAnPTPMHDT`
- Branch: `main`

### 3. Custom Domain (Optional)
- Domain: `recruitmentpro.live` (từ name.com)
- Frontend: `www.recruitmentpro.live`
- Backend: `api.recruitmentpro.live`

---

## 🔧 Backend Service Setup

### Step 1: Tạo Backend Service

1. **Railway Dashboard** → Click **"New"** → **"GitHub Repo"**
2. Chọn repository: `DoAnPTPMHDT`
3. Service name: `DoAnPTPMHDTbackend`

### Step 2: Configure Backend Settings

**Settings → Source:**
- **Root Directory:** `backend`
- **Builder:** Nixpacks (auto-detected)
- **Branch:** `main`

### Step 3: Backend Configuration Files

#### `backend/nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["python310", "postgresql", "file"]
aptPkgs = ["libmagic1"]

[phases.install]
cmds = [
  "pip install --upgrade pip",
  "pip install -r requirements.txt"
]

[start]
cmd = "gunicorn recruitment_system.wsgi --bind 0.0.0.0:$PORT --workers 2 --timeout 120"
```

**Giải thích:**
- `python310`: Python 3.10
- `postgresql`: PostgreSQL client libraries
- `file`: File type detection utility
- `libmagic1`: Library cho python-magic (file type detection)
- `gunicorn`: WSGI server binding tới Railway's `$PORT`

#### `backend/Procfile`
```procfile
web: python manage.py collectstatic --noinput && python manage.py migrate && gunicorn recruitment_system.wsgi --bind 0.0.0.0:$PORT --workers 2 --timeout 120
worker: celery -A recruitment_system worker --loglevel=info --pool=solo
beat: celery -A recruitment_system beat --loglevel=info
```

**Giải thích:**
- `web`: Main process - collectstatic, migrate, start gunicorn
- `worker`: Celery worker (optional - nếu dùng background tasks)
- `beat`: Celery beat scheduler (optional)

#### `backend/requirements.txt` (Key changes)
```txt
# File type detection - Linux compatible
python-magic>=0.4.27  # Changed from python-magic-bin
```

**⚠️ Important:** `python-magic-bin` chỉ work trên Windows. Phải dùng `python-magic` cho Linux.

### Step 4: Backend Environment Variables

**Settings → Variables → Add:**

```bash
# Django Core
SECRET_KEY=<generate-strong-secret-key>
DEBUG=False
ALLOWED_HOSTS=.railway.app,.up.railway.app,api.recruitmentpro.live

# Database (Referenced from PostgreSQL service)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (Referenced from Redis service)
REDIS_URL=${{Redis.REDIS_URL}}

# CORS - Frontend domains
CORS_ALLOWED_ORIGINS=https://www.recruitmentpro.live

# CSRF - Backend domains
CSRF_TRUSTED_ORIGINS=https://api.recruitmentpro.live

# Email (Optional - Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password

# AI API (Optional)
GEMINI_API_KEY=your_gemini_api_key

# Default From Email
DEFAULT_FROM_EMAIL=noreply@recruitmentpro.live
```

**⚠️ Important Notes:**

1. **SECRET_KEY:** Generate mới, không dùng default:
   ```python
   import secrets
   print(secrets.token_urlsafe(50))
   ```

2. **DATABASE_URL & REDIS_URL:** Dùng **Reference Variables**
   - Variables → New Variable → **Add a Reference**
   - Chọn PostgreSQL service → DATABASE_URL
   - Chọn Redis service → REDIS_URL

3. **CORS_ALLOWED_ORIGINS:** Phải match chính xác frontend URL (không có trailing slash)

4. **ALLOWED_HOSTS:** Wildcard `.railway.app` và custom domain

### Step 5: Django Settings Configuration

#### `backend/recruitment_system/settings.py` (Key sections)

```python
import os
import dj_database_url

# Security
SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = os.environ.get('DEBUG', 'False').lower() in ('true', '1', 'yes')
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost').split(',')

# CSRF Trusted Origins
CSRF_TRUSTED_ORIGINS = [
    origin.strip() for origin in os.environ.get('CSRF_TRUSTED_ORIGINS', '').split(',') if origin.strip()
]

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    origin.strip() for origin in os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:3000').split(',') if origin.strip()
]
CORS_ALLOW_CREDENTIALS = True

# Database - Railway auto-inject DATABASE_URL
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600
    )
}

# Static files - WhiteNoise
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Must be after SecurityMiddleware
    # ... other middleware
]
```

### Step 6: Run Migrations

**Option 1: Via Railway CLI (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# Select backend service
railway service

# Run migrations
railway run python manage.py migrate

# Create superuser
railway run python manage.py createsuperuser --email admin@railway.com --username admin
```

**Option 2: Auto-run in Procfile (Already configured)**
Migrations tự động chạy mỗi lần deploy qua `Procfile`:
```
web: python manage.py migrate && gunicorn ...
```

---

## ⚛️ Frontend Service Setup

### Step 1: Tạo Frontend Service

1. **Railway Dashboard** → Click **"New"** → **"GitHub Repo"**
2. Chọn repository: `DoAnPTPMHDT`
3. Service name: `DoAnPTPMHDT-frontend`

### Step 2: Configure Frontend Settings

**Settings → Source:**
- **Root Directory:** `frontend`
- **Builder:** Dockerfile
- **Dockerfile Path:** `frontend/Dockerfile`
- **Branch:** `main`

### Step 3: Frontend Configuration Files

#### `frontend/Dockerfile`
```dockerfile
# Simple production stage - use pre-built files
FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy pre-built React app
COPY build /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Railway uses dynamic PORT, default to 80
ENV PORT=80

# Start nginx with envsubst for dynamic PORT
CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
```

**⚠️ Critical:** Railway assign dynamic `$PORT` (không phải 80). Nginx phải listen trên `$PORT` qua `envsubst`.

#### `frontend/nginx.conf`
```nginx
server {
    listen $PORT;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React Router - redirect all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Key Points:**
- `listen $PORT`: Dynamic port từ Railway
- `try_files ... /index.html`: React Router SPA support
- Gzip compression enabled
- Static asset caching

#### `frontend/railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "frontend/Dockerfile"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### `frontend/.dockerignore`
```
node_modules
.git
.gitignore
README.md
.env
.env.local
.DS_Store
npm-debug.log
yarn-error.log
```

### Step 4: Frontend API Configuration

#### `frontend/src/services/api.js`
```javascript
import axios from 'axios';

// Auto-detect API URL based on environment
const getApiUrl = () => {
  // If env var is set, use it (highest priority)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // For production deployment with custom domain
  if (window.location.hostname.includes('recruitmentpro.live')) {
    return 'https://api.recruitmentpro.live/api';
  }
  
  // For Railway deployment
  if (window.location.hostname.includes('railway.app')) {
    return 'https://doanptpmhdtbackend-production.up.railway.app/api';
  }
  
  // Default to localhost for development
  return 'http://localhost:8000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... rest of api configuration
```

**⚠️ Alternative (Simpler):** Hardcode production URL
```javascript
const API_URL = 'https://api.recruitmentpro.live/api';
```

### Step 5: Build React App Locally

**⚠️ CRITICAL:** Railway Free tier không đủ memory để build React. Phải build local và commit `build/` folder.

```bash
# Navigate to frontend
cd frontend

# Clean old build
rm -rf build

# Build production
npm run build

# Force add build folder (ignored by .gitignore)
git add -f build/

# Commit
git commit -m "Add pre-built React files for Railway deployment"

# Push
git push origin main
```

**Root `.gitignore` có ignore `build/`**, nên phải dùng `git add -f`.

### Step 6: Frontend Environment Variables

**Settings → Variables → Add:**

```bash
# Backend API URL
REACT_APP_API_URL=https://api.recruitmentpro.live/api
```

**⚠️ Note:** React env vars chỉ work nếu build với env vars. Approach hiện tại: build local hoặc dùng auto-detect trong `api.js`.

---

## 🗄️ Database Services

### PostgreSQL Setup

1. **Railway Dashboard** → Click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway tự động provision và tạo:
   - `DATABASE_URL`
   - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

**Link to Backend:**
- Backend service → Variables → New Variable → **Add a Reference**
- Select: `PostgreSQL.DATABASE_URL`

### Redis Setup

1. **Railway Dashboard** → Click **"New"** → **"Database"** → **"Redis"**
2. Railway tự động provision và tạo:
   - `REDIS_URL`
   - `REDIS_PRIVATE_URL`, `REDIS_PUBLIC_URL`

**Link to Backend:**
- Backend service → Variables → New Variable → **Add a Reference**
- Select: `Redis.REDIS_URL`

---

## 🌐 Custom Domain Configuration

### Step 1: Generate Railway Domains

**Backend Service:**
1. Settings → Networking → **Generate Domain**
2. Railway domain: `doanptpmhdtbackend-production.up.railway.app`

**Frontend Service:**
1. Settings → Networking → **Generate Domain**
2. Railway domain: `doanptpmhdt-frontend-production.up.railway.app`

### Step 2: Add Custom Domains (Optional)

**Backend - api.recruitmentpro.live:**
1. Backend Settings → Networking → Custom Domains → **Add Domain**
2. Enter: `api.recruitmentpro.live`
3. Railway sẽ cho CNAME record

**Frontend - www.recruitmentpro.live:**
1. Frontend Settings → Networking → Custom Domains → **Add Domain**
2. Enter: `www.recruitmentpro.live`
3. Railway sẽ cho CNAME record

### Step 3: Configure DNS (name.com)

**Login to name.com** → Domain Management → DNS Records:

```
Type: CNAME
Host: www
Value: doanptpmhdt-frontend-production.up.railway.app
TTL: 300

Type: CNAME
Host: api
Value: doanptpmhdtbackend-production.up.railway.app
TTL: 300
```

**DNS Propagation:** 5-30 phút

### Step 4: Update Environment Variables

**Backend Variables:**
```bash
ALLOWED_HOSTS=.railway.app,.up.railway.app,api.recruitmentpro.live
CORS_ALLOWED_ORIGINS=https://www.recruitmentpro.live
CSRF_TRUSTED_ORIGINS=https://api.recruitmentpro.live
```

**Frontend API URL (trong `api.js`):**
```javascript
return 'https://api.recruitmentpro.live/api';
```

Railway sẽ auto-redeploy sau khi update variables.

---

## 🔐 Environment Variables - Complete Reference

### Backend Variables

| Variable | Value | Description | Required |
|----------|-------|-------------|----------|
| `SECRET_KEY` | `<random-50-chars>` | Django secret key | ✅ Yes |
| `DEBUG` | `False` | Debug mode (production) | ✅ Yes |
| `ALLOWED_HOSTS` | `.railway.app,.up.railway.app,api.recruitmentpro.live` | Allowed hostnames | ✅ Yes |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | PostgreSQL connection | ✅ Yes |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` | Redis connection | ✅ Yes |
| `CORS_ALLOWED_ORIGINS` | `https://www.recruitmentpro.live` | CORS allowed origins | ✅ Yes |
| `CSRF_TRUSTED_ORIGINS` | `https://api.recruitmentpro.live` | CSRF trusted origins | ✅ Yes |
| `EMAIL_HOST` | `smtp.gmail.com` | SMTP host | ⚠️ If using email |
| `EMAIL_PORT` | `587` | SMTP port | ⚠️ If using email |
| `EMAIL_USE_TLS` | `True` | Use TLS | ⚠️ If using email |
| `EMAIL_HOST_USER` | `your@gmail.com` | SMTP username | ⚠️ If using email |
| `EMAIL_HOST_PASSWORD` | `app_password` | SMTP password | ⚠️ If using email |
| `DEFAULT_FROM_EMAIL` | `noreply@recruitmentpro.live` | From email address | ⚠️ If using email |
| `GEMINI_API_KEY` | `your_key` | Google Gemini API | ⚠️ If using AI |

### Frontend Variables

| Variable | Value | Description | Required |
|----------|-------|-------------|----------|
| `REACT_APP_API_URL` | `https://api.recruitmentpro.live/api` | Backend API URL | ✅ Yes |

**⚠️ Note:** Frontend variables chỉ work trong build time. Approach hiện tại dùng auto-detect trong `api.js`.

---

## 🐛 Troubleshooting

### Problem 1: 502 Bad Gateway

**Symptoms:**
- Frontend hoặc backend trả về 502 error
- Railway logs: Nginx/Gunicorn đang chạy nhưng không respond

**Causes & Solutions:**

1. **Nginx không listen đúng PORT:**
   ```nginx
   # Wrong
   listen 80;
   
   # Correct
   listen $PORT;
   ```
   Railway assign dynamic PORT qua `$PORT` env var.

2. **Build files không có trong Docker:**
   - Frontend `build/` folder phải được commit vào git
   - Hoặc Railway build trong Docker (nhưng cần nhiều memory)

3. **Backend không bind đúng PORT:**
   ```bash
   # Correct in Procfile
   gunicorn recruitment_system.wsgi --bind 0.0.0.0:$PORT
   ```

### Problem 2: CORS Errors

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**

1. **Backend `CORS_ALLOWED_ORIGINS` phải match frontend URL chính xác:**
   ```python
   # Correct
   CORS_ALLOWED_ORIGINS=https://www.recruitmentpro.live
   
   # Wrong (có trailing slash)
   CORS_ALLOWED_ORIGINS=https://www.recruitmentpro.live/
   ```

2. **Backend `settings.py` phải parse env var đúng:**
   ```python
   CORS_ALLOWED_ORIGINS = [
       origin.strip() 
       for origin in os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',') 
       if origin.strip()
   ]
   ```

3. **Multiple domains:** Separate bằng dấu phẩy (không có spaces)
   ```
   CORS_ALLOWED_ORIGINS=https://www.recruitmentpro.live,https://app.example.com
   ```

### Problem 3: 403 CSRF Verification Failed

**Symptoms:**
```
403 Forbidden - CSRF verification failed
```

**Solutions:**

1. **Backend phải có `CSRF_TRUSTED_ORIGINS`:**
   ```python
   CSRF_TRUSTED_ORIGINS = [
       'https://api.recruitmentpro.live'
   ]
   ```

2. **Django settings phải parse env var:**
   ```python
   CSRF_TRUSTED_ORIGINS = [
       origin.strip() 
       for origin in os.environ.get('CSRF_TRUSTED_ORIGINS', '').split(',') 
       if origin.strip()
   ]
   ```

### Problem 4: Static Files 404 (Django Admin)

**Symptoms:**
- Django admin không có CSS
- `/static/` files trả về 404

**Solutions:**

1. **Run collectstatic trong Procfile:**
   ```procfile
   web: python manage.py collectstatic --noinput && gunicorn ...
   ```

2. **WhiteNoise middleware phải enabled:**
   ```python
   MIDDLEWARE = [
       'django.middleware.security.SecurityMiddleware',
       'whitenoise.middleware.WhiteNoiseMiddleware',  # After Security
       # ...
   ]
   
   STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
   ```

### Problem 5: Database Connection Failed

**Symptoms:**
```
django.db.utils.OperationalError: could not connect to server
```

**Solutions:**

1. **DATABASE_URL phải được referenced đúng:**
   - Backend Variables → New Variable → **Add a Reference**
   - Select: `PostgreSQL.DATABASE_URL`

2. **`dj-database-url` phải được install:**
   ```txt
   # requirements.txt
   dj-database-url>=2.1.0
   psycopg2-binary>=2.9.9
   ```

3. **Django settings parse DATABASE_URL:**
   ```python
   import dj_database_url
   
   DATABASES = {
       'default': dj_database_url.config(
           default=os.environ.get('DATABASE_URL'),
           conn_max_age=600
       )
   }
   ```

### Problem 6: python-magic-bin fails on Linux

**Symptoms:**
```
ERROR: Could not find a version that satisfies python-magic-bin
```

**Solution:**

Change in `requirements.txt`:
```txt
# Wrong (Windows only)
python-magic-bin>=0.4.14

# Correct (Cross-platform)
python-magic>=0.4.27
```

Add system dependencies in `nixpacks.toml`:
```toml
[phases.setup]
nixPkgs = ["python310", "file"]
aptPkgs = ["libmagic1"]
```

### Problem 7: Railway Build Fails - Dockerfile not found

**Symptoms:**
```
Dockerfile does not exist
```

**Solutions:**

1. **Set Root Directory:**
   - Frontend Settings → Source → **Root Directory** = `frontend`

2. **Or specify full path in railway.json:**
   ```json
   {
     "build": {
       "dockerfilePath": "frontend/Dockerfile"
     }
   }
   ```

### Problem 8: npm ci package.json and package-lock.json not in sync

**Symptoms:**
```
npm ci can only install packages when your package.json and package-lock.json are in sync
```

**Solution:**

Regenerate `package-lock.json`:
```bash
cd frontend
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Regenerate package-lock.json"
git push
```

---

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] Code pushed to GitHub `main` branch
- [ ] `.env.example` documented với tất cả env vars cần thiết
- [ ] `requirements.txt` updated (python-magic, not python-magic-bin)
- [ ] Frontend `build/` folder committed (với `-f`)
- [ ] Railway account created và logged in

### Backend Deployment

- [ ] Backend service created và linked to GitHub repo
- [ ] Root Directory = `backend`
- [ ] `nixpacks.toml` configured với libmagic1
- [ ] `Procfile` có collectstatic + migrate + gunicorn
- [ ] PostgreSQL database created
- [ ] Redis database created
- [ ] All environment variables added:
  - [ ] SECRET_KEY (generated)
  - [ ] DEBUG=False
  - [ ] ALLOWED_HOSTS
  - [ ] DATABASE_URL (referenced)
  - [ ] REDIS_URL (referenced)
  - [ ] CORS_ALLOWED_ORIGINS
  - [ ] CSRF_TRUSTED_ORIGINS
- [ ] Migrations run: `railway run python manage.py migrate`
- [ ] Superuser created: `railway run python manage.py createsuperuser`
- [ ] Backend URL tested: `/admin` và `/api/jobs/`

### Frontend Deployment

- [ ] Frontend service created và linked to GitHub repo
- [ ] Root Directory = `frontend`
- [ ] `Dockerfile` configured với dynamic PORT
- [ ] `nginx.conf` listen on `$PORT`
- [ ] `railway.json` specifies Dockerfile builder
- [ ] Frontend `build/` folder exists và committed
- [ ] Environment variable added:
  - [ ] REACT_APP_API_URL (hoặc dùng auto-detect)
- [ ] Frontend URL tested: React app loads

### Domain Configuration (Optional)

- [ ] Railway domains generated cho cả backend và frontend
- [ ] Custom domains added trong Railway:
  - [ ] Backend: `api.recruitmentpro.live`
  - [ ] Frontend: `www.recruitmentpro.live`
- [ ] DNS CNAME records added tại name.com
- [ ] DNS propagated (test với `nslookup`)
- [ ] Backend variables updated với custom domain:
  - [ ] ALLOWED_HOSTS includes custom domain
  - [ ] CORS_ALLOWED_ORIGINS updated
  - [ ] CSRF_TRUSTED_ORIGINS updated
- [ ] Frontend `api.js` updated với custom backend URL
- [ ] Custom URLs tested: `https://www.recruitmentpro.live`

### Post-Deployment Testing

- [ ] Frontend loads successfully (no 502)
- [ ] Backend API responds: `GET /api/jobs/`
- [ ] Django admin accessible: `/admin`
- [ ] No CORS errors trong browser console
- [ ] No CSRF errors khi submit forms
- [ ] Static files load (CSS, JS, images)
- [ ] Database queries work (register, login)
- [ ] Redis connected (if using cache/sessions)

---

## 📊 Monitoring & Logs

### View Logs

**Real-time logs:**
```bash
railway logs --service backend
railway logs --service frontend
```

**Dashboard:**
- Railway service → **Deployments** → Latest → **View Logs**

### Metrics

- Railway service → **Metrics** tab
- Monitor: CPU, Memory, Network

### Alerts

- Railway service → **Settings** → **Notifications**
- Enable deployment failure notifications

---

## 💰 Cost Management

### Railway Free Tier

- **$5 credit/month** (January 2024)
- Enough for 2-3 small services
- No credit card required

### Estimated Monthly Cost

| Service | Resources | Estimated Cost |
|---------|-----------|----------------|
| Backend (Django) | 512MB RAM, 0.5 vCPU | ~$3-5 |
| Frontend (Nginx) | 256MB RAM, 0.25 vCPU | ~$1-2 |
| PostgreSQL | 256MB RAM | ~$1-2 |
| Redis | 128MB RAM | ~$0.5-1 |
| **Total** | | **~$5.5-10/month** |

### Cost Optimization

1. **Stop unused services** khi không development
2. **Use sleep mode** cho development services
3. **Optimize Docker images** (smaller = cheaper)
4. **Use Railway's free PostgreSQL** instead of external

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

Railway tự động deploy khi push lên `main` branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Railway sẽ:
1. Detect changes
2. Build backend (Nixpacks) và frontend (Docker)
3. Run migrations (qua Procfile)
4. Deploy new version
5. Health check
6. Switch traffic sang new deployment

### Manual Deploy

```bash
# Via CLI
railway up

# Or via Dashboard
Service → Deployments → Redeploy
```

---

## 🎯 Best Practices

### 1. Environment Variables

- ✅ **DO:** Dùng Reference Variables cho DATABASE_URL, REDIS_URL
- ✅ **DO:** Generate strong SECRET_KEY (50+ chars)
- ✅ **DO:** Set DEBUG=False trong production
- ❌ **DON'T:** Commit sensitive values vào git
- ❌ **DON'T:** Hardcode URLs nếu không cần thiết

### 2. Database

- ✅ **DO:** Run migrations trong Procfile
- ✅ **DO:** Backup database thường xuyên
- ✅ **DO:** Use connection pooling (`conn_max_age=600`)
- ❌ **DON'T:** Run migrations manually mỗi lần deploy
- ❌ **DON'T:** Use SQLite trong production

### 3. Static Files

- ✅ **DO:** Use WhiteNoise cho Django static files
- ✅ **DO:** Run collectstatic trong Procfile
- ✅ **DO:** Enable gzip compression trong Nginx
- ✅ **DO:** Set cache headers cho static assets
- ❌ **DON'T:** Serve static files từ Django views

### 4. Frontend

- ✅ **DO:** Build React locally (Railway Free tier giới hạn memory)
- ✅ **DO:** Commit `build/` folder với `-f`
- ✅ **DO:** Use nginx cho production
- ✅ **DO:** Configure SPA routing (`try_files ... /index.html`)
- ❌ **DON'T:** Build trong Docker nếu dùng Free tier
- ❌ **DON'T:** Use development server trong production

### 5. Security

- ✅ **DO:** Use HTTPS (Railway default)
- ✅ **DO:** Set security headers trong nginx
- ✅ **DO:** Configure CORS chính xác
- ✅ **DO:** Use CSRF protection
- ❌ **DON'T:** Allow `*` trong CORS_ALLOWED_ORIGINS
- ❌ **DON'T:** Disable CSRF protection

### 6. Monitoring

- ✅ **DO:** Check logs thường xuyên
- ✅ **DO:** Monitor resource usage
- ✅ **DO:** Set up error notifications
- ✅ **DO:** Test deployment sau mỗi lần push
- ❌ **DON'T:** Ignore deployment failures

---

## 📚 Resources & References

### Official Documentation

- **Railway Docs:** https://docs.railway.app
- **Nixpacks:** https://nixpacks.com/docs
- **Django Deployment:** https://docs.djangoproject.com/en/5.0/howto/deployment/
- **WhiteNoise:** https://whitenoise.readthedocs.io

### Useful Links

- **Railway Status:** https://status.railway.app
- **Railway Community:** https://discord.gg/railway
- **Django CORS Headers:** https://github.com/adamchainz/django-cors-headers
- **dj-database-url:** https://github.com/jazzband/dj-database-url

### Project-Specific

- **GitHub Repo:** https://github.com/YenNhi0511/DoAnPTPMHDT
- **Frontend URL:** https://www.recruitmentpro.live
- **Backend URL:** https://api.recruitmentpro.live
- **Backend Admin:** https://api.recruitmentpro.live/admin

---

## 🎓 Common Railway Commands (CLI)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# List services
railway service

# View logs
railway logs

# Run command in Railway environment
railway run <command>

# Deploy
railway up

# Open service in browser
railway open

# View environment variables
railway variables

# Add environment variable
railway variables set KEY=value
```

---

## ✨ Summary

### What We Deployed:

1. **Django Backend:** Gunicorn + WhiteNoise + PostgreSQL + Redis
2. **React Frontend:** Nginx + Pre-built SPA
3. **Databases:** PostgreSQL (managed) + Redis (managed)
4. **Custom Domains:** www.recruitmentpro.live + api.recruitmentpro.live

### Key Configurations:

- **Backend:** Nixpacks auto-build, Procfile processes, dynamic PORT
- **Frontend:** Docker build, Nginx with envsubst, pre-built React
- **CORS:** Properly configured frontend ↔ backend communication
- **Static Files:** WhiteNoise + collectstatic automation
- **Migrations:** Auto-run on every deployment

### Critical Fixes Applied:

1. ✅ `python-magic-bin` → `python-magic` (Linux compatibility)
2. ✅ Nginx `listen $PORT` (Railway dynamic PORT)
3. ✅ Frontend build committed to git (Free tier memory limit)
4. ✅ CORS/CSRF origins configured chính xác
5. ✅ Root Directory = `frontend` và `backend`
6. ✅ Reference Variables cho DATABASE_URL và REDIS_URL

---

**🎉 Deployment hoàn tất! Application đã live trên Railway.app**

**📧 Contact:** vvkgh@example.com  
**📅 Last Updated:** December 8, 2025  
**📝 Version:** 1.0
