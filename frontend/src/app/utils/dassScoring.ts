const DEPRESSION_ITEMS = [2, 4, 9, 12, 15, 16, 20];

export interface DepressionLevel {
  level: string;
  score: number;
  color: string;
  bgColor: string;
  description: string;
  emoji: string;
}

export function calculateDepressionScore(answers: number[]): number {
  const sum = DEPRESSION_ITEMS.reduce((total, index) => total + (answers[index] || 0), 0);
  return sum * 2;
}

export function getDepressionLevel(score: number): DepressionLevel {
  if (score <= 9) {
    return {
      level: "Normal",
      score,
      color: "#28A745",
      bgColor: "#D4EDDA",
      description: "Tingkat depresi Anda berada dalam rentang normal. Anda menunjukkan kesejahteraan mental yang baik.",
      emoji: "🙂"
    };
  }

  if (score <= 13) {
    return {
      level: "Ringan",
      score,
      color: "#FFC107",
      bgColor: "#FFF3CD",
      description: "Anda mengalami gejala depresi ringan. Pertimbangkan untuk menjaga kesehatan mental dengan self-care.",
      emoji: "😐"
    };
  }

  if (score <= 20) {
    return {
      level: "Sedang",
      score,
      color: "#FF9800",
      bgColor: "#FFE0B2",
      description: "Anda mengalami gejala depresi sedang. Disarankan untuk berkonsultasi dengan profesional kesehatan mental.",
      emoji: "😟"
    };
  }

  if (score <= 27) {
    return {
      level: "Parah",
      score,
      color: "#F44336",
      bgColor: "#FFCDD2",
      description: "Anda mengalami gejala depresi parah. Sangat disarankan untuk segera berkonsultasi dengan psikolog atau psikiater.",
      emoji: "😢"
    };
  }

  return {
    level: "Sangat Parah",
    score,
    color: "#C62828",
    bgColor: "#FFCDD2",
    description: "Anda mengalami gejala depresi sangat parah. Segera cari bantuan profesional kesehatan mental.",
    emoji: "😰"
  };
}
