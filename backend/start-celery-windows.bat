@echo off
echo ========================================
echo Starting Celery Worker (Windows)
echo ========================================
echo.
echo Using solo pool (Windows compatible)
echo.

REM Activate virtual environment if exists
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
)

REM Start Celery with solo pool for Windows
celery -A recruitment_system worker -l info --pool=solo

pause

