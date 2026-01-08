import apiClient from './api';
import { ApiResponse, ContactSubmission } from '@/types';

/**
 * Contact Service
 * Handles API calls for lead management and contact form submissions
 */

export interface ContactStats {
  total: number;
  byStatus: {
    new?: number;
    in_progress?: number;
    completed?: number;
    closed?: number;
  };
  byService: Record<string, number>;
  recent: Array<{
    id: string;
    fullName: string;
    email: string;
    service: string;
    status: string;
    createdAt: string;
  }>;
}

export const contactService = {
  /**
   * Submit contact form (Public)
   */
  async submitContact(data: Partial<ContactSubmission>): Promise<ApiResponse<{ id: string; submittedAt: string }>> {
    return apiClient.post('/api/contact', data);
  },

  /**
   * Get all contact submissions with pagination (Admin)
   */
  async getAllSubmissions(page: number = 1, limit: number = 10): Promise<ApiResponse<ContactSubmission[]>> {
    return apiClient.get('/api/contact/submissions', {
      params: { page, limit }
    });
  },

  /**
   * Get contact submission by ID (Admin)
   */
  async getSubmissionById(id: string): Promise<ApiResponse<ContactSubmission>> {
    return apiClient.get(`/api/contact/submissions/${id}`);
  },

  /**
   * Get contact statistics (Admin)
   */
  async getStats(): Promise<ApiResponse<ContactStats>> {
    return apiClient.get('/api/contact/stats');
  },

  /**
   * Update contact status (Admin)
   */
  async updateStatus(id: string, status: string, notes?: string): Promise<ApiResponse<ContactSubmission>> {
    return apiClient.patch(`/api/contact/submissions/${id}/status`, { status, notes });
  },

  /**
   * Delete contact submission (Admin)
   */
  async deleteSubmission(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/contact/submissions/${id}`);
  },

  /**
   * Mark as contacted (Admin)
   */
  async markAsContacted(id: string): Promise<ApiResponse<ContactSubmission>> {
    return apiClient.patch(`/api/contact/submissions/${id}/contacted`);
  }
};

// Also export as individual functions for backward compatibility
export const getContactSubmissions = contactService.getAllSubmissions;
export const getContactSubmissionById = contactService.getSubmissionById;
export const getContactStats = contactService.getStats;
export const updateContactStatus = contactService.updateStatus;
export const deleteContactSubmission = contactService.deleteSubmission;
export const markContactAsContacted = contactService.markAsContacted;
