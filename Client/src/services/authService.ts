import apiClient from './api';
import { ApiResponse, User } from '@/types';

/**
 * Auth Service
 * Handles user authentication, registration, and session management.
 */

export interface LoginResponse {
    user: User;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
    requires2FA?: boolean;
    tempToken?: string;
}

export const authService = {
    /**
     * Login user
     */
    async login(credentials: any): Promise<ApiResponse<LoginResponse>> {
        const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials) as unknown as ApiResponse<LoginResponse>;

        // If successful and not requiring 2FA, handle storage
        if (response.success && response.data && !response.data.requires2FA) {
            this.setSession(response.data);
        }

        return response;
    },

    /**
     * Verify 2FA during login
     */
    async verify2FA(payload: { tempToken: string; code?: string; backupCode?: string }): Promise<ApiResponse<LoginResponse>> {
        const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/2fa/login-verify', payload) as unknown as ApiResponse<LoginResponse>;

        if (response.success && response.data) {
            this.setSession(response.data);
        }

        return response;
    },

    /**
     * Register a new user
     */
    async register(userData: any): Promise<ApiResponse<any>> {
        return apiClient.post('/api/auth/register', userData);
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            await apiClient.post('/api/auth/logout');
        } finally {
            this.clearSession();
        }
    },

    /**
     * Helper to set session in localStorage
     */
    setSession(authData: LoginResponse): void {
        if (authData.tokens?.accessToken) {
            localStorage.setItem('accessToken', authData.tokens.accessToken);
        }
        if (authData.tokens?.refreshToken) {
            localStorage.setItem('refreshToken', authData.tokens.refreshToken);
        }
        if (authData.user) {
            localStorage.setItem('user', JSON.stringify(authData.user));
        }
    },

    /**
     * Helper to clear session
     */
    clearSession(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    /**
     * Get current user from storage
     */
    getCurrentUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};
