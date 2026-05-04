import React from 'react';
import { Link } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { 
  BookOpen, 
  CheckCircle, 
  FileText,
  Brain,
  TrendingUp,
  Shield,
  ArrowRight,
  ClipboardList,
  BarChart3,
  Target
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tentang DASS-21
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Depression, Anxiety and Stress Scale - Instrumen Skrining Kesehatan Mental yang Tervalidasi
            </p>
          </div>

          {/* What is DASS-21 */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Apa itu DASS-21?
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  DASS-21 (Depression, Anxiety and Stress Scale) adalah seperangkat instrumen self-report yang 
                  dirancang untuk mengukur tiga kondisi emosional negatif: <strong>depresi</strong>, <strong>kecemasan (anxiety)</strong>, 
                  dan <strong>stres</strong>.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Instrumen ini dikembangkan oleh Lovibond & Lovibond (1995) dan telah divalidasi secara 
                  internasional sebagai alat skrining yang reliabel untuk mengidentifikasi gejala-gejala 
                  gangguan kesehatan mental.
                </p>
              </div>
            </div>
          </Card>

          {/* Three Scales */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Tiga Skala DASS-21
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-blue-200">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">
                  Depresi
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Mengukur gejala seperti:
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Kehilangan minat dan kesenangan</li>
                  <li>• Rendahnya inisiatif</li>
                  <li>• Perasaan tidak berharga</li>
                  <li>• Pesimisme tentang masa depan</li>
                </ul>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-purple-200">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">
                  Kecemasan (Anxiety)
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Mengukur gejala seperti:
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Gejala fisik (gemetar, keringat)</li>
                  <li>• Ketakutan tanpa alasan jelas</li>
                  <li>• Kekhawatiran akan panik</li>
                  <li>• Mulut kering, detak jantung cepat</li>
                </ul>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-orange-200">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">
                  Stres
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Mengukur gejala seperti:
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Kesulitan untuk rileks</li>
                  <li>• Mudah tersinggung</li>
                  <li>• Reaksi berlebihan</li>
                  <li>• Gelisah dan tegang</li>
                </ul>
              </Card>
            </div>
          </div>

          {/* How It Works */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Cara Kerja DASS-21
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  DASS-21 terdiri dari <strong>21 pertanyaan</strong> yang dibagi menjadi tiga subskala 
                  (7 pertanyaan untuk setiap skala: Depresi, Anxiety, dan Stres).
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">21</div>
                <p className="text-sm text-gray-600">Pertanyaan Total</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
                <p className="text-sm text-gray-600">Subskala Terpisah</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">4</div>
                <p className="text-sm text-gray-600">Pilihan Jawaban</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-orange-600 mb-2">0-3</div>
                <p className="text-sm text-gray-600">Skala Penilaian</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Opsi Jawaban:</h4>
              <div className="grid md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-gray-900 mb-1">0</div>
                  <div className="text-sm text-gray-600">Tidak Sesuai</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-gray-900 mb-1">1</div>
                  <div className="text-sm text-gray-600">Sesuai</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-gray-900 mb-1">2</div>
                  <div className="text-sm text-gray-600">Cukup Sesuai</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-gray-900 mb-1">3</div>
                  <div className="text-sm text-gray-600">Sangat Sesuai</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Fuzzy Logic */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Metode Logika Fuzzy
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sistem ini menggunakan <strong>Logika Fuzzy</strong> untuk menginterpretasi hasil tes DASS-21. 
                  Logika fuzzy memungkinkan klasifikasi tingkat depresi yang lebih fleksibel dan mendekati 
                  penilaian manusia.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Berbeda dengan logika boolean (ya/tidak), logika fuzzy dapat menangani nilai-nilai di antara 
                  kategori yang ada, memberikan hasil yang lebih akurat dan personalisasi.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Keuntungan Logika Fuzzy:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Klasifikasi yang lebih halus dan akurat</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Dapat menangani ketidakpastian dalam data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Interpretasi yang lebih mendekati penilaian klinis</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Scoring System */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Sistem Penilaian Tingkat Depresi
            </h2>
            <p className="text-gray-700 mb-6">
              Skor depresi dihitung dengan menjumlahkan 7 item pertanyaan depresi, kemudian dikalikan 2. 
              Berikut adalah kategori tingkat depresi berdasarkan skor:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#D4EDDA' }}>
                <div className="w-20 flex-shrink-0 font-bold text-center" style={{ color: '#28A745' }}>
                  0 - 9
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Normal</div>
                  <div className="text-sm text-gray-600">Tidak ada gejala depresi yang signifikan</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#FFF3CD' }}>
                <div className="w-20 flex-shrink-0 font-bold text-center" style={{ color: '#FFC107' }}>
                  10 - 13
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Ringan</div>
                  <div className="text-sm text-gray-600">Gejala depresi ringan, perlu perhatian</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#FFE0B2' }}>
                <div className="w-20 flex-shrink-0 font-bold text-center" style={{ color: '#FF9800' }}>
                  14 - 20
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Sedang</div>
                  <div className="text-sm text-gray-600">Disarankan berkonsultasi dengan profesional</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#FFCDD2' }}>
                <div className="w-20 flex-shrink-0 font-bold text-center" style={{ color: '#F44336' }}>
                  21 - 27
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Berat</div>
                  <div className="text-sm text-gray-600">Sangat disarankan segera berkonsultasi</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#FFCDD2' }}>
                <div className="w-20 flex-shrink-0 font-bold text-center" style={{ color: '#C62828' }}>
                  28+
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Sangat Berat</div>
                  <div className="text-sm text-gray-600">Butuh intervensi profesional segera</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Important Notes */}
          <Card className="p-8 mb-8 bg-amber-50 border-2 border-amber-300">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-amber-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Catatan Penting
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      DASS-21 adalah alat <strong>skrining</strong>, bukan alat diagnostik. 
                      Hasil tidak dapat menggantikan evaluasi profesional.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Hasil tes hanya mencerminkan kondisi Anda dalam <strong>seminggu terakhir</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Jika Anda mengalami gejala yang mengganggu atau berkepanjangan, 
                      <strong> segera konsultasi dengan psikolog atau psikiater</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Sistem ini dikembangkan untuk keperluan <strong>penelitian akademik</strong> 
                      dan skrining mandiri.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Siap untuk Memulai Tes?
            </h2>
            <p className="text-gray-600 mb-6">
              Lakukan skrining mandiri sekarang dan kenali kondisi kesehatan mental Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/questionnaire">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Mulai Tes DASS-21
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline">
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
