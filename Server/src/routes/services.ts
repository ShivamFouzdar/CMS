import { Router } from 'express';
import {
  getServices,
  getServiceBySlug,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceCategories,
  getFeaturedServices,
  getServicesByCategory,
  getServiceStats,
  activateService,
  deactivateService,
  featureService,
  unfeatureService,
  getAdminServices,
  toggleServiceStatus
} from '@/controllers/servicesController';
import { authenticateToken, requireRole } from '@/middleware/auth';
import { z } from 'zod';
import { validate } from '@/middleware/validate';

const router = Router();

/**
 * Services Routes
 * Handles business services management
 */

// Validation Rules
const createServiceSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
    description: z.string().min(50).max(2000),
    shortDescription: z.string().min(20).max(200),
    category: z.string().min(1),
    icon: z.string().max(50),
    features: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional()
  })
});

const updateServiceSchema = z.object({
  body: createServiceSchema.shape.body.partial()
});

// Public routes
router.get('/', getServices);
router.get('/categories', getServiceCategories);
router.get('/featured', getFeaturedServices);
router.get('/category/:category', getServicesByCategory);
router.get('/slug/:slug', getServiceBySlug);
router.get('/id/:id', getServiceById);

// Protected routes (require authentication)
router.use(authenticateToken);

// Service management routes
router.post('/', requireRole(['admin']), validate(createServiceSchema), createService);
router.put('/:id', requireRole(['admin']), validate(updateServiceSchema), updateService);
router.delete('/:id', requireRole(['admin']), deleteService);

// Status management
router.patch('/:id/status', requireRole(['admin']), toggleServiceStatus);
router.patch('/:id/activate', requireRole(['admin']), activateService);
router.patch('/:id/deactivate', requireRole(['admin']), deactivateService);
router.patch('/:id/feature', requireRole(['admin']), featureService);
router.patch('/:id/unfeature', requireRole(['admin']), unfeatureService);

// Admin-only data retrieval
router.get('/admin', requireRole(['admin']), getAdminServices);

// Statistics route
router.get('/stats', requireRole(['admin', 'moderator']), getServiceStats);

export default router;
