import { Router } from 'express';
import {
  getDashboardStats,
  getSystemHealth,
  getRecentActivity,
  getAnalytics,
  exportData,
  getSystemLogs,
  updateSystemSettings,
  getSystemSettings,
  backupDatabase,
  restoreDatabase,
  getDatabaseStats,
  getServerMetrics,
  testSmtpConnection
} from '@/controllers/adminController';
import { authenticateToken, requireRole } from '@/middleware/auth';

const router = Router();

/**
 * Admin Routes
 * Handles admin dashboard and system management
 */

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole(['admin']));

// Dashboard routes
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);
router.get('/activity', getRecentActivity);

// System management routes
router.get('/health', getSystemHealth);
router.get('/metrics', getServerMetrics);
router.get('/logs', getSystemLogs);
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);
router.post('/settings/test-smtp', testSmtpConnection);

// Database management routes
router.get('/database/stats', getDatabaseStats);
router.get('/database/backup', backupDatabase);
router.post('/database/restore', restoreDatabase);

// Data export routes
router.get('/export/contacts', exportData('contacts'));
router.get('/export/reviews', exportData('reviews'));
router.get('/export/services', exportData('services'));
router.get('/export/users', exportData('users'));

export default router;
