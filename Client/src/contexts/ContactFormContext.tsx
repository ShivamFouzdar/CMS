import { createContext, useContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactFormValues, defaultContactFormValues } from '@/lib/validations/contact';
import { apiService } from '@/services/api';
import { trackFormSubmission, trackFormError } from '@/lib/analytics';

type ContactFormContextType = {
  // Form methods and state
  formMethods: ReturnType<typeof useForm<ContactFormValues>>;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  
  // Form submission handler
  onSubmit: SubmitHandler<ContactFormValues>;
  
  // Reset form
  resetForm: () => void;
  
  // Form state
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const ContactFormContext = createContext<ContactFormContextType | undefined>(undefined);

type ContactFormProviderProps = {
  children: ReactNode;
  
  /**
   * Callback function called when the form is successfully submitted
   */
  onSuccess?: (data: ContactFormValues) => void;
  
  /**
   * Callback function called when the form submission fails
   */
  onError?: (error: unknown) => void;
  
  /**
   * Whether to reset the form after successful submission
   * @default true
   */
  resetOnSuccess?: boolean;
};

/**
 * Provider component for the contact form context
 */
export function ContactFormProvider({
  children,
  onSuccess,
  onError,
  resetOnSuccess = true,
}: ContactFormProviderProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3; // Personal Info, Service Details, Review & Submit
  
  // Initialize react-hook-form with Zod validation
  const formMethods = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: defaultContactFormValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });
  
  const { reset, handleSubmit, trigger, getValues } = formMethods;
  
  /**
   * Reset the form to its initial state
   */
  const resetForm = useCallback(() => {
    reset(defaultContactFormValues);
    setCurrentStep(1);
    setIsSuccess(false);
    setError(null);
  }, [reset]);
  
  /**
   * Navigate to a specific step
   */
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);
  
  /**
   * Go to the next step
   */
  const nextStep = useCallback(async () => {
    // Validate current step before proceeding
    let isValid = false;
    
    if (currentStep === 1) {
      // Validate personal info
      isValid = await trigger(['firstName', 'lastName', 'email']);
    } else if (currentStep === 2) {
      // Validate service details
      isValid = await trigger(['service', 'message']);
    } else {
      // No validation needed for review step
      isValid = true;
    }
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps, trigger]);
  
  /**
   * Go to the previous step
   */
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);
  
  /**
   * Handle form submission
   */
  const onSubmit: SubmitHandler<ContactFormValues> = useCallback(async (data) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Track form submission in analytics
      trackFormSubmission('contact-form', 'Contact Form');
      
      // Call the API service to submit the form
      const response = await apiService.submitContactForm(data);
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(data);
      }
      
      // Reset the form if needed
      if (resetOnSuccess) {
        resetForm();
      } else {
        setIsSuccess(true);
      }
      
      return response;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      
      // Track form error in analytics
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      trackFormError('contact-form', 'Contact Form', errorMessage);
      
      // Set the error state
      setError(errorMessage);
      
      // Call the error callback if provided
      if (onError) {
        onError(error);
      }
      
      // Re-throw the error for form handling
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [onError, onSuccess, resetForm, resetOnSuccess]);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    formMethods,
    isSubmitting,
    isSuccess,
    error,
    onSubmit: handleSubmit(onSubmit),
    resetForm,
    currentStep,
    totalSteps,
    goToStep,
    nextStep,
    prevStep,
  }), [
    formMethods,
    isSubmitting,
    isSuccess,
    error,
    handleSubmit,
    onSubmit,
    resetForm,
    currentStep,
    totalSteps,
    goToStep,
    nextStep,
    prevStep,
  ]);
  
  return (
    <ContactFormContext.Provider value={contextValue}>
      {children}
    </ContactFormContext.Provider>
  );
}

/**
 * Custom hook to use the contact form context
 */
export function useContactFormContext() {
  const context = useContext(ContactFormContext);
  
  if (context === undefined) {
    throw new Error('useContactFormContext must be used within a ContactFormProvider');
  }
  
  return context;
}
