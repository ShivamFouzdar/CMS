import { Router } from 'express';
import { 
  submitJobApplication,
  getJobApplications,
  getJobApplicationById,
  getJobApplicationStats,
  downloadResume,
  deleteJobApplication
} from '@/controllers/jobApplicationController';
// import { authenticateToken, requireRole } from '@/middleware/auth'; // TODO: Re-enable in production

const router = Router();

/**
 * Job Application Routes
 * Handles job application submissions and management
 */

// Public route for submitting applications
router.post('/', submitJobApplication);

// Protected routes (require authentication)
// router.use(authenticateToken); // TODO: Enable authentication in production

// Job application management routes
router.get('/submissions', getJobApplications); // requireRole(['admin', 'moderator']) - disabled for testing
router.get('/submissions/:id', getJobApplicationById); // requireRole(['admin', 'moderator']) - disabled for testing
router.get('/submissions/:id/resume', downloadResume); // requireRole(['admin', 'moderator']) - disabled for testing
router.delete('/submissions/:id', deleteJobApplication); // requireRole(['admin']) - disabled for testing

// Statistics routes
router.get('/stats', getJobApplicationStats); // requireRole(['admin', 'moderator']) - disabled for testing

export default router;

