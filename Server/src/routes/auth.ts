
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
import { z } from 'zod';
import { authLimiter } from '@/middleware/rateLimiter';
import { validate } from '@/middleware/validate';

const router = Router();

/**
 * Authentication Routes
 * Handles authentication, token management and validation
 */

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(1, 'Password is required')
  })
});

const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name is required (min 2 chars)'),
    lastName: z.string().min(2, 'Last name is required (min 2 chars)'),
    email: z.string().email('Valid email is required'),
    password: z.string().min(8, 'Password is required (min 8 chars)'),
    role: z.string().optional()
  })
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
  })
});

const validateTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required')
  })
});

// Public routes
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', logout); // Can be called without auth
router.post('/refresh', validate(refreshSchema), refreshToken);
router.post('/validate', validate(validateTokenSchema), validateToken);

// Protected routes (require authentication)
router.use(authenticateToken);

// Administrative routes
router.post('/register', requireRole(['super_admin']), authLimiter, validate(registerSchema), register);

// User management routes
router.get('/me', getCurrentUser);

// Token management routes
router.post('/revoke', revokeToken);
router.get('/info', getTokenInfo);

export default router;
