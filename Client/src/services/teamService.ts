import api from './api';

export interface TeamMember {
    _id: string;
    name: string;
    role: string;
    image: string;
    bio: string;
    social: {
        twitter?: string;
        linkedin?: string;
        email?: string;
    };
    order: number;
    isActive: boolean;
}

export const teamService = {
    getAllMembers: async () => {
        const response = await api.get<{ success: boolean; data: TeamMember[] }>('/team');
        return response.data;
    },

    getAdminMembers: async () => {
        const response = await api.get<{ success: boolean; data: TeamMember[] }>('/team/admin');
        return response.data;
    },

    createMember: async (data: Partial<TeamMember>) => {
        const response = await api.post<{ success: boolean; data: TeamMember }>('/team', data);
        return response.data;
    },

    updateMember: async (id: string, data: Partial<TeamMember>) => {
        const response = await api.put<{ success: boolean; data: TeamMember }>(`/team/${id}`, data);
        return response.data;
    },

    deleteMember: async (id: string) => {
        const response = await api.delete<{ success: boolean }>(`/team/${id}`);
        return response.data;
    },

    reorderMembers: async (items: { id: string; order: number }[]) => {
        const response = await api.put<{ success: boolean }>('/team/reorder', { items });
        return response.data;
    }
};
