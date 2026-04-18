export interface Question {
  id: number;
  text: string;
  subscale: 'depression' | 'anxiety' | 'stress';
}

export const DASS21_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Saya merasa sulit untuk beristirahat/bersantai",
    subscale: 'stress'
  },
  {
    id: 2,
    text: "Saya menyadari mulut saya terasa kering",
    subscale: 'anxiety'
  },
  {
    id: 3,
    text: "Saya sepertinya tidak mampu merasakan perasaan positif sama sekali",
    subscale: 'depression'
  },
  {
    id: 4,
    text: "Saya mengalami kesulitan bernafas (misalnya bernafas cepat, kehabisan nafas meskipun tidak melakukan aktivitas fisik)",
    subscale: 'anxiety'
  },
  {
    id: 5,
    text: "Saya merasa sulit untuk memulai melakukan sesuatu",
    subscale: 'depression'
  },
  {
    id: 6,
    text: "Saya cenderung bereaksi berlebihan terhadap suatu situasi",
    subscale: 'stress'
  },
  {
    id: 7,
    text: "Saya mengalami gemetaran (misalnya di tangan)",
    subscale: 'anxiety'
  },
  {
    id: 8,
    text: "Saya merasa banyak menguras energi untuk merasa cemas/khawatir",
    subscale: 'stress'
  },
  {
    id: 9,
    text: "Saya khawatir dengan situasi dimana saya mungkin panik dan mempermalukan diri sendiri",
    subscale: 'anxiety'
  },
  {
    id: 10,
    text: "Saya merasa tidak ada hal yang bisa saya harapkan/nantikan",
    subscale: 'depression'
  },
  {
    id: 11,
    text: "Saya menemukan diri saya menjadi gelisah",
    subscale: 'stress'
  },
  {
    id: 12,
    text: "Saya merasa sulit untuk rileks/santai",
    subscale: 'stress'
  },
  {
    id: 13,
    text: "Saya merasa murung dan sedih",
    subscale: 'depression'
  },
  {
    id: 14,
    text: "Saya tidak toleran terhadap hal apapun yang menghalangi saya untuk melanjutkan apa yang sedang saya lakukan",
    subscale: 'stress'
  },
  {
    id: 15,
    text: "Saya merasa hampir panik",
    subscale: 'anxiety'
  },
  {
    id: 16,
    text: "Saya merasa tidak mampu untuk antusias tentang apapun",
    subscale: 'depression'
  },
  {
    id: 17,
    text: "Saya merasa diri saya tidak berharga sebagai seorang manusia",
    subscale: 'depression'
  },
  {
    id: 18,
    text: "Saya merasa bahwa saya mudah tersinggung",
    subscale: 'stress'
  },
  {
    id: 19,
    text: "Saya menyadari detak jantung saya meskipun tidak melakukan aktivitas fisik (misalnya, merasakan detak jantung meningkat atau melewatkan detak jantung)",
    subscale: 'anxiety'
  },
  {
    id: 20,
    text: "Saya merasa takut tanpa alasan yang jelas",
    subscale: 'anxiety'
  },
  {
    id: 21,
    text: "Saya merasa bahwa hidup tidak berarti",
    subscale: 'depression'
  }
];

export const ANSWER_OPTIONS = [
  { value: 0, label: "Tidak Sesuai" },
  { value: 1, label: "Sesuai" },
  { value: 2, label: "Cukup Sesuai" },
  { value: 3, label: "Sangat Sesuai" }
];
