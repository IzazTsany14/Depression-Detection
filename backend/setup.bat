@echo off
REM Backend Setup Script untuk Windows
REM Jalankan: backend-setup.bat

echo.
echo 🚀 Depression Detection Backend Setup
echo ======================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js tidak terinstall. Silakan install Node.js terlebih dahulu.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js version: %NODE_VERSION%
echo.

REM Navigate to backend folder
cd /d backend

REM Check if pnpm is installed, if not install it
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo Installing pnpm...
    npm install -g pnpm
)

for /f "tokens=*" %%i in ('pnpm --version') do set PNPM_VERSION=%%i
echo ✓ pnpm version: %PNPM_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
pnpm install

echo.
echo ✓ Dependencies installed successfully
echo.

REM Check if .env exists
if not exist .env (
    echo ⚠️  .env file not found. Creating from template...
    (
        echo DATABASE_URL=postgresql://postgres.^<project-ref^>:^<password^>@^<region^>.pooler.supabase.com:6543/postgres
        echo DB_SSL=true
        echo PORT=5000
        echo NODE_ENV=development
        echo JWT_SECRET=your-super-secret-jwt-key
        echo FRONTEND_URL=http://localhost:5173
    ) > .env
    echo ✓ .env created. Please update with your database credentials.
) else (
    echo ✓ .env file already exists
)

echo.
echo ======================================
echo ✅ Setup complete!
echo ======================================
echo.
echo Next steps:
echo 1. Edit backend\.env with your database credentials
echo 2. Run database\supabase-schema.sql in Supabase SQL Editor
echo 3. Run: pnpm dev (development^)
echo 4. Or:  pnpm start (production^)
echo.
echo Server will run at: http://localhost:5000
echo.
pause
