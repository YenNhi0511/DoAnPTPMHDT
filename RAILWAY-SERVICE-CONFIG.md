# Railway Service Configuration - EXACT STEPS

## 🎯 2 Services Configuration

### Service 1: Backend (Django API)

**Railway Dashboard Settings:**
```
Service Name: backend
GitHub Repo: YenNhi0511/DoAnPTPMHDT
Branch: main

Root Directory: [LEAVE EMPTY] or "/"
  ⚠️ IMPORTANT: Do NOT set to "backend"!
  
Builder: Auto-detect (will use Nixpacks)
```

**Files Used:**
- `/nixpacks.toml` - Build configuration
- `/Procfile` - Start command
- `/runtime.txt` - Python 3.10.14
- `/backend/requirements.txt` - Dependencies

**Expected Build Process:**
```bash
1. Nixpacks detects Python project
2. pip install -r backend/requirements.txt
3. python backend/manage.py collectstatic --noinput
4. Start: cd backend && gunicorn recruitment_system.wsgi
```

**Environment Variables Needed:**
```
SECRET_KEY=<generate-with-secrets.token_urlsafe(50)>
DEBUG=False
ALLOWED_HOSTS=.railway.app,.up.railway.app
DATABASE_URL=<reference:Postgres.DATABASE_URL>
REDIS_URL=<reference:Redis.REDIS_URL>
CORS_ALLOWED_ORIGINS=<frontend-url-after-deploy>
```

---

### Service 2: Frontend (React SPA)

**Railway Dashboard Settings:**
```
Service Name: frontend
GitHub Repo: YenNhi0511/DoAnPTPMHDT
Branch: main

Root Directory: frontend
  ⚠️ IMPORTANT: Must be exactly "frontend" (no leading slash)
  
Builder: Auto-detect (will use Dockerfile)
```

**Files Used:**
- `/frontend/Dockerfile` - Multi-stage build
- `/frontend/railway.json` - Force Dockerfile builder
- `/frontend/nginx.conf` - Nginx configuration
- `/frontend/package.json` - Dependencies

**Expected Build Process:**
```bash
1. Stage 1: FROM node:18-alpine
   - npm ci
   - npm run build
   
2. Stage 2: FROM nginx:alpine
   - Copy build files
   - Copy nginx.conf
   - Start nginx
```

**Environment Variables Needed:**
```
REACT_APP_API_URL=<backend-url>/api
  ⚠️ Must include /api at the end
  ⚠️ Use backend Railway URL, not localhost
```

---

## 📋 Step-by-Step Deployment

### Step 1: Deploy Backend First

1. Railway Dashboard → New → GitHub Repo
2. Select: `YenNhi0511/DoAnPTPMHDT`
3. Railway creates service automatically
4. **IMMEDIATELY go to Settings:**
   - Service Name: Change to `backend`
   - Root Directory: **LEAVE EMPTY** (or set to `/`)
   - Save
5. Wait for deployment (~3-5 minutes)
6. Check logs - should see:
   ```
   Installing Python 3.10.14
   pip install -r backend/requirements.txt
   Collecting static files
   Starting gunicorn
   ```
7. **Generate Domain:**
   - Settings → Networking → Generate Domain
   - Copy URL: `https://backend-production-xxxx.up.railway.app`

### Step 2: Set Backend Environment Variables

1. Backend service → Variables tab
2. Add these variables:

```bash
# Generate SECRET_KEY first:
python -c "import secrets; print(secrets.token_urlsafe(50))"

# Then add to Railway:
SECRET_KEY=<paste-generated-key>
DEBUG=False
ALLOWED_HOSTS=.railway.app,.up.railway.app
```

3. Link Database Services:
   - Variables → + Reference → Postgres → DATABASE_URL
   - Variables → + Reference → Redis → REDIS_URL

4. Wait for auto-redeploy

### Step 3: Run Backend Migrations

1. Backend service → Deployments tab
2. Latest deployment → "..." menu → Terminal
3. Run:
```bash
python backend/manage.py migrate
python backend/manage.py createsuperuser
```

### Step 4: Deploy Frontend

1. Railway Dashboard → New → GitHub Repo
2. Select: `YenNhi0511/DoAnPTPMHDT` (SAME REPO!)
3. **IMMEDIATELY go to Settings:**
   - Service Name: Change to `frontend`
   - Root Directory: Set to `frontend`
   - Save
4. Railway will auto-detect Dockerfile and build
5. Wait for deployment (~5-8 minutes)
6. Check logs - should see:
   ```
   Building Docker image
   Step 1: FROM node:18-alpine
   npm ci
   npm run build
   Step 2: FROM nginx:alpine
   Starting nginx
   ```
7. **Generate Domain:**
   - Settings → Networking → Generate Domain
   - Copy URL: `https://frontend-production-xxxx.up.railway.app`

### Step 5: Set Frontend Environment Variable

1. Frontend service → Variables tab
2. Add:
```bash
REACT_APP_API_URL=https://backend-production-xxxx.up.railway.app/api
```
   ⚠️ Replace with YOUR backend URL!
   ⚠️ Must end with `/api`

3. Railway will auto-redeploy frontend (~5 minutes)

### Step 6: Update Backend CORS

1. Go back to Backend service → Variables
2. Add:
```bash
CORS_ALLOWED_ORIGINS=https://frontend-production-xxxx.up.railway.app
```
   ⚠️ Replace with YOUR frontend URL!
   ⚠️ NO trailing slash

3. Wait for backend to redeploy

---

## ✅ Verification Checklist

### Backend:
- [ ] Service name: `backend`
- [ ] Root directory: empty or `/`
- [ ] Status: Active (green)
- [ ] Domain generated
- [ ] Variables set (SECRET_KEY, DEBUG, ALLOWED_HOSTS)
- [ ] DATABASE_URL linked
- [ ] REDIS_URL linked
- [ ] Migrations run
- [ ] Superuser created
- [ ] `/api/` endpoint accessible
- [ ] `/admin/` login works

### Frontend:
- [ ] Service name: `frontend`
- [ ] Root directory: `frontend`
- [ ] Status: Active (green)
- [ ] Domain generated
- [ ] Variable set (REACT_APP_API_URL)
- [ ] Homepage loads
- [ ] No CORS errors in console
- [ ] API calls working

### Cross-Service:
- [ ] CORS_ALLOWED_ORIGINS updated in backend
- [ ] Both services showing Active
- [ ] No deployment errors
- [ ] Can register/login from frontend

---

## 🚨 Common Mistakes to Avoid

❌ **DON'T** set Backend Root Directory to "backend"
✅ **DO** leave it empty or set to "/"

❌ **DON'T** forget to set Frontend Root Directory
✅ **DO** set it to exactly "frontend"

❌ **DON'T** add railway.json at project root
✅ **DO** keep railway.json only in /frontend/

❌ **DON'T** forget to generate SECRET_KEY
✅ **DO** generate a new 50+ character key

❌ **DON'T** set DEBUG=True in production
✅ **DO** set DEBUG=False

❌ **DON'T** use localhost URLs in env vars
✅ **DO** use Railway-generated URLs

---

## 🐛 Troubleshooting

### If Backend fails with "pip: command not found":
- Check Root Directory is empty (not "backend")
- Check nixpacks.toml exists at project root
- Check it's using Nixpacks builder (not Dockerfile)

### If Frontend fails with "Dockerfile not found":
- Check Root Directory is exactly "frontend"
- Check frontend/Dockerfile exists
- Check frontend/railway.json exists

### If Backend builds but crashes:
- Check environment variables are set
- Check DATABASE_URL is linked
- Run migrations in terminal
- Check logs for specific error

### If Frontend can't reach backend:
- Check REACT_APP_API_URL includes /api
- Check backend domain is correct
- Check CORS_ALLOWED_ORIGINS in backend
- Open browser console for CORS errors

---

## 📊 Expected Cost

Railway Hobby Plan ($5/month + $5 usage):
- Backend: ~$2-3/month
- Frontend: ~$1-2/month
- PostgreSQL: ~$1-2/month
- Redis: ~$0.5-1/month
**Total: ~$5-8/month** ✅

---

## 🎉 Success!

If all checkboxes are ticked, your app is deployed!

- Backend API: https://backend-xxx.railway.app/api/
- Frontend App: https://frontend-xxx.railway.app
- Admin Panel: https://backend-xxx.railway.app/admin/

Share these URLs with your team and start using your recruitment system! 🚀
