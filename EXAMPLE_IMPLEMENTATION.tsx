// ============================================================================
// CONTOH IMPLEMENTASI: Admin User Management dengan Real-Time System
// ============================================================================
// File: src/app/pages/AdminUserManagement.tsx (bagian yang sudah ada)
// Perbaikan: Mengintegrasikan userManagement utility untuk better practices
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/AuthContext';
import { Users, Search, Plus, Edit2, Trash2 } from 'lucide-react';

// ✅ IMPORT utility functions
import {
  getAllUsersRealtime,
  getUsersByRole,
  addNewUser,
  updateUserData,
  deleteUser,
  searchUser,
  getStudentStats
} from '../utils/userManagement';

export const AdminUserManagementOptimized: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'admin' | 'bk'>('all');
  const [loading, setLoading] = useState(false);

  // ✅ Load users ketika component mount
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    loadUsers();
  }, [user, navigate]);

  // ✅ Gunakan utility untuk load users (real-time)
  const loadUsers = () => {
    try {
      const allUsers = getAllUsersRealtime();
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  // ✅ Gunakan utility untuk filter & search
  const getFilteredUsers = () => {
    let filtered = users;

    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(u => u.role === filterRole);
    }

    // Search
    if (searchTerm) {
      filtered = searchUser(searchTerm).filter(u => {
        if (filterRole !== 'all') {
          return u.role === filterRole;
        }
        return true;
      });
    }

    return filtered;
  };

  // ✅ Gunakan utility untuk add user
  const handleAddUser = async (userData: any) => {
    setLoading(true);
    try {
      const result = addNewUser({
        id: `user_${Date.now()}`,
        ...userData
      });

      if (result.success) {
        toast.success(result.message); // Assuming toast is imported
        loadUsers(); // Refresh list
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Gagal menambahkan user');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Gunakan utility untuk update user
  const handleEditUser = async (userId: string, updatedData: any) => {
    setLoading(true);
    try {
      const result = updateUserData(userId, updatedData);

      if (result.success) {
        toast.success(result.message);
        loadUsers(); // Refresh list
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Gagal mengupdate user');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Gunakan utility untuk delete user
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      return;
    }

    setLoading(true);
    try {
      const result = deleteUser(userId);

      if (result.success) {
        toast.success(result.message);
        loadUsers(); // Refresh list
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Gagal menghapus user');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Utility untuk get stats
  const getStats = () => {
    const stats = getStudentStats();
    const totalUsers = users.length;
    const studentCount = getUsersByRole('student').length;
    const adminCount = getUsersByRole('admin').length;
    const bkCount = getUsersByRole('bk').length;

    return {
      total: totalUsers,
      students: studentCount,
      admins: adminCount,
      bks: bkCount,
      ...stats
    };
  };

  const stats = getStats();
  const filteredUsers = getFilteredUsers();

  // ============================================================================
  // UI IMPLEMENTATION (sama seperti sebelumnya, tapi dengan data yang benar)
  // ============================================================================

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DashboardSidebar role="admin" />

      <div className="flex-1">
        <main className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Manajemen User
            </h1>
            <p className="text-gray-600">
              Total {stats.total} pengguna | {stats.students} mahasiswa | {stats.admins} admin | {stats.bks} BK
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Total User</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Users className="w-12 h-12 text-blue-600" />
              </div>
            </Card>
            {/* Stats card lainnya... */}
          </div>

          {/* Search & Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">Semua Role</option>
              <option value="student">Mahasiswa</option>
              <option value="admin">Admin</option>
              <option value="bk">BK</option>
            </select>
            <Button onClick={() => { /* Open add user dialog */ }}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah User
            </Button>
          </div>

          {/* Users Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Nama</th>
                    <th className="px-6 py-3 text-left font-semibold">Email</th>
                    <th className="px-6 py-3 text-left font-semibold">Role</th>
                    <th className="px-6 py-3 text-left font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((userItem) => (
                      <tr key={userItem.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{userItem.name}</td>
                        <td className="px-6 py-4">{userItem.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {userItem.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { /* Edit user */ }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(userItem.id)}
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        Tidak ada user yang sesuai
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

// ============================================================================
// CONTOH: Form Component untuk Tambah/Edit User
// ============================================================================

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

interface AddUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => Promise<void>;
  initialData?: any;
  isLoading?: boolean;
}

export const AddUserForm: React.FC<AddUserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: initialData?.password || '',
    role: initialData?.role || 'student',
    nim: initialData?.nim || '',
    nik: initialData?.nik || '',
    faculty: initialData?.faculty || '',
    major: initialData?.major || '',
    semester: initialData?.semester || '1'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error untuk field ini
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email tidak valid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (formData.role === 'student') {
      if (!formData.nim.trim()) {
        newErrors.nim = 'NIM wajib diisi';
      }
      if (!formData.faculty.trim()) {
        newErrors.faculty = 'Fakultas wajib diisi';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit User' : 'Tambah User Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
          <div>
            <label className="block text-sm font-semibold mb-1">Nama</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama lengkap"
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              disabled={isLoading}
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="student">Mahasiswa</option>
              <option value="admin">Admin</option>
              <option value="bk">BK</option>
            </select>
          </div>

          {formData.role === 'student' && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-1">NIM</label>
                <Input
                  name="nim"
                  value={formData.nim}
                  onChange={handleChange}
                  placeholder="Nomor Induk Mahasiswa"
                  disabled={isLoading}
                />
                {errors.nim && <p className="text-red-600 text-sm mt-1">{errors.nim}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Fakultas</label>
                <Input
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  placeholder="Fakultas"
                  disabled={isLoading}
                />
                {errors.faculty && <p className="text-red-600 text-sm mt-1">{errors.faculty}</p>}
              </div>
            </>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// NOTES:
// ============================================================================
// ✅ Gunakan getAllUsersRealtime() untuk load data real-time dari localStorage
// ✅ Gunakan helper functions untuk add, update, delete operations
// ✅ UI akan otomatis update karena data di-refresh dari localStorage
// ✅ Tidak perlu manipulasi localStorage secara langsung
// ✅ Error handling sudah built-in dalam utility functions
// ============================================================================
