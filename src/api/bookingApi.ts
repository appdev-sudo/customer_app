import { API_BASE_URL } from '../config/api';

export interface CreateBookingData {
    serviceId: string;
    preferredDate: string; // ISO date string
    preferredTimeSlot: string;
    address: {
        street: string;
        landmark: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
        formattedAddress: string;
    };
    notes?: string;
}

export const createBooking = async (token: string, data: CreateBookingData) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const text = await response.text();
    let result;
    try {
        result = JSON.parse(text);
    } catch {
        throw new Error(`Server error: ${text.slice(0, 50)}...`);
    }

    if (!response.ok) {
        throw new Error(result.error || 'Failed to create booking');
    }

    return result;
};
