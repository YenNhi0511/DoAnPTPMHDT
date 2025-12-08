# 🚀 Hướng Dẫn Deploy Hoàn Toàn Lên Railway.com

## 📋 Tổng Quan
Project này là hệ thống tuyển dụng sẽ được deploy **HOÀN TOÀN** trên Railway với:
- **Backend**: Django REST Framework + PostgreSQL + Redis + Celery
- **Frontend**: React (Static build served by Nginx)
- **AI**: Google Gemini API cho sàng lọc CV
- **Database**: PostgreSQL on Railway
- **Cache**: Redis on Railway

## 🎯 Bước 1: Chuẩn Bị Tài Khoản

### 1.1. Đăng Ký Railway
1. Truy cập: https://railway.app
2. Đăng ký bằng GitHub account
3. Verify email của bạn

### 1.2. Cài Đặt Railway CLI (Optional)
```bash
# Windows (PowerShell)
iwr https://railway.app/install.ps1 | iex

# Hoặc dùng npm
npm i -g @railway/cli

# Login
railway login
```

## 🗄️ Bước 2: Tạo Database và Services

### 2.1. Tạo PostgreSQL Database
1. Vào Railway Dashboard
2. Click **"New Project"**
3. Click **"Add Service"** → **"Database"** → **"PostgreSQL"**
4. Railway sẽ tự động tạo database và cung cấp connection string

### 2.2. Tạo Redis
1. Trong cùng project, click **"Add Service"** → **"Database"** → **"Redis"**
2. Railway sẽ tự động provision Redis instance

### 2.3. Lưu Connection Strings
Railway sẽ tự động tạo các biến môi trường:
- `DATABASE_URL` (từ PostgreSQL)
- `REDIS_URL` (từ Redis)

## 📦 Bước 3: Deploy Backend (Django)

### 3.1. Tạo Service Cho Backend

#### Option A: Deploy từ GitHub (Recommended)
1. Push code lên GitHub repository của bạn
2. Trong Railway project, click **"New Service"** → **"GitHub Repo"**
3. Chọn repository của bạn
4. Railway sẽ tự động detect Django và build

#### Option B: Deploy từ CLI
```bash
cd d:\DoAnPTPMHDT
railway init
railway up
```

### 3.2. Configure Environment Variables
Vào **Settings** → **Variables** của backend service và thêm:

```env
# Django Settings
SECRET_KEY=your-super-secret-key-change-this-in-production-123456789abcdef
DEBUG=False
ALLOWED_HOSTS=*.railway.app,*.up.railway.app

# Database (Railway tự động set DATABASE_URL)
# DATABASE_URL sẽ được Railway inject tự động

# Redis (Railway tự động set REDIS_URL)
# REDIS_URL sẽ được Railway inject tự động

# Celery
CELERY_BROKER_URL=${{Redis.REDIS_URL}}
CELERY_RESULT_BACKEND=${{Redis.REDIS_URL}}

# Email Configuration (dùng Gmail hoặc SendGrid)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Frontend URL (sẽ update sau khi deploy frontend)
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

### 3.3. Configure Build Settings
Railway sẽ tự động detect nhờ các file:
- ✅ `Procfile` - Đã tạo
- ✅ `railway.json` - Đã tạo  
- ✅ `nixpacks.toml` - Đã tạo
- ✅ `requirements.txt` - Đã update với gunicorn, whitenoise

### 3.4. Deploy Backend
1. Railway sẽ tự động build và deploy
2. Sau khi deploy xong, bạn sẽ có URL dạng: `https://your-app.up.railway.app`
3. Vào **Settings** → **Generate Domain** để có public URL

## 🎨 Bước 4: Deploy Frontend (React) Trên Railway

### 4.1. Tạo Frontend Service

#### Option A: Deploy từ GitHub (Recommended)
1. Trong Railway project, click **"New Service"** → **"GitHub Repo"**
2. Chọn repository của bạn
3. Railway sẽ tự động detect Dockerfile trong `frontend/`

#### Option B: Deploy từ Local với Railway CLI
```bash
cd frontend
railway init
railway up
```

### 4.2. Configure Frontend Service Settings

Vào **Settings** của frontend service:

**Root Directory**: `/frontend` (nếu deploy từ root repo)

**Environment Variables**:
```env
REACT_APP_API_URL=https://your-backend.up.railway.app/api
```

> 💡 **Lưu ý**: Thay `your-backend.up.railway.app` bằng domain thực của backend service

### 4.3. Deploy Frontend
Railway sẽ tự động:
1. Detect `Dockerfile` trong folder frontend
2. Build React app (npm run build)
3. Setup Nginx server
4. Deploy và tạo public URL

### 4.4. Get Frontend URL
1. Vào frontend service
2. Click **Settings** → **Networking**
3. Click **"Generate Domain"** để có public URL
4. URL sẽ có dạng: `https://your-frontend.up.railway.app`

## ⚙️ Bước 5: Deploy Celery Worker (Background Tasks)

### 5.1. Tạo Worker Service
1. Trong Railway project, click **"New Service"** → **"GitHub Repo"**
2. Chọn cùng repository
3. Đặt tên service: `celery-worker`

### 5.2. Configure Worker
Vào **Settings** của celery-worker service:

**Start Command**:
```bash
cd backend && celery -A recruitment_system worker --loglevel=info --pool=solo
```

**Environment Variables**: Copy tất cả variables từ backend service

### 5.3. Deploy Celery Beat (Optional - cho scheduled tasks)
Tương tự tạo service `celery-beat` với start command:
```bash
cd backend && celery -A recruitment_system beat --loglevel=info
```

## 🔧 Bước 6: Final Configuration

### 6.1. Update Backend CORS
Update biến `CORS_ALLOWED_ORIGINS` trong backend service:
```env
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-frontend.railway.app
```

### 6.2. Update Frontend API URL
Update biến `REACT_APP_API_URL` trong frontend:
```env
## 🔧 Bước 6: Final Configuration

### 6.1. Update Backend CORS
Update biến `CORS_ALLOWED_ORIGINS` trong backend service:
```env
CORS_ALLOWED_ORIGINS=https://your-frontend.up.railway.app
```

### 6.2. Verify Frontend API URL
Kiểm tra biến `REACT_APP_API_URL` trong frontend service đã đúng:
```env
REACT_APP_API_URL=https://your-backend.up.railway.app/api
```

> ⚠️ **Quan trọng**: Mỗi khi thay đổi environment variables, Railway sẽ tự động redeploy servicebash
railway run python backend/manage.py migrate
railway run python backend/manage.py createsuperuser
```

### 6.4. Create Sample Data
```bash
railway run python backend/seed_data.py
```

## 🎉 Bước 7: Kiểm Tra Deployment

### 7.1. Test Backend API
```bash
curl https://your-backend.up.railway.app/api/accounts/users/
```

### 7.2. Test Frontend
Truy cập: `https://your-frontend.vercel.app`

### 7.3. Test Database Connection
Vào Railway backend terminal:
```bash
cd backend
python manage.py shell
>>> from django.db import connection
### 7.2. Test Frontend
Truy cập: `https://your-frontend.up.railway.app`
## 📊 Cấu Trúc Services Hoàn Toàn Trên Railway

```
┌──────────────────────────────────────────────────┐
│       Railway Project: Recruitment App          │
├──────────────────────────────────────────────────┤
│                                                  │
│  📦 PostgreSQL Database                          │
│     └─ DATABASE_URL (auto-inject)                │
│                                                  │
│  📦 Redis                                         │
│     └─ REDIS_URL (auto-inject)                   │
│                                                  │
│  🚀 Backend Service (Django)                     │
│     ├─ Port: 8000 (internal)                     │
│     ├─ Public: https://backend.up.railway.app    │
│     └─ Uses: PostgreSQL, Redis                   │
│                                                  │
│  🎨 Frontend Service (React + Nginx)             │
│     ├─ Port: 80 (internal)                       │
│     ├─ Public: https://frontend.up.railway.app   │
│     └─ Connects to: Backend API                  │
│                                                  │
│  👷 Celery Worker Service                        │
│     ├─ No public port                            │
│     └─ Uses: Redis, Backend code                 │
│                                                  │
│  ⏰ Celery Beat Service (Optional)               │
│     ├─ No public port                            │
│     └─ Uses: Redis, Backend code                 │
│                                                  │
└──────────────────────────────────────────────────┘

Total: 6 Services trong 1 Railway Project
```   └─ https://frontend.vercel.app  │
└─────────────────────────────────────┘
```

## 🔐 Bảo Mật Production

### Environment Variables Cần Đổi:
1. ✅ `SECRET_KEY` - Generate key mới
2. ✅ `DEBUG=False` - Tắt debug mode
3. ✅ `ALLOWED_HOSTS` - Chỉ cho phép domain chính thức
4. ✅ `CORS_ALLOWED_ORIGINS` - Chỉ frontend URL
5. ✅ Email credentials - Dùng app password, không dùng password thật
6. ✅ `GEMINI_API_KEY` - API key thật

### Generate Secret Key:
```python
import secrets
print(secrets.token_urlsafe(50))
```

## 📝 Monitoring và Logs

### Xem Logs trên Railway:
1. Click vào service
2. Tab **"Logs"** để xem real-time logs
3. Tab **"Metrics"** để xem CPU, Memory usage

### Debug Issues:
```bash
# Railway CLI
railway logs
railway shell
```

## 🆘 Troubleshooting

### Issue 1: Database Connection Failed
**Solution**: Kiểm tra `DATABASE_URL` có đúng format:
```
postgresql://user:password@host:port/database?sslmode=require
```

### Issue 2: Static Files Not Loading
**Solution**: Đảm bảo đã chạy:
```bash
python manage.py collectstatic --noinput
```

### Issue 3: CORS Error
**Solution**: Kiểm tra `CORS_ALLOWED_ORIGINS` có chứa frontend URL

### Issue 4: Celery Worker Not Processing
**Solution**: Kiểm tra Redis connection và worker logs:
```bash
railway logs --service celery-worker
```

## 💰 Chi Phí Ước Tính

Railway Pricing:
- **Hobby Plan**: $5 credit/month (FREE)
  - ✅ 500 hours execution time
  - ✅ Unlimited projects & services
  - ✅ Shared resources
  - ✅ Community support

- **Developer Plan**: $20/month
  - ✅ $20 usage included
  - ✅ Priority builds
  - ✅ Better resources
  - ✅ Email support

## 🚀 Continuous Deployment

Railway tự động deploy khi:
1. Push code lên GitHub
2. Auto detect changes trong các service folders
3. Rebuild và redeploy affected services
4. Zero downtime deployment (rolling updates)

**Configure Auto-Deploy**:
1. Vào từng service → **Settings** → **Triggers**
2. Enable **"Deploy on Push"**
## 📚 Resources

- Railway Docs: https://docs.railway.app
- Railway Pricing: https://railway.app/pricing
- Railway Templates: https://railway.app/templates
- Django Deployment: https://docs.djangoproject.com/en/5.0/howto/deployment/
- Celery on Railway: https://docs.railway.app/guides/celery
- Docker on Railway: https://docs.railway.app/deploy/dockerfiles**`
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS

**Tổng: FREE** cho development và small projects!

## 🚀 Continuous Deployment

Railway và Vercel tự động deploy khi:
1. Push code lên GitHub
2. Auto build và deploy
3. Zero downtime deployment

Configure GitHub webhook để auto-deploy:
- Railway: Tự động detect Git push
- Vercel: Tự động detect Git push

## 📚 Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Django Deployment: https://docs.djangoproject.com/en/5.0/howto/deployment/
- Celery on Railway: https://docs.railway.app/guides/celery

## 🎓 Lưu Ý Quan Trọng

1. ⚠️ **Không commit** file `.env` lên GitHub
2. ✅ Luôn dùng **environment variables** cho secrets
3. ✅ Set `DEBUG=False` trong production
4. ✅ Backup database thường xuyên
5. ✅ Monitor logs và metrics
6. ✅ Test trước khi deploy production

## 🎉 Done!

Sau khi hoàn thành các bước trên, bạn sẽ có **TẤT CẢ** trên Railway:
- ✅ Backend Django running on Railway
- ✅ Frontend React + Nginx running on Railway
- ✅ PostgreSQL database on Railway
- ✅ Redis for caching and Celery on Railway
- ✅ Celery workers for background jobs on Railway
- ✅ Auto-deployment from GitHub
- ✅ Free SSL/HTTPS cho tất cả services
- ✅ Automatic health checks và monitoring

**Production URLs (tất cả trên Railway)**:
- Backend API: `https://your-backend.up.railway.app`
- Frontend App: `https://your-frontend.up.railway.app`
- Admin Panel: `https://your-backend.up.railway.app/admin`

**Railway Dashboard**: https://railway.app/dashboard

Tất cả trong 1 platform, dễ quản lý và monitor! 🎊
