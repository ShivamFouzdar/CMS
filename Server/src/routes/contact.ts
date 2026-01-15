
import { Router } from 'express';
import {
  submitContactForm,
  getContactSubmissions,
  getContactSubmissionById,
  updateContactSubmissionStatus,
  deleteContactSubmission,
  getContactStats,
  getContactsByService,
  markContactAsContacted,
  exportContacts,
  bulkDeleteContacts
} from '@/controllers/contact.controller.js';
import { authenticateToken, requireRole } from '@/middleware/auth.js';
import { z } from 'zod';
import { authLimiter } from '@/middleware/rateLimiter.js';
import { validate } from '@/middleware/validate.js';

const router = Router();

/**
 * Contact Routes
 * Handles contact form submissions and management
 */

const contactSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email is required'),
    message: z.string().min(10, 'Message is required (min 10 chars)'),
    phone: z.string().optional(),
    company: z.string().optional(),
    service: z.string().optional()
  })
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.string().min(1, 'Status is required')
  })
});

// Public routes
router.post('/', authLimiter, validate(contactSchema), submitContactForm);

// Protected routes (require authentication)
router.use(authenticateToken);

// Contact management routes
router.get('/export', requireRole(['admin']), exportContacts);
router.get('/submissions', requireRole(['admin', 'moderator']), getContactSubmissions);
router.get('/submissions/:id', requireRole(['admin', 'moderator']), getContactSubmissionById);
router.patch('/submissions/:id/status', requireRole(['admin', 'moderator']), validate(updateStatusSchema), updateContactSubmissionStatus);
router.patch('/submissions/:id/contacted', requireRole(['admin', 'moderator']), markContactAsContacted);
router.delete('/submissions/:id', requireRole(['admin']), deleteContactSubmission);
router.post('/submissions/bulk-delete', requireRole(['admin']), bulkDeleteContacts);

// Statistics and analytics routes
router.get('/stats', requireRole(['admin', 'moderator']), getContactStats);
router.get('/by-service/:service', requireRole(['admin', 'moderator']), getContactsByService);

export default router;
