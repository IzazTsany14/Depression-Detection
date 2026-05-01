import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { QuestionEditor } from '../components/QuestionEditor';
import { ArrowLeft, Settings } from 'lucide-react';

export const BKQuestionManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only BK can access this page
    if (!user || (user.role !== 'bk' && user.role !== 'admin')) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar role="bk" />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold">Manajemen Pertanyaan DASS-21</h1>
            </div>
            <p className="text-gray-600">
              Kelola pertanyaan dan bobot jawaban untuk sistem deteksi depresi mahasiswa
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="text-sm text-gray-600">Total Pertanyaan</div>
              <div className="text-2xl font-bold">21</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="text-sm text-gray-600">Kategori</div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-gray-500 mt-1">Depresi, Kecemasan, Stres</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-purple-500">
              <div className="text-sm text-gray-600">Bobot per Jawaban</div>
              <div className="text-2xl font-bold">0-3</div>
              <div className="text-xs text-gray-500 mt-1">Dapat dikustomisasi</div>
            </Card>
          </div>

          {/* Info Alert */}
          <Card className="p-4 mb-6 bg-green-50 border-green-200">
            <div className="text-sm">
              <strong>💡 Panduan:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-xs text-gray-700">
                <li>Klik tombol "Edit" untuk mengubah pertanyaan atau bobot jawaban</li>
                <li>Gunakan tombol "Acak Bobot" untuk mengacak nilai bobot (0-3) setiap jawaban</li>
                <li>Perubahan disimpan ke penyimpanan lokal browser</li>
                <li>Klik "Simpan Semua Perubahan" untuk menyimpan semua modifikasi</li>
              </ul>
            </div>
          </Card>

          {/* Question Editor */}
          <Card className="p-6">
            <QuestionEditor />
          </Card>
        </div>
      </div>
    </div>
  );
};
