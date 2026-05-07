import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useAuth } from '../../context/AuthContext';
import { Lock, AlertCircle, CheckCircle2, ImagePlus } from 'lucide-react';
import { ProfileAvatar } from '../../components/ProfileAvatar';
import { readProfileImageFile } from '../../utils/profileUpdate';

export const AdminProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileImage, setProfileImage] = useState<{ dataUrl: string; fileName: string } | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    setFormData(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || ''
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
      const res = await fetch(`/api/users/${user?.accountId || user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          department: (user as any)?.department || null,
          profileImage,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Gagal memperbarui profil');
      const updatedUser = updateUser(data.user);
      setProfilePreview(updatedUser.profile_picture || null);
      setProfileImage(null);
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Gagal memperbarui profil' });
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru tidak cocok' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password minimal 6 karakter' });
      return;
    }

    // TODO: Implement actual password change logic
    setMessage({ type: 'success', text: 'Password berhasil diubah' });
    setShowPasswordForm(false);
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DashboardSidebar role="admin" />

      <div className="flex-1">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Pengaturan Profil</h2>
        </div>

        <main className="p-8">
          <div className="max-w-2xl">
            {message && (
              <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                {message.type === 'success' ? (
                  <CheckCircle2 className={`h-5 w-5 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <AlertDescription className={message.type === 'success' ? 'text-green-900' : 'text-red-900'}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Profil Information */}
            <Card className="p-6 bg-white mb-6">
              <div className="flex items-center gap-6 mb-8">
                <ProfileAvatar
                  profilePicture={profilePreview}
                  className="w-24 h-24"
                  iconClassName="w-12 h-12 text-white"
                  fallbackClassName="bg-blue-600"
                  alt={`Foto profil ${user?.name || 'admin'}`}
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{user?.name}</h3>
                  <p className="text-gray-600">Administrator Sistem</p>
                  <p className="text-sm text-gray-500 mt-1">ID: {user?.id}</p>
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
                       "/>
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

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </Card>

            {/* Security Section */}
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Keamanan
              </h3>

              {!showPasswordForm ? (
                <Button
                  onClick={() => setShowPasswordForm(true)}
                  variant="outline"
                  className="text-blue-600 border-blue-300"
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
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Simpan Password Baru
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
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
