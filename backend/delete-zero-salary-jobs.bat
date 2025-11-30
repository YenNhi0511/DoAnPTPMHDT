@echo off
echo ========================================
echo XOA CAC CONG VIEC CO LUONG 0 DONG
echo ========================================
echo.

cd /d %~dp0

python manage.py shell < delete_zero_salary_jobs_safe.py

pause

