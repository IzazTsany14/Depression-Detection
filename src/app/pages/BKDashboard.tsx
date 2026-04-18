import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../context/AuthContext';
import { getStudentsNeedingAttention } from '../data/dummyData';
import { MedicalRecordForm, MedicalRecord } from '../components/MedicalRecordForm';
import { MedicalRecordList } from '../components/MedicalRecordList';
import { MedicalRecordDetail } from '../components/MedicalRecordDetail';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Phone,
  Mail,
  Heart,
  CheckCircle2,
  XCircle,
  Minus,
  Plus,
  FolderOpen,
  LayoutDashboard
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export const BKDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [studentsNeedingAttention, setStudentsNeedingAttention] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'medical-records'>('dashboard');
  const [showMedicalRecordForm, setShowMedicalRecordForm] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'bk') {
      navigate('/login');
      return;
    }

    const students = getStudentsNeedingAttention();
    setStudentsNeedingAttention(students);

    const savedRecords = localStorage.getItem('medicalRecords');
    if (savedRecords) {
      setMedicalRecords(JSON.parse(savedRecords));
    }
  }, [user, navigate]);

  const handleSaveMedicalRecord = (record: MedicalRecord) => {
    const updatedRecords = [...medicalRecords, record];
    setMedicalRecords(updatedRecords);
    localStorage.setItem('medicalRecords', JSON.stringify(updatedRecords));
    setShowMedicalRecordForm(false);
  };

  const handleDeleteMedicalRecord = (id: string) => {
    const updatedRecords = medicalRecords.filter(r => r.id !== id);
    setMedicalRecords(updatedRecords);
    localStorage.setItem('medicalRecords', JSON.stringify(updatedRecords));
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'worsening':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'Sangat Berat':
        return 'bg-purple-100 border-purple-300 text-purple-900';
      case 'Berat':
        return 'bg-red-100 border-red-300 text-red-900';
      case 'Sedang':
        return 'bg-orange-100 border-orange-300 text-orange-900';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-900';
    }
  };

  const renderStudentDetail = (student: any) => {
    const chartData = student.testHistory
      .slice()
      .reverse()
      .map((test: any, index: number) => ({
        id: `test-${student.npm}-${index}-${test.date}`,
        test: `Tes ${index + 1}`,
        skor: test.score,
        tanggal: new Date(test.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        timestamp: test.date
      }));

    return (
      <Card className="p-6 bg-white">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{student.name}</h3>
              <p className="text-gray-600">NPM: {student.npm}</p>
            </div>
            <Button onClick={() => setSelectedStudent(null)} variant="outline" size="sm">
              Tutup
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Fakultas</p>
              <p className="font-semibold text-gray-900">{student.faculty}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Program Studi</p>
              <p className="font-semibold text-gray-900">{student.major}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Semester</p>
              <p className="font-semibold text-gray-900">{student.semester}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-semibold text-gray-900">{student.email}</p>
            </div>
          </div>

          <Alert className={`mb-6 border-2 ${getPriorityColor(student.latestTest.level)}`}>
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription>
              <strong>Status Terbaru:</strong> Tingkat Depresi {student.latestTest.level} (Skor: {student.latestTest.score})
              <br />
              <span className="text-sm">
                Tes terakhir: {new Date(student.latestTest.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </AlertDescription>
          </Alert>

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Skor Tes</h4>
            <ResponsiveContainer width="100%" height={250} key={`chart-${student.npm}`}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" tickFormatter={(value, index) => chartData[index]?.tanggal || ''} />
                <YAxis domain={[0, 70]} />
                <Tooltip labelFormatter={(value, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.tanggal;
                  }
                  return value;
                }} />
                <Legend />
                <Line type="monotone" dataKey="skor" stroke="#F44336" strokeWidth={2} name="Skor Depresi" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-600" />
              Rekomendasi Tindakan
            </h4>
            <div className="space-y-3">
              {student.latestTest.level === 'Sangat Berat' && (
                <>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-800">
                      <strong>URGENT:</strong> Segera hubungi mahasiswa untuk sesi konseling individual
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-800">
                      Pertimbangkan rujukan ke psikiater untuk evaluasi lebih lanjut
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-800">
                      Informasikan ke orang tua/wali (dengan persetujuan mahasiswa)
                    </p>
                  </div>
                </>
              )}
              {student.latestTest.level === 'Berat' && (
                <>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-800">
                      Jadwalkan sesi konseling dalam 1-2 hari
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-800">
                      Monitor secara berkala (minimal 1x seminggu)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-800">
                      Berikan panduan self-care dan coping strategies
                    </p>
                  </div>
                </>
              )}
              {student.trend === 'improving' && (
                <Alert className="bg-green-50 border-green-200">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <AlertDescription className="text-green-900">
                    <strong>Good Progress!</strong> Mahasiswa menunjukkan perbaikan. Terus berikan dukungan dan monitoring.
                  </AlertDescription>
                </Alert>
              )}
              {student.trend === 'worsening' && (
                <Alert className="bg-red-50 border-red-200">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-900">
                    <strong>Warning!</strong> Kondisi memburuk. Tingkatkan intensitas intervensi.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Phone className="w-4 h-4 mr-2" />
                Hubungi Mahasiswa
              </Button>
              <Button variant="outline" className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Kirim Email
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <DashboardSidebar role="bk" />

      <div className="flex-1">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant={activeView === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveView('dashboard')}
              className={activeView === 'dashboard' ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard Kasus
            </Button>
            <Button
              variant={activeView === 'medical-records' ? 'default' : 'outline'}
              onClick={() => setActiveView('medical-records')}
              className={activeView === 'medical-records' ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Rekam Medis
            </Button>
          </div>
        </div>

        <main className="p-8">
          {activeView === 'dashboard' ? (
            <div>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Dashboard Bimbingan Konseling
                </h1>
                <p className="text-gray-600 text-lg">
                  Selamat datang, {user?.name}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-700">Kasus Perlu Perhatian</p>
                      <h3 className="text-3xl font-bold text-red-900 mt-2">
                        {studentsNeedingAttention.length}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">Sangat Berat</p>
                      <h3 className="text-3xl font-bold text-purple-900 mt-2">
                        {studentsNeedingAttention.filter(s => s.latestTest.level === 'Sangat Berat').length}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700">Berat</p>
                      <h3 className="text-3xl font-bold text-orange-900 mt-2">
                        {studentsNeedingAttention.filter(s => s.latestTest.level === 'Berat').length}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </div>

              {selectedStudent ? (
                renderStudentDetail(selectedStudent)
              ) : (
                <Tabs defaultValue="urgent" className="space-y-6">
                  <TabsList className="grid grid-cols-3 w-full max-w-2xl">
                    <TabsTrigger value="urgent">Urgent (Sangat Berat)</TabsTrigger>
                    <TabsTrigger value="high">Prioritas Tinggi (Berat)</TabsTrigger>
                    <TabsTrigger value="all">Semua Kasus</TabsTrigger>
                  </TabsList>

                  <TabsContent value="urgent" className="space-y-4">
                    <Alert className="bg-purple-50 border-2 border-purple-300">
                      <AlertTriangle className="h-5 w-5 text-purple-600" />
                      <AlertDescription className="text-purple-900">
                        <strong>Perhatian!</strong> Mahasiswa dengan tingkat depresi sangat berat memerlukan intervensi segera.
                      </AlertDescription>
                    </Alert>

                    {studentsNeedingAttention
                      .filter(s => s.latestTest.level === 'Sangat Berat')
                      .map((student, index) => (
                        <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-2 border-purple-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
                                {getTrendIcon(student.trend)}
                              </div>
                              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                                <p>NPM: {student.npm}</p>
                                <p>Fakultas: {student.faculty}</p>
                                <p>Prodi: {student.major}</p>
                                <p>Semester: {student.semester}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                                  {student.latestTest.level}
                                </span>
                                <span className="text-sm text-gray-600">
                                  Skor: {student.latestTest.score}
                                </span>
                                <span className="text-sm text-gray-600">
                                  Total Tes: {student.totalTests}
                                </span>
                              </div>
                            </div>
                            <Button onClick={() => setSelectedStudent(student)} className="bg-purple-600 hover:bg-purple-700">
                              Lihat Detail
                            </Button>
                          </div>
                        </Card>
                      ))}

                    {studentsNeedingAttention.filter(s => s.latestTest.level === 'Sangat Berat').length === 0 && (
                      <div className="text-center py-12">
                        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <p className="text-gray-600">Tidak ada kasus sangat berat saat ini</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="high" className="space-y-4">
                    <Alert className="bg-red-50 border-2 border-red-300">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <AlertDescription className="text-red-900">
                        Mahasiswa dengan tingkat depresi berat perlu dijadwalkan untuk konseling.
                      </AlertDescription>
                    </Alert>

                    {studentsNeedingAttention
                      .filter(s => s.latestTest.level === 'Berat')
                      .map((student, index) => (
                        <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-2 border-red-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
                                {getTrendIcon(student.trend)}
                              </div>
                              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                                <p>NPM: {student.npm}</p>
                                <p>Fakultas: {student.faculty}</p>
                                <p>Prodi: {student.major}</p>
                                <p>Semester: {student.semester}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium">
                                  {student.latestTest.level}
                                </span>
                                <span className="text-sm text-gray-600">
                                  Skor: {student.latestTest.score}
                                </span>
                                <span className="text-sm text-gray-600">
                                  Total Tes: {student.totalTests}
                                </span>
                              </div>
                            </div>
                            <Button onClick={() => setSelectedStudent(student)} className="bg-red-600 hover:bg-red-700">
                              Lihat Detail
                            </Button>
                          </div>
                        </Card>
                      ))}

                    {studentsNeedingAttention.filter(s => s.latestTest.level === 'Berat').length === 0 && (
                      <div className="text-center py-12">
                        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <p className="text-gray-600">Tidak ada kasus berat saat ini</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="all" className="space-y-4">
                    {studentsNeedingAttention.map((student, index) => (
                      <Card key={index} className={`p-6 hover:shadow-lg transition-shadow border-2 ${
                        student.latestTest.level === 'Sangat Berat' ? 'border-purple-200' : 'border-red-200'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
                              {getTrendIcon(student.trend)}
                            </div>
                            <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                              <p>NPM: {student.npm}</p>
                              <p>Fakultas: {student.faculty}</p>
                              <p>Prodi: {student.major}</p>
                              <p>Semester: {student.semester}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`px-3 py-1 text-white rounded-full text-sm font-medium ${
                                student.latestTest.level === 'Sangat Berat' ? 'bg-purple-600' : 'bg-red-600'
                              }`}>
                                {student.latestTest.level}
                              </span>
                              <span className="text-sm text-gray-600">
                                Skor: {student.latestTest.score}
                              </span>
                              <span className="text-sm text-gray-600">
                                Total Tes: {student.totalTests}
                              </span>
                            </div>
                          </div>
                          <Button onClick={() => setSelectedStudent(student)} className={
                            student.latestTest.level === 'Sangat Berat'
                              ? 'bg-purple-600 hover:bg-purple-700'
                              : 'bg-red-600 hover:bg-red-700'
                          }>
                            Lihat Detail
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">Rekam Medis Konsultasi</h1>
                  <p className="text-gray-600 text-lg">
                    Kelola rekam medis mahasiswa yang telah berkonsultasi
                  </p>
                </div>
                {!showMedicalRecordForm && (
                  <Button
                    onClick={() => setShowMedicalRecordForm(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Rekam Medis
                  </Button>
                )}
              </div>

              {showMedicalRecordForm ? (
                <MedicalRecordForm
                  onSave={handleSaveMedicalRecord}
                  onCancel={() => setShowMedicalRecordForm(false)}
                />
              ) : (
                <MedicalRecordList
                  records={medicalRecords}
                  onDelete={handleDeleteMedicalRecord}
                  onView={(record) => setSelectedRecord(record)}
                />
              )}

              {selectedRecord && (
                <MedicalRecordDetail
                  record={selectedRecord}
                  onClose={() => setSelectedRecord(null)}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};