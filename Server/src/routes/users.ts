
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
import { validate, ValidationRule } from '@/middleware/validate';

const router = Router();

/**
 * Users Routes
 * Handles user authentication and management
 */

// Validation Rules
const registerRules: ValidationRule[] = [
  { field: 'firstName', type: 'string', required: true, min: 2, message: 'First name is required' },
  { field: 'lastName', type: 'string', required: true, min: 2, message: 'Last name is required' },
  { field: 'email', type: 'email', required: true, message: 'Valid email is required' },
  { field: 'password', type: 'string', required: true, min: 8, message: 'Password is required (min 8 chars)' }
];

const loginRules: ValidationRule[] = [
  { field: 'email', type: 'email', required: true, message: 'Valid email is required' },
  { field: 'password', type: 'string', required: true, message: 'Password is required' }
];

const forgotPasswordRules: ValidationRule[] = [
  { field: 'email', type: 'email', required: true, message: 'Valid email is required' }
];

const resetPasswordRules: ValidationRule[] = [
  { field: 'token', type: 'string', required: true, message: 'Token is required' },
  { field: 'newPassword', type: 'string', required: true, min: 8, message: 'New password is required (min 8 chars)' }
];

const verifyEmailRules: ValidationRule[] = [
  { field: 'token', type: 'string', required: true, message: 'Token is required' }
];

const changePasswordRules: ValidationRule[] = [
  { field: 'currentPassword', type: 'string', required: true, message: 'Current password is required' },
  { field: 'newPassword', type: 'string', required: true, min: 8, message: 'New password is required (min 8 chars)' }
];

const updateProfileRules: ValidationRule[] = [
  // Optional fields
  { field: 'firstName', type: 'string', required: false, min: 2 },
  { field: 'lastName', type: 'string', required: false, min: 2 },
  // Only allow updating basic profile fields here
];

const updateUserRules: ValidationRule[] = [
  { field: 'email', type: 'email', required: false },
  { field: 'role', type: 'string', required: false, min: 2 } // rudimentary check
];

// Public routes
router.post('/register', validate(registerRules), registerUser);
router.post('/login', validate(loginRules), loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', validate(forgotPasswordRules), forgotPassword);
router.post('/reset-password', validate(resetPasswordRules), resetPassword);
router.post('/verify-email', validate(verifyEmailRules), verifyEmail);

// Protected routes (require authentication)
router.use(authenticateToken);

// User profile routes
router.get('/me', getCurrentUser);
router.put('/me/profile', validate(updateProfileRules), updateUserProfile);
router.put('/me/preferences', updateUserPreferences); // Loose validation for object structure
router.put('/me/password', validate(changePasswordRules), changePassword);

// User management routes (admin only)
router.get('/', requireRole(['admin']), getAllUsers);
router.get('/stats', requireRole(['admin']), getUserStats);
router.get('/:id', requireRole(['admin']), getUserById);
router.put('/:id', requireRole(['admin']), validate(updateUserRules), updateUser);
router.delete('/:id', requireRole(['admin']), deleteUser);
router.patch('/:id/activate', requireRole(['admin']), activateUser);
router.patch('/:id/deactivate', requireRole(['admin']), deactivateUser);

export default router;
