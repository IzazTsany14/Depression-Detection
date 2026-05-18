#!/bin/bash
# Backend Setup Script untuk Linux/Mac
# Jalankan: bash backend-setup.sh

echo "🚀 Depression Detection Backend Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak terinstall. Silakan install Node.js terlebih dahulu."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Navigate to backend folder
cd backend

# Check if npm/pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

echo "✓ pnpm version: $(pnpm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "✓ Dependencies installed successfully"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@<region>.pooler.supabase.com:6543/postgres
DB_SSL=true
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:5173
EOF
    echo "✓ .env created. Please update with your database credentials."
else
    echo "✓ .env file already exists"
fi

echo ""
echo "======================================"
echo "✅ Setup complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your database credentials"
echo "2. Run database/supabase-schema.sql in Supabase SQL Editor"
echo "3. Run: pnpm dev (development)"
echo "4. Or:  pnpm start (production)"
echo ""
echo "Server will run at: http://localhost:5000"
echo ""
