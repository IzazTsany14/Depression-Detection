import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Download, Calendar, User, FileText, Heart, ClipboardList } from 'lucide-react';
import { MedicalRecord } from './MedicalRecordForm';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface MedicalRecordDetailProps {
  record: MedicalRecord;
  onClose: () => void;
}

export const MedicalRecordDetail: React.FC<MedicalRecordDetailProps> = ({ record, onClose }) => {
  
  const generatePDF = (record: MedicalRecord) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;

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
    doc.setFillColor(111, 78, 124);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('REKAM MEDIS KONSELING', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Bimbingan Konseling - Sistem Deteksi Depresi', pageWidth / 2, 25, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    yPosition = 50;

    addText(`No. Rekam Medis: ${record.id}`, 10, true);
    addText(`Tanggal Dibuat: ${new Date(record.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 10);
    yPosition += 5;

    doc.setDrawColor(111, 78, 124);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    addText('DATA MAHASISWA', 14, true);
    yPosition += 2;
    addText(`Nama: ${record.studentName}`, 11);
    addText(`NIM: ${record.nim}`, 11);
    addText(`NIK: ${record.nik}`, 11);
    if (record.faculty) addText(`Fakultas: ${record.faculty}`, 11);
    if (record.major) addText(`Program Studi: ${record.major}`, 11);
    if (record.semester) addText(`Semester: ${record.semester}`, 11);
    yPosition += 5;

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

    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

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

    const footerY = doc.internal.pageSize.getHeight() - 30;
    doc.setDrawColor(111, 78, 124);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text('Dokumen ini bersifat rahasia dan hanya untuk keperluan konseling', pageWidth / 2, footerY + 7, { align: 'center' });
    doc.text('Sistem Deteksi Dini Tingkat Depresi Mahasiswa', pageWidth / 2, footerY + 12, { align: 'center' });

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-4xl w-full bg-white my-8">
        <div className="sticky top-0 bg-purple-600 text-white p-6 rounded-t-lg z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Detail Rekam Medis</h2>
              <p className="text-purple-100 text-sm mt-1">No. {record.id}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-purple-700">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Metadata */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Dibuat pada: {new Date(record.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Data Mahasiswa */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Data Mahasiswa
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Nama Lengkap</p>
                <p className="font-semibold text-gray-900">{record.studentName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">NIM</p>
                <p className="font-semibold text-gray-900">{record.nim}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">NIK</p>
                <p className="font-semibold text-gray-900">{record.nik}</p>
              </div>
              {record.faculty && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Fakultas</p>
                  <p className="font-semibold text-gray-900">{record.faculty}</p>
                </div>
              )}
              {record.major && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Program Studi</p>
                  <p className="font-semibold text-gray-900">{record.major}</p>
                </div>
              )}
              {record.semester && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Semester</p>
                  <p className="font-semibold text-gray-900">{record.semester}</p>
                </div>
              )}
            </div>
          </div>

          {/* Data Konsultasi */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Data Konsultasi
            </h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tanggal Konsultasi</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(record.consultationDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Jenis Konsultasi</p>
                  <p className="font-semibold text-gray-900">{record.consultationType}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tingkat Depresi</p>
                  <Badge className={`${getLevelColor(record.depressionLevel)} border`}>
                    {record.depressionLevel}
                  </Badge>
                </div>
              </div>

              {record.symptoms && (
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Gejala & Keluhan</p>
                  <p className="text-gray-900 whitespace-pre-wrap">{record.symptoms}</p>
                </div>
              )}

              {record.diagnosis && (
                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Diagnosis</p>
                  <p className="text-gray-900 whitespace-pre-wrap">{record.diagnosis}</p>
                </div>
              )}
            </div>
          </div>

          {/* Intervensi & Rekomendasi */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-600" />
              Intervensi & Rekomendasi
            </h3>
            <div className="space-y-4">
              {record.interventions && (
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Intervensi yang Diberikan</p>
                  <p className="text-gray-900 whitespace-pre-wrap">{record.interventions}</p>
                </div>
              )}

              {record.recommendations && (
                <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Rekomendasi Tindak Lanjut</p>
                  <p className="text-gray-900 whitespace-pre-wrap">{record.recommendations}</p>
                </div>
              )}

              {record.followUpDate && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tanggal Follow Up</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(record.followUpDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Catatan Konselor */}
          {(record.counselorName || record.counselorNotes) && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-purple-600" />
                Catatan Konselor
              </h3>
              <div className="space-y-4">
                {record.counselorName && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Nama Konselor</p>
                    <p className="font-semibold text-gray-900">{record.counselorName}</p>
                  </div>
                )}
                {record.counselorNotes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Catatan</p>
                    <p className="text-gray-900 whitespace-pre-wrap">{record.counselorNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-lg border-t flex gap-3">
          <Button
            onClick={() => generatePDF(record)}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Unduh PDF
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1">
            Tutup
          </Button>
        </div>
      </Card>
    </div>
  );
};
