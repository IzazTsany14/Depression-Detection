import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useAuth } from '../../context/AuthContext';
import { apiUrl } from '../../utils/api';
import { ProfileAvatar } from '../../components/ProfileAvatar';
import { Users, Search, Plus, Edit2, Trash2, CheckCircle2, XCircle, Power, Eye, EyeOff } from 'lucide-react';
import { showSuccessDialog } from '../../utils/successDialog';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  nim: '',
  nik: '',
  nip: '',
  nidn: '',
  nuptk: '',
  faculty: '',
  major: '',
  semester: '1',
};

const isUserActive = (value: unknown) => (
  value === true ||
  value === 1 ||
  value === '1' ||
  String(value).toLowerCase() === 'true'
);

export const AdminUserManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'admin' | 'bk'>('all');
  const [filterFaculty, setFilterFaculty] = useState<string>('all');
  const [filterMajor, setFilterMajor] = useState<string>('all');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<'student' | 'admin' | 'bk' | null>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/users'), {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Gagal mengambil user');
      setUsers(data.data || []);
    } catch (error: any) {
      alert(error.message || 'Gagal mengambil user dari database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    loadUsers();
  }, [user, navigate]);

  const resetForm = () => {
    setFormData(emptyForm);
    setSelectedUserType(null);
    setEditingUser(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email tidak valid';
    }

    if (!editingUser && !formData.password.trim()) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (selectedUserType === 'student') {
      if (!formData.nim.trim()) newErrors.nim = 'NIM wajib diisi';
      if (!formData.nik.trim()) newErrors.nik = 'NIK wajib diisi';
      if (!formData.faculty.trim()) newErrors.faculty = 'Fakultas wajib diisi';
      if (!formData.major.trim()) newErrors.major = 'Jurusan wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditUser = (userToEdit: any) => {
    setEditingUser(userToEdit);
    setSelectedUserType(userToEdit.role);
    setFormData({
      name: userToEdit.name || '',
      email: userToEdit.email || '',
      password: '',
      nim: userToEdit.nim || '',
      nik: userToEdit.nik || '',
      nip: userToEdit.nip || '',
      nidn: userToEdit.nidn || '',
      nuptk: userToEdit.nuptk || '',
      faculty: userToEdit.faculty || '',
      major: userToEdit.major || '',
      semester: String(userToEdit.semester || '1'),
    });
    setShowDialog(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUserType || !validateForm()) return;

    const payload = {
      ...formData,
      role: selectedUserType,
      semester: Number(formData.semester),
    };

    try {
      const res = await fetch(editingUser ? apiUrl(`/users/${editingUser.account_id || editingUser.accountId}`) : apiUrl('/users'), {
        method: editingUser ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Gagal menyimpan user');

      await loadUsers();
      resetForm();
      setShowDialog(false);
      showSuccessDialog(editingUser ? 'Data berhasil diperbarui' : 'Data berhasil ditambahkan');
    } catch (error: any) {
      alert(error.message || 'Gagal menyimpan user');
    }
  };

  const handleDeleteUser = async (userToDelete: any) => {
    if (!window.confirm(`Hapus user ${userToDelete.name}? Data profile dan relasinya akan terhapus dari database.`)) return;

    try {
      const res = await fetch(apiUrl(`/users/${userToDelete.account_id || userToDelete.accountId}`), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Gagal menghapus user');
      await loadUsers();
      showSuccessDialog('Data berhasil dihapus');
    } catch (error: any) {
      alert(error.message || 'Gagal menghapus user');
    }
  };


  const handleToggleStudentStatus = async (userToToggle: any) => {
    const isActive = isUserActive(userToToggle.is_active ?? userToToggle.isActive);
    const nextStatus = !isActive;
    const actionLabel = nextStatus ? 'aktifkan' : 'nonaktifkan';

    if (!window.confirm(`Yakin ingin ${actionLabel} mahasiswa ${userToToggle.name}?`)) return;

    try {
      const res = await fetch(apiUrl(`/users/${userToToggle.account_id || userToToggle.accountId}/status`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ isActive: nextStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Gagal mengubah status mahasiswa');
      await loadUsers();
      showSuccessDialog(data.message || 'Status mahasiswa berhasil diperbarui');
    } catch (error: any) {
      alert(error.message || 'Gagal mengubah status mahasiswa');
    }
  };
  const filteredUsers = users.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      String(item.name || '').toLowerCase().includes(term) ||
      String(item.email || '').toLowerCase().includes(term) ||
      String(item.nik || '').includes(searchTerm) ||
      String(item.nim || '').includes(searchTerm);

    return matchesSearch &&
      (filterRole === 'all' || item.role === filterRole) &&
      (filterFaculty === 'all' || item.faculty === filterFaculty) &&
      (filterMajor === 'all' || item.major === filterMajor);
  });

  const studentUsers = users.filter((item) => item.role === 'student');
  const faculties = Array.from(new Set(studentUsers.map((item) => item.faculty).filter(Boolean))).sort();
  const majors = filterFaculty === 'all'
    ? Array.from(new Set(studentUsers.map((item) => item.major).filter(Boolean))).sort()
    : Array.from(new Set(studentUsers.filter((item) => item.faculty === filterFaculty).map((item) => item.major).filter(Boolean))).sort();

  const stats = {
    total: users.length,
    students: users.filter((item) => item.role === 'student').length,
    admins: users.filter((item) => item.role === 'admin').length,
    bk: users.filter((item) => item.role === 'bk').length,
  };

  const getRoleBadge = (role: string) => ({
    admin: 'bg-blue-100 text-blue-800',
    bk: 'bg-purple-100 text-purple-800',
    student: 'bg-green-100 text-green-800',
  }[role] || 'bg-gray-100 text-gray-800');

  const getRoleLabel = (role: string) => ({
    admin: 'Administrator',
    bk: 'Bimbingan Konseling',
    student: 'Mahasiswa',
  }[role] || role);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DashboardSidebar role="admin" />

      <div className="flex-1">
        <main className="p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Manajemen User</h1>
              <p className="text-gray-600 text-lg">Kelola pengguna langsung dari database Supabase</p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Terhubung ke Supabase
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              ['Total User', stats.total, 'bg-blue-600'],
              ['Mahasiswa', stats.students, 'bg-green-600'],
              ['BK', stats.bk, 'bg-purple-600'],
              ['Admin', stats.admins, 'bg-orange-600'],
            ].map(([label, value, iconBg]) => (
              <Card key={String(label)} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
                  </div>
                  <div className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center`}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari nama, email, NIM, atau NIK..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button onClick={() => setShowDialog(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah User
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {(['all', 'student', 'bk', 'admin'] as const).map((role) => (
                  <Button
                    key={role}
                    variant={filterRole === role ? 'default' : 'outline'}
                    onClick={() => setFilterRole(role)}
                    size="sm"
                    className={filterRole === role ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    {role === 'all' ? 'Semua' : getRoleLabel(role)}
                  </Button>
                ))}
              </div>

              {(filterRole === 'all' || filterRole === 'student') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={filterFaculty}
                    onChange={(event) => {
                      setFilterFaculty(event.target.value);
                      setFilterMajor('all');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">Semua Fakultas</option>
                    {faculties.map((faculty) => <option key={faculty} value={faculty}>{faculty}</option>)}
                  </select>
                  <select
                    value={filterMajor}
                    onChange={(event) => setFilterMajor(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">Semua Program Studi</option>
                    {majors.map((major) => <option key={major} value={major}>{major}</option>)}
                  </select>
                </div>
              )}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-white">Pengguna</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-white">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-white">NIM/NIP</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-white">Peran</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-white">Fakultas</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-white">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-white">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((item) => (
                    <tr key={item.account_id} className={`transition-colors ${isUserActive(item.is_active ?? item.isActive) ? 'hover:bg-gray-50' : 'bg-red-50/40 hover:bg-red-50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ProfileAvatar profilePicture={item.profile_picture} className="w-10 h-10" />
                          <div className="font-medium text-gray-900">{item.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.nim || item.nip || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(item.role)}`}>
                          {getRoleLabel(item.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.faculty || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {!isUserActive(item.is_active ?? item.isActive) ? (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-sm font-medium text-red-700">Nonaktif</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-sm font-medium text-green-700">Aktif</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {item.role === 'student' && (
                            <Button
                              onClick={() => handleToggleStudentStatus(item)}
                              variant="outline"
                              size="sm"
                              className={!isUserActive(item.is_active ?? item.isActive) ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}
                              title={!isUserActive(item.is_active ?? item.isActive) ? 'Aktifkan mahasiswa' : 'Nonaktifkan mahasiswa'}
                            >
                              <Power className="w-4 h-4" />
                            </Button>
                          )}
                          <Button onClick={() => handleEditUser(item)} variant="outline" size="sm" title="Edit user">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => handleDeleteUser(item)} variant="outline" size="sm" className="text-red-600 hover:bg-red-50" title="Hapus user">
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
                <p className="text-gray-600">{loading ? 'Memuat data user...' : 'Tidak ada user ditemukan'}</p>
              </div>
            )}
          </Card>

          <Dialog open={showDialog} onOpenChange={(open) => {
            if (!open) resetForm();
            setShowDialog(open);
          }}>
            <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-3xl overflow-hidden p-0 flex flex-col">
              <DialogHeader className="border-b px-6 py-5">
                <DialogTitle>{editingUser ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
                <DialogDescription>
                  Data akan disimpan ke Supabase. Foto profil diubah dari halaman profil masing-masing user.
                </DialogDescription>
              </DialogHeader>

              <div className="min-h-0 flex-1 overflow-y-auto px-6">
                {!selectedUserType && !editingUser ? (
                  <div className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-2 lg:grid-cols-3">
                    {(['student', 'bk', 'admin'] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedUserType(role)}
                        className="min-w-0 rounded-lg border-2 border-gray-200 p-5 text-center transition-all hover:border-blue-500 hover:bg-blue-50"
                      >
                        <Users className="w-10 h-10 mx-auto mb-3 text-blue-600" />
                        <h3 className="mb-2 text-base font-semibold leading-snug text-gray-900">{getRoleLabel(role)}</h3>
                        <p className="mx-auto max-w-[14rem] text-sm leading-snug text-gray-600">
                          Tambah user {getRoleLabel(role).toLowerCase()}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 py-5">
                    {!editingUser && (
                      <Button variant="outline" onClick={() => setSelectedUserType(null)} className="w-full">
                        Kembali Pilih Tipe User
                      </Button>
                    )}

                    <Field label="Nama Lengkap *" value={formData.name} error={errors.name} onChange={(value) => setFormData({ ...formData, name: value })} />
                    <Field label="Email *" type="email" value={formData.email} error={errors.email} onChange={(value) => setFormData({ ...formData, email: value })} />
                    <Field
                      label={editingUser ? 'Password Baru' : 'Password *'}
                      type="password"
                      value={formData.password}
                      error={errors.password}
                      placeholder={editingUser ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'}
                      onChange={(value) => setFormData({ ...formData, password: value })}
                    />

                    {selectedUserType === 'student' && (
                      <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Field label="NIM *" value={formData.nim} error={errors.nim} onChange={(value) => setFormData({ ...formData, nim: value })} />
                          <Field label="NIK *" value={formData.nik} error={errors.nik} onChange={(value) => setFormData({ ...formData, nik: value })} />
                        </div>
                        <Field label="Fakultas *" value={formData.faculty} error={errors.faculty} onChange={(value) => setFormData({ ...formData, faculty: value })} />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Field label="Jurusan *" value={formData.major} error={errors.major} onChange={(value) => setFormData({ ...formData, major: value })} />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                            <select value={formData.semester} onChange={(event) => setFormData({ ...formData, semester: event.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => <option key={semester} value={semester}>Semester {semester}</option>)}
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedUserType === 'bk' && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Field label="NIP" value={formData.nip} onChange={(value) => setFormData({ ...formData, nip: value })} />
                        <Field label="NIDN" value={formData.nidn} onChange={(value) => setFormData({ ...formData, nidn: value })} />
                        <Field label="NUPTK" value={formData.nuptk} onChange={(value) => setFormData({ ...formData, nuptk: value })} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 border-t px-6 py-4 sm:flex-row">
                <Button variant="outline" onClick={() => { resetForm(); setShowDialog(false); }} className="flex-1">
                  Batal
                </Button>
                <Button onClick={handleSaveUser} disabled={!selectedUserType} className="flex-1 bg-green-600 hover:bg-green-700">
                  {editingUser ? 'Simpan Perubahan' : 'Simpan User'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
  type = 'text',
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  placeholder?: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="min-w-0">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className={isPassword ? 'relative' : undefined}>
        <input
          type={isPassword && showPassword ? 'text' : type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isPassword ? 'pr-11' : ''}`}
          placeholder={placeholder}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
};



