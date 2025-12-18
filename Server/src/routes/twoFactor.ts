import { Router } from 'express';
import {
  enableTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
  verifyTwoFactorLogin,
  regenerateBackupCodes,
} from '@/controllers/twoFactorController';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

/**
 * Two-Factor Authentication Routes
 */

// 2FA verification during login (public route - uses temp token)
router.post('/verify-login', verifyTwoFactorLogin);

// All other routes require authentication
router.use(authenticateToken);

// 2FA management routes
router.post('/enable', enableTwoFactor);
router.post('/verify', verifyTwoFactor);
router.post('/disable', disableTwoFactor);
router.post('/regenerate-backup-codes', regenerateBackupCodes);

export default router;

