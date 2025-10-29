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

const router = Router();

/**
 * Users Routes
 * Handles user authentication and management
 */

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);

// Protected routes (require authentication)
router.use(authenticateToken);

// User profile routes
router.get('/me', getCurrentUser);
router.put('/me/profile', updateUserProfile);
router.put('/me/preferences', updateUserPreferences);
router.put('/me/password', changePassword);

// User management routes (admin only)
router.get('/', requireRole(['admin']), getAllUsers);
router.get('/stats', requireRole(['admin']), getUserStats);
router.get('/:id', requireRole(['admin']), getUserById);
router.put('/:id', requireRole(['admin']), updateUser);
router.delete('/:id', requireRole(['admin']), deleteUser);
router.patch('/:id/activate', requireRole(['admin']), activateUser);
router.patch('/:id/deactivate', requireRole(['admin']), deactivateUser);

export default router;
