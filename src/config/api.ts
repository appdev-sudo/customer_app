/**
 * Backend API base URL.
 * Uses your machine's IP so both emulator/simulator and physical devices can reach the backend.
 */
const getDefaultBaseUrl = () => {
  if (__DEV__) {
    // Using ngrok tunnel to reach backend from mobile device
    return 'https://a743-2409-40c0-6c-b87c-510a-6658-734d-b33f.ngrok-free.app';
  }
  return 'https://your-api-domain.com'; // replace with production API URL
};

export const API_BASE_URL = getDefaultBaseUrl();

export const API_ENDPOINTS = {
  health: '/api/health',
  services: '/api/services',
  serviceById: (id: string) => `/api/services/${id}`,
  authSignup: '/api/auth/signup',
  authLogin: '/api/auth/login',
  authMe: '/api/auth/me',
  bookings: '/api/bookings',
  bookingsMe: '/api/bookings/me',
  bookingById: (id: string) => `/api/bookings/${id}`,
} as const;
