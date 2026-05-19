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
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=depresi
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
EOF
    echo ".env created. Please edit with your MySQL credentials."
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
echo "1. Edit backend/.env with your MySQL credentials:"
echo "   - DB_PASSWORD: your MySQL password"
echo ""
echo "2. Import database schema:"
echo "   mysql -u root -p < database/depresi.sql"
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
echo "- MYSQL_SETUP.md - MySQL configuration"
echo ""
