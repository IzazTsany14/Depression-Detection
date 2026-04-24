import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn, AlertCircle, Mail, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

export const Login: React.FC = () => {
  const { login, startAsGuest, user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email dan password harus diisi');
      return;
    }

    setLoading(true);
    const success = await login(formData.email, formData.password);
    setLoading(false);

    if (success) {
      // Get user from localStorage to check role
      const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');

      // Redirect based on role
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else if (loggedInUser.role === 'bk') {
        navigate('/bk');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Email atau password salah. Silakan coba lagi.');
    }
  };

  const handleGuestAccess = () => {
    startAsGuest();
    navigate('/questionnaire');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail) {
      setForgotPasswordMessage({ type: 'error', text: 'Masukkan email terlebih dahulu' });
      return;
    }

    // Simulate sending password reset email
    // In a real app, this would call a backend API to send a reset email
    setForgotPasswordMessage({ 
      type: 'success', 
      text: `Link reset password telah dikirim ke ${forgotPasswordEmail}. Silakan cek email Anda dan ikuti instruksi.` 
    });

    // Reset form after 3 seconds and close dialog
    setTimeout(() => {
      setForgotPasswordEmail('');
      setForgotPasswordMessage(null);
      setShowForgotPassword(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Masuk ke Akun Anda
              </h1>
              <p className="text-gray-600">
                Akses riwayat tes dan panduan personalisasi
              </p>
            </div>

            {error && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className="mt-1"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Masuk...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{' '}
                <Link to="/registration" className="text-blue-600 hover:underline font-medium">
                  Daftar sekarang
                </Link>
              </p>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Atau</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-700 mb-3">
                Ingin mencoba dulu tanpa membuat akun?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleGuestAccess}
                className="w-full"
              >
                Lanjut sebagai Guest
              </Button>
            </div>
          </Card>

          {/* Demo Credentials - untuk testing */}
          <Card className="p-6 mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
            <h3 className="font-semibold text-gray-900 mb-4 text-center">
              🔐 Demo Credentials (untuk Testing)
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white p-3 rounded-lg">
                <p className="font-semibold text-blue-900 mb-1">👤 Mahasiswa</p>
                <p className="text-gray-600">Email: <code className="bg-gray-100 px-2 py-0.5 rounded">mahasiswa1@student.ac.id</code></p>
                <p className="text-gray-600">Password: <code className="bg-gray-100 px-2 py-0.5 rounded">student123</code></p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="font-semibold text-purple-900 mb-1">👨‍⚕️ Konselor BK</p>
                <p className="text-gray-600">Email: <code className="bg-gray-100 px-2 py-0.5 rounded">bk@university.ac.id</code></p>
                <p className="text-gray-600">Password: <code className="bg-gray-100 px-2 py-0.5 rounded">bk123</code></p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="font-semibold text-red-900 mb-1">⚙️ Admin</p>
                <p className="text-gray-600">Email: <code className="bg-gray-100 px-2 py-0.5 rounded">admin@university.ac.id</code></p>
                <p className="text-gray-600">Password: <code className="bg-gray-100 px-2 py-0.5 rounded">admin123</code></p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Reset Password
            </DialogTitle>
            <DialogDescription>
              Masukkan email Anda untuk menerima link reset password
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleForgotPassword} className="space-y-4 py-4">
            {forgotPasswordMessage && (
              <Alert className={`${forgotPasswordMessage.type === 'success' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                {forgotPasswordMessage.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={forgotPasswordMessage.type === 'success' ? 'text-green-900' : 'text-red-900'}>
                  {forgotPasswordMessage.text}
                </AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => {
                  setForgotPasswordEmail(e.target.value);
                  setForgotPasswordMessage(null);
                }}
                placeholder="nama@email.com"
                className="mt-1"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Kirim Link Reset
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordEmail('');
                  setForgotPasswordMessage(null);
                }}
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
