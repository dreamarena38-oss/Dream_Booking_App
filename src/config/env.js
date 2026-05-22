const DEFAULT_API_BASE_URL = 'https://dream-booking-backend-1.onrender.com/api';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || DEFAULT_API_BASE_URL;
