import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type { ProfileData, ProfileResponse } from '../types/auth';

export const getProfile = async (token: string): Promise<ProfileResponse> => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.profile}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            Authorization: `Bearer ${token}`,
        },
    });

    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error(`Server error: ${text.slice(0, 50)}...`);
    }

    if (!response.ok) {
        throw new Error(data.error || 'Failed to get profile');
    }

    return data;
};

export const updateProfile = async (
    token: string,
    profileData: ProfileData,
): Promise<ProfileResponse> => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.profile}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
    });

    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        throw new Error(`Server error: ${text.slice(0, 50)}...`);
    }

    if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
    }

    return data;
};
