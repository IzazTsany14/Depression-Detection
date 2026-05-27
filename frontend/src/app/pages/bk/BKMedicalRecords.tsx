import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { MedicalRecordForm, MedicalRecord } from '../../components/MedicalRecordForm';
import { MedicalRecordList } from '../../components/MedicalRecordList';
import { MedicalRecordDetail } from '../../components/MedicalRecordDetail';
import { Plus } from 'lucide-react';
import { apiUrl } from '../../utils/api';
import { toast } from 'sonner';

export const BKMedicalRecords: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showMedicalRecordForm, setShowMedicalRecordForm] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [loadingRecords, setLoadingRecords] = useState(true);

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadMedicalRecords = async () => {
    setLoadingRecords(true);
    try {
      const res = await fetch(apiUrl('/medical-records'), {
        cache: 'no-store',
        headers: {
          ...getAuthHeaders(),
          'Cache-Control': 'no-cache'
        }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengambil data rekam medis');
      }

      setMedicalRecords(data.data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengambil data rekam medis');
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'bk') {
      navigate('/login');
      return;
    }

    loadMedicalRecords();
  }, [user, navigate]);

  const handleSaveMedicalRecord = async (record: MedicalRecord) => {
    const res = await fetch(apiUrl('/medical-records'), {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(record)
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || data.error || 'Gagal menyimpan rekam medis');
    }

    setMedicalRecords(prev => [data.record, ...prev]);
    setShowMedicalRecordForm(false);
  };

  const handleDeleteMedicalRecord = async (id: string) => {
    try {
      const res = await fetch(apiUrl(`/medical-records/${encodeURIComponent(id)}`), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal menghapus rekam medis');
      }

      setMedicalRecords(prev => prev.filter(r => r.id !== id));
      if (selectedRecord?.id === id) setSelectedRecord(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus rekam medis');
      throw error;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <DashboardSidebar role="bk" />

      <div className="flex-1">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Rekam Medis</h2>
          </div>
        </div>

        <main className="p-8">
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
          ) : loadingRecords ? (
            <div className="rounded-lg border border-purple-100 bg-white p-8 text-center text-gray-600">
              Memuat rekam medis...
            </div>
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
        </main>
      </div>
    </div>
  );
};

