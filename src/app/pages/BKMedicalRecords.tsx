import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { MedicalRecordForm, MedicalRecord } from '../components/MedicalRecordForm';
import { MedicalRecordList } from '../components/MedicalRecordList';
import { MedicalRecordDetail } from '../components/MedicalRecordDetail';
import { Plus } from 'lucide-react';

export const BKMedicalRecords: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showMedicalRecordForm, setShowMedicalRecordForm] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'bk') {
      navigate('/login');
      return;
    }

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
