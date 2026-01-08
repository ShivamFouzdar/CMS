import apiClient from './api';
import { ApiResponse, Service } from '@/types';

/**
 * Offering/Services Service
 * Handles API calls for service management and retrieval.
 */

export const servicesService = {
    /**
     * Get all services (Public & Admin)
     */
    async getAllServices(): Promise<ApiResponse<Service[]>> {
        return apiClient.get('/api/services/admin');
    },

    /**
     * Get active services for public view
     */
    async getActiveServices(): Promise<ApiResponse<Service[]>> {
        return apiClient.get('/api/services');
    },

    /**
     * Get service by slug (Public)
     */
    async getServiceBySlug(slug: string): Promise<ApiResponse<Service>> {
        return apiClient.get(`/api/services/${slug}`);
    },

    /**
     * Create new service (Admin)
     */
    async createService(data: Partial<Service>): Promise<ApiResponse<Service>> {
        return apiClient.post('/api/services', data);
    },

    /**
     * Update service (Admin)
     */
    async updateService(id: string, data: Partial<Service>): Promise<ApiResponse<Service>> {
        return apiClient.put(`/api/services/${id}`, data);
    },

    /**
     * Delete service (Admin)
     */
    async deleteService(id: string): Promise<ApiResponse<void>> {
        return apiClient.delete(`/api/services/${id}`);
    },

    /**
     * Toggle service status (Admin)
     */
    async toggleStatus(id: string): Promise<ApiResponse<Service>> {
        return apiClient.patch(`/api/services/${id}/status`);
    }
};
