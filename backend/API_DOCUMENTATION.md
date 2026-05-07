# Backend API Documentation

## Struktur Backend

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Konfigurasi MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js     # Logika login & register
│   │   └── testController.js     # CRUD test results (DASS-21)
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification & role authorization
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── testRoutes.js         # Test endpoints
│   ├── services/
│   │   └── fuzzyService.js       # Fuzzy Logic calculation
│   ├── app.js                    # Express setup
│   └── server.js                 # Entry point
├── .env                          # Environment variables
└── package.json                  # Dependencies
```

## Setup Instructions

### 1. Instalasi Dependencies

```bash
cd backend
pnpm install
# atau npm install
```

Packages yang diinstall:
- **express** - Web framework
- **mysql2** - MySQL connector dengan async support
- **jsonwebtoken** - JWT token generation
- **bcryptjs** - Password hashing
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables
- **uuid** - Unique ID generation
- **nodemon** - Development auto-restart (devDependencies)

### 2. Konfigurasi Environment Variables

Edit file `.env` di folder backend:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=depresi

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Pastikan Database Sudah Dibuat

Jalankan script SQL (file `database/depresi.sql`) di MySQL:

```bash
mysql -u root -p < database/depresi.sql
```

### 4. Jalankan Server

**Development (dengan auto-reload):**
```bash
pnpm dev
# atau npm run dev
```

**Production:**
```bash
pnpm start
# atau npm start
```

Server akan running di `http://localhost:5000`

---

## API Endpoints

### 1. Authentication (`/api/auth`)

#### Register User
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "role": "student"  // optional, default: "student"
}

Response:
{
  "message": "Registrasi berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "student"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "student"
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "student"
  }
}
```

#### Logout
```
POST /api/auth/logout

Response:
{
  "message": "Logout berhasil. Hapus token dari localStorage di frontend."
}
```

### 2. Test Results (`/api/tests`)

#### Submit Test (DASS-21)
```
POST /api/tests/submit
Content-Type: application/json

Body:
{
  "student_id": 1,
  "answers": [0, 1, 2, 0, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1, 0, 1, 2, 0, 1, 0, 1]
}

Catatan: answers harus array dengan 21 elemen, setiap nilai 0-3

Response:
{
  "message": "Test berhasil disimpan",
  "testResult": {
    "test_id": "test-a1b2c3d4",
    "student_id": 1,
    "score": 16,
    "level": "Sedang",
    "fuzzy_score": 1.50,
    "description": "Anda mengalami gejala depresi sedang. Disarankan untuk berkonsultasi dengan profesional kesehatan mental.",
    "timestamp": "2024-05-02T10:30:00.000Z"
  }
}
```

#### Get All Tests for Student
```
GET /api/tests/student/:student_id

Example: GET /api/tests/student/1

Response:
{
  "message": "Test results berhasil diambil",
  "count": 3,
  "results": [
    {
      "test_id": "test-a1b2c3d4",
      "student_id": 1,
      "date": "2024-05-02 10:30:00",
      "score": 16,
      "level": "Sedang",
      "fuzzy_score": 1.50,
      "answers": [0, 1, 2, 0, 1, ...]
    },
    ...
  ]
}
```

#### Get Test Detail
```
GET /api/tests/detail/:test_id

Example: GET /api/tests/detail/test-a1b2c3d4

Response:
{
  "message": "Test detail berhasil diambil",
  "result": {
    "test_id": "test-a1b2c3d4",
    "student_id": 1,
    "date": "2024-05-02 10:30:00",
    "score": 16,
    "level": "Sedang",
    "fuzzy_score": 1.50,
    "answers": [0, 1, 2, 0, 1, ...],
    "description": "Anda mengalami gejala depresi sedang..."
  }
}
```

#### Get Test Statistics for Student
```
GET /api/tests/statistics/:student_id

Example: GET /api/tests/statistics/1

Response:
{
  "message": "Statistik test berhasil diambil",
  "statistics": {
    "total_tests": 3,
    "avg_score": 14.33,
    "min_score": 12,
    "max_score": 16,
    "normal_count": 0,
    "mild_count": 1,
    "moderate_count": 2,
    "severe_count": 0,
    "extremely_severe_count": 0
  }
}
```

#### Delete Test
```
DELETE /api/tests/:test_id

Example: DELETE /api/tests/test-a1b2c3d4

Response:
{
  "message": "Test berhasil dihapus"
}
```

### 3. Health Check

```
GET /api/health

Response:
{
  "message": "Server is running",
  "timestamp": "2024-05-02T10:30:00.000Z"
}
```

---

## Error Responses

Semua error endpoint akan mengembalikan format:

```json
{
  "message": "Deskripsi error",
  "error": "Detail error (jika development mode)"
}
```

Status codes yang digunakan:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Fuzzy Logic Calculation

### Overview

Sistem menggunakan Fuzzy Logic untuk menginterpretasi skor DASS-21. Tingkat depresi dibagi menjadi 5 level:

| Level | Skor | Rekomendasi |
|-------|------|-------------|
| Normal | 0-9 | Kesejahteraan mental baik |
| Ringan | 10-13 | Self-care dan monitoring |
| Sedang | 14-20 | Konsultasi dengan profesional |
| Parah | 21-27 | Segera cari bantuan profesional |
| Sangat Parah | 28+ | Cari bantuan darurat |

### Membership Functions

Sistem menggunakan 5 membership functions untuk smooth transition antar level:
- `fuzzyMembershipNormal(score)` - Normal level
- `fuzzyMembershipMild(score)` - Ringan level
- `fuzzyMembershipModerate(score)` - Sedang level
- `fuzzyMembershipSevere(score)` - Parah level
- `fuzzyMembershipExtremelySevere(score)` - Sangat Parah level

Setiap membership function mengembalikan nilai 0-1 yang menunjukkan derajat keanggotaan ke level tersebut.

---

## Frontend Integration

### 1. Simpan Token di LocalStorage

```javascript
// Setelah login/register
localStorage.setItem('authToken', response.token);
localStorage.setItem('userRole', response.user.role);
localStorage.setItem('userId', response.user.id);
```

### 2. Kirim Token di Header

```javascript
const token = localStorage.getItem('authToken');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

fetch('/api/tests/submit', {
  method: 'POST',
  headers,
  body: JSON.stringify({ student_id: 1, answers: [...] })
});
```

### 3. Handle Role-based Routing

```javascript
const userRole = localStorage.getItem('userRole');
if (userRole === 'student') {
  // Redirect ke StudentDashboard
} else if (userRole === 'bk') {
  // Redirect ke BKDashboard
} else if (userRole === 'admin') {
  // Redirect ke AdminDashboard
}
```

### 4. Logout

```javascript
localStorage.removeItem('authToken');
localStorage.removeItem('userRole');
localStorage.removeItem('userId');
// Redirect ke login page
```

---

## Troubleshooting

### "Database connection failed"
- Pastikan MySQL sudah running
- Cek konfigurasi DB di `.env`
- Pastikan database `depresi` sudah dibuat

### "CORS error"
- Pastikan frontend URL sudah ditambahkan di `app.js` CORS configuration
- Cek `FRONTEND_URL` di `.env`

### "Token invalid"
- JWT_SECRET harus sama di backend dan frontend
- Token mungkin sudah expired (24 jam)
- Pastikan token format: `Bearer <token>`

### "Answers validation failed"
- Pastikan answers adalah array dengan 21 elemen
- Setiap elemen harus integer 0-3
- Jangan kirim data tambahan dalam answers

---

## Development Tips

1. **Auto-reload**: Gunakan `pnpm dev` untuk development dengan nodemon
2. **Logging**: Semua request dilog dengan timestamp dan method
3. **CORS**: Aktif untuk frontend development di localhost:5173
4. **Error Handling**: Semua error ditangani dengan middleware error handler
5. **Graceful Shutdown**: Server handle SIGTERM dan SIGINT untuk shutdown yang baik

---

## Production Checklist

- [ ] Set `NODE_ENV=production` di `.env`
- [ ] Change `JWT_SECRET` ke secret yang kuat
- [ ] Change `DB_PASSWORD` ke password yang aman
- [ ] Disable console logging untuk production
- [ ] Setup reverse proxy (Nginx/Apache)
- [ ] Setup SSL certificate (HTTPS)
- [ ] Setup database backup strategy
- [ ] Monitor server logs dan performance
- [ ] Setup error tracking (Sentry, etc)
- [ ] Setup CI/CD pipeline
