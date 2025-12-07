# Backend Service Configuration

## Railway Settings:
- **Root Directory**: `backend`
- **Builder**: Auto-detect (Nixpacks)

## Files Used:
- `backend/nixpacks.toml` - Build configuration
- `backend/Procfile` - Start command
- `backend/requirements.txt` - Python dependencies
- `backend/manage.py` - Django entry point

## Environment Variables Required:
```bash
SECRET_KEY=<generate-new-50-char-token>
DEBUG=False
ALLOWED_HOSTS=.railway.app,.up.railway.app
DATABASE_URL=<reference:Postgres.DATABASE_URL>
REDIS_URL=<reference:Redis.REDIS_URL>
CORS_ALLOWED_ORIGINS=<frontend-url-after-deploy>
```

## Build Process:
1. Nixpacks detects Python project
2. `pip install -r requirements.txt`
3. `python manage.py collectstatic --noinput`
4. Start: `gunicorn recruitment_system.wsgi --bind 0.0.0.0:$PORT`

## Verify:
- Check logs for "Starting gunicorn"
- Test API: https://backend-xxx.railway.app/api/
- Test Admin: https://backend-xxx.railway.app/admin/
