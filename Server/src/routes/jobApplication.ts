
import { Router } from 'express';
import {
  submitJobApplication,
  getJobApplications,
  getJobApplicationById,
  getJobApplicationStats,
  downloadResume,
  deleteJobApplication
} from '@/controllers/jobApplicationController';
import { authenticateToken } from '@/middleware/auth'; // Ensure this path is correct, might be '../middleware/auth' if relative? No, using aliases
import { validate, ValidationRule } from '@/middleware/validate';
import { uploadResume } from '@/middleware/upload';

const router = Router();

/**
 * Job Application Routes
 * Handles job application submissions and management
 */

const jobApplicationRules: ValidationRule[] = [
  { field: 'fullName', type: 'string', required: true, min: 2, message: 'Full name is required (min 2 chars)' },
  { field: 'email', type: 'email', required: true, message: 'Valid email is required' },
  { field: 'phone', type: 'string', required: true, message: 'Phone number is required' },
  { field: 'location', type: 'string', required: true, message: 'Location is required' },
  { field: 'experience', type: 'string', required: true, message: 'Experience level is required' }, // Enum check handled by Mongoose or custom rule? String is fine for basic
  { field: 'workMode', type: 'string', required: true, message: 'Work mode is required' },
  { field: 'skillsDescription', type: 'string', required: true, min: 20, message: 'Skills description is required (min 20 chars)' },
  { field: 'hearAboutUs', type: 'string', required: true, message: 'How you heard about us is required' }
];

// Public route for submitting applications
// uploadResume must come first to parse multipart/form-data
router.post('/', uploadResume.single('resume'), validate(jobApplicationRules), submitJobApplication);

// Protected routes (require authentication)
router.use(authenticateToken);

// Job application management routes
router.get('/submissions', getJobApplications);
router.get('/submissions/:id', getJobApplicationById);
router.get('/submissions/:id/resume', downloadResume);
router.delete('/submissions/:id', deleteJobApplication);

// Statistics routes
router.get('/stats', getJobApplicationStats);

export default router;
