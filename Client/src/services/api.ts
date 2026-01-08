import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config/api';

/**
 * Standardized API Client
 * Uses Axios for unified request/response handling, interceptors, and error management.
 */

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

/**
 * Request Interceptor: Attach Auth Token
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Unwrap data and handle global errors
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    let errorMessage = 'An unexpected error occurred';

    if (error.response) {
      const data = error.response.data as any;
      errorMessage = data?.message || error.message;

      if (error.response.status === 401) {
        console.error('Session expired or unauthorized');
      }

      if (error.response.status === 503) {
        // Maintenance mode active
        if (window.location.pathname !== '/maintenance' && !window.location.pathname.startsWith('/admin')) {
          window.location.href = '/maintenance';
        }

        // Pass the full data (including contact info) back to the caller
        const maintenanceError = new Error(errorMessage) as any;
        maintenanceError.data = data;
        maintenanceError.status = 503;
        return Promise.reject(maintenanceError);
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your connection.';
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
