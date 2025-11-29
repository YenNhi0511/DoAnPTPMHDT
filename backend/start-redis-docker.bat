@echo off
echo ========================================
echo Starting Redis with Docker
echo ========================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Redis container exists
docker ps -a | findstr redis >nul 2>&1
if errorlevel 1 (
    echo Creating new Redis container...
    docker run -d -p 6379:6379 --name redis redis:latest
) else (
    echo Starting existing Redis container...
    docker start redis
)

echo.
echo ========================================
echo Redis is running on port 6379
echo ========================================
echo.
echo To stop Redis, run: docker stop redis
echo To view logs, run: docker logs redis
echo.
pause

