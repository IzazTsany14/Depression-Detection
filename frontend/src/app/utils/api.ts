const PRODUCTION_API_BASE_URL = 'https://depression-detection-production.up.railway.app/api';
const configuredApiBaseUrl = import.meta.env.VITE_API_URL;
const shouldUseProductionApiFallback = (
  typeof window !== 'undefined' &&
  window.location.hostname.endsWith('.vercel.app') &&
  (!configuredApiBaseUrl || configuredApiBaseUrl === '/api')
);

export const API_BASE_URL = (
  shouldUseProductionApiFallback
    ? PRODUCTION_API_BASE_URL
    : configuredApiBaseUrl || '/api'
).replace(/\/$/, '');

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

export const fetchWithTimeout = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 15000
) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: init.signal || controller.signal
    });
  } finally {
    window.clearTimeout(timeout);
  }
};
