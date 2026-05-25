#!/bin/bash
# Depression Detection Fullstack - Quick Setup Script for Mac/Linux

echo ""
echo "========================================"
echo "Depression Detection - Fullstack Setup"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js v18+ from https://nodejs.org"
    exit 1
fi

echo "[1/5] Node.js found:"
node --version

# Check/Install pnpm
if ! command -v pnpm &> /dev/null; then
    echo "[2/5] pnpm not found, installing globally..."
    npm install -g pnpm
else
    echo "[2/5] pnpm found:"
    pnpm --version
fi

echo ""
echo "[3/5] Setup Backend..."
cd backend

if [ -f "package.json" ]; then
    echo "Installing backend dependencies..."
    pnpm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Backend installation failed"
        exit 1
    fi
    echo "Backend installation complete!"
else
    echo "ERROR: backend/package.json not found"
    cd ..
    exit 1
fi

# Check .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "WARNING: .env file not found!"
    echo "Creating .env template..."
    cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres.your-project-ref:your_database_password@aws-0-your-region.pooler.supabase.com:6543/postgres?sslmode=require
DB_SSL=true
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
EOF
    echo ".env created. Please edit with your Supabase DATABASE_URL."
fi

cd ..

echo ""
echo "[4/5] Setup Frontend..."
if [ -f "package.json" ]; then
    echo "Installing frontend dependencies..."
    pnpm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Frontend installation failed"
        exit 1
    fi
    echo "Frontend installation complete!"
else
    echo "ERROR: package.json not found in root"
    exit 1
fi

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Edit .env with your Supabase DATABASE_URL"
echo ""
echo "2. Run database/supabase-schema.sql in Supabase SQL Editor"
echo ""
echo "3. Start Backend (Terminal 1):"
echo "   cd backend"
echo "   pnpm dev"
echo ""
echo "4. Start Frontend (Terminal 2):"
echo "   pnpm dev"
echo ""
echo "5. Open browser:"
echo "   http://localhost:5173"
echo ""
echo "Documentation:"
echo "- FULLSTACK_SETUP.md - Complete setup guide"
echo "- database/supabase-schema.sql - Supabase PostgreSQL schema"
echo ""
