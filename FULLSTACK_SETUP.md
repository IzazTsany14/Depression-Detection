# 🚀 Fullstack Depression Detection - Complete Setup Guide

Panduan lengkap menjalankan Depression Detection System (Frontend + Backend + MySQL) dengan sempurna.

---

## 📋 Prerequisites

Pastikan Anda sudah punya:
- ✅ Node.js v18+ (`node --version`)
- ✅ pnpm atau npm (`pnpm --version` atau `npm --version`)
- ✅ MySQL Server running
- ✅ Backend folder dengan semua files
- ✅ Frontend folder sudah lengkap

---

## 🎯 Tahapan Setup (15 Menit)

### Fase 1: Database Setup (5 menit)

#### Step 1.1: Verify MySQL Running

**Windows:**
```bash
# Buka Command Prompt/PowerShell
mysql --version
# Seharusnya menampilkan version MySQL
```

**Mac/Linux:**
```bash
mysql --version
```

Jika error "command not found", MySQL belum terinstall atau tidak di PATH.

#### Step 1.2: Buat/Import Database

```bash
# Command line MySQL
mysql -u root -p

# Di MySQL prompt, ketik:
CREATE DATABASE IF NOT EXISTS depresi;
USE depresi;
SOURCE ../database/depresi.sql;
EXIT;
```

**Atau menggunakan single command:**
```bash
mysql -u root -p depresi < database/depresi.sql
```

#### Step 1.3: Verify Tables

```bash
mysql -u root -p depresi -e "SHOW TABLES;"
```

Seharusnya muncul 5 tabel:
```
accounts, admins, bk_staff, students, test_results
```

### Fase 2: Backend Setup (5 menit)

#### Step 2.1: Navigate ke Backend

```bash
cd depression-detection/backend
# atau
cd "path/to/backend"
```

#### Step 2.2: Configure .env

Edit file `backend/.env` dan sesuaikan dengan database Anda:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password    ← PENTING: Sesuaikan dengan password MySQL Anda
DB_NAME=depresi
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-for-jwt
FRONTEND_URL=http://localhost:5173
```

**PENTING:** Pastikan `DB_PASSWORD` sesuai dengan password MySQL Anda!

#### Step 2.3: Install Dependencies

```bash
pnpm install
# Tunggu selesai (2-3 menit, akan melihat: "added XXX packages")
```

#### Step 2.4: Start Backend Server

```bash
pnpm dev
```

**Jika berhasil, Anda akan melihat:**
```
==================================================
🚀 Depression Detection API Server
==================================================
✓ Environment: development
✓ Port: 5000
✓ URL: http://localhost:5000
==================================================

✓ Database connected successfully
```

**PENTING:** Jangan close terminal ini! Backend harus terus running.

**Jika error, baca Troubleshooting section di bawah.**

### Fase 3: Frontend Setup (5 menit)

#### Step 3.1: Buka Terminal Baru

Buat terminal window baru (jangan close backend terminal):
```bash
# Windows: Win+X, PowerShell
# Mac: Command+Space, ketik Terminal
# Linux: Ctrl+Alt+T
```

#### Step 3.2: Navigate ke Root Project

```bash
cd depression-detection
# atau ke folder root project Anda
```

#### Step 3.3: Install Dependencies (jika belum)

```bash
pnpm install
```

#### Step 3.4: Start Frontend

```bash
pnpm dev
```

**Jika berhasil, seharusnya melihat:**
```
  ➜ Local: http://localhost:5173/
  ➜ press h to show help
```

---

## ✅ Verification Checklist

Pastikan semuanya running:

- [ ] **Backend Terminal**
  ```
  ✓ Server running di http://localhost:5000
  ✓ Database connected successfully
  ```

- [ ] **Frontend Terminal**
  ```
  ➜ Local: http://localhost:5173/
  ```

- [ ] **Browser Test**
  - Buka http://localhost:5173
  - Seharusnya tampil halaman login
  - No error di console (F12 → Console)

- [ ] **Backend Test**
  - Buka http://localhost:5000/api/health
  - Seharusnya response JSON:
    ```json
    {
      "message": "Server is running",
      "timestamp": "..."
    }
    ```

---

## 🧪 Test Complete Flow

Jika semuanya running, test flow berikut:

### Test 1: Register New User

1. Di browser: http://localhost:5173
2. Klik "Sign Up" atau "Register"
3. Isi form:
   ```
   Email: test@example.com
   Password: password123
   Role: student (biasanya default)
   ```
4. Klik Register

**Expected Result:**
- Popup success atau redirect ke login
- Di MySQL, cek:
  ```sql
  SELECT * FROM accounts;
  -- Seharusnya ada entry baru
  ```

### Test 2: Login

1. Masukkan email: `test@example.com`
2. Masukkan password: `password123`
3. Klik Login

**Expected Result:**
- Redirect ke dashboard
- Token disimpan di localStorage

**Check di browser DevTools:**
```javascript
// Di Console (F12 → Console):
localStorage.getItem('authToken')
// Seharusnya menampilkan token JWT
```

### Test 3: Submit DASS-21 Test

1. Di dashboard, cari "Questionnaire" atau "Take Test"
2. Jawab 21 pertanyaan
3. Klik Submit

**Expected Result:**
- Test results muncul
- Di MySQL, cek:
  ```sql
  SELECT * FROM test_results;
  -- Seharusnya ada entry baru
  ```

### Test 4: View Results History

1. Di dashboard, cari "Test History" atau "Results"
2. Seharusnya menampilkan test yang baru disubmit

**Expected Result:**
- List of tests muncul dengan scores

---

## 🐛 Troubleshooting

### ❌ Frontend Error: "Failed to resolve import"

**Symptoms:**
- Red error banner di browser
- Error message: "Failed to resolve import ... from ..."

**Solution:**
- [FIXED] Sudah diperbaiki semua import paths
- Clear browser cache: Ctrl+Shift+Delete
- Reload: Ctrl+R atau Cmd+Shift+R

### ❌ Backend Error: "ECONNREFUSED" (MySQL Connection Failed)

**Symptoms:**
- Backend error: "ECONNREFUSED 127.0.0.1:3306"
- Tidak bisa connect ke database

**Solutions:**

1. **Check MySQL Running**
   ```bash
   # Windows
   mysql --version
   
   # Jika MySQL tidak running:
   # Services → MySQL80 → Start
   ```

2. **Check DB Credentials**
   - Open `backend/.env`
   - Verify `DB_USER`, `DB_PASSWORD`, `DB_HOST`
   - Test di command line:
     ```bash
     mysql -u root -p
     # Masukkan password dari .env
     ```

3. **Check Database Exists**
   ```bash
   mysql -u root -p -e "SHOW DATABASES LIKE 'depresi';"
   # Seharusnya menampilkan 'depresi'
   ```

### ❌ Frontend Error: "Cannot connect to API"

**Symptoms:**
- Network error di console
- API calls failed

**Solutions:**

1. **Verify Backend Running**
   - Terminal backend harus menampilkan "Server running"
   - http://localhost:5000/api/health harus accessible

2. **Check CORS**
   - Backend sudah dikonfigurasi untuk CORS
   - Frontend running di localhost:5173 (sudah whitelisted)

3. **Check Frontend .env** (jika ada)
   - Verify API_URL = http://localhost:5000

### ❌ Login Failed

**Symptoms:**
- "Email tidak terdaftar" atau "Password salah"
- Network error saat login

**Solutions:**

1. **Register terlebih dahulu**
   - Jika belum register, data tidak ada di database

2. **Check Database**
   ```sql
   SELECT * FROM accounts WHERE email = 'your-email@example.com';
   -- Seharusnya ada
   ```

3. **Check Password**
   - Password case-sensitive
   - Pastikan tidak ada whitespace

### ❌ Test Submission Failed

**Symptoms:**
- Error saat submit test
- Network error 400/500

**Solutions:**

1. **Verify Answers**
   - Pastikan semua 21 pertanyaan dijawab
   - Setiap jawaban harus 0-3

2. **Check Backend Logs**
   - Lihat error message di backend terminal

3. **Check Student ID**
   ```sql
   SELECT * FROM students;
   -- Verify student_id ada
   ```

### ❌ "Port 5000 already in use"

**Symptoms:**
- Backend error: "EADDRINUSE: address already in use :::5000"

**Solutions:**

1. **Kill Process Using Port 5000**
   ```bash
   # Windows (PowerShell as Admin)
   Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
   
   # Mac/Linux
   lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
   ```

2. **Use Different Port**
   ```bash
   PORT=5001 pnpm dev
   ```
   Then update frontend to use `http://localhost:5001`

---

## 📚 File Locations Reference

```
depression-detection/
├── backend/
│   ├── .env                    ← Configure MySQL credentials
│   ├── src/server.js           ← Backend entry point
│   ├── package.json
│   └── MYSQL_SETUP.md          ← MySQL detailed guide
│
├── database/
│   └── depresi.sql             ← Database schema
│
├── src/
│   ├── main.tsx                ← Frontend entry
│   └── app/
│       ├── App.tsx
│       ├── context/
│       │   └── AuthContext.tsx ← Auth state management
│       └── pages/
│
└── vite.config.ts              ← Frontend config
```

---

## 🔄 Typical Workflow

### Day 1: Initial Setup
```bash
# Terminal 1
cd backend
pnpm install
# Configure .env with MySQL credentials
pnpm dev

# Terminal 2
cd .
pnpm install
pnpm dev
```

### Day 2+: Continue Development
```bash
# Terminal 1: Backend (if not running)
cd backend && pnpm dev

# Terminal 2: Frontend
pnpm dev
```

---

## 📊 System Architecture

```
┌─────────────────────────────────────┐
│   React Frontend                    │
│   localhost:5173                    │
│                                     │
│  ├── Login Page                     │
│  ├── Questionnaire                  │
│  ├── Dashboard                      │
│  └── Profile                        │
└──────────────┬──────────────────────┘
               │ HTTP Requests
               │ JSON + JWT Token
               │
┌──────────────▼──────────────────────┐
│   Express Backend                   │
│   localhost:5000                    │
│                                     │
│  ├── /api/auth/register             │
│  ├── /api/auth/login                │
│  ├── /api/tests/submit              │
│  └── /api/tests/student/:id         │
└──────────────┬──────────────────────┘
               │ SQL Queries
               │
┌──────────────▼──────────────────────┐
│   MySQL Database                    │
│   localhost:3306                    │
│                                     │
│  ├── accounts (auth)                │
│  ├── students (profile)             │
│  ├── test_results (test data)       │
│  └── ...                            │
└─────────────────────────────────────┘
```

---

## 🎯 Development Tips

1. **Keep Both Terminals Open**
   - Terminal 1: Backend (pnpm dev)
   - Terminal 2: Frontend (pnpm dev)

2. **Monitor Backend Logs**
   - Backend log setiap request
   - Gunakan untuk debugging API issues

3. **Use Browser DevTools**
   - F12 → Console: JavaScript errors
   - F12 → Network: API requests/responses
   - F12 → Application: localStorage (tokens)

4. **Use MySQL Command Line**
   ```bash
   mysql -u root -p depresi
   SELECT * FROM accounts;
   -- Verify data di database
   ```

5. **Restart When Needed**
   - Kill and restart backend: Ctrl+C, then pnpm dev
   - Refresh frontend: Ctrl+R
   - Clear browser cache: Ctrl+Shift+Delete

---

## 🔐 Security Reminders

- **Never commit .env to git** (.gitignore sudah setup)
- **Use strong JWT_SECRET** untuk production
- **Don't hard-code credentials** di code
- **Use HTTPS** untuk production
- **Validate all inputs** di frontend dan backend

---

## ✅ Final Checklist

- [ ] MySQL running
- [ ] Database `depresi` imported
- [ ] Backend `.env` configured
- [ ] Backend running (`pnpm dev`)
- [ ] Frontend running (`pnpm dev`)
- [ ] Browser: http://localhost:5173 loading
- [ ] No errors di browser console
- [ ] Can register user
- [ ] Can login successfully
- [ ] Can submit test
- [ ] Data appears in database
- [ ] Can view test results

---

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| MySQL connection error | Check credentials in .env, verify MySQL running |
| Port 5000 in use | Kill process or use different port |
| Frontend import error | Clear cache (Ctrl+Shift+Delete), reload |
| Cannot connect to API | Verify backend running at localhost:5000 |
| Login failed | Register first, verify credentials |
| Test submission error | Ensure all 21 answers filled |

---

**Status:** ✅ Complete Setup Ready
**Version:** 1.0.0
**Last Updated:** May 2, 2026

Good luck dengan development! 🚀
