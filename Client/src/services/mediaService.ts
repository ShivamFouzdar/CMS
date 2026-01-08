import apiClient from './api';

export interface MediaItem {
    _id: string;
    url: string;
    publicId: string;
    fileName: string;
    type: 'image' | 'document';
    format: string;
    size: number;
    uploadedBy: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    createdAt: string;
}

export interface MediaResponse {
    success: boolean;
    data: MediaItem[];
    pagination: {
        total: number;
        pages: number;
        page: number;
        limit: number;
    };
}

export const mediaService = {
    getMedia: async (page: number = 1, limit: number = 20, type?: string) => {
        const response = await apiClient.get<MediaResponse>('/media', {
            params: { page, limit, type }
        });
        return response.data;
    },

    uploadMedia: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        // Explicitly set Content-Type header to undefined to let browser set boundary
        // OR axios usually handles this automatically if data is FormData
        const response = await apiClient.post<{ success: boolean; data: MediaItem }>('/media', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteMedia: async (id: string) => {
        const response = await apiClient.delete<{ success: boolean; message: string }>(`/media/${id}`);
        return response.data;
    }
};
