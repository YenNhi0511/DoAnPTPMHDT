# 🚀 Hướng Dẫn Deploy Thủ Công Lên Railway (100% Dashboard)

## 📋 Tổng Quan

Deploy hoàn toàn qua **Railway Dashboard** - Không cần CLI, không cần terminal commands!

```
Railway Project Structure
├─ PostgreSQL Database (Auto-provision)
├─ Redis Cache (Auto-provision)
├─ Backend Service (Django + Gunicorn)
├─ Frontend Service (React + Nginx)
└─ Celery Worker (Optional - Background tasks)
```

**Thời gian deploy**: ~20-30 phút  
**Chi phí**: FREE (Railway Hobby Plan $5 credit/month)  
**Kỹ năng cần**: Biết click chuột và copy-paste 😄

---

## 🎯 BƯỚC 1: CHUẨN BỊ

### 1.1. Tạo Tài Khoản Railway

1. **Truy cập**: https://railway.app
2. Click nút **"Login"** ở góc trên phải
3. Chọn **"Login with GitHub"**
4. **Authorize Railway** với GitHub account của bạn
5. Sau khi login, bạn sẽ thấy Railway Dashboard

### 1.2. Push Code Lên GitHub

**⚠️ QUAN TRỌNG**: Code phải có trên GitHub trước!

```powershell
# Mở PowerShell trong thư mục project D:\DoAnPTPMHDT
cd D:\DoAnPTPMHDT

# Kiểm tra git status
git status

# Add tất cả files (nếu có thay đổi)
git add .

# Commit với message
git commit -m "Prepare for Railway deployment"

# Push lên GitHub
git push origin main
```

**Kiểm tra**: Vào GitHub repo `YenNhi0511/DoAnPTPMHDT` và verify code mới nhất đã có.

### 1.3. Verify Files Cần Thiết

Kiểm tra các files này có trong project:

#### ✅ Root Directory:
```
D:\DoAnPTPMHDT\
├─ Procfile              ← Định nghĩa web, worker, beat processes
├─ railway.json          ← Backend build config
├─ nixpacks.toml         ← Build environment config (optional)
├─ runtime.txt           ← Python version (python-3.10.14)
```

#### ✅ Backend Directory:
```
D:\DoAnPTPMHDT\backend\
├─ requirements.txt      ← Python dependencies (có gunicorn, whitenoise)
├─ manage.py             ← Django management script
├─ .env.example          ← Template cho environment variables
└─ recruitment_system/
    └─ settings.py       ← Django settings (đã config production)
```

#### ✅ Frontend Directory:
```
D:\DoAnPTPMHDT\frontend\
├─ Dockerfile            ← Multi-stage build (Node + Nginx)
├─ nginx.conf            ← Nginx config cho React SPA
├─ railway.json          ← Frontend service config
├─ package.json          ← Dependencies và build script
```

**Nếu thiếu files**: Các files này đã được tạo trong các bước trước. Check lại workspace.

---

## 🗄️ BƯỚC 2: TẠO PROJECT VÀ DATABASES

### 2.1. Tạo Project Mới

1. Vào **Railway Dashboard**: https://railway.app/dashboard
2. Click nút **"New Project"** (màu tím, ở góc trên phải)
3. Chọn **"Empty Project"** (khung đầu tiên)
4. Project mới được tạo, click vào **project name** để đổi tên
5. Đặt tên: `recruitment-system` hoặc tên bạn muốn
6. Click **"Update"**

**Kết quả**: Bạn đang ở trong project view trống với background đen và dòng chữ "Add a service to get started"

### 2.2. Add PostgreSQL Database

1. Click nút **"+ New"** (ở góc trên bên phải)
2. Chọn **"Database"**
3. Chọn **"Add PostgreSQL"**
4. Railway sẽ bắt đầu provision database
5. Đợi ~30-60 giây cho đến khi thấy:
   - Icon PostgreSQL xuất hiện trong canvas
   - Status: **"Active"** (màu xanh)
   - Có chữ **"Postgres"** và version number

**⚠️ LƯU Ý**: 
- PostgreSQL sẽ tự động generate `DATABASE_URL`
- URL này sẽ được inject vào backend service sau
- **KHÔNG CẦN** copy hay lưu URL này ở đâu cả

### 2.3. Add Redis Cache

1. Click **"+ New"** tiếp
2. Chọn **"Database"**
3. Chọn **"Add Redis"**
4. Đợi ~30 giây cho đến khi:
   - Icon Redis xuất hiện
   - Status: **"Active"** (màu xanh)

**⚠️ LƯU Ý**:
- Redis tự động generate `REDIS_URL`
- URL sẽ được inject vào backend và worker
- Cũng **KHÔNG CẦN** copy

### 2.4. Kiểm Tra

Trong project canvas, bạn sẽ thấy:
```
┌─────────────┐
│  Postgres   │  ← Active (màu xanh)
└─────────────┘

┌─────────────┐
│    Redis    │  ← Active (màu xanh)
└─────────────┘
```

✅ **Hoàn thành Bước 2!** Databases đã sẵn sàng.

---

## 🐍 BƯỚC 3: DEPLOY BACKEND (Django)

### 3.1. Add Backend Service From GitHub

1. Click **"+ New"** trong project
2. Chọn **"GitHub Repo"**
3. Nếu chưa connect GitHub:
   - Click **"Connect to GitHub"**
   - Authorize Railway
   - Chọn repositories bạn muốn cho Railway access
4. Tìm repository: **`YenNhi0511/DoAnPTPMHDT`**
5. Click vào repository để chọn
6. Click **"Add"** hoặc **"Deploy"**

**Railway sẽ tự động**:
- Clone repository
- Detect Django project (nhờ `requirements.txt`)
- Dùng Nixpacks để build
- Read `Procfile` để biết cách start
- Bắt đầu build process

### 3.2. Đợi Build Hoàn Thành

1. Click vào **Backend service** (khung mới xuất hiện trong canvas)
2. Railway sẽ tự động mở tab **"Deployments"**
3. Bạn sẽ thấy:
   ```
   Building...
   ├─ Installing Python 3.10.14
   ├─ Installing dependencies from requirements.txt
   ├─ Collecting static files
   └─ Building...
   ```
4. **Đợi 5-10 phút** cho build hoàn thành
5. Khi thành công, status sẽ chuyển thành:
   - ✅ **"Success"** (màu xanh)
   - Hoặc **"Active"**

**⚠️ Nếu Build Failed**:
- Click vào deployment để xem logs chi tiết
- Thường là lỗi syntax trong `requirements.txt` hoặc `settings.py`
- Fix lỗi, push lên GitHub, Railway sẽ tự động rebuild

### 3.3. Đổi Tên Service (Optional nhưng nên làm)

1. Vẫn trong Backend service, click tab **"Settings"**
2. Tìm phần **"Service Name"** ở đầu trang
3. Click vào tên hiện tại (thường là `DoAnPTPMHDT`)
4. Đổi thành: **`backend`**
5. Enter để save

### 3.4. Generate Public Domain

Backend cần một public URL để frontend có thể gọi API.

1. Vẫn trong **"Settings"** tab
2. Scroll xuống tìm section **"Networking"**
3. Tìm **"Public Networking"**
4. Click nút **"Generate Domain"**
5. Railway sẽ tạo domain dạng:
   ```
   https://backend-production-xxxx.up.railway.app
   ```
6. **QUAN TRỌNG**: Copy URL này và lưu vào Notepad!
   - Gọi nó là: `BACKEND_URL`
   - Ví dụ: `https://backend-production-a1b2.up.railway.app`

### 3.5. Set Environment Variables

Đây là phần quan trọng nhất! Railway cần biết các config để chạy Django.

#### 3.5.1. Vào Variables Tab

1. Click vào Backend service (nếu đang ở nơi khác)
2. Click tab **"Variables"** (ở top bar)
3. Bạn sẽ thấy giao diện để add variables

#### 3.5.2. Thêm Required Variables

Click **"+ New Variable"** và thêm từng biến sau:

**Variable 1 - SECRET_KEY**
```
Variable Name:  SECRET_KEY
Value:          [Generate key mới - xem hướng dẫn bên dưới]
```

**Variable 2 - DEBUG**
```
Variable Name:  DEBUG
Value:          False
```

**Variable 3 - ALLOWED_HOSTS**
```
Variable Name:  ALLOWED_HOSTS
Value:          .railway.app,.up.railway.app
```

**⚠️ CHÚ Ý**: 
- Mỗi variable phải click **"Add"** để lưu
- Sau khi add xong TẤT CẢ, click **"Deploy"** hoặc đợi auto-redeploy

#### 3.5.3. Generate SECRET_KEY

**Cách 1 - Dùng Python Local**:
```powershell
# Mở PowerShell
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

**Cách 2 - Online**:
- Truy cập: https://djecrety.ir/
- Click "Generate" để tạo key mới
- Copy key

**Copy key và paste vào Railway Variable value!**

#### 3.5.4. Add Optional Variables (Có thể bỏ qua, thêm sau)

**Email Configuration** (Nếu muốn gửi email):
```
Variable Name:  EMAIL_BACKEND
Value:          django.core.mail.backends.smtp.EmailBackend

Variable Name:  EMAIL_HOST
Value:          smtp.gmail.com

Variable Name:  EMAIL_PORT
Value:          587

Variable Name:  EMAIL_USE_TLS
Value:          True

Variable Name:  EMAIL_HOST_USER
Value:          your_email@gmail.com

Variable Name:  EMAIL_HOST_PASSWORD
Value:          your_gmail_app_password
```

**⚠️ CHÚ Ý về Gmail**:
- Không dùng password Gmail thật
- Phải tạo "App Password" trong Google Account settings
- Hướng dẫn: https://support.google.com/accounts/answer/185833

**AI API** (Nếu dùng Gemini):
```
Variable Name:  GEMINI_API_KEY
Value:          your_gemini_api_key_here
```

**CORS** (Sẽ update sau khi có Frontend URL):
```
Variable Name:  CORS_ALLOWED_ORIGINS
Value:          [Để trống trước, update ở Bước 5]
```

### 3.6. Connect Database Services

Railway cần "link" backend với PostgreSQL và Redis.

#### 3.6.1. Link PostgreSQL

1. Vẫn trong Backend service, tab **"Settings"**
2. Scroll xuống tìm **"Service Variables"** hoặc **"Variable References"**
3. Click **"+ New Variable"** hoặc **"+ Reference"**
4. Chọn:
   - **Service**: `Postgres`
   - **Variable**: `DATABASE_URL`
5. Click **"Add"**

Railway sẽ tự động:
- Inject `DATABASE_URL` vào backend
- Django settings sẽ dùng `dj-database-url` để parse
- Backend có thể connect tới PostgreSQL

#### 3.6.2. Link Redis

1. Tiếp tục trong **"Variable References"**
2. Click **"+ New Variable"** hoặc **"+ Reference"**
3. Chọn:
   - **Service**: `Redis`
   - **Variable**: `REDIS_URL`
4. Click **"Add"**

#### 3.6.3. Verify Database Connections

1. Vào tab **"Variables"**
2. Kiểm tra có 2 variables màu xanh/tím (referenced):
   ```
   DATABASE_URL  →  Postgres.DATABASE_URL
   REDIS_URL     →  Redis.REDIS_URL
   ```

**Railway sẽ tự động redeploy** sau khi add variables!

### 3.7. Run Database Migrations

Sau khi backend deploy thành công với database connections, cần chạy migrations.

#### 3.7.1. Mở Railway Terminal

1. Click vào **Backend service**
2. Tìm tab **"..."** (More options) hoặc **"Settings"**
3. Scroll xuống tìm **"Terminal"** section
4. Hoặc: Ở bottom bar, tìm icon terminal và click

**Terminal sẽ mở** trong Railway (như một SSH session vào container)

#### 3.7.2. Chạy Migrations

Trong Railway Terminal, chạy:

```bash
python backend/manage.py migrate
```

**Expected Output**:
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, accounts, jobs, applications, notifications
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
  Applying jobs.0001_initial... OK
  Applying applications.0001_initial... OK
```

#### 3.7.3. Create Superuser

Tiếp tục trong terminal:

```bash
python backend/manage.py createsuperuser
```

Nhập thông tin:
```
Username: admin
Email: admin@example.com
Password: [nhập password mạnh]
Password (again): [nhập lại]
```

✅ Superuser created successfully!

#### 3.7.4. (Optional) Seed Sample Data

Nếu muốn có data mẫu để test:

```bash
python backend/manage.py loaddata seed_data
```

Hoặc chạy custom seed scripts:
```bash
cd backend
python seed_companies.py
python seed_jobs.py
```

### 3.8. Verify Backend Hoạt Động

1. Mở browser mới
2. Truy cập **BACKEND_URL** (đã copy ở Bước 3.4):
   ```
   https://backend-production-xxxx.up.railway.app
   ```

**Bạn sẽ thấy**:
- Trang Django mặc định, HOẶC
- JSON response từ API root, HOẶC
- 404 page (vẫn OK, nghĩa là Django đang chạy)

3. Test Django Admin:
   ```
   https://backend-production-xxxx.up.railway.app/admin/
   ```
   
**Bạn sẽ thấy**:
- Django Admin login page với styling
- Login bằng superuser đã tạo
- Vào được admin dashboard

4. Test API endpoint:
   ```
   https://backend-production-xxxx.up.railway.app/api/
   ```

**Expected**: JSON response hoặc API list

✅ **Backend deploy thành công!** Django đang chạy trên Railway.

---

## ⚛️ BƯỚC 4: DEPLOY FRONTEND (React + Nginx)

### 4.1. Add Frontend Service From GitHub

1. Quay lại project canvas (click tên project ở top)
2. Click **"+ New"**
3. Chọn **"GitHub Repo"**
4. Chọn repository: **`YenNhi0511/DoAnPTPMHDT`** (same repo)
5. Click **"Add"**

**⚠️ LƯU Ý**: Railway sẽ tạo service mới từ CÙNG repo với backend. Điều này OK!

### 4.2. Configure Root Directory

**QUAN TRỌNG NHẤT**: Railway cần biết build frontend từ thư mục nào!

1. Click vào **Frontend service** vừa tạo (thường tên `DoAnPTPMHDT`)
2. Click tab **"Settings"**
3. Scroll xuống tìm **"Source"** section
4. Tìm field **"Root Directory"**
5. Click vào field (nếu đang empty)
6. Nhập: **`frontend`**
7. **Nhấn Enter** hoặc click bên ngoài để save
8. Railway sẽ hiện "Redeploying..." - đợi một chút

**Tại sao cần**: 
- Backend deploy từ `/` (root)
- Frontend deploy từ `/frontend` (subfolder)
- Railway sẽ tìm `Dockerfile` trong `frontend/`

### 4.3. Đổi Tên Service (Nên làm)

1. Vẫn trong **"Settings"**
2. Scroll lên đầu trang
3. Tìm **"Service Name"**
4. Click vào tên hiện tại
5. Đổi thành: **`frontend`**
6. Enter để save

### 4.4. Đợi Build Hoàn Thành

Railway sẽ:
1. Detect `Dockerfile` trong `frontend/`
2. Run Docker multi-stage build:
   - Stage 1: Build React app với Node.js
   - Stage 2: Serve với Nginx
3. Build thường mất **5-8 phút**

**Monitor Build**:
1. Click tab **"Deployments"**
2. Xem logs:
   ```
   Building Docker image...
   Step 1/12 : FROM node:18-alpine AS build
   Step 2/12 : WORKDIR /app
   ...
   Step 8/12 : RUN npm run build
   Step 9/12 : FROM nginx:alpine
   ...
   Successfully built!
   ```

3. Đợi status: ✅ **"Success"** (màu xanh)

**⚠️ Nếu Build Failed**:
- Check logs xem lỗi gì
- Thường là:
  - `package.json` có lỗi
  - `npm install` failed
  - `npm run build` failed
  - Missing dependencies

### 4.5. Generate Public Domain

Frontend cũng cần public URL để users truy cập!

1. Vẫn trong **"Settings"** tab
2. Scroll xuống **"Networking"**
3. Tìm **"Public Networking"**
4. Click **"Generate Domain"**
5. Railway tạo domain:
   ```
   https://frontend-production-xxxx.up.railway.app
   ```
6. **QUAN TRỌNG**: Copy URL này và lưu vào Notepad!
   - Gọi nó là: `FRONTEND_URL`
   - Ví dụ: `https://frontend-production-c3d4.up.railway.app`

### 4.6. Set Environment Variables

Frontend (React) cần biết Backend API URL để gọi API.

#### 4.6.1. Vào Variables Tab

1. Click vào Frontend service
2. Click tab **"Variables"**

#### 4.6.2. Add REACT_APP_API_URL

Click **"+ New Variable"**:

```
Variable Name:  REACT_APP_API_URL
Value:          [BACKEND_URL từ Bước 3.4]/api
```

**Ví dụ**:
```
Variable Name:  REACT_APP_API_URL
Value:          https://backend-production-a1b2.up.railway.app/api
```

**⚠️ CHÚ Ý**:
- Phải có `/api` ở cuối!
- Dùng BACKEND_URL (không phải FRONTEND_URL)
- Không có trailing slash sau `/api`

Click **"Add"** để lưu.

**Railway sẽ tự động rebuild** frontend với biến mới!

### 4.7. Đợi Rebuild Hoàn Thành

1. Sau khi add variable, Railway tự động trigger rebuild
2. Vào tab **"Deployments"**
3. Thấy deployment mới đang chạy
4. Đợi ~5 phút cho build + deploy
5. Status: ✅ **"Success"**

### 4.8. Verify Frontend Hoạt Động

1. Mở browser mới
2. Truy cập **FRONTEND_URL**:
   ```
   https://frontend-production-xxxx.up.railway.app
   ```

**Bạn sẽ thấy**:
- ✅ Trang chủ recruitment system load được
- ✅ UI hiển thị đẹp (Tailwind CSS loaded)
- ✅ Header, Footer hiển thị
- ✅ Có thể navigate giữa các trang

3. Test Login Page:
   ```
   https://frontend-production-xxxx.up.railway.app/login
   ```

4. **Kiểm tra API Connection**:
   - Mở Chrome DevTools (F12)
   - Vào tab **"Console"**
   - Refresh trang
   - **KHÔNG có lỗi CORS** (quan trọng!)
   - Vào tab **"Network"**
   - Filter: `XHR` hoặc `Fetch`
   - Thấy các API calls tới backend (nếu có)

**⚠️ Nếu có CORS Error**:
- Đọi qua Bước 5 để update CORS_ALLOWED_ORIGINS

✅ **Frontend deploy thành công!** React app đang serve qua Nginx.

---

## 🔧 BƯỚC 5: UPDATE CROSS-SERVICE CONFIGURATION

Backend và Frontend đã deploy, nhưng cần "nói chuyện" với nhau qua CORS và URLs!

### 5.1. Update Backend CORS Settings

Frontend cần được phép gọi API của Backend (CORS = Cross-Origin Resource Sharing)

#### 5.1.1. Add CORS_ALLOWED_ORIGINS

1. Click vào **Backend service**
2. Vào tab **"Variables"**
3. Tìm variable **`CORS_ALLOWED_ORIGINS`** (nếu đã có từ Bước 3)
   - **Nếu có**: Click vào để edit
   - **Nếu chưa có**: Click **"+ New Variable"**

4. Set value:
   ```
   Variable Name:  CORS_ALLOWED_ORIGINS
   Value:          https://frontend-production-xxxx.up.railway.app
   ```
   
   **Thay `frontend-production-xxxx` bằng FRONTEND_URL thật!**

5. Click **"Update"** hoặc **"Add"**

#### 5.1.2. (Optional) Add FRONTEND_URL

Nếu backend cần redirect hoặc generate links:

```
Variable Name:  FRONTEND_URL
Value:          https://frontend-production-xxxx.up.railway.app
```

#### 5.1.3. Đợi Backend Redeploy

- Railway sẽ tự động redeploy backend
- Đợi ~2-3 phút
- Status: ✅ Active

### 5.2. Verify CORS Hoạt Động

1. Mở **FRONTEND_URL** trong browser
2. Open DevTools (F12) → Console tab
3. Navigate tới Login page hoặc bất kỳ trang nào call API
4. **KHÔNG thấy CORS errors** như:
   ```
   ❌ Access to XMLHttpRequest at 'https://backend...' from origin 'https://frontend...' has been blocked by CORS policy
   ```

5. Trong **Network tab**:
   - Thấy API calls thành công (status 200, 201, etc.)
   - Không có preflight OPTIONS failed

✅ **CORS configured correctly!**

### 5.3. Verify All Services trong Project Dashboard

1. Click vào project name (top) để về canvas view
2. Kiểm tra tất cả services:

```
┌──────────────────────────┐
│       Postgres           │  ← Active ✅
│   (DATABASE_URL)         │
└──────────────────────────┘

┌──────────────────────────┐
│         Redis            │  ← Active ✅
│     (REDIS_URL)          │
└──────────────────────────┘

┌──────────────────────────┐
│        Backend           │  ← Active ✅
│  backend-xxx.railway.app │
└──────────────────────────┘

┌──────────────────────────┐
│       Frontend           │  ← Active ✅
│ frontend-xxx.railway.app │
└──────────────────────────┘
```

**Tất cả đều màu xanh = Perfect!**

### 5.4. Full System Test

#### Test 1: Frontend → Backend API
1. Mở FRONTEND_URL
2. Vào Login page
3. Try login (sẽ call `/api/auth/login/`)
4. Check Network tab - API call successful

#### Test 2: Backend Admin
1. Mở BACKEND_URL/admin/
2. Login với superuser
3. Browse data models
4. Create/Edit/Delete test data

#### Test 3: Complete User Flow
1. **Register** new account (Frontend)
2. **Verify email** (check email nếu đã config)
3. **Login** (Frontend)
4. **Browse jobs** (Frontend → Backend API)
5. **Apply for job** (Frontend → Backend API → Database)
6. **Check in Admin** (Backend admin panel)

✅ **All systems operational!**

---

## 👷 BƯỚC 6: DEPLOY CELERY WORKER (Optional)

Celery worker xử lý background tasks như gửi email, process CV, AI screening, etc.

**⚠️ LƯU Ý**: Bước này optional! Nếu app không cần background tasks, có thể skip.

### 6.1. Add Worker Service

1. Quay về project canvas
2. Click **"+ New"**
3. Chọn **"GitHub Repo"**
4. Chọn repository: **`YenNhi0511/DoAnPTPMHDT`** (same repo)
5. Click **"Add"**

### 6.2. Configure Worker Service

#### 6.2.1. Đổi Tên Service
1. Click vào service vừa tạo
2. Vào **"Settings"**
3. Đổi **"Service Name"** thành: **`celery-worker`**

#### 6.2.2. Set Custom Start Command

Worker không dùng Procfile `web` command, cần custom command!

1. Vẫn trong **"Settings"**
2. Scroll xuống tìm **"Deploy"** section
3. Tìm **"Custom Start Command"**
4. Click vào field
5. Nhập:
   ```bash
   cd backend && celery -A recruitment_system worker --loglevel=info --pool=solo
   ```

6. Click **"Save"** hoặc nhấn Enter

**Giải thích command**:
- `cd backend` - Vào thư mục backend
- `celery -A recruitment_system` - Run Celery với Django app
- `worker` - Start worker process
- `--loglevel=info` - Log level
- `--pool=solo` - Windows-compatible pool (important!)

### 6.3. Copy Environment Variables From Backend

Worker cần SAME environment variables như backend!

#### Option 1: Manual Copy (Recommended)

1. Mở **Backend service** trong tab mới
2. Vào Backend → **"Variables"** tab
3. Copy tất cả variables (trừ PORT):
   - SECRET_KEY
   - DEBUG
   - ALLOWED_HOSTS
   - GEMINI_API_KEY (nếu có)
   - EMAIL_* variables (nếu có)

4. Quay về **Worker service** → **"Variables"** tab
5. Add từng variable giống hệt backend

#### Option 2: Use Railway CLI (Nếu có cài)
```bash
railway variables --service backend > vars.txt
railway variables --service celery-worker --from-file vars.txt
```

### 6.4. Link Database Services

Worker cũng cần connect tới Redis và PostgreSQL!

1. Trong Worker service → **"Settings"**
2. Scroll tới **"Service Variables"** / **"Variable References"**
3. Click **"+ Reference"**:
   - Service: **Redis**
   - Variable: **REDIS_URL**
   - Click Add

4. Click **"+ Reference"** again:
   - Service: **Postgres**
   - Variable: **DATABASE_URL**
   - Click Add

### 6.5. Verify Worker Deployment

1. Vào Worker service → **"Deployments"**
2. Xem logs:
   ```
   Building...
   Installing dependencies...
   Starting Celery worker...
   
   celery@railway-worker v5.3.x
   
   [tasks]
     . recruitment_system.tasks.send_email
     . recruitment_system.tasks.process_cv
     . recruitment_system.tasks.ai_screening
   
   [2024-12-08 10:30:00] celery.worker.strategy: Starting worker...
   [2024-12-08 10:30:01] celery.worker.consumer: Ready to accept tasks!
   ```

3. Status: ✅ **Active**

✅ **Celery Worker đang chạy!**

### 6.6. (Optional) Deploy Celery Beat

Celery Beat chạy scheduled/periodic tasks (cron jobs).

**Nếu cần**, làm tương tự như Worker:

1. Add service mới từ GitHub
2. Đổi tên: `celery-beat`
3. Custom Start Command:
   ```bash
   cd backend && celery -A recruitment_system beat --loglevel=info
   ```
4. Copy environment variables từ backend
5. Link Redis + PostgreSQL

**⚠️ CHÚ Ý**: 
- Beat chỉ cần nếu có scheduled tasks trong code
- Không cần nếu chỉ dùng async tasks thôi

### 6.7. Test Background Tasks

#### Test từ Backend Admin:

1. Vào BACKEND_URL/admin/
2. Login với superuser
3. Trigger một task (ví dụ: gửi email)
4. Check Worker logs:
   - Vào Worker service → Deployments → View logs
   - Thấy task được execute:
     ```
     [2024-12-08 10:35:00] Task recruitment_system.tasks.send_email[xxx] received
     [2024-12-08 10:35:01] Task recruitment_system.tasks.send_email[xxx] succeeded
     ```

#### Test từ Django Shell:

1. Vào Backend service → Terminal
2. Run:
   ```bash
   cd backend
   python manage.py shell
   ```

3. Trong shell:
   ```python
   from recruitment_system.tasks import send_email
   result = send_email.delay('test@example.com', 'Test Subject', 'Test Body')
   print(result.id)
   ```

4. Check Worker logs - task should execute!

✅ **Background tasks hoạt động!**

---

## 🎉 BƯỚC 7: FINAL TESTING & VERIFICATION

### 7.1. Complete End-to-End Test Flow

Test toàn bộ hệ thống như một user thật!

#### Test Flow 1: Candidate Journey

1. **Open Frontend**: Truy cập FRONTEND_URL
   ```
   https://frontend-production-xxxx.up.railway.app
   ```

2. **Register Account**:
   - Click "Register" hoặc "Đăng ký"
   - Điền form:
     - Email: `test-candidate@example.com`
     - Password: `TestPass123!`
     - Role: Candidate
   - Submit form
   - Kiểm tra:
     - ✅ Registration successful
     - ✅ Redirect to email verification (nếu có)
     - ✅ Hoặc auto-login

3. **Login**:
   - Vào `/login`
   - Email: `test-candidate@example.com`
   - Password: `TestPass123!`
   - Click Login
   - Kiểm tra:
     - ✅ Login successful
     - ✅ Redirect to Dashboard
     - ✅ User info hiển thị trong header

4. **Browse Jobs**:
   - Vào "Jobs" hoặc "Tìm việc"
   - Kiểm tra:
     - ✅ Job list hiển thị
     - ✅ Filters hoạt động
     - ✅ Search hoạt động
     - ✅ Pagination hoạt động

5. **View Job Detail**:
   - Click vào một job
   - Kiểm tra:
     - ✅ Job detail page load
     - ✅ Company info hiển thị
     - ✅ Job requirements hiển thị
     - ✅ "Apply" button visible

6. **Apply for Job**:
   - Click "Apply"
   - Upload CV (nếu có)
   - Write cover letter
   - Submit application
   - Kiểm tra:
     - ✅ Application submitted
     - ✅ Success message
     - ✅ Redirect to "My Applications"

7. **View Applications**:
   - Vào "My Applications"
   - Kiểm tra:
     - ✅ Application vừa tạo xuất hiện
     - ✅ Status hiển thị
     - ✅ Can view details

#### Test Flow 2: Recruiter Journey

1. **Login as Recruiter**:
   - Use recruiter account (create in admin nếu chưa có)
   - Login thành công

2. **Post Job**:
   - Vào "Post Job" hoặc "Đăng tuyển"
   - Điền form job details
   - Submit
   - Kiểm tra:
     - ✅ Job created
     - ✅ Job appears in "My Jobs"

3. **View Applications**:
   - Vào "Applications" hoặc "Ứng viên"
   - Kiểm tra:
     - ✅ Application từ candidate hiển thị
     - ✅ Can download CV
     - ✅ Can change status

4. **Schedule Interview**:
   - Click "Schedule Interview"
   - Pick date/time
   - Submit
   - Kiểm tra:
     - ✅ Interview scheduled
     - ✅ Status updated

#### Test Flow 3: Admin Journey

1. **Login to Admin Panel**:
   ```
   https://backend-production-xxxx.up.railway.app/admin/
   ```
   - Username: `admin`
   - Password: [superuser password]

2. **Verify Data**:
   - Check **Users**: Thấy accounts vừa tạo
   - Check **Jobs**: Thấy jobs
   - Check **Applications**: Thấy applications
   - Check **Companies**: Verify company data

3. **Test CRUD Operations**:
   - Create new user
   - Edit existing job
   - Delete test data
   - Kiểm tra:
     - ✅ All CRUD operations work
     - ✅ Changes reflect in frontend

### 7.2. Monitor Logs

Nếu có vấn đề, check logs để debug!

#### Backend Logs:
1. Click Backend service
2. Tab **"Deployments"**
3. Click latest deployment
4. Click **"View Logs"**
5. Xem real-time logs:
   ```
   [2024-12-08 10:40:00] "GET /api/jobs/ HTTP/1.1" 200
   [2024-12-08 10:40:05] "POST /api/applications/ HTTP/1.1" 201
   ```

#### Frontend Logs:
1. Click Frontend service
2. Same process
3. Xem Nginx access logs

#### Worker Logs (nếu có):
1. Click Worker service
2. Xem Celery task execution logs

**⚠️ Common Issues**:
- 500 errors → Check backend logs
- 404 errors → Check URLs
- CORS errors → Check CORS_ALLOWED_ORIGINS
- Database errors → Check DATABASE_URL connection

### 7.3. Performance & Resource Monitoring

#### CPU & Memory Usage:
1. Vào Project dashboard
2. Click vào từng service
3. Tab **"Metrics"**
4. Xem:
   - CPU usage graph
   - Memory usage graph
   - Request count
   - Response time

**Normal ranges**:
- Backend: 50-200 MB RAM, <10% CPU (idle)
- Frontend: 30-100 MB RAM, <5% CPU
- Worker: 100-300 MB RAM (depending on tasks)
- PostgreSQL: 100-500 MB RAM
- Redis: 20-100 MB RAM

#### Request Monitoring:
- Check "Deployments" tab
- Look at request logs
- Monitor response times
- Verify no frequent errors

### 7.4. Create Deployment Checklist

Save this for future reference:

```markdown
## ✅ Railway Deployment Checklist

### Pre-Deployment:
- [x] Code pushed to GitHub
- [x] Railway account created
- [x] All config files present

### Railway Setup:
- [x] Project created: `recruitment-system`
- [x] PostgreSQL added & Active
- [x] Redis added & Active

### Backend Service:
- [x] Deployed from GitHub
- [x] ROOT directory: `/` (project root)
- [x] Environment variables set:
  - SECRET_KEY
  - DEBUG=False
  - ALLOWED_HOSTS
  - CORS_ALLOWED_ORIGINS
- [x] Database connections:
  - DATABASE_URL → PostgreSQL
  - REDIS_URL → Redis
- [x] Public domain generated
- [x] Migrations run
- [x] Superuser created
- [x] API accessible at /api/
- [x] Admin panel accessible at /admin/

### Frontend Service:
- [x] Deployed from GitHub
- [x] Root directory: `frontend`
- [x] Environment variable set:
  - REACT_APP_API_URL
- [x] Public domain generated
- [x] App loads correctly
- [x] No CORS errors
- [x] API calls working

### Celery Worker (Optional):
- [x] Deployed from GitHub
- [x] Custom start command set
- [x] Environment variables copied
- [x] Database connections linked
- [x] Tasks executing successfully

### Final Verification:
- [x] All services Active (green status)
- [x] End-to-end user flows tested
- [x] No errors in logs
- [x] Performance metrics normal
- [x] Admin panel functional
- [x] Email sending works (if configured)
- [x] Background tasks work (if configured)

### URLs Recorded:
- Backend:  https://backend-production-xxxx.up.railway.app
- Frontend: https://frontend-production-xxxx.up.railway.app
- Admin:    https://backend-production-xxxx.up.railway.app/admin/

### Credentials Saved:
- Admin Username: admin
- Admin Password: [SAVED SECURELY]
- Database: [Auto-managed by Railway]
```

✅ **Deployment Complete!**

---

## 📊 SYSTEM ARCHITECTURE OVERVIEW

```
┌────────────────────────────────────────────────────────────────┐
│                     RAILWAY PROJECT                             │
│                   recruitment-system                            │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────┐         ┌────────────────┐                │
│  │   PostgreSQL   │←────────│    Backend     │                │
│  │   Database     │  DB     │   (Django)     │                │
│  │                │ Conn    │   Gunicorn     │                │
│  │ DATABASE_URL   │         │   Port: 8000   │                │
│  └────────────────┘         └────────┬───────┘                │
│                                      │                         │
│  ┌────────────────┐                  │ API                    │
│  │     Redis      │←─────────────────┤                        │
│  │     Cache      │  REDIS_URL       │                        │
│  │                │                  │                         │
│  └────────┬───────┘                  │                        │
│           │                          │                         │
│           │ Tasks    ┌───────────────▼──────┐                 │
│           └──────────│  Celery Worker       │                 │
│                      │  Background Tasks    │                 │
│                      │  (Optional)          │                 │
│                      └──────────────────────┘                 │
│                                                                 │
│  ┌────────────────────────────────────┐                       │
│  │         Frontend                    │                       │
│  │         (React)                     │                       │
│  │         Nginx Server                │                       │
│  │         Port: 80                    │                       │
│  └─────────────┬──────────────────────┘                       │
│                │                                               │
│                │ HTTP Requests                                 │
│                │ (CORS Allowed)                                │
│                │                                               │
│                ▼                                               │
│         API Endpoint                                           │
│    /api/jobs/, /api/auth/                                     │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
         │                           │
         │ HTTPS                     │ HTTPS
         │                           │
         ▼                           ▼
    Users (Web)                 Admins (Admin Panel)
```

### Key Components:

1. **PostgreSQL Database**:
   - Stores all application data
   - Auto-managed by Railway
   - Auto-backup enabled
   - SSL connection

2. **Redis Cache**:
   - Celery task queue
   - Session storage
   - Cache backend
   - Auto-managed by Railway

3. **Backend Service (Django)**:
   - REST API endpoints
   - Django Admin panel
   - Business logic
   - Authentication (JWT)
   - Served by Gunicorn
   - Static files via WhiteNoise

4. **Frontend Service (React)**:
   - Single Page Application (SPA)
   - Responsive UI (Tailwind CSS)
   - Client-side routing (React Router)
   - Served by Nginx
   - Production build optimized

5. **Celery Worker (Optional)**:
   - Background task processing
   - Email sending
   - CV processing
   - AI screening
   - Report generation

### Data Flow:

1. **User Request**:
   ```
   User Browser
   → Frontend (React + Nginx)
   → API Call (HTTPS)
   → Backend (Django)
   → Database (PostgreSQL)
   → Response
   ```

2. **Background Task**:
   ```
   User Action (Apply Job)
   → Backend creates task
   → Task pushed to Redis queue
   → Celery Worker picks task
   → Process (e.g., send email)
   → Update database
   ```

3. **Admin Action**:
   ```
   Admin Browser
   → Backend /admin/ URL
   → Django Admin Panel
   → Direct database access
   → CRUD operations
   ```

---

## 🔐 SECURITY & BEST PRACTICES

### Security Checklist

#### ✅ Required Security Measures:

- [ ] **SECRET_KEY**: Generated mới, unique, không commit vào Git
  - Minimum 50 characters
  - Random string (dùng `secrets.token_urlsafe(50)`)
  - KHÔNG dùng default value từ template

- [ ] **DEBUG Mode**: Set `DEBUG=False` trong production
  - KHÔNG để `DEBUG=True` trên production!
  - Debug mode expose sensitive information

- [ ] **ALLOWED_HOSTS**: Chỉ Railway domains
  - `.railway.app,.up.railway.app`
  - KHÔNG để `*` (allow all)

- [ ] **CORS_ALLOWED_ORIGINS**: Chỉ frontend URL
  - Specific origin, không dùng `*`
  - Example: `https://frontend-production-xxxx.up.railway.app`

- [ ] **Database Credentials**: KHÔNG hardcode
  - Dùng `DATABASE_URL` từ Railway
  - Railway auto-manage credentials

- [ ] **Email Credentials**: Dùng App Password
  - KHÔNG dùng real Gmail password
  - Generate App Password trong Google Account
  - Guide: https://support.google.com/accounts/answer/185833

- [ ] **HTTPS**: Auto-enabled by Railway
  - All Railway domains có SSL certificate
  - Force HTTPS trong Django settings

- [ ] **API Keys**: Store trong Environment Variables
  - `GEMINI_API_KEY` và các keys khác
  - KHÔNG commit vào Git
  - Add vào `.gitignore`

### Best Practices

#### 1. Environment Variables Management

**DO**:
- ✅ Store tất cả secrets trong Railway Variables
- ✅ Use different keys cho dev vs production
- ✅ Document required variables trong README
- ✅ Use `.env.example` template

**DON'T**:
- ❌ Hardcode credentials trong code
- ❌ Commit `.env` file vào Git
- ❌ Share secrets qua chat/email
- ❌ Reuse same SECRET_KEY across projects

#### 2. Database Security

**DO**:
- ✅ Use Railway-managed PostgreSQL (auto SSL)
- ✅ Regular backups (Railway auto-backup)
- ✅ Use Django ORM (prevent SQL injection)
- ✅ Validate all user inputs

**DON'T**:
- ❌ Expose database credentials
- ❌ Use raw SQL without validation
- ❌ Skip migrations
- ❌ Delete production database without backup

#### 3. Deployment Security

**DO**:
- ✅ Review code before push
- ✅ Test locally before deploy
- ✅ Monitor logs regularly
- ✅ Keep dependencies updated

**DON'T**:
- ❌ Deploy untested code to production
- ❌ Ignore security warnings
- ❌ Use outdated packages
- ❌ Skip error monitoring

#### 4. Access Control

**DO**:
- ✅ Use strong admin passwords
- ✅ Enable 2FA on GitHub account
- ✅ Limit Railway project access
- ✅ Use Django permissions system

**DON'T**:
- ❌ Share admin credentials
- ❌ Use weak passwords
- ❌ Give unnecessary permissions
- ❌ Skip authentication checks

### Recommended Django Settings for Production

Ensure these in `backend/recruitment_system/settings.py`:

```python
# Security
SECRET_KEY = os.environ.get('SECRET_KEY')  # ✅ From env
DEBUG = os.environ.get('DEBUG', 'False') == 'True'  # ✅ Default False

# Hosts
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')  # ✅ Specific hosts

# HTTPS
SECURE_SSL_REDIRECT = True  # ✅ Force HTTPS
SESSION_COOKIE_SECURE = True  # ✅ HTTPS-only cookies
CSRF_COOKIE_SECURE = True  # ✅ HTTPS-only CSRF

# HSTS
SECURE_HSTS_SECONDS = 31536000  # ✅ 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Content Security
X_FRAME_OPTIONS = 'DENY'  # ✅ Prevent clickjacking
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True

# CORS
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_CREDENTIALS = True
```

### Regular Maintenance Tasks

#### Weekly:
- Check Railway usage/costs
- Review error logs
- Monitor performance metrics
- Check for security updates

#### Monthly:
- Update Python packages
- Update Node.js packages
- Review and rotate secrets
- Database backup verification

#### Quarterly:
- Full security audit
- Performance optimization
- Code refactoring
- Documentation updates

---

## 💰 COST MANAGEMENT & OPTIMIZATION

### Railway Pricing Plans

#### Hobby Plan (Recommended for Start)
- **Cost**: $5 usage credit/month + $5 subscription = **$10/month total**
- **Features**:
  - All core features
  - Up to 500 hours/month execution time
  - 8 GB RAM
  - 100 GB bandwidth
  - Perfect for small-medium projects

#### Developer Plan (If Needed)
- **Cost**: ~$20-50/month (pay-as-you-go)
- **For**: Higher traffic, more resources

### Estimated Monthly Cost Breakdown

**Your Project (recruitment-system)**:

```
Service            | RAM   | CPU  | Est. Cost
-------------------|-------|------|----------
PostgreSQL         | 256MB | 5%   | $1-2
Redis              | 128MB | 2%   | $0.5-1
Backend (Django)   | 512MB | 10%  | $2-3
Frontend (Nginx)   | 256MB | 3%   | $1-1.5
Celery Worker*     | 256MB | 5%   | $1-1.5
-------------------|-------|------|----------
TOTAL              | ~1.4GB| 25%  | $5.5-9
```

**✅ Fits within $10 Hobby Plan!**

*Optional - có thể tắt nếu không cần background tasks

### Cost Optimization Tips

#### 1. Reduce Resource Usage

**Scale Down Unused Services**:
```
# Trong Railway Dashboard
Service → Settings → Resources
- Adjust Memory limit
- Set CPU limit
- Enable sleep mode for dev services
```

**Use Environment-Based Scaling**:
- Production: Full resources
- Staging: Reduced resources
- Development: Minimal resources

#### 2. Optimize Database

**PostgreSQL**:
- Regular VACUUM operations
- Index optimization
- Query optimization
- Delete old logs/data

**Redis**:
- Set TTL on cache keys
- Use memory-efficient data structures
- Monitor memory usage
- Flush unused keys

#### 3. Optimize Frontend

**Build Size**:
- Code splitting
- Tree shaking
- Image optimization
- Lazy loading
- Remove unused dependencies

**Result**: Faster builds, less bandwidth, lower costs

#### 4. Optimize Backend

**Django Performance**:
- Use select_related(), prefetch_related()
- Enable query caching
- Optimize database queries
- Use Django Debug Toolbar locally

**Static Files**:
- WhiteNoise compression (already configured)
- CDN for media files (optional)
- Aggressive caching headers

#### 5. Monitor & Analyze

**Railway Metrics**:
1. Go to Project → Metrics
2. Check:
   - Memory usage over time
   - CPU usage patterns
   - Request volume
   - Error rates

**Identify Issues**:
- Memory leaks (increasing RAM over time)
- CPU spikes (inefficient code)
- High error rates (bugs)

**Set Alerts**:
- Railway can notify when usage is high
- Set up email/Discord notifications

#### 6. Development Best Practices

**Local Development**:
- Do most development locally
- Use Railway for production/staging only
- Don't deploy every commit

**Branch Deployments**:
- Only deploy `main` branch auto
- Manual deploy for other branches
- Reduce unnecessary deployments

**Sleep Mode**:
- Enable for development services
- Wakes on request
- Saves execution hours

### Cost Monitoring Dashboard

**Track Your Usage**:
1. Railway Dashboard → Project
2. Click **"Usage"** tab
3. View:
   - Current month usage
   - Cost breakdown by service
   - Execution time used
   - Bandwidth used
   - Projected end-of-month cost

**Example**:
```
Current Usage (Dec 8):
━━━━━━━━━━━━━━━━━━━━━━━
Execution Time: 127 / 500 hours
Memory:         1.2 / 8 GB
Bandwidth:      2.3 / 100 GB
━━━━━━━━━━━━━━━━━━━━━━━
Projected Cost: $6.50 / $10
```

### When to Upgrade

Consider upgrading to Developer Plan if:
- Traffic exceeds 10k requests/day
- Need more than 8 GB RAM
- Need more than 500 execution hours
- Need custom domains
- Need team collaboration features

### Cost-Saving Strategies

**For Development**:
- Use local development setup
- Only deploy to Railway for demos/testing
- Use Railway CLI for quick tests
- Pause services when not in use

**For Production**:
- Enable caching aggressively
- Optimize database queries
- Use CDN for static assets
- Scale services based on traffic
- Monitor and fix memory leaks

**Estimated Savings**:
- Local dev: ~30% cost reduction
- Proper caching: ~20% cost reduction
- Query optimization: ~15% cost reduction
- CDN usage: ~10% cost reduction

**Total potential savings: ~75%** 🎉

---

## 🆘 TROUBLESHOOTING GUIDE

### Common Issues & Solutions

#### 🔴 Issue 1: Backend Build Failed

**Symptoms**:
- Build status: ❌ Failed (red)
- Error in logs: `pip install failed` hoặc `requirements.txt not found`

**Solutions**:

**Check 1**: Verify `requirements.txt` exists
```powershell
# Local
ls backend/requirements.txt

# Should show file exists
```

**Check 2**: Verify Python version
- File `runtime.txt` có chứa: `python-3.10.14`
- Không có typo

**Check 3**: Check Railway logs
1. Backend service → Deployments → Latest deployment
2. Look for specific error:
   ```
   ERROR: Could not find a version that satisfies the requirement <package>
   ```
3. Fix: Update version trong `requirements.txt`

**Check 4**: Procfile syntax
```
# Should be:
web: cd backend && gunicorn recruitment_system.wsgi --bind 0.0.0.0:$PORT

# NOT:
web: gunicorn recruitment_system.wsgi  # ❌ Missing cd backend
```

**Fix**:
1. Fix files locally
2. Commit và push to GitHub:
   ```powershell
   git add .
   git commit -m "Fix build configuration"
   git push origin main
   ```
3. Railway auto-redeploy

---

#### 🔴 Issue 2: Frontend Build Failed

**Symptoms**:
- Frontend deployment failed
- Error: `npm install failed` hoặc `Dockerfile not found`

**Solutions**:

**Check 1**: Root Directory is set correctly
1. Frontend service → Settings
2. **Root Directory** = `frontend` (NOT empty, NOT `/frontend`)

**Check 2**: Dockerfile exists
```powershell
# Should exist:
ls frontend/Dockerfile
ls frontend/nginx.conf
```

**Check 3**: package.json has build script
```json
"scripts": {
  "build": "react-scripts build"  // ✅ Must exist
}
```

**Check 4**: Check build logs
- Look for specific npm errors
- Usually missing dependencies or syntax errors

**Fix**:
```powershell
# Test build locally first
cd frontend
npm install
npm run build

# If successful, push to GitHub
git add .
git commit -m "Fix frontend build"
git push origin main
```

---

#### 🔴 Issue 3: Database Connection Error

**Symptoms**:
- Backend logs: `OperationalError: could not connect to server`
- API returns 500 errors
- Admin panel không load được

**Solutions**:

**Check 1**: DATABASE_URL is linked
1. Backend service → Settings → scroll down
2. Look for **Variable References**
3. Should see: `DATABASE_URL` → `Postgres.DATABASE_URL`

**If missing**:
1. Click **"+ Reference"**
2. Service: Postgres
3. Variable: DATABASE_URL
4. Add

**Check 2**: PostgreSQL service is Active
- Go to Postgres service
- Status should be: ✅ Active (green)
- If not, wait or contact Railway support

**Check 3**: Run migrations
```bash
# In Railway Terminal (Backend service)
python backend/manage.py migrate
```

**Check 4**: Verify settings.py
```python
# Should use dj-database-url
import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600
    )
}
```

---

#### 🔴 Issue 4: CORS Error

**Symptoms**:
- Frontend loads OK
- But API calls fail
- Console error:
  ```
  Access to XMLHttpRequest at 'https://backend...' from origin 'https://frontend...'
  has been blocked by CORS policy
  ```

**Solutions**:

**Check 1**: CORS_ALLOWED_ORIGINS is set
1. Backend service → Variables
2. Look for: `CORS_ALLOWED_ORIGINS`
3. Value should be: `https://frontend-production-xxxx.up.railway.app`
4. NO trailing slash!
5. Use EXACT frontend URL

**Check 2**: django-cors-headers is installed
```python
# settings.py should have:
INSTALLED_APPS = [
    ...
    'corsheaders',  # ✅ Must be here
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ✅ Must be BEFORE CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    ...
]
```

**Check 3**: Verify CORS settings
```python
# settings.py
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_CREDENTIALS = True
```

**Fix**:
1. Update `CORS_ALLOWED_ORIGINS` in Railway Variables
2. Wait for auto-redeploy (~2 minutes)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Refresh frontend

---

#### 🔴 Issue 5: Static Files Not Loading

**Symptoms**:
- Admin panel có CSS nhưng trông xấu
- Or: Admin panel hoàn toàn không có styling
- Missing images/CSS

**Solutions**:

**Check 1**: WhiteNoise is configured
```python
# settings.py
MIDDLEWARE = [
    ...
    'whitenoise.middleware.WhiteNoiseMiddleware',  # ✅ After SecurityMiddleware
    ...
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

**Check 2**: Static files settings
```python
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
```

**Check 3**: Run collectstatic
```bash
# In Railway Terminal
python backend/manage.py collectstatic --noinput
```

**Check 4**: Procfile includes collectstatic (optional)
```
release: cd backend && python manage.py collectstatic --noinput && python manage.py migrate
web: cd backend && gunicorn recruitment_system.wsgi --bind 0.0.0.0:$PORT
```

---

#### 🔴 Issue 6: "Service Temporarily Unavailable" (503)

**Symptoms**:
- Service deployed successfully
- But accessing URL shows 503 error
- Or: Loading forever

**Solutions**:

**Check 1**: Service is actually running
1. Go to service
2. Tab: Deployments
3. Latest deployment status should be: ✅ Success
4. Check logs - should see:
   ```
   [2024-12-08 10:30:00] Listening on 0.0.0.0:8000
   ```

**Check 2**: Healthcheck passing
- Railway checks if service responds
- If service takes too long to start, marks as unhealthy

**Fix for slow startup**:
```python
# settings.py - reduce startup time
# Comment out heavy imports in __init__.py
# Defer Celery initialization
```

**Check 3**: Port binding correct
```python
# Procfile
web: cd backend && gunicorn recruitment_system.wsgi --bind 0.0.0.0:$PORT
#                                                           ^^^^^ Must use $PORT
```

**Check 4**: Check Railway status
- Visit: https://status.railway.app
- If Railway has outage, wait for resolution

---

#### 🔴 Issue 7: Celery Worker Not Processing Tasks

**Symptoms**:
- Tasks created but never execute
- Worker logs show no activity
- Tasks stuck in queue

**Solutions**:

**Check 1**: Worker is running
1. Go to Worker service
2. Status: ✅ Active
3. Check logs:
   ```
   celery@railway-worker ready to accept tasks
   ```

**Check 2**: REDIS_URL is linked
1. Worker service → Settings
2. Variable References
3. Should see: `REDIS_URL` → `Redis.REDIS_URL`

**Check 3**: Custom Start Command correct
```bash
cd backend && celery -A recruitment_system worker --loglevel=info --pool=solo
```

**Check 4**: Test task manually
```python
# In Backend Railway Terminal
python backend/manage.py shell

from recruitment_system.tasks import test_task
result = test_task.delay()
print(result.id)
```

Then check Worker logs for task execution.

**Check 5**: Redis connection
```python
# In Backend Terminal
python
>>> import redis
>>> from django.conf import settings
>>> r = redis.from_url(settings.CELERY_BROKER_URL)
>>> r.ping()
True  # ✅ Should return True
```

---

#### 🔴 Issue 8: Email Not Sending

**Symptoms**:
- Registration/verification emails not received
- No errors in logs
- Or: SMTP authentication failed

**Solutions**:

**Check 1**: Email variables are set
1. Backend → Variables
2. Check:
   ```
   EMAIL_HOST = smtp.gmail.com
   EMAIL_PORT = 587
   EMAIL_USE_TLS = True
   EMAIL_HOST_USER = your_email@gmail.com
   EMAIL_HOST_PASSWORD = [app password]
   EMAIL_BACKEND = django.core.mail.backends.smtp.EmailBackend
   ```

**Check 2**: Using App Password (NOT regular password)
- Go to: https://myaccount.google.com/apppasswords
- Generate new app password for "Mail"
- Copy 16-character password
- Update `EMAIL_HOST_PASSWORD` in Railway

**Check 3**: Gmail "Less secure app access" (if needed)
- Or use SendGrid, Mailgun instead

**Check 4**: Test email from Django shell
```python
# Railway Terminal
python backend/manage.py shell

from django.core.mail import send_mail
send_mail(
    'Test Subject',
    'Test message',
    'from@example.com',
    ['to@example.com'],
    fail_silently=False,
)
```

If error occurs, will show in terminal.

---

#### 🔴 Issue 9: High Memory Usage / Out of Memory

**Symptoms**:
- Service crashes randomly
- Error: `OutOfMemoryError`
- Service restarts frequently

**Solutions**:

**Check 1**: Monitor memory in Metrics
1. Service → Metrics tab
2. Check RAM usage over time
3. If steadily increasing = memory leak

**Check 2**: Optimize queries
```python
# Bad - loads all objects:
jobs = Job.objects.all()

# Good - use pagination:
jobs = Job.objects.all()[:20]

# Best - use select_related:
jobs = Job.objects.select_related('company').all()[:20]
```

**Check 3**: Enable query caching
```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.environ.get('REDIS_URL'),
    }
}
```

**Check 4**: Increase memory limit
1. Service → Settings → Resources
2. Increase memory allocation
3. Note: May increase cost

---

### Debugging Checklist

When something goes wrong, follow this sequence:

```markdown
1. [ ] Check Service Status
   - Is service Active (green)?
   - Recent deployments successful?

2. [ ] Check Logs
   - Go to Deployments → Latest → View Logs
   - Look for ERROR or CRITICAL messages
   - Note timestamps

3. [ ] Check Environment Variables
   - All required variables set?
   - No typos in variable names?
   - Values are correct?

4. [ ] Check Connections
   - Database linked?
   - Redis linked?
   - Services can talk to each other?

5. [ ] Check Code
   - Recent changes might have broken something?
   - Try reverting last commit
   - Test locally

6. [ ] Check Railway Status
   - https://status.railway.app
   - Any platform-wide issues?

7. [ ] Check Metrics
   - CPU usage normal?
   - Memory usage normal?
   - Any unusual spikes?

8. [ ] Clear Caches
   - Browser cache
   - CDN cache (if using)
   - Django cache

9. [ ] Restart Services
   - Sometimes helps with transient issues
   - Service → Deployments → Redeploy

10. [ ] Ask for Help
    - Railway Discord: https://discord.gg/railway
    - Railway Docs: https://docs.railway.app
    - GitHub Issues (if code-related)
```

---

## 📚 ADDITIONAL RESOURCES

### Railway Documentation

- **Official Docs**: https://docs.railway.app
- **Getting Started**: https://docs.railway.app/getting-started
- **Deploy Guide**: https://docs.railway.app/deploy/deployments
- **Environment Variables**: https://docs.railway.app/develop/variables
- **Networking**: https://docs.railway.app/deploy/networking
- **Databases**: https://docs.railway.app/databases/postgresql
- **CLI Reference**: https://docs.railway.app/develop/cli

### Community & Support

- **Railway Discord**: https://discord.gg/railway
  - Active community
  - Railway team responds quickly
  - #help channel for questions

- **Railway Status**: https://status.railway.app
  - Check platform status
  - Subscribe to updates
  - Incident history

- **Railway Blog**: https://blog.railway.app
  - Product updates
  - Best practices
  - Case studies

### Django Production Resources

- **Django Deployment Checklist**: https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/
- **Django Security**: https://docs.djangoproject.com/en/5.0/topics/security/
- **Django Performance**: https://docs.djangoproject.com/en/5.0/topics/performance/
- **Gunicorn Docs**: https://docs.gunicorn.org/
- **WhiteNoise Docs**: https://whitenoise.readthedocs.io/

### React Production Resources

- **React Production Build**: https://react.dev/learn/start-a-new-react-project#building-for-production
- **Nginx Configuration**: https://nginx.org/en/docs/
- **Docker Best Practices**: https://docs.docker.com/develop/dev-best-practices/

### Celery Resources

- **Celery Docs**: https://docs.celeryq.dev/
- **Celery + Django**: https://docs.celeryq.dev/en/stable/django/
- **Redis Backend**: https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/redis.html

### Security Resources

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Django Security**: https://docs.djangoproject.com/en/5.0/topics/security/
- **Security Headers**: https://securityheaders.com/
- **SSL Labs**: https://www.ssllabs.com/ssltest/

### Monitoring & Analytics

- **Sentry** (Error Tracking): https://sentry.io
- **LogRocket** (Frontend Monitoring): https://logrocket.com
- **Datadog** (Full-stack Monitoring): https://www.datadoghq.com
- **Google Analytics**: https://analytics.google.com

### Useful Tools

- **Django Debug Toolbar**: https://django-debug-toolbar.readthedocs.io/
- **Postman** (API Testing): https://www.postman.com/
- **pgAdmin** (PostgreSQL GUI): https://www.pgadmin.org/
- **Redis Commander**: https://www.npmjs.com/package/redis-commander

---

## 🎯 QUICK REFERENCE CARD

### Your Deployment URLs

**Save these after deployment!**

```
┌─────────────────────────────────────────────────────────┐
│                  PRODUCTION URLS                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend:  https://_____.up.railway.app                │
│             (User-facing website)                        │
│                                                          │
│  Backend:   https://_____.up.railway.app                │
│             (API endpoint)                               │
│                                                          │
│  Admin:     https://_____.up.railway.app/admin/         │
│             (Django admin panel)                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Essential Environment Variables

**Backend (Django)**:
```bash
# Required
SECRET_KEY=<generated-50-char-token>
DEBUG=False
ALLOWED_HOSTS=.railway.app,.up.railway.app

# Auto-injected by Railway
DATABASE_URL=<auto-from-postgres>
REDIS_URL=<auto-from-redis>

# CORS (after frontend deploy)
CORS_ALLOWED_ORIGINS=https://frontend-xxx.up.railway.app

# Optional
GEMINI_API_KEY=<your-gemini-key>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=<your-email@gmail.com>
EMAIL_HOST_PASSWORD=<app-password>
```

**Frontend (React)**:
```bash
# Required
REACT_APP_API_URL=https://backend-xxx.up.railway.app/api
```

**Worker (Celery)**:
```bash
# Same as Backend
# Copy all Backend variables
# Plus auto-injected DATABASE_URL and REDIS_URL
```

### Common Railway CLI Commands

```bash
# Login
railway login

# Link to project
railway link

# Deploy
railway up

# View logs
railway logs

# Open service
railway open

# Run command
railway run python backend/manage.py migrate

# Environment variables
railway variables
railway variables set KEY=value

# Status
railway status
```

### Quick Deploy Steps Recap

```
1. ✅ Create Railway account (GitHub login)
2. ✅ Create Empty Project
3. ✅ Add PostgreSQL database
4. ✅ Add Redis cache
5. ✅ Deploy Backend from GitHub (root: /)
6. ✅ Set Backend env vars + link databases
7. ✅ Generate Backend domain
8. ✅ Run migrations in Railway Terminal
9. ✅ Create superuser
10. ✅ Deploy Frontend from GitHub (root: frontend)
11. ✅ Set Frontend env vars (REACT_APP_API_URL)
12. ✅ Generate Frontend domain
13. ✅ Update Backend CORS with Frontend URL
14. ✅ Test complete flow
15. ✅ (Optional) Deploy Celery Worker
```

**Total time**: ~20-30 minutes ⏱️

---

## ✅ FINAL DEPLOYMENT CHECKLIST

Print this and check off as you complete each step!

### Pre-Deployment
- [ ] Code is tested locally
- [ ] All features working
- [ ] No console errors
- [ ] Database migrations created
- [ ] Static files collected locally (test)
- [ ] .gitignore configured (.env, node_modules, etc.)
- [ ] Code pushed to GitHub (main branch)

### Railway Setup
- [ ] Railway account created
- [ ] GitHub connected to Railway
- [ ] Project created: `recruitment-system`

### Database Setup
- [ ] PostgreSQL service added
- [ ] PostgreSQL status: Active ✅
- [ ] Redis service added
- [ ] Redis status: Active ✅

### Backend Deployment
- [ ] Backend service created from GitHub repo
- [ ] Service name changed to: `backend`
- [ ] Build completed successfully
- [ ] Public domain generated
- [ ] SECRET_KEY generated and added (50+ chars)
- [ ] DEBUG set to False
- [ ] ALLOWED_HOSTS configured
- [ ] DATABASE_URL linked from PostgreSQL
- [ ] REDIS_URL linked from Redis
- [ ] Email variables added (if using)
- [ ] GEMINI_API_KEY added (if using)
- [ ] Service status: Active ✅
- [ ] Migrations run via Railway Terminal
- [ ] Superuser created
- [ ] /api/ endpoint accessible
- [ ] /admin/ login works

### Frontend Deployment
- [ ] Frontend service created from GitHub repo
- [ ] Service name changed to: `frontend`
- [ ] Root Directory set to: `frontend`
- [ ] Build completed successfully
- [ ] Public domain generated
- [ ] REACT_APP_API_URL set (with /api suffix)
- [ ] Service status: Active ✅
- [ ] Homepage loads correctly
- [ ] No console errors
- [ ] API calls working (Network tab check)

### Cross-Service Configuration
- [ ] CORS_ALLOWED_ORIGINS updated in Backend
- [ ] Frontend URL added (exact, no trailing slash)
- [ ] Backend redeployed after CORS update
- [ ] CORS errors resolved
- [ ] All services Active ✅

### Celery Worker (Optional)
- [ ] Worker service created (if needed)
- [ ] Custom start command set
- [ ] Environment variables copied from Backend
- [ ] DATABASE_URL linked
- [ ] REDIS_URL linked
- [ ] Service status: Active ✅
- [ ] Worker logs show "Ready to accept tasks"
- [ ] Test task executed successfully

### Testing
- [ ] User registration works
- [ ] Email verification works (if configured)
- [ ] User login works
- [ ] Job listing displays
- [ ] Job search/filters work
- [ ] Job detail page loads
- [ ] Job application submission works
- [ ] Admin panel accessible
- [ ] Admin CRUD operations work
- [ ] No errors in any service logs
- [ ] No CORS errors in browser console

### Documentation
- [ ] URLs recorded (Backend, Frontend, Admin)
- [ ] Admin credentials saved securely
- [ ] Environment variables documented
- [ ] Deployment process documented (this guide!)

### Final Checks
- [ ] All services showing Active status
- [ ] No deployment errors
- [ ] Resource usage within limits
- [ ] Cost projection acceptable
- [ ] Team notified of deployment
- [ ] URLs shared with stakeholders

---

## 🎊 CONGRATULATIONS!

Your **Recruitment System** is now live on Railway! 🚀

### What You've Accomplished:

✅ Set up complete cloud infrastructure  
✅ Deployed Django backend with REST API  
✅ Deployed React frontend with modern UI  
✅ Configured PostgreSQL database  
✅ Configured Redis cache  
✅ Set up Celery workers (optional)  
✅ Secured with HTTPS  
✅ Implemented CORS correctly  
✅ Optimized for production  

### Next Steps:

1. **Share with your team**:
   - Send Frontend URL to users
   - Send Admin URL to admins
   - Provide login credentials

2. **Monitor your application**:
   - Check logs daily
   - Monitor resource usage
   - Watch for errors

3. **Gather feedback**:
   - Test with real users
   - Fix bugs as they arise
   - Iterate and improve

4. **Scale as needed**:
   - Add more resources if traffic increases
   - Enable CDN for better performance
   - Add monitoring tools (Sentry, etc.)

5. **Keep learning**:
   - Explore Railway features
   - Optimize performance
   - Enhance security

### Support:

**If you need help**:
- 📖 Review this guide
- 💬 Ask in Railway Discord
- 📚 Check Railway docs
- 🔍 Search for similar issues

**If you found this helpful**:
- ⭐ Star the project on GitHub
- 📣 Share with others
- 💝 Contribute improvements

---

## 📝 DEPLOYMENT NOTES

**Project**: Recruitment System  
**Deployed**: December 8, 2025  
**Platform**: Railway (https://railway.app)  
**Method**: 100% Manual via Dashboard  
**Difficulty**: ⭐⭐☆☆☆ Easy-Medium  
**Duration**: ~20-30 minutes  
**Cost**: ~$6-9/month (Hobby Plan)  

**Tech Stack**:
- Backend: Django 5.0 + Gunicorn + WhiteNoise
- Frontend: React 18 + Nginx
- Database: PostgreSQL
- Cache: Redis
- Tasks: Celery (optional)

**Features Deployed**:
- User authentication (JWT)
- Job listings
- Application management
- Admin panel
- AI screening (if Gemini configured)
- Email notifications (if configured)
- Background tasks (if Worker deployed)

**Production Ready**: ✅ YES

---

**Happy Recruiting! 🎯**

*Guide created with ❤️ for seamless Railway deployment*

---

**Last Updated**: December 8, 2025  
**Version**: 1.0  
**Author**: GitHub Copilot  
**License**: Free to use and share
