# 🚀 MULAI DARI SINI - Backend Installation Quick Start

## Selamat! Anda sudah punya backend yang lengkap! 🎉

Backend Depression Detection Anda sudah **100% complete** dan siap digunakan. Ikuti 5 langkah sederhana di bawah untuk memulai.

---

## ⚡ 5 Langkah Instalasi

### Langkah 1️⃣: Buka Terminal/PowerShell

**Windows:**
```powershell
# Buka PowerShell (Win + X, pilih PowerShell)
# atau Command Prompt (Win + R, ketik cmd)
```

**Mac/Linux:**
```bash
# Buka Terminal
```

### Langkah 2️⃣: Navigate ke Backend Folder

```bash
cd "d:\kuliah\semester 4\RPL\Depression Detection\backend"
```

Atau jika menggunakan PowerShell Windows:
```powershell
cd 'd:\kuliah\semester 4\RPL\Depression Detection\backend'
```

### Langkah 3️⃣: Install Dependencies

```bash
pnpm install
```

**Atau menggunakan npm (jika pnpm tidak tersedia):**
```bash
npm install
```

**Atau menggunakan yarn:**
```bash
yarn install
```

Tunggu hingga selesai (biasanya 2-3 menit). Anda akan melihat:
```
added XXX packages
```

### Langkah 4️⃣: Configure Environment Variables

Edit file `.env` di folder backend:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here    ← UBAH dengan password MySQL Anda
DB_NAME=depresi

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**PENTING:** Ganti `your_password_here` dengan password MySQL Anda yang sebenarnya!

### Langkah 5️⃣: Jalankan Backend

```bash
pnpm dev
```

**Output yang Anda harapkan:**
```
==================================================
🚀 Depression Detection API Server
==================================================
✓ Environment: development
✓ Port: 5000
✓ URL: http://localhost:5000
==================================================
```

**Jika berhasil:**
- ✅ Backend running di `http://localhost:5000`
- ✅ Database connected
- ✅ Siap untuk frontend integration

---

## 🧪 Test Backend Dengan Cepat

Buka terminal baru (jangan stop backend), jalankan:

```bash
curl http://localhost:5000/api/health
```

**Output yang Anda harapkan:**
```json
{
  "message": "Server is running",
  "timestamp": "2024-05-02T10:30:00.000Z"
}
```

✅ Jika mendapat response ini, backend sudah berjalan dengan sempurna!

---

## 📋 Troubleshooting

### ❌ Error: "Cannot find module 'express'"
**Solusi:** Dependencies belum terinstall
```bash
pnpm install
```

### ❌ Error: "ECONNREFUSED" (Database)
**Solusi:** MySQL belum running
- Windows: Buka Services, cari MySQL, klik Start
- Mac: `brew services start mysql`
- Linux: `sudo systemctl start mysql`

### ❌ Error: "Access denied for user 'root'"
**Solusi:** Password di `.env` salah
- Edit `.env`
- Sesuaikan `DB_PASSWORD` dengan password MySQL Anda
- Jalankan `pnpm dev` lagi

### ❌ Error: "Port 5000 already in use"
**Solusi 1:** Kill process yang pakai port 5000
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**Solusi 2:** Gunakan port berbeda
```bash
PORT=5001 pnpm dev
```

---

## 📚 Dokumentasi Selanjutnya

Setelah backend running, baca dokumentasi ini (sesuai kebutuhan):

1. **API_DOCUMENTATION.md** - Semua endpoints & contoh
2. **TESTING_GUIDE.md** - Cara test endpoints dengan curl/Postman
3. **INTEGRATION_GUIDE.md** - Integrasikan dengan React frontend
4. **CHEAT_SHEET.md** - Quick reference commands

---

## 🎯 Setelah Backend Running

### 1. Test Endpoints (Optional)

```bash
# Terminal baru (jangan stop backend)

# Test 1: Register User
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"student"}'

# Test 2: Get Health
curl http://localhost:5000/api/health
```

### 2. Integrasikan dengan Frontend

Baca **INTEGRATION_GUIDE.md** untuk:
- Update AuthContext.tsx
- Create API service
- Connect login page ke backend
- Handle token storage

### 3. Full Flow Test

Setelah frontend terintegrasi:
1. Register user
2. Login (dapatkan token)
3. Submit test (21 answers)
4. View results

---

## 🎓 Backend Structure Overview

```
backend/
├── src/
│   ├── server.js              Entry point
│   ├── app.js                 Express setup
│   ├── config/db.js           Database connection
│   ├── controllers/           Business logic
│   ├── routes/                API endpoints
│   ├── middleware/            JWT & validation
│   └── services/fuzzyService  Fuzzy logic
├── .env                       Configuration
├── package.json              Dependencies
└── documentation/            Guides
```

---

## 📞 Command Reference

**Start backend:**
```bash
pnpm dev              # Development (auto-reload)
pnpm start           # Production
```

**Install packages:**
```bash
pnpm install         # Install dependencies
pnpm add express     # Add new package
```

**View logs:**
```bash
# Logs langsung muncul di terminal tempat pnpm dev running
# Tidak perlu command khusus
```

---

## ✅ Installation Checklist

- [ ] Node.js terinstall (`node --version`)
- [ ] pnpm/npm terinstall (`pnpm --version`)
- [ ] MySQL running
- [ ] Database `depresi` ada
- [ ] Backend folder dibuka di terminal
- [ ] `pnpm install` selesai
- [ ] `.env` dikonfigurasi dengan DB password yang benar
- [ ] `pnpm dev` running tanpa error
- [ ] `curl http://localhost:5000/api/health` return 200 OK
- [ ] Backend ready untuk frontend integration

---

## 🎉 Selamat!

Backend Anda sudah:
✅ Fully functional
✅ Connected ke database
✅ Ready untuk testing
✅ Ready untuk frontend integration

Lanjutkan dengan membaca **INTEGRATION_GUIDE.md** untuk menghubungkan dengan frontend React!

---

**Need Help?**
- Check error message di terminal
- Baca TESTING_GUIDE.md
- Lihat BACKEND_SETUP.md untuk detail

**Status:** ✅ Ready for Development
**Version:** 1.0.0
**Created:** May 2, 2026
