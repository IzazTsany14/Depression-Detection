import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../context/AuthContext';
import { getStudentsNeedingAttention, searchStudents, getStudentDetailBySearch } from '../data/dummyData';
import {
  Heart, Search, Filter, TrendingUp, TrendingDown, Minus, Phone, Mail,
  AlertTriangle, FileText, Calendar, User
} from 'lucide-react';

export const BKStudentCases: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    if (!user || user.role !== 'bk') {
      navigate('/login');
    } else {
      const data = getStudentsNeedingAttention();
      setStudents(data);
    }
  }, [user, navigate]);

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nim.includes(searchTerm) ||
      (s.nik && s.nik.includes(searchTerm)) ||
      s.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = filterLevel === 'all' || s.latestTest.level === filterLevel;
    
    return matchesSearch && matchesLevel;
  });

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
        return 'border-purple-300 bg-purple-50';
      case 'Berat':
        return 'border-red-300 bg-red-50';
      case 'Sedang':
        return 'border-orange-300 bg-orange-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const renderStudentDetail = (student: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{student.name}</h2>
              <p className="text-gray-600">NIM: {student.nim} | NIK: {student.nik}</p>
            </div>
            <Button onClick={() => setSelectedStudent(null)} variant="outline">
              Tutup
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <p className="text-sm font-medium text-gray-600">Informasi Personal</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">Fakultas:</span> {student.faculty}</p>
                  <p className="text-sm"><span className="font-medium">Program Studi:</span> {student.major}</p>
                  <p className="text-sm"><span className="font-medium">Semester:</span> {student.semester}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {student.email}</p>
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${getPriorityColor(student.latestTest.level)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <p className="text-sm font-medium">Status Terkini</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Tingkat:</span>{' '}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.latestTest.level === 'Sangat Berat' ? 'bg-purple-600 text-white' :
                      student.latestTest.level === 'Berat' ? 'bg-red-600 text-white' :
                      'bg-orange-600 text-white'
                    }`}>
                      {student.latestTest.level}
                    </span>
                  </p>
                  <p className="text-sm"><span className="font-medium">Skor:</span> {student.latestTest.score}/63</p>
                  <p className="text-sm">
                    <span className="font-medium">Tren:</span>
                    <span className="inline-flex items-center gap-1 ml-2">
                      {getTrendIcon(student.trend)}
                      {student.trend === 'improving' ? 'Membaik' : student.trend === 'worsening' ? 'Memburuk' : 'Stabil'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-900">Riwayat Tes</p>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {student.testHistory.map((test: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                      <span className="text-gray-600">
                        {new Date(test.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{test.level}</span>
                        <span className="text-gray-500">({test.score})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-900">Statistik</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm flex justify-between">
                    <span>Total Tes:</span>
                    <span className="font-medium">{student.totalTests}</span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span>Tes Pertama:</span>
                    <span className="font-medium">
                      {new Date(student.testHistory[0].date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span>Tes Terakhir:</span>
                    <span className="font-medium">
                      {new Date(student.latestTest.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
              Rekomendasi Intervensi
            </h4>
            <div className="space-y-3">
              {student.latestTest.level === 'Sangat Berat' && (
                <>
                  <Alert className="bg-red-50 border-red-200">
                    <AlertDescription className="text-red-900">
                      <strong>PRIORITAS TINGGI:</strong> Mahasiswa ini memerlukan perhatian segera. Jadwalkan sesi konseling individual dalam 24 jam.
                    </AlertDescription>
                  </Alert>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                    <li>Hubungi mahasiswa segera untuk konfirmasi kondisi</li>
                    <li>Jadwalkan pertemuan konseling individual</li>
                    <li>Pertimbangkan rujukan ke psikiater/psikolog profesional</li>
                    <li>Informasikan ke orang tua/wali (dengan persetujuan)</li>
                    <li>Buat catatan observasi dan follow-up mingguan</li>
                  </ul>
                </>
              )}
              {student.latestTest.level === 'Berat' && (
                <>
                  <Alert className="bg-orange-50 border-orange-200">
                    <AlertDescription className="text-orange-900">
                      <strong>PERLU PERHATIAN:</strong> Jadwalkan sesi konseling dalam 2-3 hari ke depan.
                    </AlertDescription>
                  </Alert>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                    <li>Hubungi mahasiswa untuk jadwal konseling</li>
                    <li>Berikan panduan self-care dan coping strategies</li>
                    <li>Monitor perkembangan secara berkala (mingguan)</li>
                    <li>Identifikasi faktor pemicu stres</li>
                  </ul>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Phone className="w-4 h-4 mr-2" />
                Hubungi Mahasiswa
              </Button>
              <Button variant="outline" className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Kirim Email
              </Button>
              <Button variant="outline" className="flex-1">
                <Calendar className="w-4 h-4 mr-2" />
                Jadwal Konseling
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <DashboardSidebar role="bk" />

      <div className="flex-1">
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Kasus Mahasiswa
            </h1>
            <p className="text-gray-600 text-lg">
              Daftar mahasiswa yang memerlukan perhatian dan intervensi
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Sangat Berat</p>
                  <h3 className="text-3xl font-bold text-purple-900 mt-2">
                    {students.filter(s => s.latestTest.level === 'Sangat Berat').length}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Berat</p>
                  <h3 className="text-3xl font-bold text-red-900 mt-2">
                    {students.filter(s => s.latestTest.level === 'Berat').length}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Sedang</p>
                  <h3 className="text-3xl font-bold text-orange-900 mt-2">
                    {students.filter(s => s.latestTest.level === 'Sedang').length}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama, NIM, NIK, atau fakultas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterLevel === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterLevel('all')}
                  className={filterLevel === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Semua
                </Button>
                <Button
                  variant={filterLevel === 'Sangat Berat' ? 'default' : 'outline'}
                  onClick={() => setFilterLevel('Sangat Berat')}
                  className={filterLevel === 'Sangat Berat' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Sangat Berat
                </Button>
                <Button
                  variant={filterLevel === 'Berat' ? 'default' : 'outline'}
                  onClick={() => setFilterLevel('Berat')}
                  className={filterLevel === 'Berat' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Berat
                </Button>
                <Button
                  variant={filterLevel === 'Sedang' ? 'default' : 'outline'}
                  onClick={() => setFilterLevel('Sedang')}
                  className={filterLevel === 'Sedang' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Sedang
                </Button>
              </div>
            </div>
          </Card>

          {/* Student Cases List */}
          <div className="space-y-4">
            {filteredStudents.map((student, index) => (
              <Card key={index} className={`p-6 border-2 ${getPriorityColor(student.latestTest.level)} hover:shadow-lg transition-shadow`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
                      {getTrendIcon(student.trend)}
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                      <p><span className="font-medium">NIM:</span> {student.nim}</p>
                      <p><span className="font-medium">NIK:</span> {student.nik}</p>
                      <p><span className="font-medium">Fakultas:</span> {student.faculty}</p>
                      <p><span className="font-medium">Prodi:</span> {student.major}</p>
                      <p><span className="font-medium">Semester:</span> {student.semester}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                        student.latestTest.level === 'Sangat Berat' ? 'bg-purple-600' :
                        student.latestTest.level === 'Berat' ? 'bg-red-600' :
                        'bg-orange-600'
                      }`}>
                        {student.latestTest.level}
                      </span>
                      <span className="text-sm text-gray-600">Skor: {student.latestTest.score}</span>
                      <span className="text-sm text-gray-600">Total Tes: {student.totalTests}</span>
                      <span className="text-sm text-gray-600">
                        Terakhir: {new Date(student.latestTest.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedStudent(student)}
                    className={
                      student.latestTest.level === 'Sangat Berat' ? 'bg-purple-600 hover:bg-purple-700' :
                      student.latestTest.level === 'Berat' ? 'bg-red-600 hover:bg-red-700' :
                      'bg-orange-600 hover:bg-orange-700'
                    }
                  >
                    Lihat Detail
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Tidak ada kasus ditemukan</p>
              </div>
            </Card>
          )}
        </main>
      </div>

      {selectedStudent && renderStudentDetail(selectedStudent)}
    </div>
  );
};
