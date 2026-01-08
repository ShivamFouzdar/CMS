
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
import { validate, ValidationRule } from '@/middleware/validate';

const router = Router();

/**
 * Contact Routes
 * Handles contact form submissions and management
 */

const contactRules: ValidationRule[] = [
  { field: 'name', type: 'string', required: true, min: 2, message: 'Name is required' },
  { field: 'email', type: 'email', required: true, message: 'Valid email is required' },
  { field: 'message', type: 'string', required: true, min: 10, message: 'Message is required (min 10 chars)' },
  // Optional fields
  { field: 'phone', type: 'string', required: false },
  { field: 'company', type: 'string', required: false },
  { field: 'service', type: 'string', required: false }
];

const updateStatusRules: ValidationRule[] = [
  { field: 'status', type: 'string', required: true, message: 'Status is required' }
];

// Public routes
router.post('/', validate(contactRules), submitContactForm);

// Protected routes (require authentication)
router.use(authenticateToken);

// Contact management routes
router.get('/submissions', requireRole(['admin', 'moderator']), getContactSubmissions);
router.get('/submissions/:id', requireRole(['admin', 'moderator']), getContactSubmissionById);
router.patch('/submissions/:id/status', requireRole(['admin', 'moderator']), validate(updateStatusRules), updateContactSubmissionStatus);
router.patch('/submissions/:id/contacted', requireRole(['admin', 'moderator']), markContactAsContacted);
router.delete('/submissions/:id', requireRole(['admin']), deleteContactSubmission);

// Statistics and analytics routes
router.get('/stats', requireRole(['admin', 'moderator']), getContactStats);
router.get('/by-service/:service', requireRole(['admin', 'moderator']), getContactsByService);

export default router;
