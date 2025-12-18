import { useState, useCallback } from 'react';

interface UseAsyncOperationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  showError?: boolean;
}

interface UseAsyncOperationReturn<T> {
  execute: (asyncFunction: () => Promise<T>) => Promise<T | undefined>;
  loading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

/**
 * Custom hook for handling async operations with loading and error states
 * Reduces boilerplate code for async operations
 */
export function useAsyncOperation<T = any>(
  options: UseAsyncOperationOptions = {}
): UseAsyncOperationReturn<T> {
  const { onSuccess, onError, showError = true } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const execute = useCallback(
    async (asyncFunction: () => Promise<T>): Promise<T | undefined> => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const result = await asyncFunction();

        setSuccess(true);
        onSuccess?.(result);

        return result;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'An error occurred';

        if (showError) {
          setError(errorMessage);
        }

        onError?.(err);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError, showError]
  );

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    execute,
    loading,
    error,
    success,
    reset,
  };
}

