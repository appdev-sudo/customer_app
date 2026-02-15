import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type { AuthResponse, OTPResponse } from '../types/auth';

export const sendOTP = async (phoneNumber: string): Promise<OTPResponse> => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.phoneSendOTP}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
    }

    return data;
};

export const verifyOTP = async (
    phoneNumber: string,
    otp: string,
): Promise<AuthResponse> => {
    const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.phoneVerifyOTP}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber, otp }),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
    }

    return data;
};

export const resendOTP = async (phoneNumber: string): Promise<OTPResponse> => {
    const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.phoneResendOTP}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber }),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
    }

    return data;
};
