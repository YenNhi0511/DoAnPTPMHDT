web: cd backend && gunicorn recruitment_system.wsgi --bind 0.0.0.0:$PORT
worker: cd backend && celery -A recruitment_system worker --loglevel=info --pool=solo
beat: cd backend && celery -A recruitment_system beat --loglevel=info
