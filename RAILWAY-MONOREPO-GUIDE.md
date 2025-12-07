# Railway Monorepo Configuration Guide

## Problem
You're deploying 2 services (Backend + Frontend) from the SAME GitHub repository.
Railway gets confused because each service needs different build configuration.

## Solution: Use Root Directory + Service-Specific Config

### Backend Service Configuration:

**In Railway Dashboard:**
1. Service: DoAnPTPMHDTbackend
2. Settings → Source → Root Directory: **LEAVE EMPTY** or set to `/`
3. Settings → Build: Auto (will detect Nixpacks)

**Files used:**
- `/Procfile` - Defines web, worker, beat processes
- `/nixpacks.toml` - Nixpacks configuration
- `/runtime.txt` - Python version
- `/backend/requirements.txt` - Python dependencies

**Build will:**
```bash
cd backend
pip install -r requirements.txt
python manage.py collectstatic --noinput
gunicorn recruitment_system.wsgi --bind 0.0.0.0:$PORT
```

---

### Frontend Service Configuration:

**In Railway Dashboard:**
1. Service: DoAnPTPMHDT-frontend
2. Settings → Source → Root Directory: **`frontend`** (no leading slash!)
3. Settings → Build: Auto (will detect Dockerfile)

**Files used:**
- `/frontend/Dockerfile` - Multi-stage Docker build
- `/frontend/railway.json` - Specifies Dockerfile builder
- `/frontend/nginx.conf` - Nginx configuration
- `/frontend/package.json` - Node dependencies

**Build will:**
```bash
# Stage 1: Build React app
npm ci
npm run build

# Stage 2: Serve with Nginx
nginx -g 'daemon off;'
```

---

## Important Notes:

1. **NEVER put railway.json at root** - It conflicts with frontend config
2. **Root Directory is KEY** - Backend = empty, Frontend = "frontend"
3. **Each service deploys from same repo** but different root directories
4. **Railway will auto-detect** the right builder based on Root Directory

---

## If Services Still Fail:

### Option A: Redeploy Both Services
1. Delete both services in Railway
2. Create Backend service first:
   - Add from GitHub
   - Root Directory: empty
   - Let it build
3. Create Frontend service:
   - Add from GitHub (same repo)
   - Root Directory: `frontend`
   - Let it build

### Option B: Force Specific Builder
**Backend service settings:**
- Settings → Build Command: `cd backend && pip install -r requirements.txt`
- Settings → Start Command: `cd backend && gunicorn recruitment_system.wsgi --bind 0.0.0.0:$PORT`

**Frontend service settings:**
- Settings → Builder: Docker
- Settings → Dockerfile Path: `Dockerfile` (Railway will look in /frontend/)

---

## Current Project Structure:

```
DoAnPTPMHDT/
├── Procfile                    ← Backend: Gunicorn start command
├── nixpacks.toml              ← Backend: Nixpacks build config
├── runtime.txt                ← Backend: Python version
├── backend/
│   ├── requirements.txt       ← Backend: Dependencies
│   ├── manage.py
│   └── recruitment_system/
│       └── settings.py
└── frontend/
    ├── Dockerfile             ← Frontend: Docker build
    ├── railway.json           ← Frontend: Force Docker builder
    ├── nginx.conf             ← Frontend: Nginx config
    └── package.json           ← Frontend: Node dependencies
```

---

## Environment Variables Needed:

### Backend:
```
SECRET_KEY=<generate-new>
DEBUG=False
ALLOWED_HOSTS=.railway.app,.up.railway.app
DATABASE_URL=<auto-from-postgresql>
REDIS_URL=<auto-from-redis>
CORS_ALLOWED_ORIGINS=<frontend-url>
```

### Frontend:
```
REACT_APP_API_URL=<backend-url>/api
```

---

## Build Status Check:

✅ Backend should show:
- Builder: Nixpacks
- Build time: ~2-5 minutes
- Start command from Procfile

✅ Frontend should show:
- Builder: Dockerfile
- Build time: ~5-8 minutes
- Nginx serving on port 80

