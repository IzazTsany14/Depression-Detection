# Quick Start Guide - Backend Setup

## Prerequisites
- Node.js v18+ 
- MySQL Server (sudah berjalan)
- Database `depresi` sudah dibuat (dari `database/depresi.sql`)

## Setup Steps

### 1. Navigate ke Backend Folder
```bash
cd depression-detection/backend
```

### 2. Install Dependencies
```bash
pnpm install
# atau: npm install
# atau: yarn install
```

Ini akan menginstall:
```
✓ express v4.18.2
✓ mysql2 v3.6.5
✓ dotenv v16.3.1
✓ jsonwebtoken v9.1.2
✓ bcryptjs v2.4.3
✓ cors v2.8.5
✓ uuid v9.0.0
✓ nodemon v3.0.2 (dev)
```

### 3. Configure .env File

Edit `backend/.env`:

```env
# REQUIRED - Sesuaikan dengan setup MySQL Anda
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=depresi

# Optional - Gunakan default jika tidak ada perubahan
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:5173
```

### 4. Verify Database Connection

Pastikan database `depresi` sudah ada dan tabel sudah dibuat:

```bash
mysql -u root -p depresi
# Cek tabel:
SHOW TABLES;
# Seharusnya ada: accounts, students, bk_staff, admins, test_results
```

### 5. Start Server

**Development (dengan auto-reload):**
```bash
pnpm dev
```

**Production:**
```bash
pnpm start
```

Seharusnya Anda lihat:
```
==================================================
🚀 Depression Detection API Server
==================================================
✓ Environment: development
✓ Port: 5000
✓ URL: http://localhost:5000
==================================================
```

### 6. Test API

Buka browser atau gunakan Postman:

```
GET http://localhost:5000/api/health
```

Seharusnya response:
```json
{
  "message": "Server is running",
  "timestamp": "2024-05-02T10:30:00.000Z"
}
```

## Backend Folder Structure

```
backend/
├── src/
│   ├── app.js                    # Express configuration
│   ├── server.js                 # Entry point (npm start)
│   ├── config/
│   │   └── db.js                 # MySQL connection pool
│   ├── controllers/              # Business logic
│   │   ├── authController.js
│   │   └── testController.js
│   ├── middleware/               # Request handlers
│   │   └── authMiddleware.js
│   ├── routes/                   # API endpoints
│   │   ├── authRoutes.js
│   │   └── testRoutes.js
│   └── services/                 # Utilities
│       └── fuzzyService.js       # DASS-21 Fuzzy Logic
├── .env                          # Environment variables
├── package.json                  # Dependencies
└── API_DOCUMENTATION.md          # Full API docs
```

## Available Scripts

```bash
# Development dengan auto-reload
pnpm dev

# Production start
pnpm start

# Run tests (belum dikonfigurasi)
pnpm test
```

## Quick API Testing

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

Copy token dari response untuk step berikutnya.

### 3. Submit Test
```bash
curl -X POST http://localhost:5000/api/tests/submit \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "answers": [0,1,2,0,1,1,0,2,1,0,1,2,0,1,0,1,2,0,1,0,1]
  }'
```

### 4. Get Test Results
```bash
curl http://localhost:5000/api/tests/student/1
```

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| DB_HOST | MySQL server hostname | localhost |
| DB_USER | MySQL username | root |
| DB_PASSWORD | MySQL password | password123 |
| DB_NAME | Database name | depresi |
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development / production |
| JWT_SECRET | Secret untuk sign JWT token | my-secret-123 |
| FRONTEND_URL | Frontend origin untuk CORS | http://localhost:5173 |

## File Descriptions

### Core Files
- **src/server.js** - Entry point, mulai server di port 5000
- **src/app.js** - Express app setup, middleware, routes

### Controllers
- **authController.js** - Login, register, logout logic
- **testController.js** - CRUD untuk test results

### Services
- **fuzzyService.js** - DASS-21 scoring dan fuzzy logic calculation

### Middleware
- **authMiddleware.js** - JWT verification, role authorization

### Routes
- **authRoutes.js** - `/api/auth/*` endpoints
- **testRoutes.js** - `/api/tests/*` endpoints

### Config
- **db.js** - MySQL connection pool setup

## Common Issues & Solutions

### Issue: "Cannot find module 'express'"
```bash
# Solution: Install dependencies
pnpm install
```

### Issue: "ECONNREFUSED: Connection refused"
```bash
# Solution: Database tidak running
# Start MySQL service di Windows: net start MySQL80
# atau buka MySQL Workbench
```

### Issue: "Access denied for user 'root'"
```bash
# Solution: Update DB_PASSWORD di .env dengan password yang benar
```

### Issue: "CORS policy" error
```bash
# Solution: Frontend URL sudah ditambahkan ke CORS whitelist di app.js
```

## Next Steps

1. ✅ Backend running
2. → Integrate dengan frontend React
3. → Setup authentication context
4. → Build UI untuk test submission
5. → Test end-to-end flow

## Support

Untuk error details, lihat:
- Console output di terminal (development logs)
- Browser DevTools Network tab (request/response)
- MySQL error log (database issues)

## Need Help?

Refer ke [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) untuk endpoint details.
