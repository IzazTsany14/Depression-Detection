import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, Calendar, Filter, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { dummyTestResults } from '../data/dummyData';

export const AdminReports: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const years = [2024, 2025, 2026];

  const filteredTests = dummyTestResults.filter(test => {
    const testDate = new Date(test.date);
    if (selectedPeriod === 'month') {
      return testDate.getMonth() === selectedMonth && testDate.getFullYear() === selectedYear;
    }
    return testDate.getFullYear() === selectedYear;
  });

  const stats = {
    totalTests: filteredTests.length,
    avgScore: Math.round(filteredTests.reduce((sum, t) => sum + t.score, 0) / filteredTests.length || 0),
    criticalCases: filteredTests.filter(t => ['Berat', 'Sangat Berat'].includes(t.level)).length,
    uniqueStudents: new Set(filteredTests.map(t => t.userId)).size,
  };

  const levelDistribution = filteredTests.reduce((acc, test) => {
    acc[test.level] = (acc[test.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleDownloadReport = (format: 'pdf' | 'excel') => {
    alert(`Mengunduh laporan dalam format ${format.toUpperCase()}...`);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DashboardSidebar role="admin" />

      <div className="flex-1">
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Laporan Sistem
            </h1>
            <p className="text-gray-600 text-lg">
              Laporan dan analisis data sistem deteksi depresi
            </p>
          </div>

          {/* Filter Section */}
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filter Periode</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periode
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="month">Bulanan</option>
                  <option value="year">Tahunan</option>
                </select>
              </div>
              {selectedPeriod === 'month' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bulan
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={() => handleDownloadReport('pdf')} className="flex-1 bg-red-600 hover:bg-red-700">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button onClick={() => handleDownloadReport('excel')} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Tes</p>
                  <h3 className="text-3xl font-bold text-blue-900 mt-2">{stats.totalTests}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Mahasiswa Unik</p>
                  <h3 className="text-3xl font-bold text-green-900 mt-2">{stats.uniqueStudents}</h3>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Rata-rata Skor</p>
                  <h3 className="text-3xl font-bold text-orange-900 mt-2">{stats.avgScore}</h3>
                </div>
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Kasus Kritis</p>
                  <h3 className="text-3xl font-bold text-red-900 mt-2">{stats.criticalCases}</h3>
                </div>
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Report Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Level Distribution */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Distribusi Tingkat Depresi
              </h3>
              <div className="space-y-4">
                {Object.entries(levelDistribution).map(([level, count]) => {
                  const percentage = ((count / stats.totalTests) * 100).toFixed(1);
                  const colors = {
                    'Normal': 'bg-green-500',
                    'Ringan': 'bg-yellow-500',
                    'Sedang': 'bg-orange-500',
                    'Berat': 'bg-red-500',
                    'Sangat Berat': 'bg-purple-500'
                  };
                  
                  return (
                    <div key={level}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{level}</span>
                        <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${colors[level as keyof typeof colors] || 'bg-gray-500'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Recent Tests */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Tes Terbaru
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTests
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{test.userId}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(test.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          test.level === 'Sangat Berat' ? 'bg-purple-100 text-purple-800' :
                          test.level === 'Berat' ? 'bg-red-100 text-red-800' :
                          test.level === 'Sedang' ? 'bg-orange-100 text-orange-800' :
                          test.level === 'Ringan' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {test.level}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">Skor: {test.score}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>

          {/* Summary Report */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Ringkasan Laporan Periode {selectedPeriod === 'month' ? months[selectedMonth] : ''} {selectedYear}
            </h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                Berdasarkan data yang dikumpulkan pada periode {selectedPeriod === 'month' ? `${months[selectedMonth]} ${selectedYear}` : selectedYear}, 
                sistem deteksi dini tingkat depresi mahasiswa telah mencatat:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Total <strong>{stats.totalTests}</strong> tes telah dilakukan oleh <strong>{stats.uniqueStudents}</strong> mahasiswa unik</li>
                <li>Rata-rata skor depresi adalah <strong>{stats.avgScore}</strong></li>
                <li>Terdapat <strong>{stats.criticalCases}</strong> kasus yang memerlukan perhatian khusus (tingkat Berat dan Sangat Berat)</li>
                <li>
                  Distribusi tingkat depresi:
                  <ul className="list-circle list-inside ml-6 mt-2">
                    {Object.entries(levelDistribution).map(([level, count]) => (
                      <li key={level}>{level}: {count} kasus ({((count / stats.totalTests) * 100).toFixed(1)}%)</li>
                    ))}
                  </ul>
                </li>
              </ul>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mt-6">
                <p className="text-sm text-blue-900">
                  <strong>Rekomendasi:</strong> Berdasarkan data di atas, disarankan untuk meningkatkan program konseling 
                  dan dukungan mental bagi mahasiswa, terutama untuk kasus dengan tingkat depresi berat dan sangat berat.
                </p>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};
