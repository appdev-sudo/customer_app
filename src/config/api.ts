/**
 * Backend API base URL.
 * Uses your machine's IP so both emulator/simulator and physical devices can reach the backend.
 */
const getDefaultBaseUrl = () => {
  if (__DEV__) {
    // Using ngrok tunnel to reach backend from mobile device
    return 'https://f82a-2409-40c0-5d-ddae-bd1f-ef86-3d4-ddb2.ngrok-free.app';
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
