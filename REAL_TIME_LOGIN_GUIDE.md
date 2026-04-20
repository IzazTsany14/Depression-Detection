# Dokumentasi: Sistem Login Real-Time Terintegrasi

## Ringkasan Sistem

Sistem login telah diupdate untuk mendukung data dari **tiga sumber**:
1. **Dummy Data** - Data default dari code (20 mahasiswa + 2 BK + 1 Admin)
2. **Registered Users** - User yang mendaftar melalui halaman Register
3. **Admin-Added Users** - User yang ditambahkan oleh admin melalui Admin Panel

Semua data tersimpan dan tersinkronisasi secara **real-time** di localStorage.

---

## Alur Login

```
Email + Password Input
         ↓
Cek localStorage (Registered Users + Admin-Added Users)
         ↓
   Jika ketemu → Login Berhasil
   Jika tidak → Cek Dummy Data sebagai Fallback
         ↓
   Jika ketemu → Login Berhasil
   Jika tidak → Login Gagal
```

---

## Data Login Dummy yang Tersedia

### Admin
- **Email:** `admin@university.ac.id`
- **Password:** `admin123`

### BK (Counselor)
- **Email:** `bk@university.ac.id`
- **Password:** `bk123`
- **Email:** `bk2@university.ac.id`
- **Password:** `bk123`

### Students (20 Mahasiswa)
Contoh:
- **Email:** `mahasiswa1@student.ac.id` | **Password:** `student123`
- **Email:** `mahasiswa2@student.ac.id` | **Password:** `student123`
- ... (hingga mahasiswa20@student.ac.id)

---

## Fitur-Fitur Baru

### 1. **Real-Time User Management** (`userManagement.ts`)

Utility yang tersedia untuk admin dan developer:

```typescript
import {
  getAllUsersRealtime,      // Dapatkan semua user
  getUsersByRole,           // Filter user berdasarkan role
  addNewUser,              // Tambah user baru
  updateUserData,          // Update data user
  deleteUser,              // Hapus user
  searchUser,              // Cari user
  getUserByEmail,          // Cari by email
  getUserById,             // Cari by ID
  getStudentStats          // Statistik mahasiswa
} from '@/app/utils/userManagement';
```

### 2. **Helper Functions di dummyData.ts**

```typescript
// Autentikasi dari semua sumber
authenticateUser(email: string, password: string)

// Dapatkan semua user (registered + admin-added)
getAllUsers()

// Tambah user dari admin
addUserFromAdmin(newUser: User)

// Cari user by ID
getUserById(userId: string)

// Update user data
updateUser(userId: string, updatedData: Partial<User>)
```

---

## Implementasi untuk Admin Panel

### Contoh: Menambah User Baru

```typescript
import { addNewUser } from '@/app/utils/userManagement';

const handleAddUser = async (formData) => {
  const result = addNewUser({
    id: `user_${Date.now()}`,
    name: formData.name,
    email: formData.email,
    password: formData.password,
    role: formData.role,
    faculty: formData.faculty,
    major: formData.major,
    nim: formData.nim
  });
  
  if (result.success) {
    toast.success(result.message);
    // Refresh user list
  } else {
    toast.error(result.message);
  }
};
```

### Contoh: Menampilkan Daftar User

```typescript
import { getAllUsersRealtime, getUsersByRole } from '@/app/utils/userManagement';

// Semua user
const allUsers = getAllUsersRealtime();

// User per role
const students = getUsersByRole('student');
const admins = getUsersByRole('admin');
const bks = getUsersByRole('bk');
```

### Contoh: Mencari User

```typescript
import { searchUser } from '@/app/utils/userManagement';

const handleSearch = (query) => {
  const results = searchUser(query); // By name, email, NIM, NIK, atau ID
  console.log(results);
};
```

---

## Local Storage Structure

```
localStorage
├── registeredUsers        // Array of users (dummy data + registered users)
├── adminAddedUsers       // Array of users yang ditambah admin
├── allTestResults        // Array of semua test results
├── user                  // Current logged-in user
├── history_{userId}      // Test history per user
├── testHistory           // General test history
└── dummyDataInitialized  // Flag untuk inisialisasi
```

---

## Alur Registrasi

1. User mengisi form registrasi (nama, email, password)
2. System cek apakah email sudah ada di registered atau admin users
3. Jika belum ada → User ditambahkan ke registeredUsers di localStorage
4. User otomatis login dan diarahkan ke dashboard
5. Inisialisasi `history_{userId}` kosong untuk test history baru

---

## Alur Admin Menambah User

1. Admin ke halaman User Management di Admin Panel
2. Klik "Tambah User"
3. Isi form: Nama, Email, Password, Role, Detail tambahan
4. Klik "Simpan"
5. User disimpan ke `adminAddedUsers` di localStorage
6. User baru sudah bisa login dengan kredensial yang diberikan

---

## Sinkronisasi Real-Time

### Session Sebelumnya
```
Registered Users: [User1, User2]
Admin Users: [User3]
```

### Setelah Register/Admin Add
```
Registered Users: [User1, User2, NewUser]
Admin Users: [User3, AdminAddedUser]
```

### Login Query
Semua 5 user bisa login karena sistem mengecek kedua storage.

---

## Best Practices

### 1. **Selalu Gunakan Helper Functions**
```typescript
// ✅ Benar
import { searchUser } from '@/app/utils/userManagement';
const results = searchUser(query);

// ❌ Jangan
const data = JSON.parse(localStorage.getItem('registeredUsers'));
```

### 2. **Handle Error pada Edit/Delete**
```typescript
const result = updateUserData(userId, { name: 'New Name' });
if (result.success) {
  // Refresh UI
} else {
  console.error(result.message);
}
```

### 3. **Jangan Edit localStorage Secara Langsung**
```typescript
// ❌ Jangan
localStorage.setItem('registeredUsers', JSON.stringify([...]));

// ✅ Gunakan Helper
addNewUser({...});
updateUserData(id, {...});
deleteUser(id);
```

---

## Testing Login

### Test Dummy Data
```
Email: mahasiswa1@student.ac.id
Password: student123
Expected: Login berhasil, role: student
```

### Test Registered User
1. Daftar baru dengan email `test@example.com` dan password `test123`
2. Logout
3. Login dengan kredensial tersebut
4. Expected: Login berhasil

### Test Admin-Added User
1. Admin menambah user `newstudent@university.ac.id` dengan password `pass123`
2. Logout
3. Login dengan kredensial tersebut
4. Expected: Login berhasil

---

## Debugging

### Issue: User tidak bisa login padahal email sudah terdaftar

**Solusi:**
```typescript
// Cek di console
const users = getAllUsersRealtime();
console.log(users); // Lihat semua user
const user = searchUser('email@domain.com');
console.log(user); // Cek user spesifik
```

### Issue: Data tidak tersimpan

**Solusi:**
- Pastikan localStorage tidak disabled di browser
- Check browser console untuk error messages
- Gunakan DevTools → Application → Local Storage

---

## Migration dari Sistem Lama

Jika sudah ada user di localStorage lama:
1. Data dummy akan ke-override saat pertama kali initalisasi
2. Data registrasi sebelumnya akan dipertahankan
3. Jalankan ulang aplikasi untuk full sync

---

## Notes Penting

- **Password tidak di-hash** - Untuk demo purposes saja. Gunakan bcrypt untuk production
- **No Database** - Menggunakan localStorage sebagai tempat penyimpanan
- **Session-based** - Data hilang jika clear browser storage
- **Single Device** - localStorage tidak tersinkronisasi antar perangkat
