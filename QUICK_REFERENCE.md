# Quick Reference: Real-Time Login System

## Import yang Perlu

```typescript
// Dari AuthContext (untuk login/register)
import { useAuth } from '@/app/context/AuthContext';

// Dari userManagement utility
import {
  getAllUsersRealtime,
  getUsersByRole,
  addNewUser,
  updateUserData,
  deleteUser,
  searchUser,
  getUserByEmail,
  getUserById,
  getStudentStats
} from '@/app/utils/userManagement';

// Dari dummyData
import {
  authenticateUser,
  getAllUsers,
  addUserFromAdmin,
  getUserById as getDummyUserById,
  updateUser as updateDummyUser
} from '@/app/data/dummyData';
```

---

## Component: Login

```typescript
const { login } = useAuth();

// Login user
const success = await login(email, password);
if (success) {
  // User logged in successfully
  navigate('/dashboard');
} else {
  // Login failed
  setError('Email atau password salah');
}
```

---

## Component: Register

```typescript
const { register } = useAuth();

// Register new user
const success = await register(name, email, password);
if (success) {
  // Auto login and redirect
  navigate('/dashboard');
} else {
  // Email sudah terdaftar
  setError('Email sudah terdaftar');
}
```

---

## Component: Get Current User

```typescript
const { user } = useAuth();

if (user) {
  console.log(user.name, user.role);
} else {
  // User not logged in
}
```

---

## Admin: List All Users

```typescript
import { getAllUsersRealtime } from '@/app/utils/userManagement';

const allUsers = getAllUsersRealtime();
// Output: UserWithPassword[]
```

---

## Admin: Add New User

```typescript
import { addNewUser } from '@/app/utils/userManagement';

const result = addNewUser({
  id: `user_${Date.now()}`,
  name: 'John Doe',
  email: 'john@university.ac.id',
  password: 'securePass123',
  role: 'student',
  faculty: 'Fakultas Teknik',
  major: 'Informatika',
  nim: '2021110001',
  nik: '3201051998123001',
  semester: 4
});

if (result.success) {
  toast.success(result.message);
} else {
  toast.error(result.message);
}
```

---

## Admin: Update User

```typescript
import { updateUserData } from '@/app/utils/userManagement';

const result = updateUserData('user_123', {
  name: 'New Name',
  faculty: 'Fakultas Hukum'
});

if (result.success) {
  // Success
} else {
  // Failed
}
```

---

## Admin: Delete User

```typescript
import { deleteUser } from '@/app/utils/userManagement';

const result = deleteUser('user_123');

if (result.success) {
  // Success - user and all related data deleted
} else {
  // Failed
}
```

---

## Admin: Search User

```typescript
import { searchUser } from '@/app/utils/userManagement';

// Cari by name, email, NIM, NIK, atau ID
const results = searchUser('john');           // Search by name
const results = searchUser('john@university.ac.id'); // Search by email
const results = searchUser('2021110001');     // Search by NIM
const results = searchUser('3201051998123001'); // Search by NIK
```

---

## Admin: Filter Users by Role

```typescript
import { getUsersByRole } from '@/app/utils/userManagement';

const students = getUsersByRole('student');
const admins = getUsersByRole('admin');
const bks = getUsersByRole('bk');
```

---

## Admin: Get User Statistics

```typescript
import { getStudentStats } from '@/app/utils/userManagement';

const stats = getStudentStats();
// {
//   totalStudents: 20,
//   totalTests: 45,
//   levelDistribution: { Normal: 5, Ringan: 8, Sedang: 12, Berat: 3, SangatBerat: 1 },
//   criticalCases: 4
// }
```

---

## Admin: Get User by Email or ID

```typescript
import { getUserByEmail, getUserById } from '@/app/utils/userManagement';

const user1 = getUserByEmail('john@university.ac.id');
const user2 = getUserById('user_123');
```

---

## Testing: Dummy Account Credentials

```typescript
// Admin
admin@university.ac.id / admin123

// BK
bk@university.ac.id / bk123
bk2@university.ac.id / bk123

// Students
mahasiswa1@student.ac.id / student123
mahasiswa2@student.ac.id / student123
// ... hingga mahasiswa20@student.ac.id / student123
```

---

## Common Patterns

### Pattern 1: Form Add/Edit User di Admin Panel

```typescript
const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
const [editingUserId, setEditingUserId] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (editingUserId) {
    // Update existing
    const result = updateUserData(editingUserId, formData);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
  } else {
    // Add new
    const result = addNewUser({
      id: `user_${Date.now()}`,
      ...formData
    });
    if (!result.success) {
      toast.error(result.message);
      return;
    }
  }
  
  toast.success('Berhasil disimpan');
  // Refresh list
};
```

### Pattern 2: Search & Filter User

```typescript
const [searchTerm, setSearchTerm] = useState('');

const handleSearch = (query: string) => {
  setSearchTerm(query);
};

const filteredUsers = 
  searchTerm.length > 0 
    ? searchUser(searchTerm)
    : getAllUsersRealtime();
```

### Pattern 3: Export User List ke CSV

```typescript
const exportUsers = () => {
  const users = getAllUsersRealtime();
  const csv = [
    ['ID', 'Nama', 'Email', 'Role', 'NIM', 'Fakultas'],
    ...users.map(u => [u.id, u.name, u.email, u.role, u.nim || '', u.faculty || ''])
  ]
    .map(row => row.join(','))
    .join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users.csv';
  a.click();
};
```

---

## Troubleshooting

### Q: User tidak bisa login padahal sudah terdaftar
**A:** Cek di console:
```typescript
const users = getAllUsersRealtime();
console.log(users.filter(u => u.email === 'test@example.com'));
```

### Q: Data tidak tersimpan setelah tambah user
**A:** Pastikan menggunakan helper function, tidak manipulasi localStorage langsung

### Q: Password user lupa
**A:** Update password via updateUserData:
```typescript
updateUserData(userId, { password: 'newPassword123' });
```

### Q: Perlu reset semua data
**A:** 
```typescript
localStorage.removeItem('registeredUsers');
localStorage.removeItem('adminAddedUsers');
localStorage.removeItem('dummyDataInitialized');
// Refresh page
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────┐
│         Login / Register Form                │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│    authenticateUser() / register()           │
└─────────────────────────────────────────────┘
              ↓
      ┌───────┴────────┐
      ↓                ↓
┌──────────────┐  ┌─────────────────────┐
│ localStorage │  │   dummyData fallback│
│  (registered)│  │   (if not found)    │
└──────────────┘  └─────────────────────┘
      ↓                ↓
┌─────────────────────────────────────────────┐
│  Merge & Check Credentials                   │
└─────────────────────────────────────────────┘
      ↓
  ✓ / ✗
```

---

## Next Steps

1. Integrasikan `addNewUser` ke Admin User Management Form ✓
2. Gunakan `getUsersByRole` untuk dashboard stats
3. Implementasikan search dengan `searchUser`
4. Setup export data functionality
5. Add audit log untuk admin actions
