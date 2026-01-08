
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
import { validate, ValidationRule } from '@/middleware/validate';

const router = Router();

/**
 * Services Routes
 * Handles business services management
 */

// Validation Rules
const createServiceRules: ValidationRule[] = [
  { field: 'name', type: 'string', required: true, min: 2, max: 100 },
  { field: 'slug', type: 'string', required: true, min: 2, max: 50, pattern: /^[a-z0-9-]+$/ },
  { field: 'description', type: 'string', required: true, min: 50, max: 2000 },
  { field: 'shortDescription', type: 'string', required: true, min: 20, max: 200 },
  { field: 'category', type: 'string', required: true },
  { field: 'icon', type: 'string', required: true, max: 50 },
  { field: 'features', type: 'array', required: false },
  { field: 'benefits', type: 'array', required: false }
];

const updateServiceRules: ValidationRule[] = [
  { field: 'name', type: 'string', required: false, min: 2, max: 100 },
  { field: 'slug', type: 'string', required: false, min: 2, max: 50, pattern: /^[a-z0-9-]+$/ },
  { field: 'description', type: 'string', required: false, min: 50, max: 2000 },
  { field: 'shortDescription', type: 'string', required: false, min: 20, max: 200 },
  { field: 'category', type: 'string', required: false },
  { field: 'icon', type: 'string', required: false, max: 50 }
];

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
router.post('/', requireRole(['admin']), validate(createServiceRules), createService);
router.put('/:id', requireRole(['admin']), validate(updateServiceRules), updateService);
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
