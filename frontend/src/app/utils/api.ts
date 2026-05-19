export const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const backendUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!/^https?:\/\//i.test(API_BASE_URL)) {
    return normalizedPath;
  }

  const apiBase = new URL(API_BASE_URL);
  return `${apiBase.origin}${normalizedPath}`;
};
