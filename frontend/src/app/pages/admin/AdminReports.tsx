import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useAuth } from '../../context/AuthContext';
import { FileText, Filter, TrendingUp, Users, AlertTriangle, RefreshCw, Eye, Search } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { user, getAllTestResults } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dummyTestResults, setDummyTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categorySort, setCategorySort] = useState<'latest' | 'critical' | 'light'>('latest');
  const [selectedTest, setSelectedTest] = useState<any | null>(null);

  const loadReports = async (syncPeriodToLatest = false) => {
    setLoading(true);
    try {
      const results = await getAllTestResults();
      setDummyTestResults(results);
      setLastUpdated(new Date());

      const latestTest = results
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

      if (syncPeriodToLatest && latestTest) {
        const latestDate = new Date(latestTest.date);
        setSelectedMonth(latestDate.getMonth());
        setSelectedYear(latestDate.getFullYear());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    loadReports(true);
  }, [user, navigate, getAllTestResults]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') {
        loadReports();
      }
    };

    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [user, getAllTestResults]);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const years = Array.from(new Set([
    new Date().getFullYear(),
    ...dummyTestResults.map(test => new Date(test.date).getFullYear()).filter(Boolean),
  ])).sort((a, b) => b - a);

  const filteredTests = dummyTestResults.filter(test => {
    const testDate = new Date(test.date);
    if (selectedPeriod === 'month') {
      return testDate.getMonth() === selectedMonth && testDate.getFullYear() === selectedYear;
    }
    return testDate.getFullYear() === selectedYear;
  });

  const levelRank: Record<string, number> = {
    Normal: 1,
    Ringan: 2,
    Sedang: 3,
    Parah: 4,
    'Sangat Parah': 5,
  };

  const visibleTests = filteredTests.filter((test) => {
    const keyword = searchTerm.toLowerCase();
    const matchesSearch = (
      String(test.userName || '').toLowerCase().includes(keyword) ||
      String(test.userEmail || '').toLowerCase().includes(keyword) ||
      String(test.userNim || '').toLowerCase().includes(keyword) ||
      String(test.userFaculty || '').toLowerCase().includes(keyword) ||
      String(test.level || '').toLowerCase().includes(keyword)
    );

    const matchesCategory = categoryFilter === 'all' || test.level === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedVisibleTests = visibleTests
    .slice()
    .sort((a, b) => {
      if (categorySort === 'critical') {
        const levelCompare = (levelRank[b.level] || 0) - (levelRank[a.level] || 0);
        if (levelCompare !== 0) return levelCompare;
      }

      if (categorySort === 'light') {
        const levelCompare = (levelRank[a.level] || 0) - (levelRank[b.level] || 0);
        if (levelCompare !== 0) return levelCompare;
      }

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const getLevelBadge = (level: string) => ({
    Normal: 'bg-green-100 text-green-800 border-green-200',
    Ringan: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Sedang: 'bg-orange-100 text-orange-800 border-orange-200',
    Parah: 'bg-red-100 text-red-800 border-red-200',
    'Sangat Parah': 'bg-purple-100 text-purple-800 border-purple-200',
  }[level] || 'bg-gray-100 text-gray-800 border-gray-200');

  const formatDateTime = (date: string) => new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const stats = {
  totalTests: filteredTests.length,
  avgScore: Math.round(
    filteredTests.reduce((sum, t) => sum + t.score, 0) /
    filteredTests.length || 0
  ),
  criticalCases: filteredTests.filter(t =>
    ['Parah', 'Sangat Parah'].includes(t.level)
  ).length,
  uniqueStudents: new Set(
    filteredTests.map(t => t.userId || t.student_id)
  ).size,
};

  const levelDistribution = filteredTests.reduce(
  (acc, test) => {
    acc[test.level] = (acc[test.level] || 0) + 1;
    return acc;
  },
  {} as Record<string, number>
);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DashboardSidebar role="admin" />

      <div className="flex-1">
        <main className="p-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Laporan Sistem
              </h1>
              <p className="text-gray-600 text-lg">
                Laporan dan analisis data sistem deteksi depresi
              </p>
              {lastUpdated && (
                <p className="mt-2 text-sm text-gray-500">
                  Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </p>
              )}
            </div>
            <Button
              onClick={() => loadReports()}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Memperbarui...' : 'Perbarui Data'}
            </Button>
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
    const safeCount = Number(count);
    const percentage = stats.totalTests
      ? ((safeCount / stats.totalTests) * 100).toFixed(1)
      : '0';

    const colors = {
      'Normal': 'bg-green-500',
      'Ringan': 'bg-yellow-500',
      'Sedang': 'bg-orange-500',
      'Parah': 'bg-red-500',
      'Sangat Parah': 'bg-purple-500'
    };

    return (
      <div key={level}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {level}
          </span>

          <span className="text-sm text-gray-600">
            {safeCount} ({percentage}%)
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${
              colors[level as keyof typeof colors] || 'bg-gray-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  })}
</div>
            </Card>
          </div>

          {/* Summary Report */}
          <Card className="p-6 mb-8">
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
                <li>Terdapat <strong>{stats.criticalCases}</strong> kasus yang memerlukan perhatian khusus (tingkat Parah dan Sangat Parah)</li>
                <li>
                  Distribusi tingkat depresi:
                  <ul className="list-circle list-inside ml-6 mt-2">
                   {Object.entries(levelDistribution).map(([level, count]) => {
  const safeCount = Number(count);
  const percentage = stats.totalTests
    ? ((safeCount / stats.totalTests) * 100).toFixed(1)
    : '0';

  return (
    <li key={level}>
      {level}: {safeCount} kasus ({percentage}%)
    </li>
  );
})}
                  </ul>
                </li>
              </ul>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mt-6">
                <p className="text-sm text-blue-900">
                  <strong>Rekomendasi:</strong> Berdasarkan data di atas, disarankan untuk meningkatkan program konseling 
                  dan dukungan mental bagi mahasiswa, terutama untuk kasus dengan tingkat depresi parah dan sangat parah.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Hasil Tes Mahasiswa
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Menampilkan {sortedVisibleTests.length} dari {filteredTests.length} hasil tes pada periode terpilih.
                </p>
              </div>
              <div className="grid w-full gap-3 lg:max-w-3xl lg:grid-cols-[1fr_180px_190px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Cari nama, NIM, email, fakultas..."
                    className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter kategori"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Normal">Normal</option>
                  <option value="Ringan">Ringan</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Parah">Parah</option>
                  <option value="Sangat Parah">Sangat Parah</option>
                </select>
                <select
                  value={categorySort}
                  onChange={(event) => setCategorySort(event.target.value as 'latest' | 'critical' | 'light')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  aria-label="Urutkan kategori"
                >
                  <option value="latest">Terbaru</option>
                  <option value="critical">Kategori Terberat</option>
                  <option value="light">Kategori Teringan</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead className="border-b-2 border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Mahasiswa</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">NIM</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Fakultas</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tanggal Tes</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Skor</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Kategori</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedVisibleTests.map((test) => (
                    <tr key={test.id || test.test_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{test.userName || 'Mahasiswa'}</p>
                        <p className="text-xs text-gray-500">{test.userEmail || '-'}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{test.userNim || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{test.userFaculty || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDateTime(test.date)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{test.score}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getLevelBadge(test.level)}`}>
                          {test.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTest(test)}
                          title="Lihat hasil tes mahasiswa"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sortedVisibleTests.length === 0 && (
              <div className="py-12 text-center">
                <FileText className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                <p className="text-gray-600">Tidak ada hasil tes pada filter ini.</p>
              </div>
            )}
          </Card>

          <Dialog open={Boolean(selectedTest)} onOpenChange={(open) => !open && setSelectedTest(null)}>
            <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-3xl overflow-hidden p-0">
              <DialogHeader className="border-b px-6 py-5">
                <DialogTitle>Detail Hasil Tes Mahasiswa</DialogTitle>
                <DialogDescription>
                  Ringkasan hasil DASS-21 berdasarkan tes yang dipilih dari laporan sistem.
                </DialogDescription>
              </DialogHeader>

              {selectedTest && (
                <div className="max-h-[calc(90vh-116px)] space-y-5 overflow-y-auto px-6 py-5">
                  <div className="grid min-w-0 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 md:grid-cols-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-gray-500">Nama Mahasiswa</p>
                      <p className="break-words font-semibold text-gray-900">{selectedTest.userName || '-'}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-gray-500">Email</p>
                      <p className="break-words font-semibold text-gray-900">{selectedTest.userEmail || '-'}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-gray-500">NIM</p>
                      <p className="break-words font-semibold text-gray-900">{selectedTest.userNim || '-'}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-gray-500">Fakultas</p>
                      <p className="break-words font-semibold text-gray-900">{selectedTest.userFaculty || '-'}</p>
                    </div>
                  </div>

                  <div className="grid min-w-0 gap-4 md:grid-cols-3">
                    <div className="min-w-0 rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <p className="text-sm font-medium text-blue-700">Tanggal Tes</p>
                      <p className="mt-1 break-words font-bold text-blue-950">{formatDateTime(selectedTest.date)}</p>
                    </div>
                    <div className="min-w-0 rounded-lg border border-orange-200 bg-orange-50 p-4">
                      <p className="text-sm font-medium text-orange-700">Skor</p>
                      <p className="mt-1 text-2xl font-bold text-orange-950">{selectedTest.score}</p>
                    </div>
                    <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-4">
                      <p className="text-sm font-medium text-gray-700">Kategori</p>
                      <span className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${getLevelBadge(selectedTest.level)}`}>
                        {selectedTest.level}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 font-semibold text-gray-900">Jawaban DASS-21</h4>
                    {Array.isArray(selectedTest.answers) && selectedTest.answers.length > 0 ? (
                      <div className="grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] gap-2">
                        {selectedTest.answers.map((answer: number, index: number) => (
                          <div key={index} className="min-h-16 min-w-0 rounded-lg border border-gray-200 bg-white p-3 text-center">
                            <p className="text-xs text-gray-500">Q{index + 1}</p>
                            <p className="text-lg font-bold text-gray-900">{answer}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                        Data jawaban tidak tersedia untuk tes ini.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};
