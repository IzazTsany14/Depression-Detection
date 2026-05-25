#!/bin/bash
# Backend Setup Verification Script
# Run this to verify backend is properly configured

echo "🔍 Depression Detection Backend - Setup Verification"
echo "======================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "Checking prerequisites..."
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓${NC} Node.js $(node --version)"
else
    echo -e "${RED}✗${NC} Node.js not found"
    exit 1
fi

# Check npm/pnpm
if command -v pnpm &> /dev/null; then
    echo -e "${GREEN}✓${NC} pnpm $(pnpm --version)"
elif command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠${NC} npm $(npm --version) (consider using pnpm)"
else
    echo -e "${RED}✗${NC} npm/pnpm not found"
    exit 1
fi

echo ""
echo "Checking backend structure..."

# Check required files
FILES=(
    "src/server.js"
    "src/app.js"
    "src/config/db.js"
    "src/controllers/authController.js"
    "src/controllers/testController.js"
    "src/middleware/authMiddleware.js"
    "src/routes/authRoutes.js"
    "src/routes/testRoutes.js"
    "src/services/dassScoringService.js"
    "package.json"
    ".env"
)

MISSING=0
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (MISSING)"
        MISSING=$((MISSING + 1))
    fi
done

echo ""
if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✓ All backend files present${NC}"
else
    echo -e "${RED}✗ Missing $MISSING files${NC}"
fi

# Check dependencies
echo ""
echo "Checking dependencies in package.json..."
if grep -q "express" package.json; then
    echo -e "${GREEN}✓${NC} express"
fi
if grep -q "\"pg\"" package.json; then
    echo -e "${GREEN}✓${NC} pg"
fi
if grep -q "jsonwebtoken" package.json; then
    echo -e "${GREEN}✓${NC} jsonwebtoken"
fi
if grep -q "cors" package.json; then
    echo -e "${GREEN}✓${NC} cors"
fi
if grep -q "dotenv" package.json; then
    echo -e "${GREEN}✓${NC} dotenv"
fi

# Check .env
echo ""
echo "Checking .env configuration..."
if grep -q "DATABASE_URL" .env; then
    echo -e "${GREEN}✓${NC} Supabase PostgreSQL database configured"
fi
if grep -q "JWT_SECRET" .env; then
    echo -e "${GREEN}✓${NC} JWT_SECRET configured"
fi

# Check node_modules
echo ""
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules installed"
else
    echo -e "${YELLOW}⚠${NC} node_modules not found (run: pnpm install)"
fi

echo ""
echo "======================================================"
echo "✅ Backend verification complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your Supabase DATABASE_URL"
echo "2. Run database/supabase-schema.sql in Supabase SQL Editor"
echo "3. Run: pnpm install (if not done yet)"
echo "4. Run: pnpm dev"
echo ""
