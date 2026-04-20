# Testing Guide: Real-Time Login System

## Prerequisites
- Browser dengan localStorage enabled
- Aplikasi running di localhost

---

## Test 1: Login dengan Dummy Data

### Steps:
1. Buka aplikasi → Halaman Login
2. Masukkan kredensial dummy:
   - **Email:** `admin@university.ac.id`
   - **Password:** `admin123`
3. Klik "Login"

### Expected Result:
✅ Login berhasil → Redirect ke `/admin`
✅ User data muncul di navbar
✅ Admin dashboard terbuka

### Verification:
```javascript
// Di browser console
const user = JSON.parse(localStorage.getItem('user'));
console.log(user); // Should show admin user object
```

---

## Test 2: Login Student dengan Dummy Data

### Steps:
1. Buka aplikasi → Halaman Login
2. Masukkan kredensial:
   - **Email:** `mahasiswa1@student.ac.id`
   - **Password:** `student123`
3. Klik "Login"

### Expected Result:
✅ Login berhasil → Redirect ke `/dashboard`
✅ Dashboard menampilkan data mahasiswa
✅ Can access test history

### Verification:
```javascript
// Di browser console
const user = JSON.parse(localStorage.getItem('user'));
console.log(user.role); // Should be 'student'

const history = JSON.parse(localStorage.getItem(`history_${user.id}`));
console.log(history.length); // Should have test results
```

---

## Test 3: Registrasi User Baru

### Steps:
1. Buka aplikasi → Halaman Register
2. Isi form:
   - **Nama:** `Test Student`
   - **Email:** `teststudent@example.com`
   - **Password:** `password123`
   - **Confirm Password:** `password123`
3. Centang "Saya setuju dengan syarat & ketentuan"
4. Klik "Daftar"

### Expected Result:
✅ Registrasi berhasil
✅ Otomatis login
✅ Redirect ke `/dashboard`
✅ User baru tersimpan di localStorage

### Verification:
```javascript
// Di browser console
const users = JSON.parse(localStorage.getItem('registeredUsers'));
console.log(users.find(u => u.email === 'teststudent@example.com'));
// Should find the new user

const currentUser = JSON.parse(localStorage.getItem('user'));
console.log(currentUser.email); // Should be 'teststudent@example.com'
```

---

## Test 4: Login User yang Baru Terdaftar

### Steps:
1. Logout dari dashboard (jika masih login)
2. Buka halaman Login
3. Masukkan kredensial yang baru didaftar:
   - **Email:** `teststudent@example.com`
   - **Password:** `password123`
4. Klik "Login"

### Expected Result:
✅ Login berhasil
✅ Redirect ke `/dashboard`
✅ User data ditampilkan dengan benar

---

## Test 5: Admin Menambah User Baru

### Steps:
1. Login sebagai admin (`admin@university.ac.id` / `admin123`)
2. Buka halaman "Admin" → "Manajemen User"
3. Klik tombol "Tambah User"
4. Isi form:
   - **Nama:** `Admin Added Student`
   - **Email:** `adminstudent@university.ac.id`
   - **Password:** `password123`
   - **Role:** `Mahasiswa`
   - **NIM:** `2021110099`
   - **Fakultas:** `Fakultas Teknik`
   - **Jurusan:** `Informatika`
5. Klik "Simpan"

### Expected Result:
✅ User berhasil ditambahkan
✅ Toast notification menampilkan success message
✅ User muncul di daftar user management
✅ User tersimpan di `adminAddedUsers` localStorage

### Verification:
```javascript
// Di browser console
const adminUsers = JSON.parse(localStorage.getItem('adminAddedUsers'));
console.log(adminUsers.find(u => u.email === 'adminstudent@university.ac.id'));
// Should find the newly added user
```

---

## Test 6: Login dengan User yang Ditambah Admin

### Steps:
1. Logout dari admin
2. Buka halaman Login
3. Masukkan kredensial:
   - **Email:** `adminstudent@university.ac.id`
   - **Password:** `password123`
4. Klik "Login"

### Expected Result:
✅ Login berhasil
✅ User dapat mengakses dashboard
✅ Data user ditampilkan dengan benar

---

## Test 7: Cek Data dari 3 Sumber

### Steps:
1. Buka browser console
2. Jalankan commands berikut:

```javascript
// Cek registered users (termasuk dummy data)
const registered = JSON.parse(localStorage.getItem('registeredUsers'));
console.log('Registered Users:', registered.length);

// Cek admin-added users
const adminAdded = JSON.parse(localStorage.getItem('adminAddedUsers'));
console.log('Admin Added Users:', adminAdded.length);

// Gunakan utility function
// (Perlu import dari utils)
// const allUsers = getAllUsersRealtime();
// console.log('Total Real-Time Users:', allUsers.length);
```

### Expected Result:
```
Registered Users: 20+ (dummy + registered new users)
Admin Added Users: 1+ (users added by admin)
Total Real-Time Users: 20+ + 1+ (combined)
```

---

## Test 8: Login Failed - Wrong Credentials

### Steps:
1. Buka halaman Login
2. Masukkan kredensial salah:
   - **Email:** `mahasiswa1@student.ac.id`
   - **Password:** `wrongpassword`
3. Klik "Login"

### Expected Result:
✅ Login gagal
✅ Error message: "Email atau password salah. Silakan coba lagi."
✅ User tetap di halaman login
✅ Tidak ada data yang disimpan di localStorage

---

## Test 9: Duplicate Email Registration

### Steps:
1. Logout jika sudah login
2. Buka halaman Register
3. Isi form dengan email yang sudah ada:
   - **Email:** `mahasiswa1@student.ac.id` (sudah ada di dummy data)
   - **Password:** `test123`
4. Klik "Daftar"

### Expected Result:
✅ Registrasi gagal
✅ Error message: "Email sudah terdaftar. Silakan gunakan email lain atau login."

---

## Test 10: Logout & Session

### Steps:
1. Login dengan user apapun
2. Verifikasi data tersimpan di localStorage
3. Klik tombol Logout
4. Verifikasi localStorage setelah logout

### Expected Result:
✅ User logout berhasil
✅ `user` key di localStorage terhapus
✅ Redirect ke halaman login
✅ User tidak bisa akses protected routes

### Verification:
```javascript
// Before logout
const user = JSON.parse(localStorage.getItem('user'));
console.log('Before:', user); // Should have user data

// After logout
const userAfter = localStorage.getItem('user');
console.log('After:', userAfter); // Should be null
```

---

## Test 11: Multi-Session (Different Devices Simulation)

### Steps:
1. Login dengan User A di Tab 1
2. Buka Tab 2
3. Login dengan User B di Tab 2
4. Cek localStorage di kedua tab

### Expected Result:
⚠️ **Note:** localStorage adalah per-domain, bukan per-tab
✅ Tab 2 akan override User A
✅ Kedua tab akan menampilkan User B
✅ Ini adalah behavior yang di-expect untuk localStorage

---

## Test 12: Real-Time Sync Test

### Steps:
1. Login dengan admin di Tab 1
2. Buka DevTools → Application → Local Storage
3. Di Tab 2, buka console dan jalankan:
```javascript
const newUser = {
  id: 'test_' + Date.now(),
  name: 'Real Time Test',
  email: 'realtime@test.com',
  password: 'test123',
  role: 'student'
};

const adminUsers = JSON.parse(localStorage.getItem('adminAddedUsers') || '[]');
adminUsers.push(newUser);
localStorage.setItem('adminAddedUsers', JSON.stringify(adminUsers));

console.log('New user added!');
```
4. Kembali ke Tab 1 → Refresh halaman User Management
5. Cari user yang baru ditambahkan

### Expected Result:
✅ User baru muncul di daftar setelah refresh
✅ Real-time sync bekerja dengan baik

---

## Test 13: Test History Persistence

### Steps:
1. Login sebagai mahasiswa
2. Selesaikan kuesioner dan dapatkan hasil
3. Logout
4. Login kembali dengan email yang sama

### Expected Result:
✅ Test history masih ada
✅ Hasil test sebelumnya ditampilkan
✅ Data persisten di localStorage

### Verification:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
const history = JSON.parse(localStorage.getItem(`history_${user.id}`));
console.log('Test history:', history);
```

---

## Test 14: Data Integrity Check

### Steps:
1. Jalankan command di console:

```javascript
const allUsers = [
  ...JSON.parse(localStorage.getItem('registeredUsers') || '[]'),
  ...JSON.parse(localStorage.getItem('adminAddedUsers') || '[]')
];

// Check for duplicates
const ids = allUsers.map(u => u.id);
const uniqueIds = new Set(ids);
console.log('Total Users:', allUsers.length);
console.log('Unique IDs:', uniqueIds.size);
console.log('Duplicates:', ids.length !== uniqueIds.size);

// Check for duplicate emails
const emails = allUsers.map(u => u.email);
const uniqueEmails = new Set(emails);
console.log('Duplicate Emails:', emails.length !== uniqueEmails.size);
```

### Expected Result:
✅ No duplicate IDs
✅ No duplicate emails
✅ Data integrity maintained

---

## Test 15: Performance Check

### Steps:
1. Jalankan script untuk measure performance:

```javascript
console.time('getAllUsersRealtime');
const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
console.timeEnd('getAllUsersRealtime');

console.time('searchUser');
const results = users.filter(u => 
  u.name.toLowerCase().includes('admin') || 
  u.email.toLowerCase().includes('admin')
);
console.timeEnd('searchUser');

console.log('Results count:', results.length);
```

### Expected Result:
✅ getAllUsers: < 1ms
✅ searchUser: < 5ms
✅ Performance adalah acceptable untuk 50-1000 users

---

## Common Issues & Solutions

### Issue 1: "User tidak bisa login padahal sudah terdaftar"

**Solution:**
```javascript
// Cek semua users
const all = [
  ...JSON.parse(localStorage.getItem('registeredUsers') || '[]'),
  ...JSON.parse(localStorage.getItem('adminAddedUsers') || '[]')
];
const user = all.find(u => u.email === 'email@example.com');
console.log('Found user:', user);
console.log('Password match:', user?.password === 'enteredPassword');
```

### Issue 2: "Data hilang setelah refresh"

**Solution:**
```javascript
// Check localStorage is working
console.log('localStorage available:', typeof(Storage) !== 'undefined');
console.log('dummyDataInitialized:', localStorage.getItem('dummyDataInitialized'));

// Try to re-initialize
localStorage.removeItem('dummyDataInitialized');
// Refresh page
```

### Issue 3: "Admin-added users tidak muncul saat login"

**Solution:**
```javascript
// Verify authenticateUser function checks adminAddedUsers
const adminUsers = JSON.parse(localStorage.getItem('adminAddedUsers') || '[]');
console.log('Admin users count:', adminUsers.length);
console.log('Admin users:', adminUsers);
```

---

## Checklist Sebelum Deployment

- [ ] Dummy data terload dengan benar (20 students + 2 BK + 1 Admin)
- [ ] Registrasi user baru berfungsi dan tersimpan
- [ ] Admin bisa menambah user baru
- [ ] Login dari 3 sumber (dummy, registered, admin-added) berfungsi
- [ ] Logout berfungsi dan membersihkan session
- [ ] Test history tersimpan dan persistent
- [ ] Search & filter berfungsi
- [ ] No duplicate emails
- [ ] Performance acceptable
- [ ] Error handling proper

---

## Quick Test Script

Jalankan script ini di console untuk full test:

```javascript
// Full System Test
console.log('=== REAL-TIME LOGIN SYSTEM TEST ===');

// 1. Check localStorage
console.log('1. localStorage status:');
console.log('- Available:', typeof(Storage) !== 'undefined');
console.log('- Initialized:', localStorage.getItem('dummyDataInitialized'));

// 2. Check users
const registered = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
const adminAdded = JSON.parse(localStorage.getItem('adminAddedUsers') || '[]');
console.log('2. User counts:');
console.log('- Registered:', registered.length);
console.log('- Admin Added:', adminAdded.length);
console.log('- Total:', registered.length + adminAdded.length);

// 3. Check for issues
const all = [...registered, ...adminAdded];
const emails = all.map(u => u.email);
const uniqueEmails = new Set(emails);
console.log('3. Data integrity:');
console.log('- Duplicate emails:', emails.length !== uniqueEmails.size);
console.log('- Empty users:', all.some(u => !u.name || !u.email));

// 4. Test login function
console.log('4. Test login:');
const testUser = registered.find(u => u.role === 'student');
if (testUser) {
  console.log('- Test user found:', testUser.name);
  console.log('- Email:', testUser.email);
  console.log('- Password:', testUser.password);
}

// 5. Sample users
console.log('5. Sample dummy users:');
registered.slice(0, 3).forEach(u => {
  console.log(`- ${u.name} (${u.email}) - ${u.role}`);
});

console.log('=== TEST COMPLETE ===');
```

---

## Acceptance Criteria

✅ **All 15 tests pass**
✅ **No console errors**
✅ **Data persists across sessions**
✅ **Login from all 3 sources works**
✅ **Performance is acceptable**
✅ **No data corruption**
✅ **Error messages are clear**
