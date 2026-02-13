
import { Router } from 'express';
import {
  submitJobApplication,
  getJobApplications,
  getJobApplicationById,
  getJobApplicationStats,
  downloadResume,
  deleteJobApplication,
  bulkDeleteJobApplications,
  exportApplications
} from '@/controllers/jobApplication.controller.js';
import { authenticateToken } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import { uploadResume } from '@/middleware/upload.js';
import {
  createJobApplicationSchema,
  jobApplicationIdSchema,
  bulkDeleteJobApplicationSchema
} from '@/schemas/jobApplication.schema.js';

const router = Router();

/**
 * Job Application Routes
 * Handles job application submissions and management
 */

// Public route for submitting applications
// uploadResume must come first to parse multipart/form-data
router.post('/', uploadResume.single('resume'), validate(createJobApplicationSchema), submitJobApplication);

// Protected routes (require authentication)
router.use(authenticateToken);

// Job application management routes
router.get('/export', exportApplications);
router.get('/submissions', getJobApplications);

router.get('/submissions/:id',
  validate(jobApplicationIdSchema),
  getJobApplicationById
);

router.get('/submissions/:id/resume',
  validate(jobApplicationIdSchema),
  downloadResume
);

router.delete('/submissions/:id',
  validate(jobApplicationIdSchema),
  deleteJobApplication
);

router.post('/submissions/bulk-delete',
  validate(bulkDeleteJobApplicationSchema),
  bulkDeleteJobApplications
);

// Statistics routes
router.get('/stats', getJobApplicationStats);

export default router;
