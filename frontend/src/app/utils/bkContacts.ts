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

export const getWhatsAppUrl = (whatsappNumber: string, message = 'Halo BK, saya ingin berkonsultasi terkait hasil skrining DASS-21.'): string => {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

export const isSevereLevel = (level?: string | null): boolean => {
  return level === 'Parah' || level === 'Sangat Parah';
};
