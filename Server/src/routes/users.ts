import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserProfile,
  updateUserPreferences,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  getUserStats,
  resetPassword,
  forgotPassword,
  verifyEmail
} from '@/controllers/usersController';
import { authenticateToken, requireRole } from '@/middleware/auth';
import { z } from 'zod';
import { authLimiter } from '@/middleware/rateLimiter';
import { validate } from '@/middleware/validate';

const router = Router();

/**
 * Users Routes
 * Handles user authentication and management
 */

// Validation Rules
const registerUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    password: z.string().min(8, 'Password is required (min 8 chars)')
  })
});

const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(1, 'Password is required')
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
    newPassword: z.string().min(8, 'New password is required (min 8 chars)')
  })
});

const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required')
  })
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password is required (min 8 chars)')
  })
});

const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional()
  })
});

const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    role: z.string().min(2).optional()
  })
});

// Public routes
router.post('/register', authLimiter, validate(registerUserSchema), registerUser);
router.post('/login', authLimiter, validate(loginUserSchema), loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);

// Protected routes (require authentication)
router.use(authenticateToken);

// User profile routes
router.get('/me', getCurrentUser);
router.put('/me/profile', validate(updateProfileSchema), updateUserProfile);
router.put('/me/preferences', updateUserPreferences); // Loose validation for object structure
router.put('/me/password', validate(changePasswordSchema), changePassword);

// User management routes (admin only)
router.get('/', requireRole(['admin']), getAllUsers);
router.get('/stats', requireRole(['admin']), getUserStats);
router.get('/:id', requireRole(['admin']), getUserById);
router.put('/:id', requireRole(['admin']), validate(updateUserSchema), updateUser);
router.delete('/:id', requireRole(['admin']), deleteUser);
router.patch('/:id/activate', requireRole(['admin']), activateUser);
router.patch('/:id/deactivate', requireRole(['admin']), deactivateUser);

export default router;
