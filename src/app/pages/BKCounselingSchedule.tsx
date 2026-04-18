import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Plus, CheckCircle2, XCircle, AlertCircle, User, Phone, Mail } from 'lucide-react';

interface CounselingSession {
  id: string;
  studentName: string;
  studentNim: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: 'individual' | 'group';
  notes?: string;
  priority: 'high' | 'medium' | 'low';
}

export const BKCounselingSchedule: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<CounselingSession[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!user || user.role !== 'bk') {
      navigate('/login');
    } else {
      loadDummySessions();
    }
  }, [user, navigate]);

  const loadDummySessions = () => {
    const dummySessions: CounselingSession[] = [
      {
        id: '1',
        studentName: 'Dewi Lestari',
        studentNim: '2021001',
        date: '2026-04-18',
        time: '09:00',
        duration: 60,
        status: 'scheduled',
        type: 'individual',
        priority: 'high',
        notes: 'First session - Tingkat depresi sangat berat'
      },
      {
        id: '2',
        studentName: 'Ahmad Rizki',
        studentNim: '2021002',
        date: '2026-04-18',
        time: '10:30',
        duration: 60,
        status: 'scheduled',
        type: 'individual',
        priority: 'high'
      },
      {
        id: '3',
        studentName: 'Siti Nurhaliza',
        studentNim: '2021003',
        date: '2026-04-18',
        time: '13:00',
        duration: 45,
        status: 'scheduled',
        type: 'individual',
        priority: 'medium'
      },
      {
        id: '4',
        studentName: 'Budi Santoso',
        studentNim: '2021004',
        date: '2026-04-17',
        time: '09:00',
        duration: 60,
        status: 'completed',
        type: 'individual',
        priority: 'medium',
        notes: 'Progress baik, lanjutkan terapi'
      },
      {
        id: '5',
        studentName: 'Rina Wijaya',
        studentNim: '2021005',
        date: '2026-04-17',
        time: '11:00',
        duration: 60,
        status: 'completed',
        type: 'individual',
        priority: 'low'
      },
      {
        id: '6',
        studentName: 'Group Session A',
        studentNim: 'GROUP-A',
        date: '2026-04-19',
        time: '14:00',
        duration: 90,
        status: 'scheduled',
        type: 'group',
        priority: 'medium',
        notes: '5 peserta - Mindfulness & Stress Management'
      },
    ];

    setSessions(dummySessions);
  };

  const filteredSessions = sessions.filter(session => {
    const matchesDate = session.date === selectedDate;
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesDate && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Terjadwal';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      case 'no-show':
        return 'Tidak Hadir';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-red-500';
      case 'medium':
        return 'border-l-4 border-yellow-500';
      case 'low':
        return 'border-l-4 border-green-500';
      default:
        return '';
    }
  };

  const todaySessions = sessions.filter(s => s.date === new Date().toISOString().split('T')[0]);
  const upcomingSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessionDate > today && s.status === 'scheduled';
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <DashboardSidebar role="bk" />

      <div className="flex-1">
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Jadwal Konseling
            </h1>
            <p className="text-gray-600 text-lg">
              Kelola jadwal sesi konseling dengan mahasiswa
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Hari Ini</p>
                  <h3 className="text-3xl font-bold text-blue-900 mt-2">{todaySessions.length}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Mendatang</p>
                  <h3 className="text-3xl font-bold text-green-900 mt-2">{upcomingSessions.length}</h3>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Selesai</p>
                  <h3 className="text-3xl font-bold text-purple-900 mt-2">
                    {sessions.filter(s => s.status === 'completed').length}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Prioritas Tinggi</p>
                  <h3 className="text-3xl font-bold text-red-900 mt-2">
                    {sessions.filter(s => s.priority === 'high' && s.status === 'scheduled').length}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Date Selector and Filters */}
          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Tanggal
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="flex gap-2 items-end">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  className={filterStatus === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Semua
                </Button>
                <Button
                  variant={filterStatus === 'scheduled' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('scheduled')}
                  className={filterStatus === 'scheduled' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Terjadwal
                </Button>
                <Button
                  variant={filterStatus === 'completed' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('completed')}
                  className={filterStatus === 'completed' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Selesai
                </Button>
              </div>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Jadwal
              </Button>
            </div>
          </Card>

          {/* Sessions List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Jadwal untuk {new Date(selectedDate).toLocaleDateString('id-ID', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>

            {filteredSessions.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Tidak ada jadwal konseling untuk tanggal ini</p>
                  <Button className="mt-4 bg-purple-600 hover:bg-purple-700" onClick={() => setShowAddForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Jadwal Baru
                  </Button>
                </div>
              </Card>
            ) : (
              filteredSessions
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((session) => (
                  <Card key={session.id} className={`p-6 hover:shadow-lg transition-shadow ${getPriorityColor(session.priority)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="bg-purple-100 p-3 rounded-lg">
                            <Clock className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">{session.time}</h4>
                            <p className="text-sm text-gray-600">{session.duration} menit</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(session.status)}`}>
                            {getStatusLabel(session.status)}
                          </span>
                          {session.type === 'group' && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              Grup
                            </span>
                          )}
                          {session.priority === 'high' && (
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              Prioritas Tinggi
                            </span>
                          )}
                        </div>

                        <div className="ml-16">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-gray-600" />
                            <h5 className="font-semibold text-gray-900">{session.studentName}</h5>
                            {session.type === 'individual' && (
                              <span className="text-sm text-gray-600">({session.studentNim})</span>
                            )}
                          </div>

                          {session.notes && (
                            <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded">
                              <strong>Catatan:</strong> {session.notes}
                            </p>
                          )}

                          <div className="flex gap-2 mt-4">
                            {session.status === 'scheduled' && (
                              <>
                                <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50">
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Tandai Selesai
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Batalkan
                                </Button>
                                {session.type === 'individual' && (
                                  <>
                                    <Button size="sm" variant="outline">
                                      <Phone className="w-4 h-4 mr-2" />
                                      Hubungi
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Mail className="w-4 h-4 mr-2" />
                                      Email
                                    </Button>
                                  </>
                                )}
                              </>
                            )}
                            {session.status === 'completed' && (
                              <Button size="sm" variant="outline">
                                Lihat Catatan
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </div>

          {/* Quick Schedule Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Jadwal Hari Ini</h3>
              {todaySessions.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Tidak ada jadwal hari ini</p>
              ) : (
                <div className="space-y-3">
                  {todaySessions
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="font-bold text-purple-600">{session.time}</p>
                            <p className="text-xs text-gray-600">{session.duration}m</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{session.studentName}</p>
                            <p className="text-sm text-gray-600">{session.studentNim}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(session.status)}`}>
                          {getStatusLabel(session.status)}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
              {upcomingSessions.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Tidak ada jadwal mendatang</p>
              ) : (
                <div className="space-y-3">
                  {upcomingSessions
                    .sort((a, b) => {
                      const dateCompare = a.date.localeCompare(b.date);
                      if (dateCompare !== 0) return dateCompare;
                      return a.time.localeCompare(b.time);
                    })
                    .slice(0, 5)
                    .map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{session.studentName}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {session.time}
                          </p>
                        </div>
                        {session.priority === 'high' && (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};
