
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
import { authenticateToken, requireRole } from '@/middleware/auth';
import { validate, ValidationRule } from '@/middleware/validate';

const router = Router();

/**
 * Authentication Routes
 * Handles authentication, token management and validation
 */

const loginRules: ValidationRule[] = [
  { field: 'email', type: 'email', required: true, message: 'Valid email is required' },
  { field: 'password', type: 'string', required: true, message: 'Password is required' }
];

const registerRules: ValidationRule[] = [
  { field: 'firstName', type: 'string', required: true, min: 2, message: 'First name is required (min 2 chars)' },
  { field: 'lastName', type: 'string', required: true, min: 2, message: 'Last name is required (min 2 chars)' },
  { field: 'email', type: 'email', required: true, message: 'Valid email is required' },
  { field: 'password', type: 'string', required: true, min: 8, message: 'Password is required (min 8 chars)' },
  // role is optional
];

const refreshRules: ValidationRule[] = [
  { field: 'refreshToken', type: 'string', required: true, message: 'Refresh token is required' }
];

const validateTokenRules: ValidationRule[] = [
  { field: 'token', type: 'string', required: true, message: 'Token is required' }
];

// Public routes
router.post('/login', validate(loginRules), login);
router.post('/logout', logout); // Can be called without auth
router.post('/refresh', validate(refreshRules), refreshToken);
router.post('/validate', validate(validateTokenRules), validateToken);

// Protected routes (require authentication)
router.use(authenticateToken);

// Administrative routes
router.post('/register', requireRole(['super_admin']), validate(registerRules), register);

// User management routes
router.get('/me', getCurrentUser);

// Token management routes
router.post('/revoke', revokeToken);
router.get('/info', getTokenInfo);

export default router;
