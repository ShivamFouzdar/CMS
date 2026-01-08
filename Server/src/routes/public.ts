import { Router } from 'express';
import { getPublicSettings } from '@/controllers/publicController';

const router = Router();

/**
 * Public Routes
 * Accessible without authentication
 */

router.get('/settings', getPublicSettings);

export default router;
