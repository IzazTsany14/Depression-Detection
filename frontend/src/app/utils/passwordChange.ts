import { apiUrl } from './api';

export const changeAccountPassword = async (
  accountId: string,
  currentPassword: string,
  newPassword: string
) => {
  const token = localStorage.getItem('token');
  const res = await fetch(apiUrl(`/users/${accountId}/password`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await res.json()
    : { message: await res.text() };

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Gagal mengubah password');
  }

  return data;
};
