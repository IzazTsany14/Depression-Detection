const DEPRESSION_ITEMS = [2, 4, 9, 12, 15, 16, 20];

export function calculateDepressionScore(answers) {
  if (!Array.isArray(answers) || answers.length !== 21) {
    throw new Error('Answers harus berupa array dengan 21 elemen');
  }

  return DEPRESSION_ITEMS.reduce((total, index) => total + (answers[index] || 0), 0) * 2;
}

export function getDepressionLevel(score) {
  if (score <= 9) return 'Normal';
  if (score <= 13) return 'Ringan';
  if (score <= 20) return 'Sedang';
  if (score <= 27) return 'Parah';
  return 'Sangat Parah';
}

export function getSeverityIndex(level) {
  const severityMap = {
    Normal: 0,
    Ringan: 1,
    Sedang: 2,
    Parah: 3,
    'Sangat Parah': 4
  };

  return severityMap[level] ?? 0;
}

export function calculateDassResult(answers) {
  try {
    const score = calculateDepressionScore(answers);
    const level = getDepressionLevel(score);

    return {
      score,
      level,
      severity_score: getSeverityIndex(level)
    };
  } catch (error) {
    throw new Error(`Gagal menghitung skor DASS-21: ${error.message}`);
  }
}

export function getDepressionDescription(level) {
  const descriptions = {
    Normal: 'Tingkat depresi Anda berada dalam rentang normal. Anda menunjukkan kesejahteraan mental yang baik.',
    Ringan: 'Anda mengalami gejala depresi ringan. Pertimbangkan untuk menjaga kesehatan mental dengan self-care.',
    Sedang: 'Anda mengalami gejala depresi sedang. Disarankan untuk berkonsultasi dengan profesional kesehatan mental.',
    Parah: 'Anda mengalami gejala depresi parah. Sangat disarankan untuk segera berkonsultasi dengan psikolog atau psikiater.',
    'Sangat Parah': 'Anda mengalami gejala depresi sangat parah. Segera cari bantuan profesional kesehatan mental.'
  };

  return descriptions[level] || 'Level tidak dikenali';
}
