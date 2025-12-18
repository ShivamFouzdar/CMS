import { z } from 'zod';

// Common validation messages
export const validationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be at most ${max} characters`,
} as const;

// Service options for the contact form
export const serviceOptions = [
  { value: 'bpo', label: 'Business Process Outsourcing (BPO)' },
  { value: 'kpo', label: 'Knowledge Process Outsourcing (KPO)' },
  { value: 'it', label: 'IT Services & Solutions' },
  { value: 'recruitment', label: 'Recruitment & Staffing' },
  { value: 'legal', label: 'Legal Process Outsourcing' },
  { value: 'other', label: 'Other (Please specify)' },
] as const;

// Contact form schema
export const contactFormSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(2, validationMessages.minLength(2))
    .max(50, validationMessages.maxLength(50)),
    
  lastName: z
    .string()
    .min(2, validationMessages.minLength(2))
    .max(50, validationMessages.maxLength(50)),
    
  // Contact Information
  email: z
    .string()
    .min(1, validationMessages.required)
    .email(validationMessages.email),
    
  phone: z
    .string()
    .min(10, validationMessages.minLength(10))
    .max(20, validationMessages.maxLength(20))
    .optional()
    .or(z.literal('')),
    
  // Company Information
  company: z
    .string()
    .min(2, validationMessages.minLength(2))
    .max(100, validationMessages.maxLength(100))
    .optional()
    .or(z.literal('')),
    
  jobTitle: z
    .string()
    .max(100, validationMessages.maxLength(100))
    .optional()
    .or(z.literal('')),
    
  // Service Information
  service: z
    .string({
      required_error: validationMessages.required,
    })
    .refine(
      (val) => serviceOptions.some((option) => option.value === val),
      'Please select a valid service'
    ),
    
  otherService: z
    .string()
    .max(100, validationMessages.maxLength(100))
    .optional()
    .refine(
      (val, ctx) => {
        // Only require otherService if 'other' is selected
        if (ctx.parent.service === 'other' && (!val || val.trim() === '')) {
          return false;
        }
        return true;
      },
      {
        message: 'Please specify the service',
      }
    )
    .or(z.literal('')),
    
  // Project Details
  message: z
    .string()
    .min(10, 'Please provide more details (at least 10 characters)')
    .max(2000, validationMessages.maxLength(2000)),
    
  // Preferences
  preferredContactMethod: z
    .enum(['email', 'phone'], {
      required_error: 'Please select a preferred contact method',
    })
    .default('email'),
    
  // Consent
  privacyPolicy: z.boolean({
    required_error: 'You must accept the privacy policy',
  }),
  
  marketingEmails: z.boolean().default(false),
});

// Type for the form values
export type ContactFormValues = z.infer<typeof contactFormSchema>;

// Default form values
export const defaultContactFormValues: ContactFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  service: '',
  otherService: '',
  message: '',
  preferredContactMethod: 'email',
  privacyPolicy: false,
  marketingEmails: false,
};

// Note: formatPhoneNumber, unformatPhoneNumber, and isValidEmail have been moved to lib/form-utils.ts
// Import them from there: import { formatPhoneNumber, unformatPhoneNumber, isValidEmail } from '@/lib/form-utils';
