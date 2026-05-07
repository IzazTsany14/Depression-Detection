# 🏥 Depression Detection System - Complete Backend Setup

Selamat! Anda sudah membuat backend yang lengkap dan siap diintegrasikan dengan frontend React. Berikut adalah ringkasan lengkap dari apa yang telah dibuat.

## 📊 Project Structure

```
depression-detection/
├── frontend/                           # React aplikasi (sudah ada)
│   ├── src/
│   ├── vite.config.ts
│   └── package.json
│
├── database/
│   └── depresi.sql                    # SQL schema (sudah ada)
│
├── backend/                           # ✨ NEW - Backend yang baru dibuat
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # MySQL connection pool
│   │   ├── controllers/
│   │   │   ├── authController.js      # Login/Register logic
│   │   │   └── testController.js      # Test CRUD operations
│   │   ├── middleware/
│   │   │   └── authMiddleware.js      # JWT & Role validation
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── testRoutes.js
│   │   ├── services/
│   │   │   └── fuzzyService.js        # Fuzzy Logic calculation
│   │   ├── app.js                     # Express setup
│   │   └── server.js                  # Entry point
│   ├── .env                           # Environment variables
│   ├── .gitignore
│   ├── package.json                   # Dependencies
│   ├── BACKEND_SETUP.md               # Setup instructions
│   └── API_DOCUMENTATION.md           # Full API docs
│
└── INTEGRATION_GUIDE.md               # Frontend-Backend integration
```

## 🚀 Quick Start

### 1. Instalasi Backend

```bash
cd depression-detection/backend
pnpm install
```

### 2. Konfigurasi Environment

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=depresi
PORT=5000
JWT_SECRET=your-secret-key
```

### 3. Jalankan Backend

```bash
pnpm dev
# Server running di http://localhost:5000
```

### 4. Jalankan Frontend (di terminal baru)

```bash
pnpm dev
# Frontend running di http://localhost:5173
```

## 📋 Apa yang Telah Dibuat?

### Backend Files (7 file utama)

✅ **Database Layer**
- `src/config/db.js` - MySQL connection pool dengan async support

✅ **Business Logic**
- `src/services/fuzzyService.js` - Implementasi Fuzzy Logic dari TypeScript ke JavaScript
  - `calculateDepressionScore()` - Hitung skor dari 21 jawaban
  - `getDepressionLevel()` - Tentukan level (Normal/Ringan/Sedang/Parah/Sangat Parah)
  - `calculateFuzzy()` - Kombinasi scoring dan membership functions

✅ **Controllers (Request Handlers)**
- `src/controllers/authController.js`
  - `login()` - Login dengan email & password
  - `register()` - Registrasi user baru
  - `logout()` - Logout
  - `getCurrentUser()` - Get user info dari token

- `src/controllers/testController.js`
  - `submitTest()` - Submit 21 jawaban DASS-21
  - `getTestsByStudent()` - Ambil semua test untuk student
  - `getTestDetail()` - Ambil detail satu test
  - `getTestStatistics()` - Statistik test student
  - `deleteTest()` - Hapus test

✅ **Middleware (Security & Validation)**
- `src/middleware/authMiddleware.js`
  - `verifyToken()` - Validasi JWT token
  - `authorizeRole()` - Cek role user (student/bk/admin)
  - `errorHandler()` - Centralized error handling

✅ **Routes (API Endpoints)**
- `src/routes/authRoutes.js`
  - POST `/api/auth/register` - Register user
  - POST `/api/auth/login` - Login
  - POST `/api/auth/logout` - Logout
  - GET `/api/auth/me` - Get current user

- `src/routes/testRoutes.js`
  - POST `/api/tests/submit` - Submit test
  - GET `/api/tests/student/:id` - Get student tests
  - GET `/api/tests/detail/:id` - Get test detail
  - GET `/api/tests/statistics/:id` - Get statistics
  - DELETE `/api/tests/:id` - Delete test

✅ **Main Application Files**
- `src/app.js` - Express setup dengan CORS, middleware, routes
- `src/server.js` - Entry point, graceful shutdown

✅ **Configuration**
- `package.json` - All dependencies listed
- `.env` - Environment variables template
- `.gitignore` - Files to ignore in git

### Documentation Files

📖 **Setup Instructions**
- `BACKEND_SETUP.md` - Step-by-step backend setup
- `API_DOCUMENTATION.md` - Complete API reference dengan contoh
- `INTEGRATION_GUIDE.md` - Frontend-Backend integration guide

## 🔌 API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register user baru |
| `/api/auth/login` | POST | Login dengan email/password |
| `/api/auth/me` | GET | Get current user (perlu token) |
| `/api/auth/logout` | POST | Logout |
| `/api/tests/submit` | POST | Submit test (21 jawaban) |
| `/api/tests/student/:id` | GET | Get all tests for student |
| `/api/tests/detail/:id` | GET | Get test detail |
| `/api/tests/statistics/:id` | GET | Get test statistics |
| `/api/tests/:id` | DELETE | Delete test |
| `/api/health` | GET | Health check |

## 🔐 Security Features

✅ **JWT Authentication**
- Token-based authentication
- 24-hour expiry
- Secure secret management

✅ **Role-Based Access Control**
- student, bk (BK Staff), admin roles
- Middleware untuk authorize role tertentu

✅ **Input Validation**
- Validate email & password
- Validate 21 answers (0-3 range)
- JSON format validation di database

✅ **Database Security**
- Connection pooling untuk efficiency
- Parameterized queries untuk prevent SQL injection
- Password field untuk hash (ready for bcryptjs)

## 📚 Key Technologies Used

```json
{
  "runtime": "Node.js v18+",
  "framework": "Express 4.18.2",
  "database": "MySQL 8.0+ dengan mysql2/promise",
  "authentication": "JWT (jsonwebtoken)",
  "security": "CORS, bcryptjs-ready",
  "utilities": "uuid untuk unique IDs, dotenv untuk config",
  "development": "nodemon untuk auto-reload"
}
```

## 🔄 Data Flow

```
User Input (React)
      ↓
API Request + Token (HTTP)
      ↓
Backend: Middleware (verify JWT)
      ↓
Backend: Route → Controller
      ↓
Backend: Service (Fuzzy Logic calculation)
      ↓
Backend: Database (MySQL)
      ↓
Response (JSON)
      ↓
Frontend: Update UI
```

## 📝 Database Tables

Backend ini menggunakan 5 tabel yang sudah ada di `depresi.sql`:

- **accounts** - Autentikasi user (email, password, role)
- **students** - Profil student
- **bk_staff** - Profil BK staff
- **admins** - Profil admin
- **test_results** - Hasil tes DASS-21 (score, level, answers JSON)

## ✨ Special Features

### Fuzzy Logic Implementation
Backend sudah mengimplementasikan fuzzy logic dari frontend:
- 5 membership functions (Normal, Ringan, Sedang, Parah, Sangat Parah)
- Smooth transition antar level
- Weighted fuzzy scoring

### Clean Code Practices
- Modular structure (separation of concerns)
- Detailed comments pada setiap function
- Consistent error handling
- Request logging untuk debugging

### Production Ready
- Environment variable configuration
- Graceful shutdown handling
- CORS configuration
- Error middleware centralization
- Connection pooling for database

## 🎯 Next Steps

1. **Setup Backend** (sekarang)
   - [x] Create folder structure
   - [x] Create all files
   - [ ] Run `pnpm install`
   - [ ] Configure `.env`
   - [ ] Run `pnpm dev`

2. **Integrate dengan Frontend** (lihat INTEGRATION_GUIDE.md)
   - Update AuthContext.tsx
   - Create API service utilities
   - Update login/register pages
   - Update test submission page
   - Setup protected routes

3. **Test End-to-End**
   - Register user
   - Login dan dapat token
   - Submit test
   - View results
   - Logout

4. **Production Deploy**
   - Setup SSL certificate
   - Configure database backup
   - Setup monitoring
   - Deploy backend (Heroku, AWS, Digital Ocean, etc)
   - Deploy frontend (Vercel, Netlify, etc)

## 📞 Troubleshooting

### Backend won't start?
```bash
# Check if port 5000 is free
netstat -ano | findstr :5000

# Try different port
PORT=5001 pnpm dev
```

### Database connection error?
```bash
# Verify MySQL is running
# Check .env file DB credentials
# Make sure database 'depresi' exists
```

### Frontend CORS error?
```bash
# Backend harus running di port 5000
# Frontend di port 5173
# Cek CORS configuration di app.js
```

## 📖 Documentation

Baca dokumentasi lengkap di:
- `backend/BACKEND_SETUP.md` - Setup instructions
- `backend/API_DOCUMENTATION.md` - API reference
- `INTEGRATION_GUIDE.md` - Frontend integration

## 🎓 Learning Resources

Backend ini menggunakan best practices dari:
- RESTful API design
- Node.js async/await patterns
- Express middleware patterns
- Fuzzy logic system implementation
- JWT authentication
- Role-based access control

## ✅ Checklist

- [ ] Backend folder structure created
- [ ] All files created successfully
- [ ] Dependencies defined in package.json
- [ ] .env template created
- [ ] Database schema ready (depresi.sql)
- [ ] Documentation complete
- [ ] Ready for `pnpm install`
- [ ] Ready for first test run

## 🎉 Congratulations!

Anda sudah memiliki:
✅ Fullstack Depression Detection System dengan:
- React Frontend
- Node.js Backend dengan Express
- MySQL Database
- JWT Authentication
- Fuzzy Logic Implementation
- Complete Documentation

Sekarang silakan jalankan `pnpm install` di folder backend dan mulai development! 🚀

---

*Created: May 2, 2026*
*Version: 1.0.0*
*Status: Ready for Development*
