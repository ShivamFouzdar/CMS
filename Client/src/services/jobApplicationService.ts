import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

/**
 * Job Application Service
 * Handles API calls for job applications
 */

export interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  workMode: string;
  skillsDescription: string;
  hearAboutUs: string;
  resumePath?: string;
  submittedAt: string;
  status?: string;
  notes?: string;
}

export interface JobApplicationStats {
  total: number;
  newToday?: number;
  thisMonth?: number;
  pending?: number;
  approved?: number;
  rejected?: number;
  byExperience: Record<string, number>;
  byWorkMode: Record<string, number>;
  bySource: Record<string, number>;
  recent: Array<{
    id: string;
    fullName: string;
    email: string;
    experience: string;
    submittedAt: string;
  }>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta?: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
  timestamp: string;
}

/**
 * Get all job applications with pagination
 */
export const getJobApplications = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<JobApplication>> => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.error('No access token found');
      throw new Error('Authentication required. Please log in again.');
    }

    console.log('Fetching job applications from:', API_ENDPOINTS.jobApplication.submissions);
    console.log('Page:', page, 'Limit:', limit);

    const response = await axios.get(API_ENDPOINTS.jobApplication.submissions, {
      params: { page, limit },
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Job applications response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching job applications:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      console.error('Authentication failed. Redirecting to login...');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
      throw new Error('Session expired. Please log in again.');
    }
    
    if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
      // Return empty data if no applicants or server is down
      console.warn('No job applications found or network error');
      return {
        success: true,
        data: [],
        meta: {
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        },
        message: 'No job applications found',
        timestamp: new Date().toISOString(),
      };
    }
    
    // Re-throw other errors
    throw error;
  }
};

/**
 * Get job application by ID
 */
export const getJobApplicationById = async (id: string): Promise<{ success: boolean; data: JobApplication }> => {
  try {
    const token = localStorage.getItem('accessToken');
    // Use the submissions endpoint with ID
    const response = await axios.get(`${API_ENDPOINTS.jobApplication.submissions}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Job application not found');
    }
    throw error;
  }
};

/**
 * Get job application statistics
 */
export const getJobApplicationStats = async (): Promise<{ success: boolean; data: JobApplicationStats }> => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(API_ENDPOINTS.jobApplication.stats, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      // Return empty stats if no data
      return {
        success: true,
        data: {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          byExperience: {},
          byWorkMode: {},
          bySource: {},
          recent: [],
        },
      };
    }
    throw error;
  }
};

/**
 * Download resume
 */
export const downloadResume = async (id: string): Promise<void> => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(`${API_ENDPOINTS.jobApplication.submissions}/${id}/resume`, {
    headers: {
      Authorization: `Bearer ${token || ''}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Resume file not found');
    }
    throw new Error('Failed to download resume');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resume-${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

/**
 * Delete job application
 */
export const deleteJobApplication = async (id: string): Promise<void> => {
  const token = localStorage.getItem('accessToken');
  await axios.delete(`${API_ENDPOINTS.jobApplication.submissions}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
