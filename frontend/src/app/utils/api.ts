/// <reference types="vite/client" />

const configuredApiBaseUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL = (configuredApiBaseUrl || '/api').replace(/\/$/, '');

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
  input: Parameters<typeof fetch>[0],
  init: Parameters<typeof fetch>[1] = {},
  timeoutMs = 15000
) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: init?.signal || controller.signal
    });
  } finally {
    window.clearTimeout(timeout);
  }
};
