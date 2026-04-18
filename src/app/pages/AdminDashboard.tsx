import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { getStatistics, dummyUsers, dummyTestResults } from '../data/dummyData';
import {
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  UserCheck,
  Calendar,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Only admin can access this page
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    // Load statistics
    const statistics = getStatistics();
    setStats(statistics);
  }, [user, navigate]);

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Prepare chart data
  const levelDistributionData = Object.entries(stats.levelDistribution).map(([name, value], index) => ({
    id: `level-${index}`,
    name,
    jumlah: value
  }));

  const COLORS = {
    'Normal': '#28A745',
    'Ringan': '#FFC107',
    'Sedang': '#FF9800',
    'Berat': '#F44336',
    'Sangat Berat': '#9C27B0'
  };

  // Get monthly test trend
  const monthlyData = dummyTestResults.reduce((acc, test) => {
    const month = new Date(test.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month]++;
    return acc;
  }, {} as Record<string, number>);

  const trendData = Object.entries(monthlyData).map(([month, count], index) => ({
    id: `month-${index}`,
    bulan: month,
    tests: count
  }));

  // Get faculty distribution
  const facultyData = dummyUsers
    .filter(u => u.role === 'student' && u.faculty)
    .reduce((acc, student) => {
      const faculty = student.faculty!;
      if (!acc[faculty]) {
        acc[faculty] = 0;
      }
      acc[faculty]++;
      return acc;
    }, {} as Record<string, number>);

  const facultyChartData = Object.entries(facultyData).map(([name, value], index) => ({
    id: `faculty-${index}`,
    name,
    mahasiswa: value
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DashboardSidebar role="admin" />

      <div className="flex-1">
        <main className="p-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Selamat datang, {user?.name}
              </p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Mahasiswa</p>
                    <h3 className="text-3xl font-bold text-blue-900 mt-2">{stats.totalStudents}</h3>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Total Tes</p>
                    <h3 className="text-3xl font-bold text-green-900 mt-2">{stats.totalTests}</h3>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Konselor BK</p>
                    <h3 className="text-3xl font-bold text-purple-900 mt-2">{stats.totalBK}</h3>
                  </div>
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-white" />
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Level Distribution */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Distribusi Tingkat Depresi
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={levelDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="jumlah" fill="#4A90E2">
                      {levelDistributionData.map((entry, index) => (
                        <Cell key={`bar-${entry.id}`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Pie Chart */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Proporsi Tingkat Depresi
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={levelDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="jumlah"
                    >
                      {levelDistributionData.map((entry) => (
                        <Cell key={`cell-${entry.id}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#999'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Trend and Faculty Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Monthly Trend */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Tren Tes Bulanan
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bulan" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="tests" stroke="#28A745" strokeWidth={2}>
                      {trendData.map((entry) => (
                        <Cell key={`line-${entry.id}`} />
                      ))}
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Faculty Distribution */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  Distribusi Fakultas
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={facultyChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="mahasiswa" fill="#FF9800">
                      {facultyChartData.map((entry) => (
                        <Cell key={`faculty-bar-${entry.id}`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Aktivitas Terbaru
              </h3>
              <div className="space-y-4">
                {dummyTestResults
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((test, index) => {
                    const student = dummyUsers.find(u => u.id === test.userId);
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {student?.name || 'Unknown Student'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {student?.npm} - {student?.major}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              test.level === 'Normal'
                                ? 'bg-green-100 text-green-800'
                                : test.level === 'Ringan'
                                ? 'bg-yellow-100 text-yellow-800'
                                : test.level === 'Sedang'
                                ? 'bg-orange-100 text-orange-800'
                                : test.level === 'Berat'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {test.level}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(test.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};