# 🚀 Railway Deployment - Troubleshooting Guide

## ❌ Vấn Đề Thường Gặp

### 1. Script Dừng Sau Khi Login

**Nguyên nhân**: Railway CLI mở browser để authenticate và đợi callback.

**Giải pháp**:
```powershell
# Option 1: Login trước khi chạy script
railway login

# Đợi browser xác thực xong, sau đó chạy:
.\deploy-railway.bat

# Option 2: Dùng script đơn giản hơn
.\quick-deploy-backend.bat
```

### 2. Railway Init/Link Bị Treo

**Nguyên nhân**: Lệnh đang đợi input từ user.

**Giải pháp**:
```powershell
# Tạo project trước bằng Dashboard
# 1. Vào https://railway.app/dashboard
# 2. Click "New Project"
# 3. Đặt tên: recruitment-system

# Sau đó link từ CLI:
railway link
# Chọn project vừa tạo
```

### 3. "Not Logged In" Error

**Giải pháp**:
```powershell
# Xóa session cũ
Remove-Item -Recurse -Force "$env:USERPROFILE\.railway"

# Login lại
railway login
```

### 4. Deploy Thất Bại

**Check logs**:
```powershell
railway logs
railway status
```

**Nguyên nhân thường gặp**:
- ❌ Thiếu `requirements.txt`
- ❌ Sai Python version
- ❌ Thiếu environment variables

**Giải pháp**:
```powershell
# Check Python version
python --version

# Verify requirements.txt exists
dir backend\requirements.txt

# Set required variables
.\setup-railway-vars.bat
```

### 5. Database Connection Failed

**Nguyên nhân**: Chưa add PostgreSQL plugin.

**Giải pháp**:
```powershell
# Add PostgreSQL
railway add

# Hoặc trong Dashboard:
# New -> Database -> PostgreSQL
```

### 6. Frontend Build Failed

**Check Dockerfile**:
```powershell
# Test local build
cd frontend
docker build -t test-frontend .
```

**Nguyên nhân thường gặp**:
- ❌ Thiếu `package.json`
- ❌ Node version không tương thích
- ❌ Build command sai

**Giải pháp**:
```json
// frontend/package.json - verify "build" script exists
{
  "scripts": {
    "build": "react-scripts build"
  }
}
```

## 🔧 Cách Deploy Từng Bước (Manual)

### Bước 1: Login
```powershell
railway login
# Đợi browser xác thực
# Đóng terminal sau khi thấy "Logged in"
```

### Bước 2: Tạo Project (Trên Dashboard)
1. Vào https://railway.app/dashboard
2. Click **"New Project"**
3. Chọn **"Empty Project"**
4. Đặt tên: `recruitment-system`

### Bước 3: Add Database (Trên Dashboard)
1. Click **"New"** → **"Database"** → **"PostgreSQL"**
2. Click **"New"** → **"Database"** → **"Redis"**
3. Đợi databases provision xong

### Bước 4: Deploy Backend (Từ GitHub)
1. Click **"New"** → **"GitHub Repo"**
2. Chọn repo của bạn
3. Railway tự động detect và build
4. Set root directory nếu cần

### Bước 5: Set Backend Variables
```powershell
# Link to project
railway link

# Set variables
railway variables set SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(50))")
railway variables set DEBUG=False
railway variables set ALLOWED_HOSTS=*.railway.app
```

### Bước 6: Deploy Frontend (Trên Dashboard)
1. Click **"New"** → **"GitHub Repo"**
2. Chọn repo của bạn
3. Set **Root Directory**: `frontend`
4. Railway auto-detect Dockerfile

### Bước 7: Set Frontend Variables
```powershell
# Get backend URL từ Dashboard
# Ví dụ: https://backend-production-abc123.up.railway.app

# Set trong Frontend service
railway variables set REACT_APP_API_URL=https://your-backend-url/api
```

### Bước 8: Run Migrations
```powershell
railway run python backend/manage.py migrate
railway run python backend/manage.py createsuperuser
```

## 📝 Checklist Deploy Thành Công

```
✅ Railway CLI installed
✅ Logged in to Railway
✅ Project created
✅ PostgreSQL added
✅ Redis added
✅ Backend deployed
✅ Backend variables set
✅ Frontend deployed
✅ Frontend variables set
✅ Database migrated
✅ Superuser created
✅ All services showing "Active"
```

## 🛠️ Useful Commands

```powershell
# Check login status
railway whoami

# List projects
railway list

# Link to project
railway link

# Check current project
railway status

# View logs
railway logs

# View logs của service cụ thể
railway logs --service backend

# List services
railway service

# Run command trong Railway environment
railway run python --version

# Open project in browser
railway open

# Variables management
railway variables           # List all
railway variables set KEY=VALUE
railway variables delete KEY

# Add database
railway add

# Unlink project
railway unlink
```

## 🔍 Debug Tips

### Check Railway Project Info
```powershell
railway status
```

### Check Environment Variables
```powershell
railway variables
```

### Test Database Connection
```powershell
railway run python backend/check_database_connection.py
```

### View Real-time Logs
```powershell
railway logs --follow
```

### Check Service Health
```powershell
# Open Railway Dashboard
railway open

# Or check in browser:
https://railway.app/dashboard
```

## 💡 Pro Tips

1. **Deploy từng service một**: Dễ debug hơn
2. **Dùng Railway Dashboard**: UI trực quan hơn CLI
3. **Check logs thường xuyên**: Phát hiện lỗi sớm
4. **Backup environment variables**: Save vào file riêng
5. **Test local trước**: Docker build local trước khi deploy

## 📞 Cần Trợ Giúp?

- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
- Railway Status: https://status.railway.app

## 🎯 Alternative: Deploy Hoàn Toàn Bằng Dashboard

Nếu CLI gặp vấn đề, deploy 100% trên web:

1. **Tạo Project**: Dashboard → New Project
2. **Add Databases**: New → Database → PostgreSQL/Redis
3. **Deploy Backend**: New → GitHub Repo (root directory: /)
4. **Deploy Frontend**: New → GitHub Repo (root directory: frontend)
5. **Set Variables**: Settings → Variables (mỗi service)
6. **Run Migrations**: Service → Terminal tab

✅ **Không cần CLI nào cả!**

---

**Last Updated**: December 8, 2025
