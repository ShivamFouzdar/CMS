import { Router } from 'express';
import { 
  submitJobApplication,
  getJobApplications,
  getJobApplicationById,
  getJobApplicationStats,
  downloadResume,
  deleteJobApplication
} from '@/controllers/jobApplicationController';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

/**
 * Job Application Routes
 * Handles job application submissions and management
 */

// Public route for submitting applications
router.post('/', submitJobApplication);

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

