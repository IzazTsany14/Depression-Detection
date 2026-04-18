// DASS-21 Depression subscale items (questions 3, 5, 10, 13, 16, 17, 21)
// Each answer ranges from 0-3
// Sum these items and multiply by 2 to get the final depression score

export const DEPRESSION_ITEMS = [2, 4, 9, 12, 15, 16, 20]; // 0-indexed (questions 3, 5, 10, 13, 16, 17, 21)

export interface DepressionLevel {
  level: string;
  score: number;
  color: string;
  bgColor: string;
  description: string;
  emoji: string;
}

export function calculateDepressionScore(answers: number[]): number {
  // Sum only the depression items
  let sum = 0;
  for (const index of DEPRESSION_ITEMS) {
    sum += answers[index] || 0;
  }
  
  // Multiply by 2 as per DASS-21 scoring
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
      emoji: "😊"
    };
  } else if (score <= 13) {
    return {
      level: "Ringan",
      score,
      color: "#FFC107",
      bgColor: "#FFF3CD",
      description: "Anda mengalami gejala depresi ringan. Pertimbangkan untuk menjaga kesehatan mental dengan self-care.",
      emoji: "😐"
    };
  } else if (score <= 20) {
    return {
      level: "Sedang",
      score,
      color: "#FF9800",
      bgColor: "#FFE0B2",
      description: "Anda mengalami gejala depresi sedang. Disarankan untuk berkonsultasi dengan profesional kesehatan mental.",
      emoji: "😟"
    };
  } else if (score <= 27) {
    return {
      level: "Berat",
      score,
      color: "#F44336",
      bgColor: "#FFCDD2",
      description: "Anda mengalami gejala depresi berat. Sangat disarankan untuk segera berkonsultasi dengan psikolog atau psikiater.",
      emoji: "😢"
    };
  } else {
    return {
      level: "Sangat Berat",
      score,
      color: "#C62828",
      bgColor: "#FFCDD2",
      description: "Anda mengalami gejala depresi sangat berat. Segera cari bantuan profesional kesehatan mental.",
      emoji: "😰"
    };
  }
}

// Fuzzy logic membership functions
export function fuzzyMembershipNormal(score: number): number {
  if (score <= 9) return 1;
  if (score <= 13) return (13 - score) / 4;
  return 0;
}

export function fuzzyMembershipMild(score: number): number {
  if (score <= 9) return 0;
  if (score <= 11) return (score - 9) / 2;
  if (score <= 13) return 1;
  if (score <= 15) return (15 - score) / 2;
  return 0;
}

export function fuzzyMembershipModerate(score: number): number {
  if (score <= 13) return 0;
  if (score <= 17) return (score - 13) / 4;
  if (score <= 20) return 1;
  if (score <= 24) return (24 - score) / 4;
  return 0;
}

export function fuzzyMembershipSevere(score: number): number {
  if (score <= 20) return 0;
  if (score <= 24) return (score - 20) / 4;
  if (score <= 27) return 1;
  if (score <= 31) return (31 - score) / 4;
  return 0;
}

export function fuzzyMembershipExtremelySevere(score: number): number {
  if (score <= 27) return 0;
  if (score <= 31) return (score - 27) / 4;
  return 1;
}

export function getFuzzyInterpretation(score: number): string {
  const normal = fuzzyMembershipNormal(score);
  const mild = fuzzyMembershipMild(score);
  const moderate = fuzzyMembershipModerate(score);
  const severe = fuzzyMembershipSevere(score);
  const extremelySevere = fuzzyMembershipExtremelySevere(score);

  const memberships = [
    { level: "Normal", value: normal },
    { level: "Ringan", value: mild },
    { level: "Sedang", value: moderate },
    { level: "Berat", value: severe },
    { level: "Sangat Berat", value: extremelySevere },
  ];

  // Find the highest membership value
  const highest = memberships.reduce((prev, current) => 
    current.value > prev.value ? current : prev
  );

  if (highest.value > 0.5) {
    return highest.level;
  }

  // If multiple memberships are similar, return a combined interpretation
  const significantMemberships = memberships.filter(m => m.value > 0.3);
  if (significantMemberships.length > 1) {
    return significantMemberships.map(m => m.level).join(" - ");
  }

  return highest.level;
}
