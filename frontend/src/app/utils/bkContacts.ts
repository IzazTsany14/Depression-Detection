export const BK_CONTACTS = [
  {
    label: 'BK 1',
    phone: '0852-3126-4685',
    whatsappNumber: '6285231264685'
  },
  {
    label: 'BK 2',
    phone: '0857-9157-0735',
    whatsappNumber: '6285791570735'
  }
];

type ConsultationMessageParams = {
  bkName?: string;
  studentName?: string;
  nim?: string;
  studyProgram?: string;
  faculty?: string;
  latestCategory?: string;
};

const getGreetingTime = () => {
  const hour = new Date().getHours();
  if (hour < 11) return 'pagi';
  if (hour < 15) return 'siang';
  if (hour < 18) return 'sore';
  return 'malam';
};

export const createConsultationMessage = ({
  bkName = 'Bapak/Ibu Dosen BK',
  studentName = 'Nama Mahasiswa',
  nim = 'NIM Mahasiswa',
  studyProgram = 'S1/D3/D4 dan Nama Prodi',
  faculty = 'Nama Fakultas',
  latestCategory = 'hasil kategori terakhir',
}: ConsultationMessageParams = {}) => (
  `Assalamualaikum Wr. Wb.\n\n` +
  `Permisi Bapak/Ibu ${bkName}, selamat ${getGreetingTime()}. Mohon maaf mengganggu waktunya. Perkenalkan saya ${studentName}, NIM ${nim}, dari Prodi ${studyProgram}, Fakultas ${faculty}.\n\n` +
  `Izin menyampaikan bahwa saya ingin melakukan konsultasi terkait hasil kategori terakhir yang telah saya peroleh. Berikut saya lampirkan hasil kategori terakhir saya sebagai bahan konsultasi bersama Bapak/Ibu.\n\n` +
  `Hasil kategori terakhir: ${latestCategory}.\n\n` +
  `Apabila Bapak/Ibu berkenan, saya memohon arahan dan waktu untuk melakukan konsultasi lebih lanjut mengenai hasil tersebut.\n\n` +
  `Terima kasih banyak atas perhatian dan waktu Bapak/Ibu. Mohon maaf apabila mengganggu aktivitas Bapak/Ibu.\n\n` +
  `Wassalamualaikum Wr. Wb.`
);

export const getWhatsAppUrl = (
  whatsappNumber: string,
  message = createConsultationMessage(),
): string => {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

export const isSevereLevel = (level?: string | null): boolean => {
  return level === 'Parah' || level === 'Sangat Parah';
};
