/**
 * API Helper Utilities
 * Common utilities for API calls
 */

/**
 * Get authorization headers for API requests
 */
export function getAuthHeaders(): { Authorization: string } {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found. Please log in again.');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Get authorization headers with optional token override
 */
export function getAuthHeadersWithToken(token?: string): { Authorization: string } {
  const accessToken = token || localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('No access token found. Please log in again.');
  }
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

