/**
 * Backend API base URL.
 * Uses your machine's IP so both emulator/simulator and physical devices can reach the backend.
 */
const getDefaultBaseUrl = () => {
  if (__DEV__) {
    // Using ngrok tunnel to reach backend from mobile device
    return 'https://787c-2409-40c0-7e-c6d1-917f-ddef-5394-307e.ngrok-free.app';
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
  // Phone authentication
  phoneSendOTP: '/api/auth/phone/send-otp',
  phoneVerifyOTP: '/api/auth/phone/verify-otp',
  phoneResendOTP: '/api/auth/phone/resend-otp',
  // Profile
  profile: '/api/profile',
  bookings: '/api/bookings',
  bookingsMe: '/api/bookings/me',
  bookingById: (id: string) => `/api/bookings/${id}`,
} as const;
