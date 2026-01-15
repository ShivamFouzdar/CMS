import { Router } from 'express';
import {
  getReviews,
  getAllReviewsAdmin,
  getReviewById,
  getReviewsByCategory,
  getReviewStats,
  submitReview,
  updateReview,
  updateReviewStatus,
  deleteReview,
  getFeaturedReviews,
  getRecentReviews,
  addReviewResponse,
  voteReviewHelpful,
  bulkDeleteReviews
} from '@/controllers/review.controller.js';
import { authenticateToken, requireRole } from '@/middleware/auth.js';

const router = Router();

/**
 * Reviews Routes
 * Handles customer testimonials and reviews
 */

// Public routes (specific routes first)
router.get('/', getReviews);
router.get('/stats', getReviewStats);
router.get('/featured', getFeaturedReviews);
router.get('/recent', getRecentReviews);
router.get('/category/:category', getReviewsByCategory);
router.post('/', submitReview);
router.post('/:id/vote', voteReviewHelpful);

// Protected admin routes (specific routes that might conflict with /:id)
router.get('/all', authenticateToken, requireRole(['admin', 'moderator']), getAllReviewsAdmin);
router.patch('/:id/status', authenticateToken, requireRole(['admin', 'moderator']), updateReviewStatus);
router.patch('/:id/response', authenticateToken, requireRole(['admin', 'moderator']), addReviewResponse);
router.patch('/:id', authenticateToken, requireRole(['admin', 'moderator']), updateReview);
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteReview);
router.post('/bulk-delete', authenticateToken, requireRole(['admin']), bulkDeleteReviews);

// Public get by ID - must be last to avoid conflicts
router.get('/:id', getReviewById);

export default router;
