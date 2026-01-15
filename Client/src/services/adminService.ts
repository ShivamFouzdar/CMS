import apiClient from './api';
import { ApiResponse, ActivityLog, SystemHealth, SystemSettings, RegisterData, LogEntry, DatabaseStats, AdminUser } from '@/types';

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
    async getRecentActivity(): Promise<ApiResponse<ActivityLog[]>> {
        return apiClient.get('/api/admin/activity');
    },

    /**
     * Get system health monitoring
     */
    async getSystemHealth(): Promise<ApiResponse<SystemHealth>> {
        return apiClient.get('/api/admin/health');
    },

    /**
     * Get all admin users
     */
    async getAllUsers(): Promise<AdminUser[]> {
        const response = await apiClient.get<ApiResponse<AdminUser[]>>('/api/users') as unknown as ApiResponse<AdminUser[]>;
        return response.data;
    },

    /**
     * Create a new admin user (restricted to super_admin)
     */
    async createUser(userData: RegisterData): Promise<AdminUser> {
        const response = await apiClient.post<ApiResponse<{ user: AdminUser }>>('/api/auth/register', userData) as unknown as ApiResponse<{ user: AdminUser }>;
        return response.data.user;
    },

    /**
     * Update an existing user's role or status
     */
    async updateUser(userId: string, updateData: Partial<AdminUser>): Promise<AdminUser> {
        const response = await apiClient.patch<ApiResponse<AdminUser>>(`/api/users/${userId}`, updateData) as unknown as ApiResponse<AdminUser>;
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
    async getSystemSettings(): Promise<ApiResponse<SystemSettings>> {
        return apiClient.get('/api/admin/settings');
    },

    /**
     * Update system settings
     */
    async updateSystemSettings(settings: Partial<SystemSettings>): Promise<ApiResponse<SystemSettings>> {
        return apiClient.put('/api/admin/settings', settings);
    },

    /**
     * Backup database
     */
    async backupDatabase(): Promise<Blob> {
        const response = await apiClient.get('/api/admin/database/backup', { responseType: 'blob' });
        return response as unknown as Blob;
    },

    /**
     * Restore database
     */
    async restoreDatabase(data: FormData): Promise<ApiResponse<void>> {
        return apiClient.post('/api/admin/database/restore', data);
    },

    /**
     * Get database stats
     */
    async getDatabaseStats(): Promise<ApiResponse<DatabaseStats>> {
        return apiClient.get('/api/admin/database/stats');
    },

    /**
     * Get system logs
     */
    async getSystemLogs(page: number = 1, limit: number = 20, filters: any = {}): Promise<ApiResponse<LogEntry[]>> {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });

        return apiClient.get(`/api/admin/logs?${params.toString()}`);
    },

    /**
     * Clear system logs
     */
    async clearSystemLogs(): Promise<ApiResponse<void>> {
        return apiClient.delete('/api/admin/logs');
    },

    /**
     * Test SMTP connection
     */
    async testSmtpConnection(smtp: SystemSettings['smtp']): Promise<ApiResponse<{ success: boolean; message: string }>> {
        return apiClient.post('/api/admin/settings/test-smtp', smtp);
    }
};
