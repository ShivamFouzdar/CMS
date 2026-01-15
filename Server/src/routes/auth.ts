
import { Router } from 'express';
import {
  login,
  register,
  logout,
  getCurrentUser,
  refreshToken,
  validateToken,
  revokeToken,
  getTokenInfo,
  forgotPassword,
  resetPassword,
  setup2FA,
  verify2FA,
  verify2FALogin,
} from '@/controllers/auth.controller.js';
import { authenticateToken, requireRole } from '@/middleware/auth.js';
import { z } from 'zod';
import { authLimiter } from '@/middleware/rateLimiter.js';
import { validate } from '@/middleware/validate.js';

const router = Router();

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1)
  })
});

const validateTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1)
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

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required')
  })
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    userId: z.string().min(1, 'User ID is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters')
  })
});

const verify2FASchema = z.object({
  body: z.object({
    code: z.string().length(6, 'Verification code must be 6 digits')
  })
});

const verify2FALoginSchema = z.object({
  body: z.object({
    tempToken: z.string().min(1, 'Temporary token is required'),
    code: z.string().optional(),
    backupCode: z.string().optional()
  }).refine((data) => data.code || data.backupCode, {
    message: "Either verification code or backup code is required",
    path: ["code"]
  })
});

// Public routes
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', logout); // Can be called without auth
router.post('/refresh', validate(refreshSchema), refreshToken);
router.post('/validate', validate(validateTokenSchema), validateToken);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);
router.post('/2fa/verify-login', authLimiter, validate(verify2FALoginSchema), verify2FALogin);

// Protected routes (require authentication)
router.use(authenticateToken);

// 2FA Routes
router.post('/2fa/enable', setup2FA);
router.post('/2fa/verify', validate(verify2FASchema), verify2FA);

// Administrative routes
router.post('/register', requireRole(['super_admin']), authLimiter, validate(registerSchema), register);

// User management routes
router.get('/me', getCurrentUser);

// Token management routes
router.post('/revoke', revokeToken);
router.get('/info', getTokenInfo);

export default router;
