import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Card } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Activity, TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react';
import { dummyTestResults, dummyUsers } from '../data/dummyData';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

export const AdminStatistics: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Monthly trend
  const monthlyData = dummyTestResults.reduce((acc, test) => {
    const month = new Date(test.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { month, tests: 0, totalScore: 0, count: 0 };
    }
    acc[month].tests++;
    acc[month].totalScore += test.score;
    acc[month].count++;
    return acc;
  }, {} as Record<string, any>);

  const trendData = Object.values(monthlyData).map((item: any, index) => ({
    id: `month-trend-${index}`,
    bulan: item.month,
    jumlahTes: item.tests,
    rataRataSkor: Math.round(item.totalScore / item.count)
  }));

  // Level distribution by faculty
  const facultyLevelData = dummyUsers
    .filter(u => u.role === 'student' && u.faculty)
    .reduce((acc, student) => {
      const faculty = student.faculty!;
      if (!acc[faculty]) {
        acc[faculty] = { faculty, Normal: 0, Ringan: 0, Sedang: 0, Berat: 0, 'Sangat Berat': 0 };
      }
      
      // Get latest test for this student
      const studentTests = dummyTestResults.filter(t => t.userId === student.npm);
      if (studentTests.length > 0) {
        const latestTest = studentTests.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
        acc[faculty][latestTest.level]++;
      }
      
      return acc;
    }, {} as Record<string, any>);

  const facultyChartData = Object.values(facultyLevelData).map((item: any, index) => ({
    id: `faculty-${index}`,
    ...item
  }));

  // Weekly trend (last 8 weeks)
  const weeklyData: any[] = [];
  for (let i = 7; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - (i * 7));
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    
    const weekTests = dummyTestResults.filter(test => {
      const testDate = new Date(test.date);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      return testDate >= weekStart && testDate < weekEnd;
    });

    weeklyData.push({
      id: `week-${i}`,
      minggu: `Minggu ${8 - i}`,
      tes: weekTests.length,
      kritis: weekTests.filter(t => ['Berat', 'Sangat Berat'].includes(t.level)).length
    });
  }

  // Score distribution
  const scoreRanges = [
    { range: '0-9', min: 0, max: 9, label: 'Normal' },
    { range: '10-20', min: 10, max: 20, label: 'Ringan' },
    { range: '21-35', min: 21, max: 35, label: 'Sedang' },
    { range: '36-50', min: 36, max: 50, label: 'Berat' },
    { range: '51+', min: 51, max: 100, label: 'Sangat Berat' }
  ];

  const scoreDistribution = scoreRanges.map((range, index) => ({
    id: `score-${index}`,
    range: range.range,
    jumlah: dummyTestResults.filter(t => t.score >= range.min && t.score <= range.max).length,
    label: range.label
  }));

  const COLORS = {
    'Normal': '#28A745',
    'Ringan': '#FFC107',
    'Sedang': '#FF9800',
    'Berat': '#F44336',
    'Sangat Berat': '#9C27B0'
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DashboardSidebar role="admin" />

      <div className="flex-1">
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Statistik & Analitik
            </h1>
            <p className="text-gray-600 text-lg">
              Analisis mendalam data sistem deteksi depresi
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Tes</p>
                  <h3 className="text-3xl font-bold text-blue-900 mt-2">{dummyTestResults.length}</h3>
                  <p className="text-xs text-blue-600 mt-1">+12% dari bulan lalu</p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Mahasiswa Aktif</p>
                  <h3 className="text-3xl font-bold text-green-900 mt-2">
                    {dummyUsers.filter(u => u.role === 'student').length}
                  </h3>
                  <p className="text-xs text-green-600 mt-1">+5% dari bulan lalu</p>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Avg Tes/Minggu</p>
                  <h3 className="text-3xl font-bold text-purple-900 mt-2">
                    {Math.round(dummyTestResults.length / 4)}
                  </h3>
                  <p className="text-xs text-purple-600 mt-1">+8% dari bulan lalu</p>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Rata-rata Skor</p>
                  <h3 className="text-3xl font-bold text-orange-900 mt-2">
                    {Math.round(dummyTestResults.reduce((sum, t) => sum + t.score, 0) / dummyTestResults.length)}
                  </h3>
                  <p className="text-xs text-orange-600 mt-1">-3% dari bulan lalu</p>
                </div>
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Trend */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Tren Bulanan
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4A90E2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="jumlahTes" stroke="#4A90E2" fillOpacity={1} fill="url(#colorTests)" name="Jumlah Tes">
                    {trendData.map((entry) => (
                      <Cell key={`area-${entry.id}`} />
                    ))}
                  </Area>
                  <Line type="monotone" dataKey="rataRataSkor" stroke="#F44336" strokeWidth={2} name="Rata-rata Skor">
                    {trendData.map((entry) => (
                      <Cell key={`line-${entry.id}`} />
                    ))}
                  </Line>
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Score Distribution */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Distribusi Skor
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="jumlah" name="Jumlah Tes">
                    {scoreDistribution.map((entry) => (
                      <Cell key={`bar-${entry.id}`} fill={COLORS[entry.label as keyof typeof COLORS] || '#999'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Weekly Activity */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Aktivitas 8 Minggu Terakhir
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="minggu" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tes" stroke="#28A745" strokeWidth={2} name="Total Tes">
                    {weeklyData.map((entry) => (
                      <Cell key={`week-line-${entry.id}`} />
                    ))}
                  </Line>
                  <Line type="monotone" dataKey="kritis" stroke="#F44336" strokeWidth={2} name="Kasus Kritis">
                    {weeklyData.map((entry) => (
                      <Cell key={`week-critical-${entry.id}`} />
                    ))}
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Faculty Level Distribution */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                Distribusi per Fakultas
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={facultyChartData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="category" dataKey="faculty" angle={-45} textAnchor="end" height={100} />
                  <YAxis type="number" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Normal" stackId="a" fill={COLORS['Normal']}>
                    {facultyChartData.map((entry) => (
                      <Cell key={`faculty-normal-${entry.id}`} />
                    ))}
                  </Bar>
                  <Bar dataKey="Ringan" stackId="a" fill={COLORS['Ringan']}>
                    {facultyChartData.map((entry) => (
                      <Cell key={`faculty-ringan-${entry.id}`} />
                    ))}
                  </Bar>
                  <Bar dataKey="Sedang" stackId="a" fill={COLORS['Sedang']}>
                    {facultyChartData.map((entry) => (
                      <Cell key={`faculty-sedang-${entry.id}`} />
                    ))}
                  </Bar>
                  <Bar dataKey="Berat" stackId="a" fill={COLORS['Berat']}>
                    {facultyChartData.map((entry) => (
                      <Cell key={`faculty-berat-${entry.id}`} />
                    ))}
                  </Bar>
                  <Bar dataKey="Sangat Berat" stackId="a" fill={COLORS['Sangat Berat']}>
                    {facultyChartData.map((entry) => (
                      <Cell key={`faculty-sangat-berat-${entry.id}`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Insights */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Insight & Rekomendasi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">📈 Tren Positif</h4>
                <p className="text-sm text-green-800">
                  Aktivitas penggunaan sistem meningkat 12% bulan ini, menunjukkan awareness mahasiswa terhadap kesehatan mental semakin baik.
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-2">⚠️ Perhatian</h4>
                <p className="text-sm text-orange-800">
                  Fakultas tertentu menunjukkan tingkat depresi yang lebih tinggi. Pertimbangkan program dukungan khusus untuk fakultas tersebut.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Rekomendasi</h4>
                <p className="text-sm text-blue-800">
                  Tingkatkan kampanye awareness dan sediakan lebih banyak sesi konseling untuk mengakomodasi peningkatan permintaan.
                </p>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};
