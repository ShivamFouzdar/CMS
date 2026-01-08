import apiClient from './api';
import { ApiResponse, PublicSettings } from '@/types';

class PublicService {
    async getPublicSettings(): Promise<ApiResponse<PublicSettings>> {
        return apiClient.get('/api/public/settings');
    }
}

export const publicService = new PublicService();
