import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Briefcase, FileText, 
  Upload, AlertCircle, CheckCircle, X, Loader2
} from 'lucide-react';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/FormField';
import { Textarea } from '@/components/forms/FormField';
import { Select } from '@/components/forms/FormField';
import { fadeIn, staggerContainer } from '@/lib/utils';
import { 
  jobApplicationSchema, 
  type JobApplicationFormValues,
  experienceLevels,
  workModes,
  hearAboutUsOptions,
} from '@/lib/validations/jobApplication';
import { formatFileSize } from '@/lib/form-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { API_ENDPOINTS } from '@/config/api';
import axios from 'axios';

type JobApplicationFormProps = {
  /**
   * Callback when form is submitted successfully
   */
  onSuccess?: (data: JobApplicationFormValues) => void;
  
  /**
   * Callback when form submission fails
   */
  onError?: (error: unknown) => void;
  
  /**
   * Whether to show a success message after submission
   * @default true
   */
  showSuccessMessage?: boolean;
  
  /**
   * Additional class name for the form container
   */
  className?: string;
};

/**
 * Job Application Form Component
 * A comprehensive form for job seekers to apply for positions at CareerMap Solutions
 */
export function JobApplicationForm({
  onSuccess,
  onError,
  showSuccessMessage = true,
  className = '',
}: JobApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [resumePreview, setResumePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
    watch,
    reset,
    resetField,
  } = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      experience: 'Fresher',
      workMode: 'Work from Home',
      skillsDescription: '',
      hearAboutUs: 'LinkedIn',
      consent: false,
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const resumeFile = watch('resume');

  // Handle resume file change
  useEffect(() => {
    if (resumeFile instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumePreview(e.target?.result as string);
      };
      reader.readAsDataURL(resumeFile);
    } else {
      setResumePreview(null);
    }
  }, [resumeFile]);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: JobApplicationFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('location', data.location);
      formData.append('experience', data.experience);
      formData.append('workMode', data.workMode);
      formData.append('skillsDescription', data.skillsDescription);
      formData.append('hearAboutUs', data.hearAboutUs);
      formData.append('resume', data.resume);

      // Submit to backend API using API_ENDPOINTS
      const response = await axios.post(API_ENDPOINTS.jobApplication.submit, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to submit application');
      }

      if (onSuccess) {
        onSuccess(data);
      }

      setSubmitSuccess(true);

      // Reset form after 5 seconds
      setTimeout(() => {
        reset();
        setSubmitSuccess(false);
        setResumePreview(null);
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Extract error message from axios error response
      let errorMessage = 'An error occurred while submitting the application. Please try again.';
      
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        const missingFields = error.response?.data?.missingFields;
        
        if (backendMessage) {
          errorMessage = backendMessage;
          if (missingFields && Array.isArray(missingFields) && missingFields.length > 0) {
            errorMessage += ` Missing: ${missingFields.join(', ')}`;
          }
        } else if (error.response?.status === 400) {
          errorMessage = 'Invalid form data. Please check all required fields are filled correctly.';
        } else if (error.response?.status === 413) {
          errorMessage = 'File size is too large. Please upload a file smaller than 5MB.';
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);

      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      <AnimatePresence mode="wait">
        {submitSuccess && showSuccessMessage ? (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
          >
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                Thank You!
              </h3>
              <p className="text-green-700 mb-4">
                Thank you for your interest in joining CareerMap Solutions. Our HR team will review your details and contact you soon.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="job-application-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
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
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-800">Error</h4>
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitError(null)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {/* Personal Information Section */}
            <motion.div variants={fadeIn('up', 0.1)} className="bg-white shadow rounded-lg p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  id="fullName"
                  autoComplete="name"
                  error={errors.fullName?.message}
                  leftIcon={<User className="h-4 w-4 text-gray-400" />}
                  {...register('fullName')}
                />
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    label="Phone Number"
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    error={errors.phone?.message}
                    leftIcon={<Phone className="h-4 w-4 text-gray-400" />}
                    {...register('phone')}
                  />
                </div>
                
                <Input
                  label="Current City/Location"
                  id="location"
                  autoComplete="address-level2"
                  error={errors.location?.message}
                  leftIcon={<MapPin className="h-4 w-4 text-gray-400" />}
                  {...register('location')}
                />
              </div>
            </motion.div>

            {/* Experience and Work Preferences */}
            <motion.div variants={fadeIn('up', 0.2)} className="bg-white shadow rounded-lg p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                Experience & Work Preferences
              </h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Select
                  label="Total Years of Experience"
                  id="experience"
                  error={errors.experience?.message}
                  options={[
                    ...experienceLevels.map(level => ({ value: level, label: level })),
                  ]}
                  {...register('experience')}
                />
                
                <Select
                  label="Preferred Work Mode"
                  id="workMode"
                  error={errors.workMode?.message}
                  options={[
                    ...workModes.map(mode => ({ value: mode, label: mode })),
                  ]}
                  {...register('workMode')}
                />
              </div>
            </motion.div>

            {/* Resume Upload */}
            <motion.div variants={fadeIn('up', 0.3)} className="bg-white shadow rounded-lg p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Resume
              </h3>
              
              <Controller
                name="resume"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <div>
                    <label
                      htmlFor="resume"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Upload Resume *
                      <span className="text-gray-500 text-xs ml-2">
                        (PDF or Word document, max 5MB)
                      </span>
                    </label>
                    
                    <div className="mt-1">
                      <label
                        htmlFor="resume"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF or Word document (MAX. 5MB)
                          </p>
                        </div>
                        <input
                          {...field}
                          id="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    
                    {value && resumePreview && (
                      <div className="mt-3 flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-sm text-gray-700">
                            {value instanceof File ? value.name : 'Resume uploaded'}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {value instanceof File ? formatFileSize(value.size) : ''}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            resetField('resume');
                            setResumePreview(null);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    
                    {errors.resume && (
                      <p className="mt-1 text-sm text-red-600">{errors.resume.message as string}</p>
                    )}
                  </div>
                )}
              />
            </motion.div>

            {/* Skills Description */}
            <motion.div variants={fadeIn('up', 0.4)} className="bg-white shadow rounded-lg p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Skills & Expertise
              </h3>
              
              <Textarea
                label="Briefly Describe Your Skills / Expertise"
                id="skillsDescription"
                rows={5}
                error={errors.skillsDescription?.message}
                className="resize-none"
                placeholder="Please describe your key skills, expertise, and any relevant experience..."
                {...register('skillsDescription')}
              />
            </motion.div>

            {/* How did you hear about us */}
            <motion.div variants={fadeIn('up', 0.5)} className="bg-white shadow rounded-lg p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                How did you hear about CareerMap Solutions?
              </h3>
              
              <div className="space-y-3">
                {hearAboutUsOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      value={option}
                      {...register('hearAboutUs')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
                {errors.hearAboutUs && (
                  <p className="mt-1 text-sm text-red-600">{errors.hearAboutUs.message}</p>
                )}
              </div>
            </motion.div>

            {/* Consent */}
            <motion.div variants={fadeIn('up', 0.6)} className="bg-white shadow rounded-lg p-6 sm:p-8">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="consent"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    {...register('consent')}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="consent" className="font-medium text-gray-700">
                    I consent to CareerMap Solutions using my information for recruitment purposes. *
                  </label>
                  {errors.consent && (
                    <p className="mt-1 text-red-600">{errors.consent.message}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={fadeIn('up', 0.7)} className="bg-white shadow rounded-lg p-6 sm:p-8">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                isLoading={isSubmitting}
                loadingText="Submitting..."
                disabled={!isDirty || !isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
              <p className="mt-3 text-sm text-gray-500 text-center">
                * Required fields
              </p>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default JobApplicationForm;

