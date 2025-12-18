import { AxiosError } from 'axios';

/**
 * Standardized error handler for API errors
 * Provides consistent error messages and handling
 */
export function handleApiError(error: unknown): {
  message: string;
  code?: string;
  status?: number;
  shouldLogout?: boolean;
} {
  // Network errors
  if (error && typeof error === 'object' && 'code' in error) {
    if (error.code === 'ERR_NETWORK') {
      return {
        message: 'Server is not running. Please start the server.',
        code: 'ERR_NETWORK',
      };
    }
  }

  // Axios errors
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<{ message?: string }>;

    // 401 Unauthorized - Session expired
    if (axiosError.response?.status === 401) {
      return {
        message: 'Session expired. Please login again.',
        status: 401,
        shouldLogout: true,
      };
    }

    // 403 Forbidden - No permission
    if (axiosError.response?.status === 403) {
      return {
        message: axiosError.response.data?.message || 'You do not have permission to perform this action.',
        status: 403,
      };
    }

    // 400 Bad Request - Validation error
    if (axiosError.response?.status === 400) {
      return {
        message: axiosError.response.data?.message || 'Invalid data. Please check your inputs.',
        status: 400,
      };
    }

    // 404 Not Found
    if (axiosError.response?.status === 404) {
      return {
        message: axiosError.response.data?.message || 'Resource not found.',
        status: 404,
      };
    }

    // 409 Conflict (e.g., email already exists)
    if (axiosError.response?.status === 409) {
      return {
        message: axiosError.response.data?.message || 'This resource already exists.',
        status: 409,
      };
    }

    // 500+ Server errors
    if (axiosError.response?.status && axiosError.response.status >= 500) {
      return {
        message: 'Server error. Please try again later.',
        status: axiosError.response.status,
      };
    }

    // Generic axios error
    return {
      message: axiosError.response?.data?.message || axiosError.message || 'An error occurred',
      status: axiosError.response?.status,
    };
  }

  // Error objects with message
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  // Unknown error
  return {
    message: 'An unexpected error occurred',
  };
}

/**
 * Handle logout on authentication errors
 */
export function handleAuthError(error: unknown): void {
  const errorInfo = handleApiError(error);
  
  if (errorInfo.shouldLogout) {
    localStorage.clear();
    setTimeout(() => {
      window.location.href = '/auth/login';
    }, 2000);
  }
}

