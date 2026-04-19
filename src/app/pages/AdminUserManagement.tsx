import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useAuth } from '../context/AuthContext';
import { Users, Search, Plus, Edit2, Trash2, Filter, CheckCircle2, XCircle, User } from 'lucide-react';
import { dummyUsers } from '../data/dummyData';

export const AdminUserManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState(dummyUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'admin' | 'bk'>('all');
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<'student' | 'admin' | 'bk' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    nim: '',
    nik: '',
    faculty: '',
    major: '',
    semester: '1',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

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

    if (selectedUserType === 'student') {
      if (!formData.nim.trim()) {
        newErrors.nim = 'NIM wajib diisi';
      }
      if (!formData.nik.trim()) {
        newErrors.nik = 'NIK wajib diisi';
      }
      if (!formData.faculty.trim()) {
        newErrors.faculty = 'Fakultas wajib diisi';
      }
      if (!formData.major.trim()) {
        newErrors.major = 'Jurusan wajib diisi';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = () => {
    if (!validateForm()) return;

    const newUser = {
      id: `${selectedUserType}-${Date.now()}`,
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: selectedUserType as 'student' | 'admin' | 'bk',
      ...(selectedUserType === 'student' && {
        nim: formData.nim,
        nik: formData.nik,
        faculty: formData.faculty,
        major: formData.major,
        semester: parseInt(formData.semester),
      }),
    };

    setUsers([...users, newUser]);
    resetForm();
    setShowAddUserDialog(false);
    alert('User berhasil ditambahkan!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      nim: '',
      nik: '',
      faculty: '',
      major: '',
      semester: '1',
    });
    setSelectedUserType(null);
    setErrors({});
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.nik && u.nik.includes(searchTerm)) ||
      (u.nim && u.nim.includes(searchTerm));
    
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'bk':
        return 'bg-purple-100 text-purple-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'bk':
        return 'Bimbingan Konseling';
      case 'student':
        return 'Mahasiswa';
      default:
        return role;
    }
  };

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    admins: users.filter(u => u.role === 'admin').length,
    bk: users.filter(u => u.role === 'bk').length,
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DashboardSidebar role="admin" />

      <div className="flex-1">
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Manajemen User
            </h1>
            <p className="text-gray-600 text-lg">
              Kelola pengguna sistem deteksi depresi
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total User</p>
                  <h3 className="text-3xl font-bold text-blue-900 mt-2">{stats.total}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Mahasiswa</p>
                  <h3 className="text-3xl font-bold text-green-900 mt-2">{stats.students}</h3>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">BK</p>
                  <h3 className="text-3xl font-bold text-purple-900 mt-2">{stats.bk}</h3>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Admin</p>
                  <h3 className="text-3xl font-bold text-orange-900 mt-2">{stats.admins}</h3>
                </div>
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama, email, NIM, atau NIK..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterRole === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterRole('all')}
                  className={filterRole === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Semua
                </Button>
                <Button
                  variant={filterRole === 'student' ? 'default' : 'outline'}
                  onClick={() => setFilterRole('student')}
                  className={filterRole === 'student' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  Mahasiswa
                </Button>
                <Button
                  variant={filterRole === 'bk' ? 'default' : 'outline'}
                  onClick={() => setFilterRole('bk')}
                  className={filterRole === 'bk' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  BK
                </Button>
                <Button
                  variant={filterRole === 'admin' ? 'default' : 'outline'}
                  onClick={() => setFilterRole('admin')}
                  className={filterRole === 'admin' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  Admin
                </Button>
              </div>
              <Button 
                onClick={() => setShowAddUserDialog(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah User
              </Button>
            </div>
          </Card>

          {/* Users Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">NIM</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fakultas</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((u, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{u.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{u.nim || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(u.role)}`}>
                          {getRoleLabel(u.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{u.faculty || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">Aktif</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Tidak ada user ditemukan</p>
              </div>
            )}
          </Card>

          {/* Add User Dialog */}
          <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah User Baru</DialogTitle>
                <DialogDescription>
                  Pilih tipe user dan isi informasi sesuai dengan tipenya
                </DialogDescription>
              </DialogHeader>

              {!selectedUserType ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                  {/* Mahasiswa Card */}
                  <button
                    onClick={() => setSelectedUserType('student')}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                  >
                    <div className="text-4xl mb-3">👨‍🎓</div>
                    <h3 className="font-semibold text-gray-900 mb-2">Mahasiswa</h3>
                    <p className="text-sm text-gray-600">Tambahkan data mahasiswa dengan NIM, fakultas, dll</p>
                  </button>

                  {/* BK Card */}
                  <button
                    onClick={() => setSelectedUserType('bk')}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                  >
                    <div className="text-4xl mb-3">👨‍⚕️</div>
                    <h3 className="font-semibold text-gray-900 mb-2">BK</h3>
                    <p className="text-sm text-gray-600">Tambahkan staf Bimbingan Konseling</p>
                  </button>

                  {/* Admin Card */}
                  <button
                    onClick={() => setSelectedUserType('admin')}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                  >
                    <div className="text-4xl mb-3">⚙️</div>
                    <h3 className="font-semibold text-gray-900 mb-2">Admin</h3>
                    <p className="text-sm text-gray-600">Tambahkan admin sistem</p>
                  </button>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  {/* Back Button */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedUserType(null);
                      setErrors({});
                    }}
                    className="w-full"
                  >
                    ← Kembali Pilih Tipe User
                  </Button>

                  {/* Common Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan nama lengkap"
                    />
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan email"
                    />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan password (minimal 6 karakter)"
                    />
                    {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                  </div>

                  {/* Student-Specific Fields */}
                  {selectedUserType === 'student' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            NIM *
                          </label>
                          <input
                            type="text"
                            value={formData.nim}
                            onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nomor Induk Mahasiswa"
                          />
                          {errors.nim && <p className="text-xs text-red-600 mt-1">{errors.nim}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            NIK *
                          </label>
                          <input
                            type="text"
                            value={formData.nik}
                            onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nomor Induk Kependudukan"
                          />
                          {errors.nik && <p className="text-xs text-red-600 mt-1">{errors.nik}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fakultas *
                        </label>
                        <input
                          type="text"
                          value={formData.faculty}
                          onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Contoh: Fakultas Ilmu Komputer"
                        />
                        {errors.faculty && <p className="text-xs text-red-600 mt-1">{errors.faculty}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jurusan *
                          </label>
                          <input
                            type="text"
                            value={formData.major}
                            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Contoh: Teknik Informatika"
                          />
                          {errors.major && <p className="text-xs text-red-600 mt-1">{errors.major}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Semester
                          </label>
                          <select
                            value={formData.semester}
                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                              <option key={sem} value={sem}>Semester {sem}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetForm();
                        setShowAddUserDialog(false);
                      }}
                      className="flex-1"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleAddUser}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Simpan User
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};
