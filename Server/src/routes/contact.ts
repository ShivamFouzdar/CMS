
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
import { authLimiter } from '@/middleware/rateLimiter.js';
import { validate } from '@/middleware/validate.js';
import {
  createContactSchema,
  updateContactStatusSchema,
  contactIdSchema,
  bulkDeleteContactSchema
} from '@/schemas/contact.schema.js';

const router = Router();

/**
 * Contact Routes
 * Handles contact form submissions and management
 */

// Public routes
router.post('/', authLimiter, validate(createContactSchema), submitContactForm);

// Protected routes (require authentication)
router.use(authenticateToken);

// Contact management routes
router.get('/export', requireRole(['admin']), exportContacts);
router.get('/submissions', requireRole(['admin', 'moderator']), getContactSubmissions);

router.get('/submissions/:id',
  requireRole(['admin', 'moderator']),
  validate(contactIdSchema),
  getContactSubmissionById
);

router.patch('/submissions/:id/status',
  requireRole(['admin', 'moderator']),
  validate(updateContactStatusSchema),
  updateContactSubmissionStatus
);

router.patch('/submissions/:id/contacted',
  requireRole(['admin', 'moderator']),
  validate(contactIdSchema),
  markContactAsContacted
);

router.delete('/submissions/:id',
  requireRole(['admin']),
  validate(contactIdSchema),
  deleteContactSubmission
);

router.post('/submissions/bulk-delete',
  requireRole(['admin']),
  validate(bulkDeleteContactSchema),
  bulkDeleteContacts
);

// Statistics and analytics routes
router.get('/stats', requireRole(['admin', 'moderator']), getContactStats);
router.get('/by-service/:service', requireRole(['admin', 'moderator']), getContactsByService);

export default router;
