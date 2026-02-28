import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export const createRazorpayOrder = async (token: string, amount: number) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.paymentCreateOrder}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create payment order');
    }

    return response.json();
};

export const verifyRazorpayPayment = async (token: string, paymentData: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.paymentVerify}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to verify payment');
    }

    return response.json();
};
