import apiClient from './api';

export interface UserProfile {
    avatar?: string;
    phone?: string;
    department?: string;
    bio?: string;
}

export interface AdminUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'super_admin' | 'admin' | 'moderator' | 'viewer';
    isActive: boolean;
    lastLoginAt?: string;
    createdAt: string;
    profile?: UserProfile;
}

export interface DashboardStats {
    contacts: {
        total: number;
        new: number;
        inProgress: number;
        completed: number;
    };
    reviews: {
        total: number;
        published: number;
        pending: number;
        averageRating: number;
    };
    services: {
        total: number;
        active: number;
        featured: number;
    };
    users: {
        total: number;
        active: number;
        byRole: Record<string, number>;
    };
    jobs: {
        total: number;
    };
}

export const adminService = {
    /**
     * Get dashboard statistics
     */
    async getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
        return apiClient.get('/api/admin/dashboard');
    },

    /**
     * Get recent system activity
     */
    async getRecentActivity(): Promise<{ success: boolean; data: any[] }> {
        return apiClient.get('/api/admin/activity');
    },

    /**
     * Get system health monitoring
     */
    async getSystemHealth(): Promise<{ success: boolean; data: any }> {
        return apiClient.get('/api/admin/health');
    },

    /**
     * Get all admin users
     */
    async getAllUsers(): Promise<AdminUser[]> {
        const response: any = await apiClient.get('/api/users');
        return response.data;
    },

    /**
     * Create a new admin user (restricted to super_admin)
     */
    async createUser(userData: any): Promise<AdminUser> {
        const response: any = await apiClient.post('/api/auth/register', userData);
        return response.data.user;
    },

    /**
     * Update an existing user's role or status
     */
    async updateUser(userId: string, updateData: any): Promise<AdminUser> {
        const response: any = await apiClient.patch(`/api/users/${userId}`, updateData);
        return response.data;
    },

    /**
     * Delete a user
     */
    async deleteUser(userId: string): Promise<void> {
        await apiClient.delete(`/api/users/${userId}`);
    },

    /**
     * Toggle user active status
     */
    async toggleUserStatus(userId: string, isActive: boolean): Promise<AdminUser> {
        return this.updateUser(userId, { isActive });
    },

    /**
     * Get system settings
     */
    async getSystemSettings(): Promise<any> {
        return apiClient.get('/api/admin/settings');
    },

    /**
     * Update system settings
     */
    async updateSystemSettings(settings: any): Promise<any> {
        return apiClient.put('/api/admin/settings', settings);
    },

    /**
     * Backup database
     */
    async backupDatabase(): Promise<Blob> {
        const response = await apiClient.get('/api/admin/database/backup', { responseType: 'blob' });
        return response as any;
    },

    /**
     * Restore database
     */
    async restoreDatabase(data: any): Promise<any> {
        return apiClient.post('/api/admin/database/restore', data);
    },

    /**
     * Get database stats
     */
    async getDatabaseStats(): Promise<any> {
        return apiClient.get('/api/admin/database/stats');
    },

    /**
     * Get system logs
     */
    async getSystemLogs(): Promise<any> {
        return apiClient.get('/api/admin/logs');
    },

    /**
     * Test SMTP connection
     */
    async testSmtpConnection(smtp: any): Promise<any> {
        return apiClient.post('/api/admin/settings/test-smtp', smtp);
    }
};
