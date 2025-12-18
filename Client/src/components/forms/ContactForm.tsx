import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, User, Building, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/FormField';
import { Textarea } from '@/components/forms/FormField';
import { Select } from '@/components/forms/FormField';
import { fadeIn, staggerContainer, cn } from '@/lib/utils';
import { useContactForm } from '@/hooks/useContactForm';
import { serviceOptions } from '@/lib/validations/contact';

type ContactFormProps = {
  /**
   * Additional class name for the form container
   */
  className?: string;
  
  /**
   * Whether to show a success message after submission
   * @default true
   */
  showSuccessMessage?: boolean;
  
  /**
   * Whether to show a title above the form
   * @default true
   */
  showTitle?: boolean;
  
  /**
   * Whether to show a description below the title
   * @default true
   */
  showDescription?: boolean;
};

/**
 * A comprehensive contact form with validation and submission handling
 */
export function ContactForm({
  className = '',
  showSuccessMessage = true,
  showTitle = true,
  showDescription = true,
}: ContactFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    errors,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitSuccessful,
    submitError,
    selectedService,
  } = useContactForm({
    onSuccess: (data) => {
      console.log('Form submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Form submission error:', error);
    },
  });

  // Show success message for 5 seconds after successful submission
  useEffect(() => {
    if (isSubmitSuccessful && showSuccessMessage) {
      const timer = setTimeout(() => {
        // Reset form after showing success message
        reset();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isSubmitSuccessful, showSuccessMessage, reset]);

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {showTitle && (
        <motion.div 
          className="text-center mb-8"
          variants={fadeIn('up', 0.1)}
          initial="hidden"
          animate="show"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">
            Get in Touch
          </h2>
          {showDescription && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have a question or want to discuss your project? Fill out the form below and our team will get back to you as soon as possible.
            </p>
          )}
        </motion.div>
      )}
      
      <AnimatePresence mode="wait">
        {isSubmitSuccessful && showSuccessMessage ? (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
          >
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
              <p className="text-green-700 mb-4">
                Your message has been sent successfully. We'll get back to you soon!
              </p>
              <Button
                variant="outline"
                onClick={() => reset()}
                className="mt-2"
              >
                Send Another Message
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="contact-form"
            onSubmit={handleSubmit}
            className="space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {submitError && (
              <motion.div
                variants={fadeIn('up', 0.1)}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start"
              >
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Error</h4>
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              </motion.div>
            )}
            
            <motion.div 
              variants={fadeIn('up', 0.1)}
              className="bg-white shadow rounded-lg p-6 sm:p-8"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Input
                      label="First Name"
                      id="firstName"
                      autoComplete="given-name"
                      error={errors.firstName?.message}
                      leftIcon={<User className="h-4 w-4 text-gray-400" />}
                      {...register('firstName')}
                    />
                    
                    <Input
                      label="Last Name"
                      id="lastName"
                      autoComplete="family-name"
                      error={errors.lastName?.message}
                      leftIcon={<User className="h-4 w-4 text-gray-400" />}
                      {...register('lastName')}
                    />
                    
                    <Input
                      label="Email Address"
                      id="email"
                      type="email"
                      autoComplete="email"
                      error={errors.email?.message}
                      leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
                      {...register('email')}
                    />
                    
                    <Input
                      label="Phone Number (Optional)"
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      error={errors.phone?.message}
                      leftIcon={<Phone className="h-4 w-4 text-gray-400" />}
                      {...register('phone')}
                    />
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Input
                      label="Company Name (Optional)"
                      id="company"
                      autoComplete="organization"
                      error={errors.company?.message}
                      leftIcon={<Building className="h-4 w-4 text-gray-400" />}
                      {...register('company')}
                    />
                    
                    <Input
                      label="Job Title (Optional)"
                      id="jobTitle"
                      autoComplete="organization-title"
                      error={errors.jobTitle?.message}
                      leftIcon={<Briefcase className="h-4 w-4 text-gray-400" />}
                      {...register('jobTitle')}
                    />
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">How can we help you?</h3>
                  <div className="space-y-6">
                    <div>
                      <Select
                        label="Service of Interest"
                        id="service"
                        error={errors.service?.message}
                        options={[
                          { value: '', label: 'Select a service...', disabled: true },
                          ...serviceOptions,
                        ]}
                        {...register('service')}
                      />
                    </div>
                    
                    {selectedService === 'other' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <Input
                          label="Please specify"
                          id="otherService"
                          error={errors.otherService?.message}
                          {...register('otherService')}
                        />
                      </motion.div>
                    )}
                    
                    <div>
                      <Textarea
                        label="Your Message"
                        id="message"
                        rows={5}
                        error={errors.message?.message}
                        className="resize-none"
                        {...register('message')}
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Please provide as much detail as possible about your inquiry.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</p>
                        <div className="flex space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              value="email"
                              defaultChecked
                              {...register('preferredContactMethod')}
                            />
                            <span className="ml-2 text-gray-700">Email</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              value="phone"
                              {...register('preferredContactMethod')}
                            />
                            <span className="ml-2 text-gray-700">Phone</span>
                          </label>
                        </div>
                        {errors.preferredContactMethod && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.preferredContactMethod.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="privacyPolicy"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          {...register('privacyPolicy')}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="privacyPolicy" className="font-medium text-gray-700">
                          I agree to the{' '}
                          <a href="/privacy-policy" className="text-blue-600 hover:text-blue-500">
                            Privacy Policy
                          </a>{' '}
                          and{' '}
                          <a href="/terms" className="text-blue-600 hover:text-blue-500">
                            Terms of Service
                          </a>
                          . *
                        </label>
                        {errors.privacyPolicy && (
                          <p className="mt-1 text-red-600">
                            {errors.privacyPolicy.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="marketingEmails"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          {...register('marketingEmails')}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="marketingEmails" className="text-gray-600">
                          I'd like to receive marketing communications about CareerMap Solutions services, events and news. I can unsubscribe at any time.
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                    isFullWidth
                    isLoading={isSubmitting}
                    loadingText="Sending..."
                    disabled={!isDirty || !isValid || isSubmitting}
                  >
                    Send Message
                  </Button>
                  <p className="mt-3 text-sm text-gray-500">
                    * Required fields
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ContactForm;
