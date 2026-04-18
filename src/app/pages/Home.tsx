import React from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  Lock, 
  Zap, 
  Shield, 
  BookOpen,
  Clock,
  FileCheck,
  Heart
} from 'lucide-react';

export const Home: React.FC = () => {
  const { startAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleGuestStart = () => {
    startAsGuest();
    navigate('/questionnaire');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                Metode DASS-21 & Logika Fuzzy
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Deteksi Dini Tingkat Depresi Mahasiswa
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Lakukan skrining mandiri dengan metode DASS-21 yang ilmiah dan tervalidasi. 
                Dapatkan hasil instan dengan privasi yang terjaga.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={handleGuestStart}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  Mulai Tes Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Link to="/about">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 md:p-12">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Heart className="w-16 h-16 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800">Kesehatan Mental Anda Penting</p>
                    <p className="text-sm text-gray-600 mt-2">Kenali diri Anda lebih baik</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two Main Options */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pilih Cara Anda Memulai
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Guest Option */}
            <Card className="p-8 hover:shadow-xl transition-shadow border-2 hover:border-blue-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Coba Sekarang (Tanpa Registrasi)
                  </h3>
                  <p className="text-gray-600">
                    Langsung tes, lihat hasil, dan data tidak tersimpan
                  </p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Tidak perlu membuat akun
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Hasil langsung tersedia
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Data tidak disimpan setelah keluar
                </li>
              </ul>

              <Button
                size="lg"
                onClick={handleGuestStart}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Mulai sebagai Guest
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Card>

            {/* Registered Option */}
            <Card className="p-8 hover:shadow-xl transition-shadow border-2 hover:border-green-300 bg-gradient-to-br from-green-50 to-white">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Daftar/Login untuk Fitur Lengkap
                  </h3>
                  <p className="text-gray-600">
                    Simpan riwayat tes dan dapatkan panduan mengatasi depresi
                  </p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  Riwayat tes tersimpan otomatis
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  Akses panduan mengatasi depresi
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  Lacak perkembangan Anda
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  Unduh hasil dalam PDF
                </li>
              </ul>

              <div className="flex gap-3">
                <Link to="/login" className="flex-1">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-green-600 text-green-700 hover:bg-green-50"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/registration" className="flex-1">
                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Daftar
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-16 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Fitur Unggulan
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Hasil Instan</h3>
                <p className="text-gray-600">
                  Dapatkan hasil analisis tingkat depresi Anda dalam hitungan detik setelah menyelesaikan kuesioner
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Metode Ilmiah DASS-21</h3>
                <p className="text-gray-600">
                  Menggunakan instrumen DASS-21 yang tervalidasi secara internasional dan metode Logika Fuzzy
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Privasi Terjaga</h3>
                <p className="text-gray-600">
                  Data Anda aman dan terlindungi. Mode guest memastikan data tidak tersimpan setelah sesi berakhir
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About DASS-21 Preview */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="flex items-start gap-4 mb-6">
              <BookOpen className="w-12 h-12 flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold mb-4">Apa itu DASS-21?</h2>
                <p className="text-blue-100 text-lg mb-6">
                  Depression, Anxiety and Stress Scale (DASS-21) adalah instrumen self-report yang dirancang 
                  untuk mengukur tiga kondisi emosional negatif: depresi, kecemasan, dan stres.
                </p>
                <Link to="/about">
                  <Button size="lg" variant="secondary">
                    Pelajari Lebih Lanjut
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
