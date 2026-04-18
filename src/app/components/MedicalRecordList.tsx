import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Download, Eye, Trash2, FileText } from 'lucide-react';
import { MedicalRecord } from './MedicalRecordForm';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface MedicalRecordListProps {
  records: MedicalRecord[];
  onDelete: (id: string) => void;
  onView: (record: MedicalRecord) => void;
}

export const MedicalRecordList: React.FC<MedicalRecordListProps> = ({ records, onDelete, onView }) => {
  
  const generatePDF = (record: MedicalRecord) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;

    // Helper function to add text with auto line break
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * (fontSize * 0.5) + 5;
    };

    // Header
    doc.setFillColor(111, 78, 124); // Purple color
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('REKAM MEDIS KONSELING', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Bimbingan Konseling - Sistem Deteksi Depresi', pageWidth / 2, 25, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    yPosition = 50;

    // Record ID and Date
    addText(`No. Rekam Medis: ${record.id}`, 10, true);
    addText(`Tanggal Dibuat: ${new Date(record.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 10);
    yPosition += 5;

    // Divider
    doc.setDrawColor(111, 78, 124);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Data Mahasiswa Section
    addText('DATA MAHASISWA', 14, true);
    yPosition += 2;
    addText(`Nama: ${record.studentName}`, 11);
    addText(`NIM: ${record.nim}`, 11);
    addText(`NIK: ${record.nik}`, 11);
    if (record.faculty) addText(`Fakultas: ${record.faculty}`, 11);
    if (record.major) addText(`Program Studi: ${record.major}`, 11);
    if (record.semester) addText(`Semester: ${record.semester}`, 11);
    if (record.email) addText(`Email: ${record.email}`, 11);
    if (record.phone) addText(`Telepon: ${record.phone}`, 11);
    yPosition += 5;

    // Data Konsultasi Section
    addText('DATA KONSULTASI', 14, true);
    yPosition += 2;
    addText(`Tanggal Konsultasi: ${new Date(record.consultationDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}`, 11);
    addText(`Jenis Konsultasi: ${record.consultationType}`, 11);
    addText(`Tingkat Depresi: ${record.depressionLevel}`, 11);
    
    if (record.symptoms) {
      yPosition += 3;
      addText('Gejala & Keluhan:', 11, true);
      addText(record.symptoms, 10);
    }
    
    if (record.diagnosis) {
      yPosition += 3;
      addText('Diagnosis:', 11, true);
      addText(record.diagnosis, 10);
    }

    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Intervensi & Rekomendasi Section
    yPosition += 5;
    addText('INTERVENSI & REKOMENDASI', 14, true);
    yPosition += 2;
    
    if (record.interventions) {
      addText('Intervensi yang Diberikan:', 11, true);
      addText(record.interventions, 10);
    }
    
    if (record.recommendations) {
      yPosition += 3;
      addText('Rekomendasi Tindak Lanjut:', 11, true);
      addText(record.recommendations, 10);
    }
    
    if (record.followUpDate) {
      yPosition += 3;
      addText(`Tanggal Follow Up: ${new Date(record.followUpDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })}`, 11);
    }

    // Konselor Section
    if (record.counselorName || record.counselorNotes) {
      yPosition += 5;
      addText('CATATAN KONSELOR', 14, true);
      yPosition += 2;
      if (record.counselorName) addText(`Nama Konselor: ${record.counselorName}`, 11);
      if (record.counselorNotes) {
        addText('Catatan:', 11, true);
        addText(record.counselorNotes, 10);
      }
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 30;
    doc.setDrawColor(111, 78, 124);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text('Dokumen ini bersifat rahasia dan hanya untuk keperluan konseling', pageWidth / 2, footerY + 7, { align: 'center' });
    doc.text('Sistem Deteksi Dini Tingkat Depresi Mahasiswa', pageWidth / 2, footerY + 12, { align: 'center' });

    // Save PDF
    const fileName = `Rekam_Medis_${record.nim}_${record.id}.pdf`;
    doc.save(fileName);
    toast.success('PDF berhasil diunduh');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Normal':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Ringan':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Sedang':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Berat':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Sangat Berat':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (records.length === 0) {
    return (
      <Card className="p-12 text-center bg-white">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Belum ada rekam medis</p>
        <p className="text-gray-500 text-sm mt-2">Rekam medis yang dibuat akan muncul di sini</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <Card key={record.id} className="p-6 bg-white hover:shadow-lg transition-shadow border-2 border-purple-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{record.studentName}</h3>
                <Badge className={`${getLevelColor(record.depressionLevel)} border`}>
                  {record.depressionLevel}
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                <p><span className="font-medium">NIM:</span> {record.nim}</p>
                <p><span className="font-medium">NIK:</span> {record.nik}</p>
                <p><span className="font-medium">No. RM:</span> {record.id}</p>
                <p><span className="font-medium">Tanggal Konsultasi:</span> {new Date(record.consultationDate).toLocaleDateString('id-ID')}</p>
                <p><span className="font-medium">Jenis:</span> {record.consultationType}</p>
                {record.faculty && <p><span className="font-medium">Fakultas:</span> {record.faculty}</p>}
                {record.counselorName && <p><span className="font-medium">Konselor:</span> {record.counselorName}</p>}
              </div>
            </div>
          </div>

          {/* Quick Preview */}
          {record.diagnosis && (
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Diagnosis:</p>
              <p className="text-sm text-gray-600 line-clamp-2">{record.diagnosis}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(record)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Lihat Detail
            </Button>
            <Button
              size="sm"
              onClick={() => generatePDF(record)}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Unduh PDF
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (confirm('Yakin ingin menghapus rekam medis ini?')) {
                  onDelete(record.id);
                  toast.success('Rekam medis berhasil dihapus');
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
