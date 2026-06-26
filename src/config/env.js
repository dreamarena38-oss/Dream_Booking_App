const DEFAULT_API_BASE_URL = 'https://dream-arena-backend-production.up.railway.app/api';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || DEFAULT_API_BASE_URL;
