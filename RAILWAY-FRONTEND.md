# Frontend Configuration for Railway (Frontend Directory Build)
# This file is detected when Root Directory = "frontend"

# Railway will use Dockerfile in frontend/ directory
# Build: Multi-stage Docker (Node.js build → Nginx serve)

# Configuration file: frontend/railway.json
# Dockerfile: frontend/Dockerfile
# Nginx config: frontend/nginx.conf

# Environment Variable Required:
# - REACT_APP_API_URL=https://backend-xxx.up.railway.app/api

# Make sure to set Root Directory = "frontend" in Railway Settings!
