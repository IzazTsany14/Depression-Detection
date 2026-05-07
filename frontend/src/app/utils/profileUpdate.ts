export const readProfileImageFile = (file: File): Promise<{ dataUrl: string; fileName: string }> => {
  if (!['image/png', 'image/jpeg'].includes(file.type)) {
    return Promise.reject(new Error('Foto profil harus berupa file PNG atau JPG'));
  }

  if (file.size > 2 * 1024 * 1024) {
    return Promise.reject(new Error('Ukuran foto profil maksimal 2MB'));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ dataUrl: String(reader.result), fileName: file.name });
    reader.onerror = () => reject(new Error('Gagal membaca file foto profil'));
    reader.readAsDataURL(file);
  });
};
