#!/bin/bash

echo "========================================"
echo "  SETUP - Recruitment System"
echo "========================================"
echo

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend Setup
echo -e "${YELLOW}[Backend Setup]${NC}"
cd backend

echo "[1/6] Creating virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create virtual environment"
    exit 1
fi

echo "[2/6] Activating virtual environment..."
source venv/bin/activate

echo "[3/6] Upgrading pip..."
pip install --upgrade pip

echo "[4/6] Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo "[5/6] Creating .env file..."
if [ ! -f .env ]; then
    cat > .env << EOF
SECRET_KEY=django-insecure-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
GEMINI_API_KEY=
EOF
    echo ".env file created! Please edit it with your configuration."
else
    echo ".env file already exists."
fi

echo "[6/6] Running migrations..."
python manage.py migrate
if [ $? -ne 0 ]; then
    echo "WARNING: Migrations failed. Please check your database configuration."
fi

echo
echo -e "${GREEN}Backend setup completed!${NC}"
echo

# Frontend Setup
echo -e "${YELLOW}[Frontend Setup]${NC}"
cd ../frontend

echo "[1/3] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo "[2/3] Creating .env file..."
if [ ! -f .env ]; then
    echo "REACT_APP_API_URL=http://localhost:8000/api" > .env
    echo ".env file created!"
else
    echo ".env file already exists."
fi

echo "[3/3] Frontend setup completed!"
echo

echo "========================================"
echo -e "${GREEN}Setup completed!${NC}"
echo "========================================"
echo
echo "Next steps:"
echo "1. Edit backend/.env with your configuration"
echo "2. Run: cd backend && source venv/bin/activate && python manage.py createsuperuser"
echo "3. Start backend: cd backend && source venv/bin/activate && python manage.py runserver"
echo "4. Start frontend: cd frontend && npm start"
echo

