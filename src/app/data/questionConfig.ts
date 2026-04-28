// Konfigurasi Pertanyaan untuk Sistem Deteksi Depresi

export interface AnswerConfig {
  label: string;
  weight: number; // Score/bobot (0-3)
}

export interface ConfigurableQuestion {
  id: number;
  text: string;
  subscale: 'depression' | 'anxiety' | 'stress';
  answers: AnswerConfig[];
  randomizeWeights?: boolean;
}

// Default Question Configuration
export const DEFAULT_QUESTION_CONFIGS: ConfigurableQuestion[] = [
  {
    id: 1,
    text: "Saya merasa sulit untuk beristirahat/bersantai",
    subscale: 'stress',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 2,
    text: "Saya menyadari mulut saya terasa kering",
    subscale: 'anxiety',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 3,
    text: "Saya sepertinya tidak mampu merasakan perasaan positif sama sekali",
    subscale: 'depression',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 4,
    text: "Saya mengalami kesulitan bernafas (misalnya bernafas cepat, kehabisan nafas meskipun tidak melakukan aktivitas fisik)",
    subscale: 'anxiety',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 5,
    text: "Saya merasa sulit untuk memulai melakukan sesuatu",
    subscale: 'depression',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 6,
    text: "Saya cenderung bereaksi berlebihan terhadap suatu situasi",
    subscale: 'stress',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 7,
    text: "Saya mengalami gemetaran (misalnya di tangan)",
    subscale: 'anxiety',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 8,
    text: "Saya merasa banyak menguras energi untuk merasa cemas/khawatir",
    subscale: 'stress',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 9,
    text: "Saya khawatir dengan situasi dimana saya mungkin panik dan mempermalukan diri sendiri",
    subscale: 'anxiety',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 10,
    text: "Saya merasa tidak ada hal yang bisa saya harapkan/nantikan",
    subscale: 'depression',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 11,
    text: "Saya menemukan diri saya menjadi gelisah",
    subscale: 'stress',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 12,
    text: "Saya merasa sulit untuk rileks/santai",
    subscale: 'stress',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 13,
    text: "Saya merasa murung dan sedih",
    subscale: 'depression',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 14,
    text: "Saya tidak toleran terhadap hal apapun yang menghalangi saya untuk melanjutkan apa yang sedang saya lakukan",
    subscale: 'stress',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 15,
    text: "Saya merasa hampir panik",
    subscale: 'anxiety',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 16,
    text: "Saya merasa tidak mampu untuk antusias tentang apapun",
    subscale: 'depression',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 17,
    text: "Saya merasa diri saya tidak berharga sebagai seorang manusia",
    subscale: 'depression',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 18,
    text: "Saya merasa bahwa saya mudah tersinggung",
    subscale: 'stress',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 19,
    text: "Saya menyadari detak jantung saya meskipun tidak melakukan aktivitas fisik (misalnya, merasakan detak jantung meningkat atau melewatkan detak jantung)",
    subscale: 'anxiety',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 20,
    text: "Saya merasa takut tanpa alasan yang jelas",
    subscale: 'anxiety',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  },
  {
    id: 21,
    text: "Saya merasa bahwa hidup tidak berarti",
    subscale: 'depression',
    answers: [
      { label: "Tidak Sesuai", weight: 0 },
      { label: "Sesuai", weight: 1 },
      { label: "Cukup Sesuai", weight: 2 },
      { label: "Sangat Sesuai", weight: 3 }
    ],
    randomizeWeights: false
  }
];

// Get question config by ID
export const getQuestionConfig = (id: number): ConfigurableQuestion | undefined => {
  return DEFAULT_QUESTION_CONFIGS.find(q => q.id === id);
};

// Get all question configs
export const getAllQuestionConfigs = (): ConfigurableQuestion[] => {
  return DEFAULT_QUESTION_CONFIGS;
};

// Load from localStorage or use defaults
export const loadQuestionConfigs = (): ConfigurableQuestion[] => {
  const stored = localStorage.getItem('questionConfigs');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_QUESTION_CONFIGS;
    }
  }
  return DEFAULT_QUESTION_CONFIGS;
};

// Save question configs to localStorage
export const saveQuestionConfigs = (configs: ConfigurableQuestion[]): void => {
  localStorage.setItem('questionConfigs', JSON.stringify(configs));
};
