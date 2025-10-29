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
  unfeatureService
} from '@/controllers/servicesController';
import { authenticateToken, requireRole } from '@/middleware/auth';

const router = Router();

/**
 * Services Routes
 * Handles business services management
 */

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
router.post('/', requireRole(['admin']), createService);
router.put('/:id', requireRole(['admin']), updateService);
router.delete('/:id', requireRole(['admin']), deleteService);

// Service status management
router.patch('/:id/activate', requireRole(['admin']), activateService);
router.patch('/:id/deactivate', requireRole(['admin']), deactivateService);
router.patch('/:id/feature', requireRole(['admin']), featureService);
router.patch('/:id/unfeature', requireRole(['admin']), unfeatureService);

// Statistics route
router.get('/stats', requireRole(['admin', 'moderator']), getServiceStats);

export default router;
