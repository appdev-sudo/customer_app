export interface AuthResponse {
    success: boolean;
    token: string;
    user: {
        id: string;
        phone: string;
        name?: string;
        profileCompleted: boolean;
    };
}

export interface OTPResponse {
    success: boolean;
    message: string;
    expiresIn: number;
}

export interface ProfileData {
    name: string;
    age: number;
    sex: 'Male' | 'Female' | 'Other';
    // weight: number;
    // height: number;
    // comorbidities: string[];
    // medications: string[];
    location?: {
        latitude: number;
        longitude: number;
        address: {
            street: string;
            landmark: string;
            city: string;
            state: string;
            pincode: string;
            country: string;
            formattedAddress: string;
        };
    };
}

export interface UserProfile extends ProfileData {
    id: string;
    phone: string;
    email?: string;
    profileCompleted: boolean;
    isPhoneVerified: boolean;
}

export interface ProfileResponse {
    success: boolean;
    user: UserProfile;
    message?: string;
}
