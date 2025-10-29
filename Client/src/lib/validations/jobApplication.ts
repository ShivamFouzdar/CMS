import { z } from 'zod';

// Common validation messages
export const validationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be at most ${max} characters`,
  fileSize: (size: number) => `File size must be less than ${size}MB`,
} as const;

// Experience level options
export const experienceLevels = [
  'Fresher',
  '0–1 year',
  '1–3 years',
  '3–5 years',
  '5+ years',
] as const;

// Work mode options
export const workModes = [
  'Work from Home',
  'Office-Based',
  'Hybrid',
] as const;

// How did you hear about us options
export const hearAboutUsOptions = [
  'LinkedIn',
  'Instagram',
  'Job Portal',
  'Referral',
  'Other',
] as const;

// Job application schema
export const jobApplicationSchema = z.object({
  // Personal Information
  fullName: z
    .string()
    .min(2, 'Please enter your full name (at least 2 characters)')
    .max(100, 'Name cannot exceed 100 characters'),
    
  email: z
    .string()
    .min(1, validationMessages.required)
    .email(validationMessages.email),
    
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number (at least 10 digits)')
    .max(20, 'Phone number cannot exceed 20 characters')
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Please enter a valid phone number'),
    
  // Location
  location: z
    .string()
    .min(2, 'Please enter your city/location (at least 2 characters)')
    .max(100, 'Location cannot exceed 100 characters'),
    
  // Experience
  experience: z
    .string()
    .refine(
      (val) => experienceLevels.includes(val as any),
      'Please select your experience level'
    ),
    
  // Resume upload
  resume: z
    .any()
    .refine(
      (file) => file instanceof File && file !== null && file !== undefined,
      'Resume file is required'
    )
    .refine(
      (file) => file instanceof File && file.size <= 5 * 1024 * 1024, // 5MB
      'Resume file size must be less than 5MB'
    )
    .refine(
      (file) => {
        if (!(file instanceof File)) return false;
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        return allowedTypes.includes(file.type);
      },
      'Resume must be a PDF or Word document'
    ),
    
  // Work Preferences
  workMode: z
    .string()
    .refine(
      (val) => workModes.includes(val as any),
      'Please select your preferred work mode'
    ),
    
  // Skills Description
  skillsDescription: z
    .string()
    .min(20, 'Please describe your skills in more detail (at least 20 characters)')
    .max(1000, 'Skills description cannot exceed 1000 characters'),
    
  // How did you hear about us
  hearAboutUs: z
    .string()
    .refine(
      (val) => hearAboutUsOptions.includes(val as any) || val === 'Other',
      'Please select how you heard about us'
    ),
    
  // Consent
  consent: z.boolean({
    required_error: 'You must provide consent to proceed',
  }).refine((val) => val === true, 'You must provide consent to proceed'),
});

// Type for the form values
export type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;

// Default form values (resume will be added by the file input)
export const defaultJobApplicationValues: Omit<JobApplicationFormValues, 'resume' | 'consent'> & { resume?: File; consent: boolean } = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  experience: 'Fresher',
  workMode: 'Work from Home',
  skillsDescription: '',
  hearAboutUs: 'LinkedIn',
  consent: false,
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  
  if (match) {
    return !match[2]
      ? match[1]
      : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
  }
  
  return value;
};

/**
 * Validate file type for resume
 */
export const isValidResumeType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  return allowedTypes.includes(file.type);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

