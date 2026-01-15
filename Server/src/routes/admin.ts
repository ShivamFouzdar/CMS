import { Router } from 'express';
import {
  getDashboardStats,
  getSystemHealth,
  getRecentActivity,
  getAnalytics,
  exportData,
  getSystemLogs,
  clearSystemLogs,
  updateSystemSettings,
  getSystemSettings,
  backupDatabase,
  restoreDatabase,
  getDatabaseStats,
  getServerMetrics,
  testSmtpConnection
} from '@/controllers/admin.controller.js';
import { authenticateToken, requireRole } from '@/middleware/auth.js';

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
router.delete('/logs', requireRole(['super_admin']), clearSystemLogs);
router.get('/settings', getSystemSettings);
router.put('/settings', requireRole(['super_admin']), updateSystemSettings);
router.post('/settings/test-smtp', requireRole(['super_admin']), testSmtpConnection);

// Database management routes
router.get('/database/stats', getDatabaseStats);
router.get('/database/backup', backupDatabase);
router.post('/database/restore', requireRole(['super_admin']), restoreDatabase);

// Data export routes
router.get('/export/contacts', exportData('contacts'));
router.get('/export/reviews', exportData('reviews'));
router.get('/export/services', exportData('services'));
router.get('/export/users', exportData('users'));

export default router;
