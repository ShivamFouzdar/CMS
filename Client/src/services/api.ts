import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Define the base URL from environment variables or use a default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create a custom axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds
  withCredentials: true, // Send cookies with requests if needed
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens or other headers here
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle successful responses
    return response.data;
  },
  (error: AxiosError) => {
    // Handle errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.message || error.message;
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response received from the server. Please check your connection.'));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(new Error('An error occurred while sending the request.'));
    }
  }
);

// API service methods
export const apiService = {
  /**
   * Submit a contact form
   */
  async submitContactForm(data: ContactFormData): Promise<ApiResponse<ContactFormResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<ContactFormResponse>>('/contact', data);
      return response;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },
  
  /**
   * Submit a general inquiry
   */
  async submitInquiry(data: InquiryFormData): Promise<ApiResponse<InquiryResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<InquiryResponse>>('/inquiries', data);
      return response;
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      throw error;
    }
  },
  
  /**
   * Get a list of services
   */
  async getServices(): Promise<ApiResponse<Service[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Service[]>>('/services');
      return response;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },
};

// Type definitions for the API
type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  service: string;
  otherService?: string;
  message: string;
  preferredContactMethod: 'email' | 'phone';
  marketingEmails: boolean;
};

type ContactFormResponse = {
  id: string;
  submittedAt: string;
};

type InquiryFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
};

type InquiryResponse = {
  id: string;
  submittedAt: string;
};

type Service = {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
};

export default apiService;
