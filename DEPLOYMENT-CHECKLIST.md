# ✅ Railway Deployment Checklist

## 📋 Pre-Deployment

### Code Preparation
- [x] ✅ Procfile created
- [x] ✅ railway.json created
- [x] ✅ nixpacks.toml created
- [x] ✅ runtime.txt created (Python 3.10.14)
- [x] ✅ requirements.txt updated with gunicorn + whitenoise
- [x] ✅ settings.py updated for production
- [x] ✅ CORS configured
- [x] ✅ Static files configured with WhiteNoise
- [ ] .env file NOT committed (check .gitignore)

### Account Setup
- [ ] Railway account created at https://railway.app
- [ ] GitHub account connected to Railway
- [ ] Railway CLI installed: `npm i -g @railway/cli`

## 🗄️ Database Setup

### PostgreSQL on Railway
- [ ] PostgreSQL plugin added to project
- [ ] DATABASE_URL environment variable auto-generated
- [ ] Database accessible from backend service

### Redis on Railway
- [ ] Redis plugin added to project
- [ ] REDIS_URL environment variable auto-generated
- [ ] Redis accessible for Celery

## 🚀 Backend Deployment

### Railway Service Setup
- [ ] Backend service created from GitHub repo
- [ ] Build successful (check logs)
- [ ] Service running (check health)
- [ ] Public domain generated

### Environment Variables Set
- [ ] SECRET_KEY (generated securely)
- [ ] DEBUG=False
- [ ] ALLOWED_HOSTS (*.railway.app,*.up.railway.app)
- [ ] DATABASE_URL (auto from PostgreSQL)
- [ ] REDIS_URL (auto from Redis)
- [ ] CELERY_BROKER_URL
- [ ] CELERY_RESULT_BACKEND
- [ ] EMAIL_HOST_USER
- [ ] EMAIL_HOST_PASSWORD
- [ ] EMAIL_BACKEND
- [ ] GEMINI_API_KEY
- [ ] FRONTEND_URL (update after frontend deploy)
- [ ] CORS_ALLOWED_ORIGINS (update after frontend deploy)

### Database Migration
- [ ] Run: `railway run python backend/manage.py migrate`
- [ ] Create superuser: `railway run python backend/manage.py createsuperuser`
- [ ] Seed data: `railway run python backend/seed_data.py`

### Backend Testing
- [ ] API accessible: `https://your-backend.up.railway.app/api/`
- [ ] Admin accessible: `https://your-backend.up.railway.app/admin/`
- [ ] Database connected (check Django admin)
- [ ] Static files loading correctly

## 👷 Background Workers

### Celery Worker
- [ ] Worker service created
- [ ] Start command: `cd backend && celery -A recruitment_system worker --loglevel=info --pool=solo`
- [ ] Environment variables copied from backend
- [ ] Worker running (check logs)
- [ ] Test task execution

### Celery Beat (Optional)
- [ ] Beat service created
- [ ] Start command: `cd backend && celery -A recruitment_system beat --loglevel=info`
- [ ] Environment variables copied from backend
- [ ] Beat scheduler running

## 🎨 Frontend Deployment

### Railway Frontend Service Setup
- [ ] Frontend service created from GitHub repo (with frontend/ root directory)
- [ ] Dockerfile detected and used for build
- [ ] Nginx container running
- [ ] Public domain generated
- [ ] Service healthy and running

### Frontend Configuration
- [ ] REACT_APP_API_URL set to backend URL
- [ ] Build successful (check Railway logs)
- [ ] Static files served correctly
- [ ] App accessible at Railway frontend URL
- [ ] API calls working (check browser console)
- [ ] React Router working (all routes accessible)

## 🔧 Final Configuration

### Update Backend for Frontend
- [ ] FRONTEND_URL updated with Railway frontend URL
- [ ] CORS_ALLOWED_ORIGINS includes Railway frontend URL
- [ ] Backend redeployed with new env vars

### Update Frontend for Backend
- [ ] REACT_APP_API_URL points to Railway backend
- [ ] Frontend redeployed (Railway auto-redeploy on env change)

## 🧪 Integration Testing

### Authentication Flow
- [ ] Register new user
- [ ] Verify email received
- [ ] Email verification link works
- [ ] Login successful
- [ ] JWT tokens working

### Core Features
- [ ] Job listing loads
- [ ] Job creation (recruiter)
- [ ] Job application (candidate)
- [ ] CV upload working
- [ ] AI CV screening working (check Celery logs)
- [ ] Notifications working

### Admin Panel
- [ ] Admin login successful
- [ ] User management accessible
- [ ] Company management accessible
- [ ] Job management accessible

## 🔐 Security Checklist

- [ ] DEBUG=False in production
- [ ] SECRET_KEY is strong and unique
- [ ] No sensitive data in GitHub repo
- [ ] .env file in .gitignore
- [ ] ALLOWED_HOSTS properly configured
- [ ] CORS_ALLOWED_ORIGINS restricted to your domains
- [ ] Database requires SSL
- [ ] Email using app password (not real password)
- [ ] HTTPS enabled (Railway/Vercel auto)

## 📊 Monitoring Setup

### Railway Monitoring
- [ ] Check Metrics tab for CPU/Memory usage
- [ ] Monitor Logs tab for errors
- [ ] Set up alerts (if needed)

### Application Monitoring
- [ ] Test all critical endpoints
- [ ] Check Celery worker status
- [ ] Monitor email delivery
- [ ] Check AI API usage (Gemini)

## 📝 Documentation

- [ ] Production URLs documented
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Rollback procedure documented
- [ ] Team members have access

## 🆘 Troubleshooting Verified

- [ ] Database connection tested
- [ ] Redis connection tested
- [ ] Static files serving correctly
- [ ] Media files upload working
- [ ] Celery tasks executing
- [ ] Email sending working
- [ ] CORS issues resolved

## 💾 Backup Plan

- [ ] Database backup strategy defined
- [ ] Railway automatic backups enabled
- [ ] Local database dump available
- [ ] Code in version control (Git)
- [ ] Environment variables backup stored securely

## 🎉 Launch Checklist

- [ ] All services green/healthy
- [ ] No critical errors in logs
- [ ] Performance acceptable
- [ ] Users can register and login
- [ ] Core workflows tested end-to-end
- [ ] Team notified of launch
- [ ] Documentation shared

## 📱 Post-Launch

- [ ] Monitor logs for 24 hours
- [ ] Check error rates
- [ ] User feedback collected
- [ ] Performance metrics tracked
- [ ] Scaling plan ready if needed

---

## 🔗 Quick Links

- Railway Dashboard: https://railway.app/dashboard
- Backend URL: `https://_____.up.railway.app`
- Frontend URL: `https://_____.up.railway.app`
- Admin Panel: `https://_____.up.railway.app/admin`
- All services in one place! 🎉

## 📞 Support

- Railway Docs: https://docs.railway.app
- Railway Templates: https://railway.app/templates
- Django Deployment: https://docs.djangoproject.com/en/5.0/howto/deployment/
- Docker on Railway: https://docs.railway.app/deploy/dockerfiles

---

**Last Updated**: December 8, 2025
**Deployment Status**: ⏳ Pending / ✅ Complete
