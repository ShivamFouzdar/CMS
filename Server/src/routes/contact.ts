import { Router } from 'express';
import { 
  submitContactForm,
  getContactSubmissions,
  getContactSubmissionById,
  updateContactSubmissionStatus,
  deleteContactSubmission,
  getContactStats,
  getContactsByService,
  markContactAsContacted
} from '@/controllers/contactController';
import { authenticateToken, requireRole } from '@/middleware/auth';

const router = Router();

/**
 * Contact Routes
 * Handles contact form submissions and management
 */

// Public routes
router.post('/', submitContactForm);

// Protected routes (require authentication)
router.use(authenticateToken);

// Contact management routes
router.get('/submissions', requireRole(['admin', 'moderator']), getContactSubmissions);
router.get('/submissions/:id', requireRole(['admin', 'moderator']), getContactSubmissionById);
router.patch('/submissions/:id/status', requireRole(['admin', 'moderator']), updateContactSubmissionStatus);
router.patch('/submissions/:id/contacted', requireRole(['admin', 'moderator']), markContactAsContacted);
router.delete('/submissions/:id', requireRole(['admin']), deleteContactSubmission);

// Statistics and analytics routes
router.get('/stats', requireRole(['admin', 'moderator']), getContactStats);
router.get('/by-service/:service', requireRole(['admin', 'moderator']), getContactsByService);

export default router;
