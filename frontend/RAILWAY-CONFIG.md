# Frontend Service Configuration

## Railway Settings:
- **Root Directory**: `frontend`
- **Builder**: Dockerfile

## Files Used:
- `frontend/Dockerfile` - Multi-stage Docker build
- `frontend/railway.json` - Force Dockerfile builder
- `frontend/nginx.conf` - Nginx configuration
- `frontend/package.json` - Node dependencies

## Environment Variables Required:
```bash
REACT_APP_API_URL=<backend-url>/api
```
⚠️ Must include `/api` at the end!

## Build Process:
1. Stage 1: Build React app with Node.js
   - `npm ci`
   - `npm run build`
2. Stage 2: Serve with Nginx
   - Copy build files to /usr/share/nginx/html
   - Start nginx

## Verify:
- Check logs for "Starting nginx"
- Test homepage loads
- Check browser console for no CORS errors
- Test API calls in Network tab
