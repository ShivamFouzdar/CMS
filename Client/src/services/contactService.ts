import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

/**
 * Contact Service
 * Handles API calls for contact form submissions
 */

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  status: 'new' | 'in_progress' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  submittedAt: string;
  updatedAt: string;
  source?: string;
  tags?: string[];
}

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
    name: string;
    email: string;
    service?: string;
    status: string;
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
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Get all contact submissions with pagination
 */
export const getContactSubmissions = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<ContactSubmission>> => {
  const response = await axios.get(API_ENDPOINTS.contact.submissions, {
    params: { page, limit },
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Get contact submission by ID
 */
export const getContactSubmissionById = async (id: string) => {
  const response = await axios.get(`${API_ENDPOINTS.contact.submissions}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Get contact statistics
 */
export const getContactStats = async (): Promise<{ success: boolean; data: ContactStats }> => {
  const response = await axios.get(API_ENDPOINTS.contact.stats, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Update contact submission status
 */
export const updateContactStatus = async (id: string, status: string, notes?: string) => {
  const response = await axios.patch(
    `${API_ENDPOINTS.contact.submissions}/${id}/status`,
    { status, notes },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * Delete contact submission
 */
export const deleteContactSubmission = async (id: string) => {
  const response = await axios.delete(`${API_ENDPOINTS.contact.submissions}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Mark contact as contacted
 */
export const markContactAsContacted = async (id: string) => {
  const response = await axios.patch(
    `${API_ENDPOINTS.contact.submissions}/${id}/contacted`,
    {},
    { headers: getAuthHeaders() }
  );
  return response.data;
};

