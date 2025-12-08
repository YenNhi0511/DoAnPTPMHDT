# 🔧 Railway Database Troubleshooting Guide

## Khắc phục lỗi "Không hiển thị dữ liệu sau khi deploy"

---

## 🔍 Bước 1: Chẩn đoán vấn đề

### Kiểm tra Backend Logs

```bash
# Via Railway CLI
railway logs --service backend

# Hoặc vào Railway Dashboard
# Service → Deployments → Latest → View Logs
```

**Tìm các lỗi sau:**

- `OperationalError: could not connect to database`
- `relation "table_name" does not exist`
- `no such table: jobs_job`
- `FATAL: password authentication failed`

---

## ⚠️ Nguyên nhân phổ biến

### 1. Migrations chưa chạy trên Production Database

**Triệu chứng:**

- Backend API trả về 500 error
- Logs: `relation "jobs_job" does not exist`
- Database trống rỗng (không có tables)

**Kiểm tra:**

```bash
# Connect vào Railway backend service
railway run python manage.py showmigrations

# Nếu thấy [ ] (chưa apply) thay vì [X] (đã apply)
# → Migrations chưa chạy
```

**Giải pháp:**

#### Option 1: Run migrations thủ công (KHUYẾN NGHỊ)

```bash
# Step 1: Link to Railway project
railway link

# Step 2: Select backend service
railway service

# Step 3: Run migrations
railway run python manage.py migrate

# Step 4: Verify migrations applied
railway run python manage.py showmigrations
```

#### Option 2: Thêm migrations vào Procfile (Tự động)

```procfile
# backend/Procfile
web: python manage.py migrate --noinput && python manage.py collectstatic --noinput && gunicorn recruitment_system.wsgi --bind 0.0.0.0:$PORT --workers 2 --timeout 120
```

**⚠️ Lưu ý:** Procfile migrations chỉ chạy khi có deploy mới. Nếu đã deploy rồi, phải trigger redeploy:

```bash
# Trigger redeploy
railway up

# Hoặc push empty commit
git commit --allow-empty -m "Trigger redeploy for migrations"
git push origin main
```

---

### 2. DATABASE_URL không được config đúng

**Triệu chứng:**

- Backend không connect được database
- Logs: `django.db.utils.OperationalError`
- Backend vẫn dùng SQLite local

**Kiểm tra:**

```bash
# Check environment variables
railway variables

# Phải thấy:
# DATABASE_URL=${{Postgres.DATABASE_URL}}
```

**Giải pháp:**

#### Step 1: Verify PostgreSQL service exists

1. Railway Dashboard → Your Project
2. Phải thấy service: **"Postgres"** hoặc **"PostgreSQL"**
3. Nếu không có → Tạo mới: **New → Database → PostgreSQL**

#### Step 2: Add Reference Variable

1. Backend Service → **Settings** → **Variables**
2. Click **"New Variable"** → **"Add a Reference"**
3. Select:
   - **Service:** PostgreSQL
   - **Variable:** DATABASE_URL
4. Click **"Add"**

#### Step 3: Verify in backend logs

```bash
railway logs --service backend | grep DATABASE

# Should see:
# DATABASE_URL=postgresql://postgres:xxx@containers-us-west-xxx.railway.app:7432/railway
```

#### Step 4: Test connection

```bash
# Run Django check
railway run python manage.py check --database default

# Should return:
# System check identified no issues (0 silenced).
```

---

### 3. Backend đang dùng SQLite thay vì PostgreSQL

**Triệu chứng:**

- Data local có, nhưng production không có
- Deploy thành công nhưng database trống
- Không thấy PostgreSQL connection logs

**Kiểm tra settings.py:**

```python
# backend/recruitment_system/settings.py

# ❌ WRONG - Static config, sẽ dùng SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ✅ CORRECT - Dynamic config, dùng DATABASE_URL
import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}
```

**Giải pháp:**

1. **Update settings.py:**

```python
# backend/recruitment_system/settings.py
import os
import dj_database_url

# Database configuration
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL', 'sqlite:///db.sqlite3'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Debug: Log database engine being used
print(f"Database Engine: {DATABASES['default']['ENGINE']}")
```

2. **Ensure dj-database-url installed:**

```txt
# backend/requirements.txt
dj-database-url>=2.1.0
psycopg2-binary>=2.9.9  # PostgreSQL driver
```

3. **Commit and deploy:**

```bash
git add backend/recruitment_system/settings.py backend/requirements.txt
git commit -m "Fix database configuration for Railway"
git push origin main
```

---

### 4. Database bị reset/xóa do rebuild

**Triệu chứng:**

- Trước đó có data, sau redeploy mất hết
- Database service bị recreate
- Volume bị xóa

**Kiểm tra:**

```bash
# Check database service logs
railway logs --service postgres

# Check deployment history
# Railway Dashboard → PostgreSQL service → Deployments
```

**⚠️ Nguyên nhân:**

- Delete và tạo lại PostgreSQL service
- Railway Free tier volume bị xóa do inactivity
- Lỗi trong migration làm Railway recreate database

**Giải pháp:**

#### Option 1: Restore từ backup (nếu có)

```bash
# Railway tự động backup mỗi ngày
# Dashboard → PostgreSQL → Backups → Restore
```

#### Option 2: Tạo lại data

```bash
# 1. Create superuser
railway run python manage.py createsuperuser --email admin@railway.com --username admin

# 2. Load fixtures (nếu có)
railway run python manage.py loaddata initial_data.json

# 3. Run custom management command (nếu có)
railway run python manage.py seed_database
```

---

### 5. CORS/API không connect được → Frontend không load data

**Triệu chứng:**

- Backend có data (kiểm tra `/admin`)
- Frontend không hiển thị gì
- Browser console: CORS error hoặc Network error

**Kiểm tra Browser Console:**

```
Access to XMLHttpRequest at 'https://api.recruitmentpro.live/api/jobs/'
from origin 'https://www.recruitmentpro.live' has been blocked by CORS policy
```

**Giải pháp:**

#### Fix CORS Configuration

1. **Backend Environment Variables:**

```bash
# Railway Dashboard → Backend Service → Variables

CORS_ALLOWED_ORIGINS=https://www.recruitmentpro.live,https://doanptpmhdt-frontend-production.up.railway.app
CSRF_TRUSTED_ORIGINS=https://api.recruitmentpro.live,https://doanptpmhdtbackend-production.up.railway.app
ALLOWED_HOSTS=.railway.app,.up.railway.app,api.recruitmentpro.live
```

**⚠️ Quan trọng:**

- Không có khoảng trắng giữa các domain
- Không có trailing slash `/`
- Protocol `https://` phải có

2. **Backend settings.py:**

```python
# backend/recruitment_system/settings.py

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
    if origin.strip()
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# CSRF Configuration
CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get('CSRF_TRUSTED_ORIGINS', '').split(',')
    if origin.strip()
]

# Allowed Hosts
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost').split(',')
```

3. **Test API directly:**

```bash
# Test backend API
curl https://api.recruitmentpro.live/api/jobs/

# Should return JSON data, not CORS error
```

---

### 6. Frontend API URL không đúng

**Triệu chứng:**

- Backend có data
- Frontend gọi sai URL (localhost hoặc wrong domain)
- Network tab: 404 Not Found

**Kiểm tra:**

```javascript
// frontend/src/services/api.js
console.log("API_URL:", API_URL);
// Should log: https://api.recruitmentpro.live/api
```

**Giải pháp:**

#### Option 1: Hardcode Production URL (Đơn giản nhất)

```javascript
// frontend/src/services/api.js
const API_URL = "https://api.recruitmentpro.live/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for CORS with credentials
});

export default api;
```

#### Option 2: Environment-based (Linh hoạt)

```javascript
// frontend/src/services/api.js
const getApiUrl = () => {
  // Production with custom domain
  if (window.location.hostname === "www.recruitmentpro.live") {
    return "https://api.recruitmentpro.live/api";
  }

  // Railway deployment
  if (window.location.hostname.includes("railway.app")) {
    return "https://doanptpmhdtbackend-production.up.railway.app/api";
  }

  // Local development
  return "http://localhost:8000/api";
};

const API_URL = getApiUrl();
console.log("Using API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
```

**Rebuild Frontend:**

```bash
cd frontend

# Clean old build
rm -rf build

# Build with correct API URL
npm run build

# Commit new build
git add -f build/
git commit -m "Update frontend build with correct API URL"
git push origin main
```

---

## 🔄 Quy trình khắc phục toàn diện

### Step 1: Verify PostgreSQL Service

```bash
# Check PostgreSQL service status
railway status

# Should show:
# ✓ postgres - Active
```

Nếu không có PostgreSQL service:

1. Railway Dashboard → New → Database → PostgreSQL
2. Wait for provision (~30s)

### Step 2: Link DATABASE_URL to Backend

```bash
# Via Dashboard:
# 1. Backend Service → Settings → Variables
# 2. New Variable → Add a Reference
# 3. Select: PostgreSQL.DATABASE_URL
# 4. Save

# Verify:
railway variables | grep DATABASE_URL
```

### Step 3: Run Migrations

```bash
# Link to project
railway link

# Select backend service
railway service

# Run migrations
railway run python manage.py migrate

# Check tables created
railway run python manage.py dbshell
# Then: \dt (list tables)
# \q (quit)
```

### Step 4: Create Superuser & Load Data

```bash
# Create admin user
railway run python manage.py createsuperuser \
  --email admin@railway.com \
  --username admin

# (Optional) Load fixtures
railway run python manage.py loaddata fixtures/initial_data.json
```

### Step 5: Fix CORS Configuration

```bash
# Update backend environment variables
railway variables set CORS_ALLOWED_ORIGINS=https://www.recruitmentpro.live
railway variables set CSRF_TRUSTED_ORIGINS=https://api.recruitmentpro.live
railway variables set ALLOWED_HOSTS=.railway.app,api.recruitmentpro.live
```

### Step 6: Update Frontend API URL

```bash
cd frontend

# Edit src/services/api.js
# Change API_URL to: https://api.recruitmentpro.live/api

# Rebuild
npm run build

# Commit and deploy
git add -f build/
git commit -m "Fix API URL in production"
git push origin main
```

### Step 7: Test End-to-End

```bash
# 1. Test Backend API
curl https://api.recruitmentpro.live/api/jobs/

# Should return JSON array

# 2. Test Django Admin
# Open: https://api.recruitmentpro.live/admin
# Login with superuser

# 3. Test Frontend
# Open: https://www.recruitmentpro.live
# Check browser console for errors

# 4. Test Full Flow
# Register → Login → Browse Jobs → Apply
```

---

## 📊 Debug Commands

### Check Database Connection

```bash
# Test PostgreSQL connection
railway run python manage.py check --database default

# Show database name
railway run python manage.py dbshell
# Inside psql: SELECT current_database();

# List all tables
railway run python manage.py dbshell
# Inside psql: \dt

# Count records in a table
railway run python manage.py dbshell
# Inside psql: SELECT COUNT(*) FROM jobs_job;
```

### Check Migrations Status

```bash
# Show all migrations
railway run python manage.py showmigrations

# Should show [X] for all applied migrations:
# jobs
#  [X] 0001_initial
#  [X] 0002_auto_20250101_1234
# ...
```

### Check Environment Variables

```bash
# List all variables
railway variables

# Check specific variable
railway variables | grep DATABASE_URL
railway variables | grep CORS
```

### Check Backend Logs (Live)

```bash
# Follow logs in real-time
railway logs --service backend --follow

# Filter logs
railway logs --service backend | grep ERROR
railway logs --service backend | grep Database
```

---

## 🚨 Common Error Messages & Fixes

### Error: `relation "jobs_job" does not exist`

**Meaning:** Migrations chưa chạy

**Fix:**

```bash
railway run python manage.py migrate
```

---

### Error: `could not connect to server: Connection refused`

**Meaning:** DATABASE_URL không đúng hoặc PostgreSQL service down

**Fix:**

1. Check PostgreSQL service status: `railway status`
2. Verify DATABASE_URL reference: Backend → Variables
3. Restart PostgreSQL: PostgreSQL service → Settings → Restart

---

### Error: `FATAL: password authentication failed`

**Meaning:** Database credentials không đúng

**Fix:**

```bash
# Delete old DATABASE_URL variable
railway variables delete DATABASE_URL

# Re-add reference variable
# Dashboard → Backend → Variables → New Variable → Add a Reference → Postgres.DATABASE_URL
```

---

### Error: `Access to XMLHttpRequest blocked by CORS policy`

**Meaning:** CORS configuration không đúng

**Fix:**

```bash
# Update CORS origins (no spaces, no trailing slash)
railway variables set CORS_ALLOWED_ORIGINS=https://www.recruitmentpro.live

# Redeploy backend
railway up --service backend
```

---

### Error: `NetworkError when attempting to fetch resource`

**Meaning:** Frontend gọi sai API URL hoặc backend down

**Fix:**

1. Check backend status: `railway status`
2. Test API directly: `curl https://api.recruitmentpro.live/api/jobs/`
3. Update frontend API URL in `api.js`
4. Rebuild frontend: `npm run build && git push`

---

## 🎯 Prevention Best Practices

### 1. Always run migrations in Procfile

```procfile
# backend/Procfile
web: python manage.py migrate --noinput && gunicorn recruitment_system.wsgi --bind 0.0.0.0:$PORT
```

### 2. Use Reference Variables for DATABASE_URL

❌ Don't: Copy-paste DATABASE_URL string
✅ Do: Use Reference Variable `${{Postgres.DATABASE_URL}}`

### 3. Backup Database Regularly

```bash
# Create manual backup
railway backup create --service postgres

# Download backup
railway backup download <backup-id> --service postgres --output backup.sql
```

### 4. Test locally with PostgreSQL

```bash
# Use docker-compose for local PostgreSQL
# docker-compose.yml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: recruitment
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
```

### 5. Monitor database size

```bash
# Check database size
railway run python manage.py dbshell
# Inside psql:
# SELECT pg_size_pretty(pg_database_size('railway'));
```

---

## 📞 Still Having Issues?

### Check Railway Status

https://status.railway.app

### Railway Discord Community

https://discord.gg/railway

### Debug Checklist

- [ ] PostgreSQL service is running
- [ ] DATABASE_URL is referenced correctly
- [ ] Migrations have been applied
- [ ] Superuser exists
- [ ] CORS is configured correctly
- [ ] Frontend API URL points to backend
- [ ] Backend logs show no errors
- [ ] Can access Django admin at `/admin`

### Contact for Support

- **Railway Support:** help@railway.app
- **Project Owner:** vvkgh@example.com

---

**💡 Tip:** Nếu vẫn không khắc phục được, hãy:

1. Export data từ local: `python manage.py dumpdata > backup.json`
2. Xóa và tạo lại PostgreSQL service
3. Re-run migrations
4. Load data: `railway run python manage.py loaddata backup.json`

---

**Last Updated:** December 8, 2025
**Version:** 1.0
