# 🗄️ MySQL Database Setup Guide

Panduan mengkoneksikan backend Depression Detection ke MySQL Database.

## 📋 Prerequisites

- MySQL Server sudah terinstall dan running
- Database management tool (phpMyAdmin, MySQL Workbench, atau command line)
- Backend folder sudah lengkap
- Node.js & pnpm sudah terinstall

## 🚀 Quick Setup (5 Menit)

### Step 1: Buka MySQL

**Opsi A: Menggunakan Command Line**
```bash
mysql -u root -p
# Masukkan password MySQL Anda
```

**Opsi B: Menggunakan MySQL Workbench**
1. Buka MySQL Workbench
2. Klik connection Anda (biasanya "Local instance MySQL80")
3. Masukkan password jika diminta

**Opsi C: Menggunakan phpMyAdmin**
1. Buka http://localhost/phpmyadmin
2. Login dengan username/password MySQL

### Step 2: Import Database Schema

**Command Line:**
```bash
mysql -u root -p depresi < ../database/depresi.sql
```

**MySQL Workbench:**
1. File → Open SQL Script
2. Pilih `database/depresi.sql`
3. Klik Execute

**phpMyAdmin:**
1. Pilih database `depresi`
2. Tab "Import"
3. Upload file `database/depresi.sql`
4. Klik "Import"

### Step 3: Verifikasi Database

```bash
mysql -u root -p depresi
```

Setelah masuk MySQL, jalankan:
```sql
SHOW TABLES;
```

Seharusnya menampilkan:
```
+--------------------+
| Tables_in_depresi  |
+--------------------+
| accounts           |
| admins             |
| bk_staff           |
| students           |
| test_results       |
+--------------------+
```

Jika ada, database sudah siap! ✅

### Step 4: Configure Backend .env

Edit file `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here    ← UBAH dengan password MySQL Anda
DB_NAME=depresi
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

### Step 5: Install Backend & Run

```bash
cd backend
pnpm install
pnpm dev
```

Backend seharusnya connect ke database:
```
✓ Database connected successfully
```

---

## 🔍 Troubleshooting MySQL

### Error: "Access denied for user 'root'"

**Solusi:**
1. Password Anda mungkin berbeda, cek di `.env`
2. Username mungkin bukan `root`, sesuaikan
3. Test password di command line terlebih dahulu

```bash
mysql -u root -p
# Masukkan password Anda
```

### Error: "Can't connect to MySQL server"

**Solusi:**
1. MySQL service tidak running
2. Windows: Services → MySQL80 → Start
3. Mac: `brew services start mysql`
4. Linux: `sudo systemctl start mysql`

### Error: "Unknown database 'depresi'"

**Solusi:**
Database belum dibuat. Import SQL schema:
```bash
mysql -u root -p < database/depresi.sql
```

### Error: "No tables found"

**Solusi:**
Schema tidak diimport dengan benar. Ulangi import:
```bash
mysql -u root -p depresi < ../database/depresi.sql
```

---

## 📊 Database Schema Overview

### Tabel: accounts
```sql
CREATE TABLE accounts (
  account_id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'bk', 'admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel: students
```sql
CREATE TABLE students (
  student_id INT PRIMARY KEY AUTO_INCREMENT,
  account_id INT NOT NULL UNIQUE,
  nim VARCHAR(20) UNIQUE NOT NULL,
  nik VARCHAR(20),
  name VARCHAR(100),
  faculty VARCHAR(100),
  major VARCHAR(100),
  semester INT,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);
```

### Tabel: bk_staff
```sql
CREATE TABLE bk_staff (
  staff_id INT PRIMARY KEY AUTO_INCREMENT,
  account_id INT NOT NULL UNIQUE,
  nip VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),
  specialization VARCHAR(100),
  phone VARCHAR(20),
  office_location VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);
```

### Tabel: admins
```sql
CREATE TABLE admins (
  admin_id INT PRIMARY KEY AUTO_INCREMENT,
  account_id INT NOT NULL UNIQUE,
  name VARCHAR(100),
  department VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);
```

### Tabel: test_results
```sql
CREATE TABLE test_results (
  test_id VARCHAR(50) PRIMARY KEY,
  student_id INT NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  score INT CHECK (score BETWEEN 0 AND 42),
  level ENUM('Normal', 'Ringan', 'Sedang', 'Berat', 'Sangat Berat'),
  fuzzy_score DECIMAL(4, 2),
  answers JSON CHECK (JSON_VALID(answers)),
  FOREIGN KEY (student_id) REFERENCES students(student_id)
);
```

---

## 💾 Backup Database

### Backup ke File

```bash
mysqldump -u root -p depresi > backup_depresi.sql
```

### Restore dari Backup

```bash
mysql -u root -p depresi < backup_depresi.sql
```

---

## 🔐 Security Tips

1. **Change Root Password**
   ```bash
   mysql -u root
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
   FLUSH PRIVILEGES;
   ```

2. **Create Application User (Production)**
   ```sql
   CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_password';
   GRANT SELECT, INSERT, UPDATE, DELETE ON depresi.* TO 'app_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Use Environment Variables**
   - Jangan hard-code password di code
   - Gunakan `.env` file (sudah dilakukan)

---

## 🔄 Running Fullstack

### Terminal 1: Backend
```bash
cd backend
pnpm dev
# Running at http://localhost:5000
```

### Terminal 2: Frontend
```bash
# Dari root project folder
pnpm dev
# Running at http://localhost:5173
```

### Testing Integration

1. **Register** di frontend
   - Akan create entry di `accounts` table

2. **Login**
   - Akan query `accounts` table

3. **Submit Test**
   - Akan insert ke `test_results` table

4. **View Results**
   - Akan query dari `test_results` table

---

## 📝 Useful MySQL Commands

### Show Databases
```sql
SHOW DATABASES;
```

### Select Database
```sql
USE depresi;
```

### Show Tables
```sql
SHOW TABLES;
```

### Show Table Structure
```sql
DESCRIBE accounts;
DESC test_results;
```

### Check Data
```sql
SELECT * FROM accounts;
SELECT COUNT(*) FROM test_results;
SELECT * FROM students WHERE student_id = 1;
```

### Clear Data (Development Only)
```sql
DELETE FROM test_results;
DELETE FROM students;
DELETE FROM bk_staff;
DELETE FROM admins;
DELETE FROM accounts;
```

---

## ✅ Checklist

- [ ] MySQL server running
- [ ] Database `depresi` dibuat
- [ ] Schema diimport dengan benar
- [ ] Tabel ada 5: accounts, students, bk_staff, admins, test_results
- [ ] Backend `.env` dikonfigurasi dengan MySQL credentials
- [ ] Backend connect ke database (check console)
- [ ] Frontend running di port 5173
- [ ] Backend running di port 5000
- [ ] CORS configured
- [ ] Can register user
- [ ] Can login
- [ ] Can submit test
- [ ] Can view results

---

## 🆘 Getting Help

1. Check backend console logs untuk error messages
2. Verify MySQL credentials di `.env`
3. Ensure database schema imported correctly
4. Check MySQL service is running
5. Try clearing browser cache (Ctrl+Shift+Delete)

---

**Status:** ✅ Ready for Development
**Last Updated:** May 2, 2026
