@echo off
echo ========================================
echo   CAP NHAT CODE SAU KHI PULL TU GITHUB
echo ========================================
echo.

echo [1/5] Cap nhat Backend dependencies...
cd backend
call venv\Scripts\activate
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo LOI: Khong the cai dat backend dependencies!
    pause
    exit /b 1
)
echo ✓ Backend dependencies da duoc cap nhat
echo.

echo [2/5] Chay migrations...
python manage.py migrate
if %errorlevel% neq 0 (
    echo CANH BAO: Co the co loi migrations, kiem tra lai!
)
echo ✓ Migrations da duoc chay
echo.

echo [3/5] Cap nhat Frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo LOI: Khong the cai dat frontend dependencies!
    pause
    exit /b 1
)
echo ✓ Frontend dependencies da duoc cap nhat
echo.

echo [4/5] Kiem tra file .env...
cd ..\backend
if not exist .env (
    echo CANH BAO: File .env khong ton tai!
    echo Vui long tao file .env trong thu muc backend
    echo Xem HUONG-DAN-CAI-DAT.md de biet chi tiet
) else (
    echo ✓ File .env da ton tai
)
echo.

echo [5/5] Kiem tra database connection...
python check_database_connection.py
if %errorlevel% neq 0 (
    echo CANH BAO: Co the co van de voi database!
    echo Kiem tra lai DATABASE_URL trong file .env
)
echo.

echo ========================================
echo   CAP NHAT HOAN TAT!
echo ========================================
echo.
echo Ban co the chay project bang cac lenh sau:
echo.
echo Backend:  cd backend ^&^& venv\Scripts\activate ^&^& python manage.py runserver
echo Frontend: cd frontend ^&^& npm start
echo.
echo Hoac su dung cac file .bat co san:
echo - start-admin.bat
echo - start-candidate.bat
echo - start-recruiter.bat
echo - start-all-roles.bat
echo.
pause

