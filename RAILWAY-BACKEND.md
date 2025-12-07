# Backend Configuration for Railway (Root Directory Build)
# This file is detected when Root Directory = "/" (project root)

# IMPORTANT: Railway will auto-detect Python/Django and use Nixpacks
# No need to specify build commands - Nixpacks handles everything

# Environment Variables Required:
# - SECRET_KEY (generate new)
# - DEBUG=False
# - ALLOWED_HOSTS=.railway.app,.up.railway.app
# - DATABASE_URL (auto-injected from PostgreSQL service)
# - REDIS_URL (auto-injected from Redis service)

# Procfile defines the processes to run
# See: Procfile in root directory
