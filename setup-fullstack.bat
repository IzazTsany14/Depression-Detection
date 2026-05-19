@echo off
REM Depression Detection Fullstack - Quick Setup Script for Windows
REM Run this file untuk auto-setup backend dan frontend

setlocal enabledelayedexpansion
cls

echo.
echo ========================================
echo Depression Detection - Fullstack Setup
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js v18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [1/5] Node.js found: 
node --version

REM Check pnpm
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo [2/5] pnpm not found, installing globally...
    npm install -g pnpm
) else (
    echo [2/5] pnpm found:
    pnpm --version
)

echo.
echo [3/5] Setup Backend...
cd /d backend
if exist package.json (
    echo Installing backend dependencies...
    call pnpm install
    if errorlevel 1 (
        echo ERROR: Backend installation failed
        pause
        exit /b 1
    )
    echo Backend installation complete!
) else (
    echo ERROR: backend/package.json not found
    cd /d ..
    pause
    exit /b 1
)

REM Check .env exists
if not exist .env (
    echo.
    echo WARNING: .env file not found!
    echo Creating .env template...
    (
        echo DB_HOST=localhost
        echo DB_PORT=3306
        echo DB_USER=root
        echo DB_PASSWORD=
        echo DB_NAME=depresi
        echo PORT=5000
        echo NODE_ENV=development
        echo JWT_SECRET=your-secret-key
        echo FRONTEND_URL=http://localhost:5173
    ) > .env
    echo .env created. Please edit with your MySQL credentials.
)

cd /d ..

echo.
echo [4/5] Setup Frontend...
if exist package.json (
    echo Installing frontend dependencies...
    call pnpm install
    if errorlevel 1 (
        echo ERROR: Frontend installation failed
        pause
        exit /b 1
    )
    echo Frontend installation complete!
) else (
    echo ERROR: package.json not found in root
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Edit backend\.env with your MySQL credentials:
echo    - DB_PASSWORD: your MySQL password
echo.
echo 2. Import database schema:
echo    mysql -u root -p ^< database\depresi.sql
echo.
echo 3. Start Backend (Terminal 1):
echo    cd backend
echo    pnpm dev
echo.
echo 4. Start Frontend (Terminal 2):
echo    pnpm dev
echo.
echo 5. Open browser:
echo    http://localhost:5173
echo.
echo Documentation:
echo - FULLSTACK_SETUP.md - Complete setup guide
echo - MYSQL_SETUP.md - MySQL configuration
echo.
pause
