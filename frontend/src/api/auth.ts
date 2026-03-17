import client from './client';
import { User, UserRole } from '../../types'; // Adjust path if needed

interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    token: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}

interface LoginData {
    email: string;
    password: string;
}

export const authService = {
    register: async (userData: RegisterData): Promise<AuthResponse> => {
        const response = await client.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    login: async (userData: LoginData): Promise<AuthResponse> => {
        const response = await client.post('/auth/login', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getMe: async (): Promise<User> => {
        const response = await client.get('/auth/me');
        return response.data;
    },
};
