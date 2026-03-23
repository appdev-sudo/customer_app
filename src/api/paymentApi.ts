import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export const createCashfreeOrder = async (
    token: string, 
    amount: number | null, 
    customerDetails: { customerId?: string; customerPhone?: string; customerName?: string; customerEmail?: string; serviceId?: string }
) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.paymentCreateOrder}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, ...customerDetails }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create payment order');
    }

    return response.json();
};

export const verifyCashfreePayment = async (token: string, orderId: string) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.paymentVerify}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order_id: orderId }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to verify payment');
    }

    return response.json();
};

