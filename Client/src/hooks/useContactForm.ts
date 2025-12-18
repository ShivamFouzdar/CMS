import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trackFormSubmission } from '@/lib/analytics';
import { 
  contactFormSchema, 
  ContactFormValues, 
  defaultContactFormValues 
} from '@/lib/validations/contact';
import { API_ENDPOINTS } from '@/config/api';

interface UseContactFormOptions {
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
}

/**
 * A custom hook to handle contact form state, validation, and submission
 */
export function useContactForm(options: UseContactFormOptions = {}) {
  const { 
    onSuccess, 
    onError, 
    resetOnSuccess = true 
  } = options;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isValid, isSubmitSuccessful },
    control,
    setValue,
    trigger,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: defaultContactFormValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });
  
  // Watch service field to conditionally show/hide otherService field
  const selectedService = watch('service');
  
  /**
   * Handle form submission
   */
  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // Track form submission in analytics
      trackFormSubmission('contact-form', 'Contact Form');
      
      // Send form data to the backend API
      const response = await fetch(API_ENDPOINTS.contact.submit, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          company: data.company || '',
          jobTitle: data.jobTitle || '',
          service: data.service,
          otherService: data.otherService || '',
          message: data.message,
          preferredContactMethod: data.preferredContactMethod,
          marketingEmails: data.marketingEmails,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send message');
      }
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(data);
      }
      
      // Reset the form if needed
      if (resetOnSuccess) {
        reset(defaultContactFormValues);
      }
      
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'An error occurred while submitting the form. Please try again.'
      );
      
      // Call the error callback if provided
      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Reset the form to its initial state
   */
  const resetForm = () => {
    reset(defaultContactFormValues);
    setSubmitError(null);
    setSubmitSuccess(false);
  };
  
  return {
    // Form state
    isSubmitting,
    submitError,
    submitSuccess,
    isDirty,
    isValid,
    isSubmitSuccessful,
    
    // Form methods
    register,
    handleSubmit: handleSubmit(onSubmit),
    reset: resetForm,
    control,
    setValue,
    trigger,
    
    // Form values
    watch,
    selectedService,
    
    // Errors
    errors,
  };
}
