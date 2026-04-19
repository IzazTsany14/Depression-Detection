import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  TrendingUp, 
  Calendar, 
  PlusCircle,
  BarChart3,
  User,
  Mail,
  Shield,
  Settings,
  LogOut,
  Book,
  Download,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateTestResultPDF, downloadPDF } from '../utils/pdfGenerator';

export const Dashboard: React.FC = () => {
  const { user, getTestHistory, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [counselingSessions, setCounselingSessions] = useState<any[]>([]);

  useEffect(() => {
    // Only registered users can access dashboard
    if (!user) {
      navigate('/login');
      return;
    }

    // Load test history
    const testHistory = getTestHistory();
    setHistory(testHistory);

    // Load counseling schedules
    const storedSessions = localStorage.getItem('counselingSessions');
    if (storedSessions) {
      const sessions = JSON.parse(storedSessions);
      // Filter for schedules relevant to this student (by name or nim)
      const userSessions = sessions.filter((s: any) => 
        s.studentName === user.name || s.studentNim === user.nim
      );
      setCounselingSessions(userSessions);
    }
  }, [user, navigate, getTestHistory]);

  const getColorForLevel = (level: string) => {
    switch (level) {
      case 'Normal':
        return { color: '#28A745', bgColor: '#D4EDDA', emoji: '😊' };
      case 'Ringan':
        return { color: '#FFC107', bgColor: '#FFF3CD', emoji: '😐' };
      case 'Sedang':
        return { color: '#FF9800', bgColor: '#FFE0B2', emoji: '😟' };
      case 'Berat':
        return { color: '#F44336', bgColor: '#FFCDD2', emoji: '😢' };
      case 'Sangat Berat':
        return { color: '#C62828', bgColor: '#FFCDD2', emoji: '😰' };
      default:
        return { color: '#28A745', bgColor: '#D4EDDA', emoji: '😊' };
    }
  };

  // Calculate statistics
  const totalTests = history.length;
  const latestTest = history.length > 0 ? history[history.length - 1] : null;
  const averageScore = history.length > 0 
    ? Math.round(history.reduce((sum, test) => sum + test.score, 0) / history.length)
    : 0;

  // Prepare chart data
  const chartData = history.map((test, index) => ({
    name: `Tes ${index + 1}`,
    date: new Date(test.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
    skor: test.score,
  }));

  const handleDownloadTestPDF = (test: any) => {
    const testStyle = getColorForLevel(test.level);
    const pdf = generateTestResultPDF({
      level: test.level,
      score: test.score,
      date: test.date,
      name: user?.name,
      color: testStyle.color,
      emoji: testStyle.emoji,
    });
    
    const filename = `hasil-tes-dass21-${new Date(test.date).getTime()}.pdf`;
    downloadPDF(pdf, filename);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Selamat datang kembali, <strong>{user.name}</strong>!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Tes</p>
                  <p className="text-3xl font-bold text-gray-900">{totalTests}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tes Terakhir</p>
                  <p className="text-lg font-bold text-gray-900">
                    {latestTest ? latestTest.level : '-'}
                  </p>
                  {latestTest && (
                    <p className="text-sm text-gray-500">
                      {new Date(latestTest.date).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Skor Rata-rata</p>
                  <p className="text-3xl font-bold text-gray-900">{averageScore}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Action */}
              <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <h2 className="text-2xl font-bold mb-3">
                  Mulai Tes Baru
                </h2>
                <p className="mb-6 text-blue-50">
                  Lakukan skrining DASS-21 untuk memonitor tingkat depresi Anda secara berkala
                </p>
                <Link to="/questionnaire">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Mulai Tes Sekarang
                  </Button>
                </Link>
              </Card>

              {/* Chart */}
              {history.length >= 2 && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                      Grafik Perkembangan
                    </h2>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Skor Depresi', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="skor" 
                        stroke="#4A90E2" 
                        strokeWidth={3}
                        dot={{ fill: '#4A90E2', r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Grafik perkembangan tingkat depresi berdasarkan hasil tes Anda
                  </p>
                </Card>
              )}

              {/* Counseling Schedule */}
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-purple-600" />
                    Jadwal Konseling Anda
                  </h2>
                </div>

                {counselingSessions.length > 0 ? (
                  <div className="space-y-3">
                    {counselingSessions
                      .filter(s => s.status === 'scheduled')
                      .sort((a: any, b: any) => {
                        const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
                        if (dateCompare !== 0) return dateCompare;
                        return a.time.localeCompare(b.time);
                      })
                      .length > 0 ? (
                      counselingSessions
                        .filter(s => s.status === 'scheduled')
                        .sort((a: any, b: any) => {
                          const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
                          if (dateCompare !== 0) return dateCompare;
                          return a.time.localeCompare(b.time);
                        })
                        .slice(0, 3)
                        .map((session: any) => (
                          <div 
                            key={session.id}
                            className="p-4 rounded-lg bg-white border-l-4 border-purple-500 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Clock className="w-4 h-4 text-purple-600" />
                                  <p className="font-semibold text-gray-900">
                                    {new Date(session.date).toLocaleDateString('id-ID', { 
                                      weekday: 'short',
                                      day: 'numeric', 
                                      month: 'short'
                                    })} • {session.time}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-600 ml-6">
                                  Durasi: {session.duration} menit
                                </p>
                                {session.notes && (
                                  <p className="text-xs text-gray-600 mt-1 ml-6 italic">"{session.notes}"</p>
                                )}
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                session.priority === 'high' 
                                  ? 'bg-red-100 text-red-800'
                                  : session.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {session.priority === 'high' ? 'Prioritas Tinggi' : 'Prioritas ' + (session.priority === 'medium' ? 'Sedang' : 'Rendah')}
                              </span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-6">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-600">Tidak ada jadwal terjadwal</p>
                      </div>
                    )}
                    
                    {/* Completed Sessions History */}
                    {counselingSessions.filter(s => s.status === 'completed').length > 0 && (
                      <div className="mt-6 pt-6 border-t">
                        <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Sesi Selesai ({counselingSessions.filter(s => s.status === 'completed').length})
                        </p>
                        <div className="space-y-2">
                          {counselingSessions
                            .filter(s => s.status === 'completed')
                            .sort((a: any, b: any) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime())
                            .slice(0, 2)
                            .map((session: any) => (
                              <div key={session.id} className="text-xs text-gray-600 bg-green-50 p-2 rounded">
                                <p className="font-medium text-green-900">{new Date(session.completedAt || '').toLocaleDateString('id-ID')}</p>
                                {session.completionNotes && <p className="mt-1">{session.completionNotes}</p>}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Cancelled Sessions */}
                    {counselingSessions.filter(s => s.status === 'cancelled').length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <XCircle className="w-3 h-3 text-red-600" />
                          Sesi Dibatalkan ({counselingSessions.filter(s => s.status === 'cancelled').length})
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">Belum ada jadwal konseling</p>
                    <p className="text-sm text-gray-500 mt-2">Hubungi bagian BK untuk membuat jadwal konseling</p>
                  </div>
                )}
              </Card>

              {/* Test History */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Riwayat Tes Lengkap
                  </h2>
                  <span className="text-sm text-gray-500">
                    {totalTests} tes
                  </span>
                </div>

                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.slice().reverse().map((test, index) => {
                      const testStyle = getColorForLevel(test.level);
                      return (
                        <div 
                          key={test.id}
                          className="p-4 rounded-lg border-2 flex items-center justify-between hover:shadow-md transition-shadow"
                          style={{ 
                            backgroundColor: testStyle.bgColor,
                            borderColor: testStyle.color
                          }}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <span className="text-3xl">{testStyle.emoji}</span>
                            <div>
                              <p className="font-semibold text-gray-900">
                                Tes #{history.length - index}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(test.date).toLocaleDateString('id-ID', { 
                                  weekday: 'long',
                                  day: 'numeric', 
                                  month: 'long', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-bold text-lg" style={{ color: testStyle.color }}>
                                {test.level}
                              </p>
                              <p className="text-sm text-gray-600">
                                Skor: {test.score}
                              </p>
                            </div>
                            <Button
                              onClick={() => handleDownloadTestPDF(test)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              title="Unduh hasil test sebagai PDF"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Belum ada riwayat tes</p>
                    <Link to="/questionnaire">
                      <Button>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Mulai Tes Pertama
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Profil Saya
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">Registered User</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Data terenkripsi & aman</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Links */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Menu Cepat
                </h3>
                <div className="space-y-2">
                  <Link to="/questionnaire">
                    <Button variant="outline" className="w-full justify-start">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Tes Baru
                    </Button>
                  </Link>
                  <Link to="/guide">
                    <Button variant="outline" className="w-full justify-start">
                      <Book className="w-4 h-4 mr-2" />
                      Panduan Mengatasi
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Tentang DASS-21
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Resources */}
              <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Butuh Bantuan?
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Jika Anda merasa perlu berbicara dengan seseorang, jangan ragu untuk menghubungi layanan kesehatan mental.
                </p>
                <Link to="/guide">
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    Lihat Kontak Bantuan
                  </Button>
                </Link>
              </Card>

              {/* Account Settings */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Pengaturan Akun
                </h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" disabled>
                    <Settings className="w-4 h-4 mr-2" />
                    Pengaturan (Segera)
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
