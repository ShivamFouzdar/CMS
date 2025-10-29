import { Router } from 'express';
import { 
  login,
  register,
  logout,
  getCurrentUser,
  refreshToken,
  validateToken,
  revokeToken,
  getTokenInfo
} from '@/controllers/authController';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

/**
 * Authentication Routes
 * Handles authentication, token management and validation
 */

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout); // Can be called without auth
router.post('/refresh', refreshToken);
router.post('/validate', validateToken);

// Protected routes (require authentication)
router.use(authenticateToken);

// User management routes
router.get('/me', getCurrentUser);

// Token management routes
router.post('/revoke', revokeToken);
router.get('/info', getTokenInfo);

export default router;
