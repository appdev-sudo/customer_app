import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export interface CreateBookingData {
    serviceId: string;
    preferredDate: string;
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
    paymentId?: string;
}

const apiFetch = async (url: string, token: string, options?: RequestInit) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            Authorization: `Bearer ${token}`,
            ...(options?.headers || {}),
        },
    });
    const text = await response.text();
    let result;
    try { result = JSON.parse(text); } catch { throw new Error(`Server error: ${text.slice(0, 50)}`); }
    if (!response.ok) { throw new Error(result.error || 'Request failed'); }
    return result;
};

export const createBooking = async (token: string, data: CreateBookingData) => {
    return apiFetch(`${API_BASE_URL}${API_ENDPOINTS.bookings}`, token, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const getMyBookings = async (token: string) => {
    return apiFetch(`${API_BASE_URL}${API_ENDPOINTS.bookingsMe}`, token);
};

export const getMySubscriptions = async (token: string) => {
    return apiFetch(`${API_BASE_URL}/api/subscriptions/me`, token);
};

export const getBookingById = async (token: string, id: string) => {
    return apiFetch(`${API_BASE_URL}${API_ENDPOINTS.bookingById(id)}`, token);
};

export const scheduleSession = async (token: string, id: string, data: any) => {
    return apiFetch(`${API_BASE_URL}/api/bookings/${id}/schedule`, token, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};
