import { useState, useCallback } from 'react';
import { trackFormSubmission, trackFormError } from '@/lib/analytics';

type FormState<T> = {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  data: T | null;
};

type UseFormSubmissionOptions<T, R> = {
  /**
   * The async function that will be called when the form is submitted
   */
  onSubmit: (data: T) => Promise<R>;
  
  /**
   * Callback function called when the form is successfully submitted
   */
  onSuccess?: (data: R) => void;
  
  /**
   * Callback function called when the form submission fails
   */
  onError?: (error: unknown) => void;
  
  /**
   * Whether to reset the form after successful submission
   * @default false
   */
  resetOnSuccess?: boolean;
  
  /**
   * The form ID for analytics tracking
   */
  formId: string;
  
  /**
   * The form name for analytics tracking
   */
  formName: string;
};

/**
 * A custom hook to handle form submission with loading states, error handling, and analytics
 */
export function useFormSubmission<T, R = void>({
  onSubmit,
  onSuccess,
  onError,
  resetOnSuccess = false,
  formId,
  formName,
}: UseFormSubmissionOptions<T, R>) {
  const [state, setState] = useState<FormState<T>>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
    data: null,
  });

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (data: T) => {
      setState((prev) => ({
        ...prev,
        isSubmitting: true,
        error: null,
        isSuccess: false,
      }));

      try {
        // Track form submission in analytics
        trackFormSubmission(formId, formName);
        
        // Call the provided onSubmit function
        const result = await onSubmit(data);
        
        // Update state with success
        setState({
          isSubmitting: false,
          isSuccess: true,
          error: null,
          data: resetOnSuccess ? null : (data as any),
        });
        
        // Call the success callback if provided
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (error) {
        // Track form error in analytics
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        trackFormError(formId, formName, errorMessage);
        
        // Update state with error
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          isSuccess: false,
          error: errorMessage,
        }));
        
        // Call the error callback if provided
        if (onError) {
          onError(error);
        }
        
        // Re-throw the error for form handling
        throw error;
      }
    },
    [formId, formName, onError, onSuccess, onSubmit, resetOnSuccess]
  );

  /**
   * Reset the form state
   */
  const reset = useCallback(() => {
    setState({
      isSubmitting: false,
      isSuccess: false,
      error: null,
      data: null,
    });
  }, []);

  return {
    /**
     * Submit handler function
     */
    handleSubmit,
    
    /**
     * Reset the form state
     */
    reset,
    
    /**
     * Form state
     */
    state: {
      /** Whether the form is currently submitting */
      isSubmitting: state.isSubmitting,
      
      /** Whether the form was successfully submitted */
      isSuccess: state.isSuccess,
      
      /** The current error message, if any */
      error: state.error,
      
      /** The submitted form data */
      data: state.data,
    },
  };
}
