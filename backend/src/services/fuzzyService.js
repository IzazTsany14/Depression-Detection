/**
 * Fuzzy Logic Service untuk DASS-21 Depression Detection
 * Mengkonversi logika dari frontend (TypeScript) ke backend (JavaScript)
 * Menerima 21 jawaban dan menghitung skor depresi serta tingkat severity
 */

// Index item depresi dalam array 21 pertanyaan (0-indexed: questions 3, 5, 10, 13, 16, 17, 21)
const DEPRESSION_ITEMS = [2, 4, 9, 12, 15, 16, 20];

/**
 * Menghitung skor depresi dari 21 jawaban DASS-21
 * @param {number[]} answers - Array 21 jawaban (masing-masing 0-3)
 * @returns {number} Skor depresi (0-42)
 */
export function calculateDepressionScore(answers) {
  if (!Array.isArray(answers) || answers.length !== 21) {
    throw new Error('Answers harus berupa array dengan 21 elemen');
  }

  // Hanya sum item depresi saja
  let sum = 0;
  for (const index of DEPRESSION_ITEMS) {
    sum += answers[index] || 0;
  }

  // Kalikan dengan 2 sesuai standar DASS-21 scoring
  return sum * 2;
}

/**
 * Membership function untuk level Normal (0-9)
 */
function fuzzyMembershipNormal(score) {
  if (score <= 9) return 1;
  if (score <= 13) return (13 - score) / 4;
  return 0;
}

/**
 * Membership function untuk level Ringan (9-15)
 */
function fuzzyMembershipMild(score) {
  if (score <= 9) return 0;
  if (score <= 11) return (score - 9) / 2;
  if (score <= 13) return 1;
  if (score <= 15) return (15 - score) / 2;
  return 0;
}

/**
 * Membership function untuk level Sedang (13-24)
 */
function fuzzyMembershipModerate(score) {
  if (score <= 13) return 0;
  if (score <= 17) return (score - 13) / 4;
  if (score <= 20) return 1;
  if (score <= 24) return (24 - score) / 4;
  return 0;
}

/**
 * Membership function untuk level Berat (20-31)
 */
function fuzzyMembershipSevere(score) {
  if (score <= 20) return 0;
  if (score <= 24) return (score - 20) / 4;
  if (score <= 27) return 1;
  if (score <= 31) return (31 - score) / 4;
  return 0;
}

/**
 * Membership function untuk level Sangat Berat (27+)
 */
function fuzzyMembershipExtremelySevere(score) {
  if (score <= 27) return 0;
  if (score <= 31) return (score - 27) / 4;
  return 1;
}

/**
 * Menentukan level depresi berdasarkan skor
 * @param {number} score - Skor depresi (0-42)
 * @returns {string} Level depresi (Normal, Ringan, Sedang, Berat, Sangat Berat)
 */
export function getDepressionLevel(score) {
  if (score <= 9) {
    return 'Normal';
  } else if (score <= 13) {
    return 'Ringan';
  } else if (score <= 20) {
    return 'Sedang';
  } else if (score <= 27) {
    return 'Parah';
  } else {
    return 'Sangat Parah';
  }
}

/**
 * Menghitung fuzzy interpretation dengan membership functions
 * @param {number} score - Skor depresi
 * @returns {object} Objek dengan membership values untuk setiap level
 */
export function calculateFuzzyMemberships(score) {
  return {
    normal: fuzzyMembershipNormal(score),
    mild: fuzzyMembershipMild(score),
    moderate: fuzzyMembershipModerate(score),
    severe: fuzzyMembershipSevere(score),
    extremelySevere: fuzzyMembershipExtremelySevere(score)
  };
}

/**
 * Fungsi utama untuk menghitung fuzzy logic score dan interpretasi
 * @param {number[]} answers - Array 21 jawaban (masing-masing 0-3)
 * @returns {object} Objek dengan score, level, dan fuzzy_score
 */
export function calculateFuzzy(answers) {
  try {
    // Hitung skor depresi
    const score = calculateDepressionScore(answers);

    // Dapatkan level depresi
    const level = getDepressionLevel(score);

    // Hitung membership values untuk fuzzy score
    const memberships = calculateFuzzyMemberships(score);

    // Hitung weighted fuzzy score (rata-rata tertimbang)
    const fuzzyScore = (
      (memberships.normal * 0) +
      (memberships.mild * 1) +
      (memberships.moderate * 2) +
      (memberships.severe * 3) +
      (memberships.extremelySevere * 4)
    ) / (
      memberships.normal +
      memberships.mild +
      memberships.moderate +
      memberships.severe +
      memberships.extremelySevere || 1
    );

    return {
      score,
      level,
      fuzzy_score: parseFloat(fuzzyScore.toFixed(2)),
      memberships
    };
  } catch (error) {
    throw new Error(`Gagal menghitung fuzzy logic: ${error.message}`);
  }
}

/**
 * Mendapatkan deskripsi interpretasi berdasarkan level
 */
export function getDepressionDescription(level) {
  const descriptions = {
    'Normal': 'Tingkat depresi Anda berada dalam rentang normal. Anda menunjukkan kesejahteraan mental yang baik.',
    'Ringan': 'Anda mengalami gejala depresi ringan. Pertimbangkan untuk menjaga kesehatan mental dengan self-care.',
    'Sedang': 'Anda mengalami gejala depresi sedang. Disarankan untuk berkonsultasi dengan profesional kesehatan mental.',
    'Parah': 'Anda mengalami gejala depresi parah. Sangat disarankan untuk segera berkonsultasi dengan psikolog atau psikiater.',
    'Sangat Parah': 'Anda mengalami gejala depresi sangat parah. Segera cari bantuan profesional kesehatan mental.'
  };
  return descriptions[level] || 'Level tidak dikenali';
}
