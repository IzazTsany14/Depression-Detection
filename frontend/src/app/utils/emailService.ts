import { apiUrl } from './api';

const parseResponse = async (res: Response) => {
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await res.json()
    : { message: await res.text() };

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Request gagal diproses');
  }

  return data;
};

export const requestPasswordResetEmail = async (email: string) => {
  const res = await fetch(apiUrl('/auth/forgot-password'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  return parseResponse(res);
};

export const verifyResetToken = async (token: string) => {
  const res = await fetch(apiUrl(`/auth/reset-password/verify?token=${encodeURIComponent(token)}`));
  return parseResponse(res);
};

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await fetch(apiUrl('/auth/reset-password'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword })
  });

  return parseResponse(res);
};
