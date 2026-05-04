import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  Users, 
  Stethoscope, 
  BookOpen, 
  Phone, 
  Video,
  Sun,
  Moon,
  Activity,
  Brain,
  Music,
  Coffee,
  TreePine,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PDFViewer } from '../components/PDFViewer';

export const Guide: React.FC = () => {
  const { user, getTestHistory } = useAuth();
  const navigate = useNavigate();
  const [latestResult, setLatestResult] = useState<any>(null);

  useEffect(() => {
    // Only registered users can access this page
    if (!user) {
      navigate('/login');
      return;
    }

    // Get latest test result
    const history = getTestHistory();
    if (history.length > 0) {
      setLatestResult(history[history.length - 1]);
    }
  }, [user, navigate, getTestHistory]);

  const getRecommendationByLevel = (level: string) => {
    switch (level) {
      case 'Normal':
        return {
          title: 'Pertahankan Kesehatan Mental Anda',
          description: 'Anda dalam kondisi yang baik. Terus jaga kesehatan mental dengan kebiasaan positif.',
          focus: ['Maintenance', 'Prevention']
        };
      case 'Ringan':
        return {
          title: 'Fokus pada Self-Care',
          description: 'Tingkatkan aktivitas self-care dan monitor kondisi Anda secara berkala.',
          focus: ['Self-Care', 'Lifestyle']
        };
      case 'Sedang':
        return {
          title: 'Pertimbangkan Konseling Profesional',
          description: 'Disarankan untuk berkonsultasi dengan profesional kesehatan mental.',
          focus: ['Professional Help', 'Self-Care']
        };
      case 'Berat':
      case 'Sangat Berat':
        return {
          title: 'Segera Cari Bantuan Profesional',
          description: 'Sangat penting untuk segera berkonsultasi dengan psikolog atau psikiater.',
          focus: ['Immediate Professional Help', 'Crisis Support']
        };
      default:
        return {
          title: 'Panduan Umum',
          description: 'Berikut adalah panduan umum untuk menjaga kesehatan mental.',
          focus: ['General']
        };
    }
  };

  const recommendation = latestResult ? getRecommendationByLevel(latestResult.level) : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Panduan Mengatasi Depresi
            </h1>
            <p className="text-gray-600 text-lg">
              Rekomendasi personalisasi berdasarkan hasil tes Anda
            </p>
          </div>

          {/* Personalized Recommendation */}
          {latestResult && recommendation && (
            <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {recommendation.title}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Berdasarkan hasil tes terakhir Anda (<strong>Tingkat Depresi: {latestResult.level}</strong>), {recommendation.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.focus.map((focus, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Important Disclaimer */}
          <Alert className="mb-8 bg-amber-50 border-2 border-amber-300">
            <Lock className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-900">
              <strong>Catatan Penting:</strong> Panduan ini bersifat edukatif dan umum, <strong>bukan pengganti terapi profesional</strong>. 
              Untuk kondisi depresi sedang hingga berat, sangat disarankan untuk berkonsultasi dengan psikolog atau psikiater.
            </AlertDescription>
          </Alert>

          {/* Tabbed Content */}
          <Tabs defaultValue="self-help" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-3xl mx-auto">
              <TabsTrigger value="self-help">Self-Help</TabsTrigger>
              <TabsTrigger value="professional">Bantuan Profesional</TabsTrigger>
              <TabsTrigger value="community">Komunitas</TabsTrigger>
              <TabsTrigger value="reference">Referensi</TabsTrigger>
            </TabsList>

            {/* Self-Help Tab */}
            <TabsContent value="self-help" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Strategi Penanganan Mandiri
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Physical Health */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Kesehatan Fisik
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Olahraga Teratur:</strong> 30 menit/hari, 3-5x seminggu
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Pola Makan Sehat:</strong> Konsumsi makanan bergizi seimbang
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Tidur Cukup:</strong> 7-9 jam per malam
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Hindari Alkohol:</strong> Batasi atau hindari konsumsi alkohol
                      </div>
                    </li>
                  </ul>
                </Card>

                {/* Mental Wellness */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Kesehatan Mental
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Meditasi & Mindfulness:</strong> 10-15 menit per hari
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Journaling:</strong> Tulis perasaan dan pikiran Anda
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Teknik Pernapasan:</strong> Latihan pernapasan dalam
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Batasi Media Sosial:</strong> Kurangi screen time
                      </div>
                    </li>
                  </ul>
                </Card>

                {/* Social Connection */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Koneksi Sosial
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Berbicara dengan Teman:</strong> Sharing dengan orang terdekat
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Bergabung Aktivitas Sosial:</strong> Ikut kegiatan komunitas
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Hindari Isolasi:</strong> Jangan mengurung diri
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Volunteer:</strong> Bantu orang lain untuk merasa lebih baik
                      </div>
                    </li>
                  </ul>
                </Card>

                {/* Enjoyable Activities */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Music className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Aktivitas Menyenangkan
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Hobi Kreatif:</strong> Melukis, menulis, musik
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Aktivitas Luar Ruangan:</strong> Berjalan di alam, berkebun
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Baca Buku:</strong> Literatur yang inspiratif
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Dengarkan Musik:</strong> Musik yang menenangkan atau energik
                      </div>
                    </li>
                  </ul>
                </Card>
              </div>

              {/* Daily Routine Suggestion */}
              <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sun className="w-6 h-6 text-amber-600" />
                  Contoh Rutinitas Harian Sehat
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Sun className="w-5 h-5 text-amber-500" />
                      Pagi (06:00 - 12:00)
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Bangun pada waktu yang sama setiap hari</li>
                      <li>• Sarapan bergizi</li>
                      <li>• Olahraga ringan 20-30 menit</li>
                      <li>• Meditasi atau journaling 10 menit</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Coffee className="w-5 h-5 text-amber-600" />
                      Siang (12:00 - 18:00)
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Makan siang sehat</li>
                      <li>• Istirahat sejenak (power nap 15-20 menit)</li>
                      <li>• Aktivitas produktif atau belajar</li>
                      <li>• Interaksi sosial dengan teman</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <TreePine className="w-5 h-5 text-green-600" />
                      Sore (18:00 - 21:00)
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Aktivitas hobi atau olahraga</li>
                      <li>• Makan malam keluarga</li>
                      <li>• Batasi screen time</li>
                      <li>• Aktivitas relaksasi</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Moon className="w-5 h-5 text-indigo-600" />
                      Malam (21:00 - 23:00)
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Rutinitas sebelum tidur yang konsisten</li>
                      <li>• Hindari kafein dan layar gadget</li>
                      <li>• Baca buku atau dengarkan musik tenang</li>
                      <li>• Tidur pada waktu yang sama setiap malam</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Professional Help Tab */}
            <TabsContent value="professional" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Bantuan Profesional Kesehatan Mental
              </h2>

              {/* When to Seek Help */}
              <Card className="p-6 bg-red-50 border-2 border-red-200">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-red-900 mb-3">
                      Kapan Harus Mencari Bantuan Profesional?
                    </h3>
                    <ul className="space-y-2 text-red-800">
                      <li>• Gejala depresi berlangsung lebih dari 2 minggu</li>
                      <li>• Mengganggu aktivitas sehari-hari (kuliah, kerja, hubungan)</li>
                      <li>• Muncul pikiran untuk menyakiti diri sendiri atau bunuh diri</li>
                      <li>• Mengalami gejala fisik yang tidak bisa dijelaskan</li>
                      <li>• Self-help tidak memberikan perbaikan</li>
                      <li>• Merasa tidak mampu mengatasi sendiri</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Types of Professional Help */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Psikolog
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Profesional kesehatan mental yang memberikan psikoterapi dan konseling.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Cognitive Behavioral Therapy (CBT)</li>
                    <li>• Terapi interpersonal</li>
                    <li>• Terapi kelompok</li>
                    <li>• Konseling individual</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Psikiater
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Dokter spesialis yang dapat meresepkan obat dan memberikan terapi medis.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Evaluasi medis lengkap</li>
                    <li>• Resep obat antidepresan jika diperlukan</li>
                    <li>• Kombinasi terapi obat dan psikoterapi</li>
                    <li>• Penanganan kondisi berat</li>
                  </ul>
                </Card>
              </div>

              {/* Crisis Hotlines */}
              <Card className="p-6 bg-blue-50 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Hotline Krisis 24/7
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Hotline Nasional</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-1">119 (ext. 8)</p>
                    <p className="text-sm text-gray-600">Pencegahan Bunuh Diri</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Into The Light</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-1">119</p>
                    <p className="text-sm text-gray-600">24 Jam</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">LSM JARI (Jakarta)</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-1">021-9696-9293</p>
                    <p className="text-sm text-gray-600">Senin-Jumat 09:00-17:00</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Crisis Center Kemenkes</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-1">500-454</p>
                    <p className="text-sm text-gray-600">24 Jam</p>
                  </div>
                </div>
              </Card>

              {/* Campus Resources */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-green-600" />
                  Layanan Konseling Kampus
                </h3>
                <p className="text-gray-700 mb-4">
                  Banyak universitas menyediakan layanan konseling gratis untuk mahasiswa. 
                  Hubungi bagian kemahasiswaan atau Unit Pelayanan Psikologi kampus Anda.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Tip:</strong> Jangan ragu untuk memanfaatkan layanan ini. Semua informasi bersifat rahasia (confidential) 
                    dan profesional konseling terlatih untuk membantu Anda.
                  </p>
                </div>
              </Card>

              {/* Online Therapy */}
              <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Video className="w-6 h-6 text-purple-600" />
                  Platform Konseling Online
                </h3>
                <p className="text-gray-700 mb-4">
                  Jika Anda lebih nyaman dengan konseling online, beberapa platform menyediakan layanan ini:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Halodoc:</strong> Konsultasi dengan psikolog via chat/video call</li>
                  <li>• <strong>Kalm:</strong> Platform kesehatan mental Indonesia</li>
                  <li>• <strong>Riliv:</strong> Konseling dan meditasi</li>
                  <li>• <strong>Ibunda.id:</strong> Konseling untuk berbagai usia</li>
                </ul>
                <p className="text-xs text-gray-500 mt-4 italic">
                  *Informasi di atas hanya untuk referensi. Pastikan untuk mengecek kredensial profesional.
                </p>
              </Card>
            </TabsContent>

            {/* Community Tab */}
            <TabsContent value="community" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Dukungan Komunitas dan Peer Support
              </h2>

              <Alert className="bg-blue-50 border-blue-200">
                <Users className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  Berbagi pengalaman dengan orang lain yang memahami apa yang Anda rasakan dapat sangat membantu 
                  dalam proses pemulihan.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Support Group
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Kelompok dukungan memberikan ruang aman untuk berbagi pengalaman, strategi coping, dan saling mendukung.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Pertemuan rutin (online atau offline)</li>
                    <li>• Fasilitasi oleh profesional atau peer leader</li>
                    <li>• Sharing dalam lingkungan yang aman dan rahasia</li>
                    <li>• Belajar dari pengalaman orang lain</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Komunitas Online
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Platform online yang menyediakan ruang untuk diskusi dan dukungan kesehatan mental.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Forum anonim untuk berbagi cerita</li>
                    <li>• Grup Facebook/WhatsApp support group</li>
                    <li>• Reddit communities (r/indonesia, r/mentalhealth)</li>
                    <li>• Discord servers untuk mental health</li>
                  </ul>
                </Card>
              </div>

              <Card className="p-6 bg-green-50 border-2 border-green-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Tips Bergabung dengan Support Group
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">✓ DO:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Bersikap terbuka dan jujur</li>
                      <li>• Hormati privasi anggota lain</li>
                      <li>• Dengarkan tanpa menghakimi</li>
                      <li>• Berbagi pengalaman Anda</li>
                      <li>• Cari grup yang sesuai dengan kebutuhan</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">✗ DON'T:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Memaksa diri jika tidak nyaman</li>
                      <li>• Memberikan nasihat medis</li>
                      <li>• Membagikan informasi pribadi orang lain</li>
                      <li>• Mengharapkan solusi instan</li>
                      <li>• Mengabaikan bantuan profesional</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Aktivitas Komunitas Kampus
                </h3>
                <p className="text-gray-700 mb-4">
                  Banyak kampus memiliki organisasi mahasiswa yang fokus pada kesehatan mental dan well-being:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <strong className="text-gray-800">UKM Pecinta Alam/Olahraga:</strong>
                      <p className="text-sm text-gray-600">Aktivitas outdoor yang baik untuk kesehatan mental</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <strong className="text-gray-800">Peer Counseling:</strong>
                      <p className="text-sm text-gray-600">Mahasiswa terlatih yang siap mendengarkan</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <strong className="text-gray-800">Mental Health Awareness Campaign:</strong>
                      <p className="text-sm text-gray-600">Edukasi dan destigmatisasi kesehatan mental</p>
                    </div>
                  </li>
                </ul>
              </Card>
            </TabsContent>

            {/* Reference Tab */}
            <TabsContent value="reference" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Referensi Penelitian
              </h2>

              <Alert className="bg-purple-50 border-purple-200">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <AlertDescription className="text-purple-900">
                  Berikut adalah dokumen referensi penelitian yang menjadi dasar pengembangan sistem ini.
                  Dokumen ini berisi informasi tentang metode DASS-21 dan logika fuzzy yang digunakan.
                </AlertDescription>
              </Alert>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Dokumen: Kelompok 8 - Sistem Deteksi Depresi
                </h3>
                <PDFViewer file="/src/imports/2024K_Kelompok_8.pdf" />
              </Card>
            </TabsContent>
          </Tabs>

          {/* Bottom CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/questionnaire">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                Tes Ulang
              </Button>
            </Link>
            <Link to="/result/registered">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Kembali ke Hasil
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
