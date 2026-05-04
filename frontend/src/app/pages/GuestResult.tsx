import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../context/AuthContext';
import { calculateDepressionScore, getDepressionLevel } from '../utils/fuzzyLogic';
import { AlertTriangle, RefreshCw, UserPlus, Home, TrendingUp, Download } from 'lucide-react';
import { generateTestResultPDF, downloadPDF } from '../utils/pdfGenerator';

export const GuestResult: React.FC = () => {
  const { currentTestAnswers, isGuest } = useAuth();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // If not guest or no answers, redirect to home
    if (!isGuest || !currentTestAnswers || currentTestAnswers.length === 0) {
      navigate('/');
      return;
    }

    // Calculate result
    const score = calculateDepressionScore(currentTestAnswers);
    const level = getDepressionLevel(score);
    setResult(level);
  }, [currentTestAnswers, isGuest, navigate]);

  if (!result) {
    return null;
  }

  const handleDownloadPDF = () => {
    const pdf = generateTestResultPDF({
      level: result.level,
      score: result.score,
      date: new Date().toISOString(),
      color: result.color,
      emoji: result.emoji,
      description: result.description,
    });
    
    const filename = `hasil-tes-dass21-guest-${new Date().getTime()}.pdf`;
    downloadPDF(pdf, filename);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Guest Warning */}
          <Alert className="mb-8 bg-amber-50 border-amber-300 border-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-900">
              <strong>Anda menggunakan mode Guest.</strong> Hasil ini tidak akan disimpan setelah Anda meninggalkan website. 
              <Link to="/registration" className="ml-1 underline font-semibold hover:text-amber-700">
                Daftar/Login
              </Link> untuk menyimpan riwayat dan mendapatkan panduan mengatasi depresi.
            </AlertDescription>
          </Alert>

          {/* Result Card */}
          <Card 
            className="p-8 md:p-12 mb-8 shadow-2xl border-2"
            style={{ 
              backgroundColor: result.bgColor,
              borderColor: result.color 
            }}
          >
            <div className="text-center">
              <div className="text-6xl mb-6">{result.emoji}</div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: result.color }}>
                Tingkat Depresi: {result.level}
              </h1>
              <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md mb-6">
                <TrendingUp className="w-6 h-6" style={{ color: result.color }} />
                <span className="text-2xl font-bold" style={{ color: result.color }}>
                  Skor: {result.score}
                </span>
              </div>
              <p className="text-lg text-gray-800 max-w-2xl mx-auto leading-relaxed">
                {result.description}
              </p>
            </div>
          </Card>

          {/* Disclaimer */}
          <Card className="p-6 mb-8 bg-red-50 border-2 border-red-200">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2 text-lg">
                  Penting untuk Diperhatikan
                </h3>
                <p className="text-red-800 leading-relaxed">
                  Hasil ini <strong>bukan diagnosis medis</strong> dan hanya untuk tujuan skrining awal. 
                  Jika Anda merasa perlu bantuan atau mengalami gejala yang mengganggu, 
                  <strong> segera konsultasi dengan psikolog atau psikiater profesional</strong>.
                </p>
              </div>
            </div>
          </Card>

          {/* What's Next Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                Ingin Menyimpan Hasil?
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Daftar sekarang untuk menyimpan riwayat tes, melacak perkembangan, dan mendapatkan panduan personalisasi.
              </p>
              <Link to="/registration">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Daftar untuk Fitur Lengkap
                </Button>
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                Sudah Punya Akun?
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Login untuk menyimpan hasil tes ini dan mengakses fitur panduan mengatasi depresi.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50">
                  Login Sekarang
                </Button>
              </Link>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleDownloadPDF}
              size="lg"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-5 h-5 mr-2" />
              Unduh Hasil PDF
            </Button>
            <Link to="/questionnaire">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Ulangi Tes
              </Button>
            </Link>
            <Link to="/">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto"
              >
                <Home className="w-5 h-5 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>

          {/* Additional Resources */}
          <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">
              Butuh Bantuan Sekarang?
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Hotline Kesehatan Mental 24/7:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hotline Nasional Pencegahan Bunuh Diri: 119 (ext. 8)</li>
                <li>Into The Light Indonesia: 119</li>
                <li>LSM JARI (Jakarta): 021-9696-9293</li>
                <li>Crisis Center Kemenkes: 500-454</li>
              </ul>
              <p className="text-xs text-gray-600 italic mt-4">
                Jangan ragu untuk mencari bantuan. Kesehatan mental Anda sangat penting.
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};
