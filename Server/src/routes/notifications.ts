import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '@/controllers/notification.controller.js';
import { authenticateToken, requireRole } from '@/middleware/auth.js';

const router = Router();

// Protect all routes
router.use(authenticateToken);
router.use(requireRole(['admin', 'super_admin', 'moderator']));

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);

export default router;
