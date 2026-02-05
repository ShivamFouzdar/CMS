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
        const response = await api.get<{ success: boolean; data: TeamMember[] }, { success: boolean; data: TeamMember[] }>('/api/team');
        return response;
    },

    getAdminMembers: async () => {
        const response = await api.get<{ success: boolean; data: TeamMember[] }, { success: boolean; data: TeamMember[] }>('/api/team/admin');
        return response;
    },

    createMember: async (data: Partial<TeamMember>) => {
        const response = await api.post<{ success: boolean; data: TeamMember }, { success: boolean; data: TeamMember }>('/api/team', data);
        return response;
    },

    updateMember: async (id: string, data: Partial<TeamMember>) => {
        const response = await api.put<{ success: boolean; data: TeamMember }, { success: boolean; data: TeamMember }>(`/api/team/${id}`, data);
        return response;
    },

    deleteMember: async (id: string) => {
        const response = await api.delete<{ success: boolean }, { success: boolean }>(`/api/team/${id}`);
        return response;
    },

    reorderMembers: async (items: { id: string; order: number }[]) => {
        const response = await api.put<{ success: boolean }, { success: boolean }>('/api/team/reorder', { items });
        return response;
    },

    seedMembers: async () => {
        const response = await api.post<{ success: boolean; data: TeamMember[] }, { success: boolean; data: TeamMember[] }>('/api/team/seed', {});
        return response;
    }
};
