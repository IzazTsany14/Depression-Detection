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
  completionNotes?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export const BKCounselingSchedule: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<CounselingSession[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState<string>('scheduled');
  const [dateFilterType, setDateFilterType] = useState<'day' | 'range' | 'month' | 'year'>('day');
  const [dateRangeStart, setDateRangeStart] = useState(new Date().toISOString().split('T')[0]);
  const [dateRangeEnd, setDateRangeEnd] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [editingSession, setEditingSession] = useState<CounselingSession | null>(null);
  const [formData, setFormData] = useState({
    studentName: '',
    studentNim: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: '60',
    type: 'individual' as 'individual' | 'group',
    priority: 'medium' as 'high' | 'medium' | 'low',
    notes: '',
  });
  const [showCompletionForm, setShowCompletionForm] = useState<string | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'bk') {
      navigate('/login');
    } else {
      loadDummySessions();
    }
  }, [user, navigate]);

  const loadDummySessions = () => {
    const storedSessions = localStorage.getItem('counselingSessions');
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    } else {
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
          notes: 'Progress baik, lanjutkan terapi',
          completionNotes: 'Sesi berjalan lancar, mahasiswa responsif'
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
      localStorage.setItem('counselingSessions', JSON.stringify(dummySessions));
    }
  };

  const filteredSessions = sessions.filter(session => {
    let matchesDate = false;
    
    if (dateFilterType === 'day') {
      matchesDate = session.date === selectedDate;
    } else if (dateFilterType === 'range') {
      matchesDate = session.date >= dateRangeStart && session.date <= dateRangeEnd;
    } else if (dateFilterType === 'month') {
      matchesDate = session.date.slice(0, 7) === selectedMonth;
    } else if (dateFilterType === 'year') {
      matchesDate = session.date.slice(0, 4) === selectedYear;
    }
    
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

  const resetForm = () => {
    setFormData({
      studentName: '',
      studentNim: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: '60',
      type: 'individual',
      priority: 'medium',
      notes: '',
    });
    setEditingSession(null);
    setShowAddForm(false);
  };

  const handleSaveSession = () => {
    if (!formData.studentName || !formData.studentNim || !formData.date || !formData.time) {
      alert('Mohon isi semua field yang wajib diisi!');
      return;
    }

    if (editingSession) {
      const updated = sessions.map(s => 
        s.id === editingSession.id 
          ? { ...s, ...formData, duration: parseInt(formData.duration) }
          : s
      );
      setSessions(updated);
      localStorage.setItem('counselingSessions', JSON.stringify(updated));
    } else {
      const newSession: CounselingSession = {
        id: Date.now().toString(),
        ...formData,
        duration: parseInt(formData.duration),
        status: 'scheduled'
      };
      const updated = [...sessions, newSession];
      setSessions(updated);
      localStorage.setItem('counselingSessions', JSON.stringify(updated));
    }
    resetForm();
    alert('Jadwal berhasil disimpan!');
  };

  const handleCompleteSession = (sessionId: string) => {
    const updated = sessions.map(s =>
      s.id === sessionId
        ? { ...s, status: 'completed' as const, completionNotes, completedAt: new Date().toISOString() }
        : s
    );
    setSessions(updated);
    localStorage.setItem('counselingSessions', JSON.stringify(updated));
    setShowCompletionForm(null);
    setCompletionNotes('');
    alert('Jadwal berhasil ditandai sebagai selesai!');
  };

  const handleCancelSession = (sessionId: string) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan jadwal ini?')) {
      const updated = sessions.map(s =>
        s.id === sessionId
          ? { ...s, status: 'cancelled' as const, cancelledAt: new Date().toISOString() }
          : s
      );
      setSessions(updated);
      localStorage.setItem('counselingSessions', JSON.stringify(updated));
      alert('Jadwal berhasil dibatalkan!');
    }
  };

  const handleEditSession = (session: CounselingSession) => {
    setEditingSession(session);
    setFormData({
      studentName: session.studentName,
      studentNim: session.studentNim,
      date: session.date,
      time: session.time,
      duration: session.duration.toString(),
      type: session.type,
      priority: session.priority,
      notes: session.notes || '',
    });
    setShowAddForm(true);
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
            <div className="space-y-4">
              {/* Filter Type Selector */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter Tanggal
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={dateFilterType === 'day' ? 'default' : 'outline'}
                      onClick={() => setDateFilterType('day')}
                      size="sm"
                      className={dateFilterType === 'day' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                    >
                      Hari
                    </Button>
                    <Button
                      variant={dateFilterType === 'range' ? 'default' : 'outline'}
                      onClick={() => setDateFilterType('range')}
                      size="sm"
                      className={dateFilterType === 'range' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                    >
                      Range Hari
                    </Button>
                    <Button
                      variant={dateFilterType === 'month' ? 'default' : 'outline'}
                      onClick={() => setDateFilterType('month')}
                      size="sm"
                      className={dateFilterType === 'month' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                    >
                      Bulan
                    </Button>
                    <Button
                      variant={dateFilterType === 'year' ? 'default' : 'outline'}
                      onClick={() => setDateFilterType('year')}
                      size="sm"
                      className={dateFilterType === 'year' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                    >
                      Tahun
                    </Button>
                  </div>
                </div>
              </div>

              {/* Date Input Based on Filter Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dateFilterType === 'day' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Hari
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                )}

                {dateFilterType === 'range' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Mulai
                      </label>
                      <input
                        type="date"
                        value={dateRangeStart}
                        onChange={(e) => setDateRangeStart(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Akhir
                      </label>
                      <input
                        type="date"
                        value={dateRangeEnd}
                        onChange={(e) => setDateRangeEnd(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </>
                )}

                {dateFilterType === 'month' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Bulan
                    </label>
                    <input
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                )}

                {dateFilterType === 'year' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Tahun
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
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
                <Button
                  variant={filterStatus === 'cancelled' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('cancelled')}
                  className={filterStatus === 'cancelled' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Dibatalkan
                </Button>
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  className={filterStatus === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Semua
                </Button>
              </div>
            </div>
          </Card>

          {/* Sessions List - Scheduled */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {dateFilterType === 'day' && `Jadwal ${new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
                {dateFilterType === 'range' && `Jadwal ${new Date(dateRangeStart).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} - ${new Date(dateRangeEnd).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                {dateFilterType === 'month' && `Jadwal ${new Date(selectedMonth + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`}
                {dateFilterType === 'year' && `Jadwal Tahun ${selectedYear}`}
              </h3>
              {filterStatus === 'scheduled' && (
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
                  resetForm();
                  setShowAddForm(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Jadwal
                </Button>
              )}
            </div>

            {filteredSessions.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Tidak ada jadwal konseling untuk periode ini</p>
                  {filterStatus === 'scheduled' && (
                    <Button className="mt-4 bg-purple-600 hover:bg-purple-700" onClick={() => setShowAddForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Jadwal Baru
                    </Button>
                  )}
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

                          <div className="flex gap-2 mt-4 flex-wrap">
                            {session.status === 'scheduled' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-green-600 hover:bg-green-50"
                                  onClick={() => setShowCompletionForm(session.id)}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Tandai Selesai
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-600 hover:bg-red-50"
                                  onClick={() => handleCancelSession(session.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Batalkan
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEditSession(session)}
                                >
                                  Edit
                                </Button>
                              </>
                            )}
                            {session.status === 'completed' && (
                              <>
                                <span className="text-xs text-gray-600 py-2">Diselesaikan: {new Date(session.completedAt || '').toLocaleDateString('id-ID')}</span>
                                {session.completionNotes && (
                                  <p className="text-sm text-gray-600 bg-green-50 p-2 rounded flex-1">Catatan: {session.completionNotes}</p>
                                )}
                              </>
                            )}
                            {session.status === 'cancelled' && (
                              <span className="text-xs text-gray-600 py-2">Dibatalkan: {new Date(session.cancelledAt || '').toLocaleDateString('id-ID')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </div>

          {/* Completion Form - Inline */}
          {showCompletionForm && (
            <Card className="p-6 mb-6 bg-green-50 border-2 border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tandai Sesi Selesai</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Penyelesaian (Opsional)
                  </label>
                  <textarea
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    placeholder="Masukkan catatan tentang hasil sesi..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleCompleteSession(showCompletionForm)}
                  >
                    Selesaikan Sesi
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowCompletionForm(null);
                      setCompletionNotes('');
                    }}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Add/Edit Schedule Form - Inline */}
          {showAddForm && (
            <Card className="p-6 mb-6 bg-blue-50 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingSession ? 'Edit Jadwal Konseling' : 'Tambah Jadwal Konseling Baru'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mahasiswa *</label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="Masukkan nama mahasiswa"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIM *</label>
                  <input
                    type="text"
                    value={formData.studentNim}
                    onChange={(e) => setFormData({ ...formData, studentNim: e.target.value })}
                    placeholder="Masukkan NIM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jam *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (menit) *</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="60"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Konseling</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'individual' | 'group' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="individual">Individual</option>
                    <option value="group">Grup</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Tinggi</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Masukkan catatan..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4 mt-4 border-t">
                <Button
                  onClick={handleSaveSession}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  Simpan Jadwal
                </Button>
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Batal
                </Button>
              </div>
            </Card>
          )}

          {/* Completed Sessions */}
          <div className="space-y-4 mb-8 mt-8">
            <h3 className="text-xl font-semibold text-gray-900">Riwayat Konseling - Selesai</h3>

            {sessions.filter(s => s.status === 'completed').length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Belum ada konseling yang selesai</p>
                </div>
              </Card>
            ) : (
              sessions
                .filter(s => s.status === 'completed')
                .sort((a, b) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime())
                .map((session) => (
                  <Card key={session.id} className="p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="bg-green-100 p-3 rounded-lg">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{session.studentName}</h4>
                            <p className="text-sm text-gray-600">{session.studentNim} • {session.date} {session.time}</p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {getStatusLabel(session.status)}
                          </span>
                        </div>

                        <div className="ml-16">
                          {session.completionNotes && (
                            <p className="text-sm text-gray-600 bg-green-50 p-3 rounded mb-2">
                              <strong>Catatan Penyelesaian:</strong> {session.completionNotes}
                            </p>
                          )}
                          <div className="text-xs text-gray-500">
                            Diselesaikan: {new Date(session.completedAt || '').toLocaleDateString('id-ID', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </div>

          {/* Cancelled Sessions */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-semibold text-gray-900">Riwayat Konseling - Dibatalkan</h3>

            {sessions.filter(s => s.status === 'cancelled').length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Tidak ada konseling yang dibatalkan</p>
                </div>
              </Card>
            ) : (
              sessions
                .filter(s => s.status === 'cancelled')
                .sort((a, b) => new Date(b.cancelledAt || '').getTime() - new Date(a.cancelledAt || '').getTime())
                .map((session) => (
                  <Card key={session.id} className="p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="bg-red-100 p-3 rounded-lg">
                            <XCircle className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{session.studentName}</h4>
                            <p className="text-sm text-gray-600">{session.studentNim} • {session.date} {session.time}</p>
                          </div>
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            {getStatusLabel(session.status)}
                          </span>
                        </div>

                        <div className="ml-16">
                          <div className="text-xs text-gray-500">
                            Dibatalkan: {new Date(session.cancelledAt || '').toLocaleDateString('id-ID', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
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
