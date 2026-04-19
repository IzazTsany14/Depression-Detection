import { jsPDF } from 'jspdf';

export interface TestResultPDF {
  level: string;
  score: number;
  date: string;
  name?: string;
  color: string;
  description?: string;
  emoji?: string;
}

export const generateTestResultPDF = (data: TestResultPDF) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Background color
  pdf.setFillColor(240, 245, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header
  pdf.setFontSize(24);
  pdf.setTextColor(30, 58, 138);
  pdf.text('HASIL TES DASS-21', margin, margin + 15, { align: 'center' });

  // Title underline
  pdf.setDrawColor(59, 130, 246);
  pdf.setLineWidth(1);
  pdf.line(margin, margin + 22, pageWidth - margin, margin + 22);

  let yPosition = margin + 35;

  // Subtitle - Sistem Deteksi Depresi
  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Sistem Deteksi Depresi Berbasis Fuzzy Logic', margin, yPosition, { align: 'center', maxWidth: contentWidth });
  yPosition += 8;

  // User info
  pdf.setFontSize(11);
  pdf.setTextColor(51, 65, 85);

  if (data.name) {
    pdf.text(`Nama: ${data.name}`, margin, yPosition);
    yPosition += 7;
  }

  // Tanggal
  const formattedDate = new Date(data.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  pdf.text(`Tanggal: ${formattedDate}`, margin, yPosition);
  yPosition += 7;

  // Jam
  const formattedTime = new Date(data.date).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
  pdf.text(`Jam: ${formattedTime}`, margin, yPosition);
  yPosition += 12;

  // Result Box
  pdf.setFillColor(255, 255, 255);
  pdf.rect(margin, yPosition, contentWidth, 50, 'F');
  pdf.setDrawColor(59, 130, 246);
  pdf.setLineWidth(2);
  pdf.rect(margin, yPosition, contentWidth, 50);

  // Result title
  pdf.setFontSize(14);
  pdf.setTextColor(30, 58, 138);
  pdf.text('Hasil Tes', margin + 8, yPosition + 10);

  // Level
  pdf.setFontSize(16);
  pdf.setTextColor(51, 65, 85);
  pdf.setFont(undefined, 'bold');
  pdf.text(`Tingkat Depresi: ${data.level}`, margin + 8, yPosition + 22);
  pdf.setFont(undefined, 'normal');

  // Score
  pdf.setFontSize(12);
  pdf.text(`Skor: ${data.score}`, margin + 8, yPosition + 32);

  // Status based on level
  let statusColor = [76, 175, 80]; // Green
  let statusText = 'Status: Normal';

  if (data.level === 'Ringan') {
    statusColor = [255, 193, 7]; // Amber
    statusText = 'Status: Perlu Diperhatikan';
  } else if (data.level === 'Sedang') {
    statusColor = [255, 152, 0]; // Orange
    statusText = 'Status: Perlu Konseling';
  } else if (data.level === 'Berat') {
    statusColor = [244, 67, 54]; // Red
    statusText = 'Status: Konseling Segera';
  } else if (data.level === 'Sangat Berat') {
    statusColor = [198, 40, 40]; // Dark Red
    statusText = 'Status: Konseling Segera (Prioritas)';
  }

  pdf.setTextColor(...statusColor);
  pdf.text(statusText, margin + 8, yPosition + 42);

  yPosition += 60;

  // Interpretation
  pdf.setFontSize(11);
  pdf.setTextColor(51, 65, 85);
  pdf.text('Interpretasi Hasil:', margin, yPosition);
  yPosition += 7;

  const interpretations: Record<string, string> = {
    'Normal': 'Hasil tes menunjukkan bahwa Anda tidak mengalami gejala depresi yang signifikan. Tetap jaga kesehatan mental dengan gaya hidup sehat dan aktif secara sosial.',
    'Ringan': 'Hasil tes menunjukkan gejala depresi ringan. Disarankan untuk mulai memperhatikan kesehatan mental, cukup istirahat, dan aktif berolahraga.',
    'Sedang': 'Hasil tes menunjukkan gejala depresi sedang. Sangat disarankan untuk berkonsultasi dengan psikolog atau konselor profesional.',
    'Berat': 'Hasil tes menunjukkan gejala depresi berat. Segera lakukan konsultasi dengan psikolog atau psikiater untuk mendapat penanganan yang tepat.',
    'Sangat Berat': 'Hasil tes menunjukkan gejala depresi yang sangat berat. Segera hubungi profesional kesehatan mental atau layanan darurat untuk mendapat bantuan profesional.',
  };

  const interpretation = interpretations[data.level] || 'Konsultasikan hasil tes ini dengan profesional kesehatan mental.';

  pdf.setFontSize(10);
  const splitText = pdf.splitTextToSize(interpretation, contentWidth - 4);
  pdf.text(splitText, margin + 2, yPosition, { maxWidth: contentWidth - 4, align: 'justify' });

  yPosition += splitText.length * 5 + 10;

  // Important Notice
  pdf.setFillColor(255, 250, 215);
  pdf.setDrawColor(255, 193, 7);
  pdf.setLineWidth(1);
  pdf.rect(margin, yPosition, contentWidth, 30, 'FD');

  pdf.setFontSize(9);
  pdf.setTextColor(140, 110, 0);
  pdf.setFont(undefined, 'bold');
  pdf.text('⚠ PENTING:', margin + 5, yPosition + 8);
  pdf.setFont(undefined, 'normal');

  const warningText = pdf.splitTextToSize(
    'Hasil ini bukan diagnosis medis. Hanya untuk tujuan skrining awal. Jika Anda merasa perlu bantuan, segera konsultasi dengan psikolog atau psikiater profesional.',
    contentWidth - 10
  );
  pdf.text(warningText, margin + 5, yPosition + 13, { maxWidth: contentWidth - 10, align: 'justify' });

  yPosition += 40;

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(148, 163, 184);
  pdf.text('Sistem Deteksi Depresi Berbasis Fuzzy Logic - ' + new Date().getFullYear(), margin, pageHeight - 10, { align: 'center' });
  pdf.text('Dokumen ini adalah hasil tes pribadi dan bersifat rahasia', margin, pageHeight - 6, { align: 'center' });

  return pdf;
};

export const downloadPDF = (pdf: jsPDF, filename: string) => {
  pdf.save(filename);
};
