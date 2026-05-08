import { DASS21_QUESTIONS } from '../pages/bk/dass21Questions';

type Subscale = 'depression' | 'anxiety' | 'stress';

const subscaleThresholds: Record<Subscale, Array<{ max: number; level: string }>> = {
  depression: [
    { max: 9, level: 'Normal' },
    { max: 13, level: 'Ringan' },
    { max: 20, level: 'Sedang' },
    { max: 27, level: 'Parah' },
    { max: Infinity, level: 'Sangat Parah' }
  ],
  anxiety: [
    { max: 7, level: 'Normal' },
    { max: 9, level: 'Ringan' },
    { max: 14, level: 'Sedang' },
    { max: 19, level: 'Parah' },
    { max: Infinity, level: 'Sangat Parah' }
  ],
  stress: [
    { max: 14, level: 'Normal' },
    { max: 18, level: 'Ringan' },
    { max: 25, level: 'Sedang' },
    { max: 33, level: 'Parah' },
    { max: Infinity, level: 'Sangat Parah' }
  ]
};

const levelDescriptions: Record<string, string> = {
  Normal: 'Hasil Anda berada dalam rentang normal. Tetap pertahankan rutinitas sehat, hubungan sosial yang mendukung, dan waktu istirahat yang cukup.',
  Ringan: 'Ada beberapa tanda tekanan psikologis ringan. Mulailah memberi ruang untuk istirahat, bercerita pada orang tepercaya, dan memantau perubahan kondisi Anda.',
  Sedang: 'Gejala berada pada tingkat sedang. Anda tidak perlu menghadapi ini sendirian; pertimbangkan membuat janji konseling dengan BK atau profesional kesehatan mental.',
  Parah: 'Gejala berada pada tingkat parah. Sangat disarankan untuk segera menghubungi BK, psikolog, psikiater, atau layanan kesehatan terdekat agar mendapat dukungan yang tepat.',
  'Sangat Parah': 'Gejala berada pada tingkat sangat parah. Bila muncul dorongan menyakiti diri atau merasa tidak aman, segera hubungi orang terdekat, BK, layanan darurat 112/119, atau fasilitas kesehatan terdekat.'
};

const guideByLevel: Record<string, string[]> = {
  Normal: [
    'Pertahankan pola tidur dan makan yang teratur.',
    'Tetap aktif secara sosial dan lakukan aktivitas yang memberi energi positif.',
    'Ulangi skrining secara berkala untuk memantau perubahan.'
  ],
  Ringan: [
    'Jadwalkan waktu istirahat singkat setiap hari.',
    'Kurangi beban yang tidak mendesak dan gunakan teknik pernapasan saat tegang.',
    'Bicarakan kondisi Anda dengan teman, keluarga, atau dosen wali yang dipercaya.'
  ],
  Sedang: [
    'Pertimbangkan sesi konseling dengan BK atau psikolog.',
    'Catat pola tidur, makan, dan pemicu emosi untuk dibahas saat konseling.',
    'Minta dukungan orang terdekat untuk membantu menjaga rutinitas harian.'
  ],
  Parah: [
    'Hubungi BK atau profesional kesehatan mental secepatnya.',
    'Jangan mengambil keputusan besar saat kondisi sedang sangat parah.',
    'Beri tahu orang tepercaya agar Anda tidak menjalani masa sulit sendirian.'
  ],
  'Sangat Parah': [
    'Cari bantuan segera dari BK, keluarga, layanan darurat, atau fasilitas kesehatan.',
    'Tetap berada di tempat yang aman dan hindari menyendiri bila muncul pikiran menyakiti diri.',
    'Simpan nomor darurat dan hubungi pendamping yang bisa menemani Anda.'
  ]
};

export const getDisplayLevel = (level?: string | null) => {
  if (!level) return '-';
  return level;
};

export const getLevelDescription = (level?: string | null) => {
  return levelDescriptions[getDisplayLevel(level)] || 'Konsultasikan hasil ini dengan profesional kesehatan mental untuk evaluasi lebih lanjut.';
};

export const getGuidanceByLevel = (level?: string | null) => {
  return guideByLevel[getDisplayLevel(level)] || guideByLevel.Sedang;
};

export const isEmergencyLevel = (level?: string | null) => {
  return ['Parah', 'Sangat Parah'].includes(getDisplayLevel(level));
};

export const isCriticalEmergencyLevel = (level?: string | null) => {
  return getDisplayLevel(level) === 'Sangat Parah';
};

export const getSubscaleResults = (answers?: number[]) => {
  if (!Array.isArray(answers) || answers.length !== DASS21_QUESTIONS.length) return [];

  const scores = DASS21_QUESTIONS.reduce<Record<Subscale, number>>(
    (acc, question, index) => {
      acc[question.subscale as Subscale] += answers[index] || 0;
      return acc;
    },
    { depression: 0, anxiety: 0, stress: 0 }
  );

  return (Object.keys(scores) as Subscale[]).map((subscale) => {
    const score = scores[subscale] * 2;
    const level = subscaleThresholds[subscale].find((item) => score <= item.max)?.level || 'Normal';

    return {
      key: subscale,
      label: subscale === 'depression' ? 'Depresi' : subscale === 'anxiety' ? 'Kecemasan' : 'Stres',
      score,
      level
    };
  });
};
