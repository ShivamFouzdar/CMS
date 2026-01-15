import apiClient from './api';
import { ApiResponse, User, LoginCredentials, RegisterData } from '@/types';

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
    async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
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
    /**
     * Verify 2FA during login
     */
    async verify2FALogin(payload: { tempToken: string; code?: string; backupCode?: string }): Promise<ApiResponse<LoginResponse>> {
        const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/2fa/verify-login', payload) as unknown as ApiResponse<LoginResponse>;

        if (response.success && response.data) {
            this.setSession(response.data);
        }

        return response;
    },

    /**
     * Enable 2FA (Setup)
     */
    async enable2FA(): Promise<ApiResponse<{ qrCode: string; secret: string; backupCodes: string[] }>> {
        return apiClient.post('/api/auth/2fa/enable');
    },

    /**
     * Verify 2FA (Setup)
     */
    async verify2FASetup(code: string): Promise<ApiResponse<void>> {
        return apiClient.post('/api/auth/2fa/verify', { code });
    },

    /**
     * Register a new user
     */
    async register(userData: RegisterData): Promise<ApiResponse<LoginResponse>> {
        return apiClient.post('/api/auth/register', userData);
    },

    /**
     * Request password reset
     */
    async forgotPassword(email: string): Promise<ApiResponse<string>> {
        return apiClient.post('/api/auth/forgot-password', { email });
    },

    /**
     * Reset password
     */
    async resetPassword(token: string, userId: string, newPassword: string): Promise<ApiResponse<string>> {
        return apiClient.post('/api/auth/reset-password', { token, userId, newPassword });
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
