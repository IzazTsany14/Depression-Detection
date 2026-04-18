import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileText, Save, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { dummyUsers } from '../data/dummyData';

interface MedicalRecordFormProps {
  onSave: (record: MedicalRecord) => void;
  onCancel: () => void;
}

export interface MedicalRecord {
  id: string;
  studentName: string;
  nik: string;
  nim: string;
  faculty: string;
  major: string;
  semester: string;
  consultationDate: string;
  consultationType: string;
  symptoms: string;
  diagnosis: string;
  depressionLevel: string;
  interventions: string;
  recommendations: string;
  followUpDate: string;
  counselorName: string;
  counselorNotes: string;
  createdAt: string;
}

export const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<MedicalRecord>>({
    consultationDate: new Date().toISOString().split('T')[0],
    consultationType: 'Individual',
    depressionLevel: 'Normal',
  });
  const [notFound, setNotFound] = useState(false);

  const handleChange = (field: keyof MedicalRecord, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNikChange = (nik: string) => {
    handleChange('nik', nik);
    
    if (nik.trim() === '') {
      setFormData(prev => ({
        ...prev,
        studentName: '',
        nim: '',
        faculty: '',
        major: '',
        semester: ''
      }));
      setNotFound(false);
      return;
    }

    // Cari mahasiswa berdasarkan NIK
    const student = dummyUsers.find(u => u.role === 'student' && u.nik === nik);
    
    if (student) {
      setFormData(prev => ({
        ...prev,
        nik: nik,
        studentName: student.name,
        nim: student.nim,
        faculty: student.faculty || '',
        major: student.major || '',
        semester: student.semester ? student.semester.toString() : ''
      }));
      setNotFound(false);
      toast.success('Data mahasiswa ditemukan');
    } else {
      setFormData(prev => ({
        ...prev,
        nik: nik,
        studentName: '',
        nim: '',
        faculty: '',
        major: '',
        semester: ''
      }));
      setNotFound(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi form
    if (!formData.studentName || !formData.nim || !formData.nik || !formData.consultationDate) {
      toast.error('Mohon lengkapi data yang wajib diisi');
      return;
    }

    const record: MedicalRecord = {
      id: `RM-${Date.now()}`,
      studentName: formData.studentName || '',
      nik: formData.nik || '',
      nim: formData.nim || '',
      faculty: formData.faculty || '',
      major: formData.major || '',
      semester: formData.semester || '',
      consultationDate: formData.consultationDate || '',
      consultationType: formData.consultationType || 'Individual',
      symptoms: formData.symptoms || '',
      diagnosis: formData.diagnosis || '',
      depressionLevel: formData.depressionLevel || 'Normal',
      interventions: formData.interventions || '',
      recommendations: formData.recommendations || '',
      followUpDate: formData.followUpDate || '',
      counselorName: formData.counselorName || '',
      counselorNotes: formData.counselorNotes || '',
      createdAt: new Date().toISOString(),
    };

    onSave(record);
    toast.success('Rekam medis berhasil disimpan');
  };

  return (
    <Card className="p-6 bg-white">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-600" />
          Form Rekam Medis Konsultasi
        </h3>
        <p className="text-gray-600">Lengkapi data konsultasi mahasiswa</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data Mahasiswa */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Data Mahasiswa</h4>
          
          {/* NIK Search Field - First */}
          <div>
            <Label htmlFor="nik">NIK (Nomor Induk Kependudukan) *</Label>
            <Input
              id="nik"
              value={formData.nik || ''}
              onChange={(e) => handleNikChange(e.target.value)}
              placeholder="Masukkan NIK untuk mencari data mahasiswa"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Data lainnya akan terisi otomatis setelah NIK dimasukkan</p>
          </div>

          {notFound && formData.nik && (
            <Alert className="bg-red-50 border-red-300">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-900">
                NIK tidak ditemukan dalam sistem. Mohon periksa kembali nomor NIK.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="studentName">Nama Lengkap *</Label>
              <Input
                id="studentName"
                value={formData.studentName || ''}
                onChange={(e) => handleChange('studentName', e.target.value)}
                placeholder="Nama akan otomatis terisi"
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            
            <div>
              <Label htmlFor="nim">NIM *</Label>
              <Input
                id="nim"
                value={formData.nim || ''}
                onChange={(e) => handleChange('nim', e.target.value)}
                placeholder="NIM akan otomatis terisi"
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="faculty">Fakultas</Label>
              <Input
                id="faculty"
                value={formData.faculty || ''}
                onChange={(e) => handleChange('faculty', e.target.value)}
                placeholder="Fakultas akan otomatis terisi"
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="major">Program Studi</Label>
              <Input
                id="major"
                value={formData.major || ''}
                onChange={(e) => handleChange('major', e.target.value)}
                placeholder="Program studi akan otomatis terisi"
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="semester">Semester</Label>
              <Input
                id="semester"
                value={formData.semester || ''}
                onChange={(e) => handleChange('semester', e.target.value)}
                placeholder="Semester akan otomatis terisi"
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Data Konsultasi */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Data Konsultasi</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="consultationDate">Tanggal Konsultasi *</Label>
              <Input
                id="consultationDate"
                type="date"
                value={formData.consultationDate || ''}
                onChange={(e) => handleChange('consultationDate', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="consultationType">Jenis Konsultasi</Label>
              <Select
                value={formData.consultationType}
                onValueChange={(value) => handleChange('consultationType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis konsultasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Kelompok">Kelompok</SelectItem>
                  <SelectItem value="Keluarga">Keluarga</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="symptoms">Gejala & Keluhan</Label>
              <Textarea
                id="symptoms"
                value={formData.symptoms || ''}
                onChange={(e) => handleChange('symptoms', e.target.value)}
                placeholder="Deskripsikan gejala dan keluhan yang dialami mahasiswa"
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                value={formData.diagnosis || ''}
                onChange={(e) => handleChange('diagnosis', e.target.value)}
                placeholder="Diagnosis berdasarkan hasil asesmen"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="depressionLevel">Tingkat Depresi</Label>
              <Select
                value={formData.depressionLevel}
                onValueChange={(value) => handleChange('depressionLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tingkat depresi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Ringan">Ringan</SelectItem>
                  <SelectItem value="Sedang">Sedang</SelectItem>
                  <SelectItem value="Berat">Berat</SelectItem>
                  <SelectItem value="Sangat Berat">Sangat Berat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="followUpDate">Tanggal Follow Up</Label>
              <Input
                id="followUpDate"
                type="date"
                value={formData.followUpDate || ''}
                onChange={(e) => handleChange('followUpDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Intervensi & Rekomendasi */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Intervensi & Rekomendasi</h4>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="interventions">Intervensi yang Diberikan</Label>
              <Textarea
                id="interventions"
                value={formData.interventions || ''}
                onChange={(e) => handleChange('interventions', e.target.value)}
                placeholder="Deskripsikan intervensi yang telah diberikan"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="recommendations">Rekomendasi Tindak Lanjut</Label>
              <Textarea
                id="recommendations"
                value={formData.recommendations || ''}
                onChange={(e) => handleChange('recommendations', e.target.value)}
                placeholder="Rekomendasi untuk tindak lanjut"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="counselorName">Nama Konselor</Label>
              <Input
                id="counselorName"
                value={formData.counselorName || ''}
                onChange={(e) => handleChange('counselorName', e.target.value)}
                placeholder="Nama konselor yang menangani"
              />
            </div>

            <div>
              <Label htmlFor="counselorNotes">Catatan Konselor</Label>
              <Textarea
                id="counselorNotes"
                value={formData.counselorNotes || ''}
                onChange={(e) => handleChange('counselorNotes', e.target.value)}
                placeholder="Catatan tambahan dari konselor"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
            <Save className="w-4 h-4 mr-2" />
            Simpan Rekam Medis
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Batal
          </Button>
        </div>
      </form>
    </Card>
  );
};
