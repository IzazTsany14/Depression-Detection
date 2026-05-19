import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useAuth } from '../../context/AuthContext';
import { Lock, BookOpen, AlertCircle, ArrowLeft, ImagePlus } from 'lucide-react';
import { ProfileAvatar } from '../../components/ProfileAvatar';
import { apiUrl } from '../../utils/api';
import { readProfileImageFile } from '../../utils/profileUpdate';
import { showSuccessDialog } from '../../utils/successDialog';
import { changeAccountPassword } from '../../utils/passwordChange';

export const StudentProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nim: '',
    nik: '',
    faculty: '',
    major: '',
    semester: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileImage, setProfileImage] = useState<{ dataUrl: string; fileName: string } | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
      return;
    }

    setFormData(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      nim: user.nim || '',
      nik: user.nik || '',
      faculty: user.faculty || '',
      major: user.major || '',
      semester: String(user.semester || ''),
    }));
    setProfilePreview(user.profile_picture || null);
  }, [user, navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const image = await readProfileImageFile(file);
      setProfileImage(image);
      setProfilePreview(image.dataUrl);
      setMessage(null);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
      e.target.value = '';
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(apiUrl(`/users/${user?.accountId || user?.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          nim: formData.nim,
          nik: formData.nik,
          faculty: formData.faculty,
          major: formData.major,
          semester: Number(formData.semester),
          profileImage,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Gagal memperbarui profil');
      const updatedUser = updateUser(data.user);
      setProfilePreview(updatedUser.profile_picture || null);
      setProfileImage(null);
      showSuccessDialog('Data berhasil diperbarui');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Gagal memperbarui profil' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru tidak cocok' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password minimal 6 karakter' });
      return;
    }

    try {
      setIsChangingPassword(true);
      await changeAccountPassword(
        String(user?.accountId || user?.id),
        formData.currentPassword,
        formData.newPassword
      );
      setMessage({ type: 'success', text: 'Password berhasil diubah. Gunakan password baru saat login berikutnya.' });
      showSuccessDialog('Password berhasil diubah');
      setShowPasswordForm(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Gagal mengubah password' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h1>
          </div>
        </div>

        <main className="p-8">
          <div className="max-w-2xl mx-auto">
            {message && (
              <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <AlertCircle className={`h-5 w-5 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
                <AlertDescription className={message.type === 'success' ? 'text-green-900' : 'text-red-900'}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Profile Information */}
            <Card className="p-6 bg-white mb-6">
              <div className="flex items-center gap-6 mb-8">
                <ProfileAvatar
                  profilePicture={profilePreview}
                  className="w-24 h-24"
                  iconClassName="w-12 h-12 text-white"
                  fallbackClassName="bg-gradient-to-br from-purple-400 to-purple-600"
                  alt={`Foto profil ${user?.name || 'mahasiswa'}`}
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{user?.name}</h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Mahasiswa
                  </p>
                  <div className="text-sm text-gray-500 mt-2 space-y-1">
                    <p>NIM: {user?.nim || '-'}</p>
                    <p>NIK: {user?.nik || '-'}</p>
                    {user?.faculty && <p>Fakultas: {user.faculty}</p>}
                    {user?.major && <p>Program Studi: {user.major}</p>}
                    {user?.semester && <p>Semester: {user.semester}</p>}
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <Label htmlFor="profileImage">Foto Profil PNG/JPG</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <Input id="profileImage" type="file" accept="image/png,image/jpeg" onChange={handleProfileImageChange}
                    className="
                    file:mr-5
                    file:rounded-md
                    file:border-0
                    file:bg-blue-600
                     file:px-4 file:py-0
                     file:text-sm
                     file:font-medium
                     file:text-white
                     hover:file:bg-blue-700
                      cursor-pointer
                       " />
                    <ImagePlus className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Maksimal 2MB.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="Masukkan email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nim">NIM</Label>
                    <Input
                      id="nim"
                      value={formData.nim}
                      onChange={(e) => handleChange('nim', e.target.value)}
                      placeholder="Nomor Induk Mahasiswa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nik">NIK</Label>
                    <Input
                      id="nik"
                      value={formData.nik}
                      onChange={(e) => handleChange('nik', e.target.value)}
                      placeholder="Nomor Induk Kependudukan"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="faculty">Fakultas</Label>
                    <Input
                      id="faculty"
                      value={formData.faculty}
                      onChange={(e) => handleChange('faculty', e.target.value)}
                      placeholder="Contoh: Fakultas Ilmu Komputer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="major">Program Studi</Label>
                    <Input
                      id="major"
                      value={formData.major}
                      onChange={(e) => handleChange('major', e.target.value)}
                      placeholder="Contoh: Teknik Informatika"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <select
                    id="semester"
                    value={formData.semester}
                    onChange={(e) => handleChange('semester', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Pilih Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </Card>

            {/* Security Section */}
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" />
                Keamanan
              </h3>

              {!showPasswordForm ? (
                <Button 
                  onClick={() => {
                    setMessage(null);
                    setShowPasswordForm(true);
                  }}
                  variant="outline"
                  className="text-purple-600 border-purple-300"
                >
                  Ubah Password
                </Button>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Password Saat Ini</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => handleChange('currentPassword', e.target.value)}
                      placeholder="Masukkan password saat ini"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">Password Baru</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => handleChange('newPassword', e.target.value)}
                      placeholder="Masukkan password baru"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Konfirmasi password baru"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={isChangingPassword} className="bg-purple-600 hover:bg-purple-700">
                      {isChangingPassword ? 'Menyimpan...' : 'Simpan Password Baru'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      disabled={isChangingPassword}
                      onClick={() => setShowPasswordForm(false)}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

