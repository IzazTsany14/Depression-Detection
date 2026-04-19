import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, RefreshCw, BookOpen, Download, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateTestResultPDF, downloadPDF } from '../utils/pdfGenerator';

export const RegisteredResult: React.FC = () => {
  const { user, getTestHistory } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [latestResult, setLatestResult] = useState<any>(null);

  useEffect(() => {
    // If not logged in, redirect
    if (!user) {
      navigate('/');
      return;
    }

    // Get test history
    const testHistory = getTestHistory();
    setHistory(testHistory);

    // Get latest result
    if (testHistory.length > 0) {
      setLatestResult(testHistory[testHistory.length - 1]);
    }
  }, [user, navigate, getTestHistory]);

  if (!latestResult) {
    return null;
  }

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

  const resultStyle = getColorForLevel(latestResult.level);

  // Prepare chart data
  const chartData = history.map((test, index) => ({
    name: `Tes ${index + 1}`,
    date: new Date(test.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
    skor: test.score,
  }));

  const handleDownloadPDF = () => {
    const pdf = generateTestResultPDF({
      level: latestResult.level,
      score: latestResult.score,
      date: latestResult.date,
      name: user?.name,
      color: resultStyle.color,
      emoji: resultStyle.emoji,
    });
    
    const filename = `hasil-tes-dass21-${new Date().getTime()}.pdf`;
    downloadPDF(pdf, filename);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Halo, {user?.name}! 👋
            </h1>
            <p className="text-gray-600">
              Berikut adalah hasil tes DASS-21 terbaru Anda
            </p>
          </div>

          {/* Latest Result Card */}
          <Card 
            className="p-8 md:p-12 mb-8 shadow-2xl border-2 relative overflow-hidden"
            style={{ 
              backgroundColor: resultStyle.bgColor,
              borderColor: resultStyle.color 
            }}
          >
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white shadow-md">
                <Calendar className="w-3 h-3 mr-1" />
                Tes Terbaru
              </span>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-6">{resultStyle.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: resultStyle.color }}>
                Tingkat Depresi: {latestResult.level}
              </h2>
              <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md mb-4">
                <TrendingUp className="w-6 h-6" style={{ color: resultStyle.color }} />
                <span className="text-2xl font-bold" style={{ color: resultStyle.color }}>
                  Skor: {latestResult.score}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Tanggal Tes: {new Date(latestResult.date).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Button 
                onClick={handleDownloadPDF}
                className="bg-white hover:bg-gray-100"
                style={{ color: resultStyle.color }}
              >
                <Download className="w-4 h-4 mr-2" />
                Unduh Hasil PDF
              </Button>
              <Link to="/guide">
                <Button 
                  className="w-full sm:w-auto"
                  style={{ 
                    backgroundColor: resultStyle.color,
                    color: 'white'
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Lihat Panduan Mengatasi
                </Button>
              </Link>
            </div>
          </Card>

          {/* Disclaimer */}
          <Alert className="mb-8 bg-red-50 border-2 border-red-200">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Penting:</strong> Hasil ini bukan diagnosis medis dan hanya untuk skrining awal. 
              Jika Anda merasa perlu bantuan, segera konsultasi dengan psikolog atau psikiater profesional.
            </AlertDescription>
          </Alert>

          {/* History and Chart Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Chart */}
            {history.length >= 2 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Grafik Perkembangan
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      label={{ value: 'Skor', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="skor" 
                      stroke="#4A90E2" 
                      strokeWidth={2}
                      dot={{ fill: '#4A90E2', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Grafik menunjukkan perkembangan tingkat depresi Anda dari waktu ke waktu
                </p>
              </Card>
            )}

            {/* Test History */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                Riwayat Tes Anda
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {history.length > 0 ? (
                  history.slice().reverse().map((test, index) => {
                    const testStyle = getColorForLevel(test.level);
                    return (
                      <div 
                        key={test.id}
                        className="p-4 rounded-lg border-2 flex items-center justify-between"
                        style={{ 
                          backgroundColor: testStyle.bgColor,
                          borderColor: testStyle.color
                        }}
                      >
                        <div>
                          <p className="text-sm text-gray-600">
                            {new Date(test.date).toLocaleDateString('id-ID', { 
                              day: '2-digit', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </p>
                          <p className="font-semibold" style={{ color: testStyle.color }}>
                            {test.level} (Skor: {test.score})
                          </p>
                        </div>
                        <span className="text-2xl">{testStyle.emoji}</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm text-center py-8">
                    Belum ada riwayat tes
                  </p>
                )}
              </div>
              {history.length > 3 && (
                <Link to="/dashboard" className="block mt-4">
                  <Button variant="outline" className="w-full" size="sm">
                    Lihat Semua Riwayat
                  </Button>
                </Link>
              )}
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/questionnaire">
              <Button 
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Tes Lagi
              </Button>
            </Link>
            <Link to="/guide">
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-green-600 text-green-700 hover:bg-green-50"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Ke Halaman Panduan
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
