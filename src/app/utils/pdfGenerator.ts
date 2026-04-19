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
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // White background
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // ===== HEADER SECTION =====
  // Header background - Professional blue
  pdf.setFillColor(30, 58, 138);
  pdf.rect(0, 0, pageWidth, 45, 'F');

  // Title
  pdf.setFontSize(26);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('HASIL TES DASS-21', pageWidth / 2, 18, { align: 'center' });

  // Subtitle
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(200, 220, 255);
  pdf.text('Sistem Deteksi Depresi Berbasis Fuzzy Logic', pageWidth / 2, 28, { align: 'center' });

  // Horizontal line
  pdf.setDrawColor(59, 130, 246);
  pdf.setLineWidth(2);
  pdf.line(margin, 43, pageWidth - margin, 43);

  let yPosition = 55;

  // ===== USER INFO SECTION =====
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(51, 65, 85);

  // Info box background
  pdf.setFillColor(240, 245, 255);
  pdf.rect(margin, yPosition - 5, contentWidth, 25, 'F');
  pdf.setDrawColor(200, 220, 255);
  pdf.setLineWidth(0.5);
  pdf.rect(margin, yPosition - 5, contentWidth, 25);

  if (data.name) {
    pdf.setFont(undefined, 'bold');
    pdf.text('Nama:', margin + 5, yPosition);
    pdf.setFont(undefined, 'normal');
    pdf.text(data.name, margin + 35, yPosition);
  }

  const formattedDate = new Date(data.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  pdf.setFont(undefined, 'bold');
  pdf.text('Tanggal:', margin + 5, yPosition + 8);
  pdf.setFont(undefined, 'normal');
  pdf.text(formattedDate, margin + 35, yPosition + 8);

  const formattedTime = new Date(data.date).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  pdf.setFont(undefined, 'bold');
  pdf.text('Jam:', margin + 5, yPosition + 16);
  pdf.setFont(undefined, 'normal');
  pdf.text(formattedTime, margin + 35, yPosition + 16);

  yPosition += 35;

  // ===== RESULT BOX SECTION =====
  // Determine colors based on level
  let levelColor = [76, 175, 80]; // Green - Normal
  let levelBgColor = [232, 245, 233];
  let statusText = 'Status: Normal - Tidak ada gejala depresi';

  if (data.level === 'Ringan') {
    levelColor = [255, 193, 7]; // Amber
    levelBgColor = [255, 248, 225];
    statusText = 'Status: Perlu Diperhatikan';
  } else if (data.level === 'Sedang') {
    levelColor = [255, 152, 0]; // Orange
    levelBgColor = [255, 243, 224];
    statusText = 'Status: Perlu Konseling';
  } else if (data.level === 'Berat') {
    levelColor = [244, 67, 54]; // Red
    levelBgColor = [255, 235, 238];
    statusText = 'Status: Konseling Segera';
  } else if (data.level === 'Sangat Berat') {
    levelColor = [198, 40, 40]; // Dark Red
    levelBgColor = [253, 230, 230];
    statusText = 'Status: Konseling Segera (Prioritas)';
  }

  // Result box background
  pdf.setFillColor(...levelBgColor);
  pdf.rect(margin, yPosition, contentWidth, 50, 'F');
  
  // Result box border
  pdf.setDrawColor(...levelColor);
  pdf.setLineWidth(2);
  pdf.rect(margin, yPosition, contentWidth, 50);

  // Section title
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(30, 58, 138);
  pdf.text('HASIL TES', margin + 8, yPosition + 8);

  // Depression level - Large and prominent
  pdf.setFontSize(18);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(...levelColor);
  pdf.text(`Tingkat Depresi: ${data.level}`, margin + 8, yPosition + 20);

  // Score
  pdf.setFontSize(11);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(51, 65, 85);
  pdf.text(`Skor: ${data.score} / 126`, margin + 8, yPosition + 30);

  // Status
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(...levelColor);
  pdf.text(statusText, margin + 8, yPosition + 39);

  yPosition += 60;

  // ===== INTERPRETATION SECTION =====
  pdf.setFontSize(11);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(30, 58, 138);
  pdf.text('INTERPRETASI HASIL:', margin, yPosition);
  yPosition += 8;

  const interpretations: Record<string, string> = {
    'Normal': 'Berdasarkan hasil tes DASS-21, Anda tidak mengalami gejala depresi yang signifikan. Tetaplah menjaga kesehatan mental dengan menjalankan gaya hidup sehat, berolahraga secara teratur, dan mempertahankan hubungan sosial yang positif.',
    'Ringan': 'Hasil tes menunjukkan gejala depresi ringan. Disarankan untuk mulai memperhatikan kesehatan mental Anda dengan lebih serius. Tingkatkan aktivitas fisik, cukup istirahat, dan jika memungkinkan, berbicara dengan teman atau keluarga tentang perasaan Anda.',
    'Sedang': 'Hasil tes menunjukkan gejala depresi sedang. Sangat disarankan untuk berkonsultasi dengan profesional kesehatan mental seperti psikolog atau konselor. Mereka dapat memberikan dukungan dan strategi coping yang tepat.',
    'Berat': 'Hasil tes menunjukkan gejala depresi berat. Segera lakukan konsultasi dengan psikolog atau psikiater untuk mendapatkan penanganan profesional. Jangan ragu untuk mencari bantuan - ini adalah langkah penting untuk kesehatan Anda.',
    'Sangat Berat': 'Hasil tes menunjukkan gejala depresi yang sangat berat. Ini adalah situasi yang memerlukan perhatian medis segera. Segera hubungi psikiater, layanan kesehatan mental, atau hotline krisis untuk mendapatkan bantuan profesional.',
  };

  const interpretation = interpretations[data.level] || 'Konsultasikan hasil tes ini dengan profesional kesehatan mental untuk evaluasi lebih lanjut.';

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(51, 65, 85);
  const splitText = pdf.splitTextToSize(interpretation, contentWidth - 4);
  pdf.text(splitText, margin + 2, yPosition, { maxWidth: contentWidth - 4, align: 'justify' });

  yPosition += splitText.length * 5 + 10;

  // ===== IMPORTANT NOTICE SECTION =====
  pdf.setFillColor(255, 250, 200);
  pdf.setDrawColor(255, 193, 7);
  pdf.setLineWidth(1.5);
  pdf.rect(margin, yPosition, contentWidth, 28, 'FD');

  pdf.setFontSize(9);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(180, 140, 0);
  pdf.text('PENTING - PERHATIAN:', margin + 5, yPosition + 6);

  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(140, 110, 0);
  pdf.setFontSize(8);
  const warningText = pdf.splitTextToSize(
    'Hasil tes ini BUKAN merupakan diagnosis medis resmi. Tes ini hanya untuk tujuan skrining awal dan kesadaran diri. Untuk diagnosis yang akurat dan penanganan yang tepat, silakan konsultasikan dengan psikolog, psikiater, atau profesional kesehatan mental yang bersertifikat.',
    contentWidth - 10
  );
  pdf.text(warningText, margin + 5, yPosition + 12, { maxWidth: contentWidth - 10, align: 'justify' });

  // ===== FOOTER =====
  pdf.setFontSize(8);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(130, 140, 155);
  
  // Horizontal line before footer
  pdf.setDrawColor(220, 230, 245);
  pdf.setLineWidth(0.5);
  pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

  pdf.text('Sistem Deteksi Depresi Berbasis Fuzzy Logic', pageWidth / 2, pageHeight - 10, { align: 'center' });
  pdf.text(`Tahun ${new Date().getFullYear()} | Dokumen Rahasia - Hanya untuk Keperluan Pribadi`, pageWidth / 2, pageHeight - 6, { align: 'center' });

  return pdf;
};

export const downloadPDF = (pdf: jsPDF, filename: string) => {
  pdf.save(filename);
};
