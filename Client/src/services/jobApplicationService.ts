import apiClient from './api';
import axios from 'axios';
import { ApiResponse, JobApplication } from '@/types';
import { API_BASE_URL } from '@/config/api';

export type { JobApplication };

/**
 * Job Application Service
 * Handles API calls for recruitment and job applications
 */

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

export const jobApplicationService = {
  /**
   * Submit job application (Public)
   */
  async submitApplication(formData: FormData): Promise<ApiResponse<{ id: string; submittedAt: string }>> {
    return apiClient.post('/api/job-application', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Get all job applications with pagination (Admin)
   */
  async getAllApplications(page: number = 1, limit: number = 10, search?: string): Promise<ApiResponse<JobApplication[]>> {
    return apiClient.get('/api/job-application/submissions', {
      params: { page, limit, search }
    });
  },

  /**
   * Get job application by ID (Admin)
   */
  async getApplicationById(id: string): Promise<ApiResponse<JobApplication>> {
    return apiClient.get(`/api/job-application/submissions/${id}`);
  },

  /**
   * Get job application statistics (Admin)
   */
  async getStats(): Promise<ApiResponse<JobApplicationStats>> {
    return apiClient.get('/api/job-application/stats');
  },

  /**
   * Download candidate resume (Admin)
   */
  async downloadResume(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');

    // Use raw axios to bypass the response interceptor in apiClient
    // that unwraps response.data (which corrupts blob responses)
    const response = await axios.get(`${API_BASE_URL}/api/job-application/submissions/${id}/resume`, {
      responseType: 'blob',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        Accept: 'application/pdf,application/octet-stream,*/*',
      },
    });

    // Extract filename from Content-Disposition header if available
    const contentDisposition = response.headers['content-disposition'];
    let fileName = `resume-${id}.pdf`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename[^;=\n]*=(['"]?)([^'"\n;]*)\1/);
      if (match && match[2]) {
        fileName = match[2];
      }
    }

    const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  /**
   * Delete job application (Admin)
   */
  async deleteApplication(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/job-application/submissions/${id}`);
  },

  async bulkDeleteApplications(ids: string[]): Promise<ApiResponse<{ count: number }>> {
    return apiClient.post('/api/job-application/submissions/bulk-delete', { ids });
  },

  async exportApplications(): Promise<Blob> {
    const response = await apiClient.get('/api/job-application/export', { responseType: 'blob' });
    return response as unknown as Blob;
  }
};

// Also export as individual functions for backward compatibility if needed by some components
export const getJobApplications = jobApplicationService.getAllApplications;
export const getJobApplicationById = jobApplicationService.getApplicationById;
export const getJobApplicationStats = jobApplicationService.getStats;
export const downloadResume = jobApplicationService.downloadResume;
export const deleteJobApplication = jobApplicationService.deleteApplication;
