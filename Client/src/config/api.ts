/**
 * API Configuration
 * Central configuration for API base URL and endpoints
 * 
 * This is the SINGLE SOURCE OF TRUTH for all API base URLs.
 * Import API_BASE_URL from this file instead of defining it elsewhere.
 */

// Get API base URL from environment variable or use default
// Defaults to relative path for production, full URL for development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : '');

// Get app base URL for SEO and absolute URLs (different from API base URL)
export const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:5005' : 'https://careermapsolutions.com');

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    me: `${API_BASE_URL}/api/auth/me`,
    refresh: `${API_BASE_URL}/api/auth/refresh`,
    validate: `${API_BASE_URL}/api/auth/validate`,
  },
  users: {
    me: `${API_BASE_URL}/api/users/me`,
    updateProfile: `${API_BASE_URL}/api/users/me/profile`,
    updatePreferences: `${API_BASE_URL}/api/users/me/preferences`,
    changePassword: `${API_BASE_URL}/api/users/me/password`,
  },
  jobApplication: {
    submit: `${API_BASE_URL}/api/job-application`, // Changed from /submit to root
    getAll: `${API_BASE_URL}/api/job-application`,
    getById: (id: string) => `${API_BASE_URL}/api/job-application/${id}`,
    stats: `${API_BASE_URL}/api/job-application/stats`,
    downloadResume: (id: string) => `${API_BASE_URL}/api/job-application/${id}/resume`,
    delete: (id: string) => `${API_BASE_URL}/api/job-application/${id}`,
    submissions: `${API_BASE_URL}/api/job-application/submissions`,
  },
  contact: {
    submit: `${API_BASE_URL}/api/contact`,
    submissions: `${API_BASE_URL}/api/contact/submissions`,
    stats: `${API_BASE_URL}/api/contact/stats`,
  },
  services: {
    getAll: `${API_BASE_URL}/api/services`,
    getBySlug: (slug: string) => `${API_BASE_URL}/api/services/${slug}`,
  },
  reviews: {
    getAll: `${API_BASE_URL}/api/reviews`,
    getById: (id: string | number) => `${API_BASE_URL}/api/reviews/${id}`,
    submit: `${API_BASE_URL}/api/reviews`,
    all: `${API_BASE_URL}/api/reviews/all`,
    updateStatus: (id: string) => `${API_BASE_URL}/api/reviews/${id}/status`,
    update: (id: string) => `${API_BASE_URL}/api/reviews/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/reviews/${id}`,
    stats: `${API_BASE_URL}/api/reviews/stats`,
  },
  admin: {
    settings: `${API_BASE_URL}/api/admin/settings`,
    stats: `${API_BASE_URL}/api/admin/stats`,
    logs: `${API_BASE_URL}/api/admin/logs`,
  },
  twoFactor: {
    enable: `${API_BASE_URL}/api/2fa/enable`,
    verify: `${API_BASE_URL}/api/2fa/verify`,
    disable: `${API_BASE_URL}/api/2fa/disable`,
    verifyLogin: `${API_BASE_URL}/api/2fa/verify-login`,
    regenerateBackupCodes: `${API_BASE_URL}/api/2fa/regenerate-backup-codes`,
  },
};

// Helper function to get headers with authentication
export const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to make authenticated API calls
/**
 * @deprecated Use apiClient from '@/services/api' instead.
 */
export const apiCall = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('accessToken');

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

