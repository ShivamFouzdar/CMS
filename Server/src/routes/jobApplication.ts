
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
import { z } from 'zod';
import { validate } from '@/middleware/validate';
import { uploadResume } from '@/middleware/upload';

const router = Router();

/**
 * Job Application Routes
 * Handles job application submissions and management
 */

const jobApplicationSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name is required (min 2 chars)'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(1, 'Phone number is required'),
    location: z.string().min(1, 'Location is required'),
    experience: z.string().min(1, 'Experience level is required'),
    workMode: z.string().min(1, 'Work mode is required'),
    skillsDescription: z.string().min(20, 'Skills description is required (min 20 chars)'),
    hearAboutUs: z.string().min(1, 'How you heard about us is required')
  })
});

// Public route for submitting applications
// uploadResume must come first to parse multipart/form-data
router.post('/', uploadResume.single('resume'), validate(jobApplicationSchema), submitJobApplication);

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
