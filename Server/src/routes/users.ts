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
  getUserStats
} from '@/controllers/users.controller.js';
import { authenticateToken, requireRole } from '@/middleware/auth.js';
import { z } from 'zod';
import { authLimiter } from '@/middleware/rateLimiter.js';
import { validate } from '@/middleware/validate.js';

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

// Specific ID actions (Must be before generic /:id)
router.patch('/:id/activate', requireRole(['super_admin']), activateUser);
router.patch('/:id/deactivate', requireRole(['super_admin']), deactivateUser);

// Generic ID operations
router.get('/:id', requireRole(['admin']), getUserById);
router.put('/:id', requireRole(['super_admin']), validate(updateUserSchema), updateUser);
router.patch('/:id', requireRole(['super_admin']), validate(updateUserSchema), updateUser);
router.delete('/:id', requireRole(['super_admin']), deleteUser);

export default router;
