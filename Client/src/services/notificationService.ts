import apiClient from './api';
import { ApiResponse } from '@/types';

export interface Notification {
    _id: string;
    type: 'new-lead' | 'job-application' | 'review' | 'system-alert';
    title: string;
    message: string;
    read: boolean;
    data?: any;
    createdAt: string;
}

export interface NotificationResponse {
    notifications: Notification[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    unreadCount: number;
}

class NotificationService {
    async getNotifications(page = 1, limit = 10, type?: string): Promise<ApiResponse<Notification[]>> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(type && { type })
        });
        return apiClient.get(`/api/notifications?${params}`);
    }

    async markAsRead(id: string): Promise<ApiResponse<Notification>> {
        return apiClient.put(`/api/notifications/${id}/read`, {});
    }

    async markAllAsRead(): Promise<ApiResponse<void>> {
        return apiClient.put('/api/notifications/mark-all-read', {});
    }
}

export const notificationService = new NotificationService();
