import { Request, Response } from 'express';
import { asyncHandler, createError } from '@/utils/helpers';
import { sendSuccess } from '@/utils/response.utils';
import { ReviewService, ReviewFilters } from '@/services/review.service';

/**
 * Reviews Controller
 * Handles testimonials and reviews management
 */

// Initialize Service
const reviewService = new ReviewService();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Testimonials and Customer Reviews
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all published reviews
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: rating
 *         schema: { type: integer, minimum: 1, maximum: 5 }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of reviews retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 */
export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = '1',
    limit = '10',
    category,
    rating,
    search,
    sort = 'date',
    order = 'desc',
    isPublished = 'true'
  } = req.query;

  const filters: ReviewFilters = {
    page: parseInt(page.toString()),
    limit: parseInt(limit.toString()),
    category: category?.toString(),
    rating: rating ? parseInt(rating.toString()) : undefined,
    search: search?.toString(),
    sort: sort.toString(),
    order: order.toString() as any,
    isPublished: isPublished === 'true'
  };

  const result = await reviewService.getReviews(filters);

  return sendSuccess(res, `Retrieved ${result.reviews.length} reviews`, result.reviews);
});

/**
 * @swagger
 * /api/reviews/all:
 *   get:
 *     summary: Get all reviews (including unpublished - Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All reviews retrieved
 */
export const getAllReviewsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = '1',
    limit = '10',
    category,
    rating,
    search,
    sort = 'createdAt',
    order = 'desc',
    isPublished,
    status
  } = req.query;

  const filters: ReviewFilters = {
    page: parseInt(page.toString()),
    limit: parseInt(limit.toString()),
    category: category?.toString(),
    rating: rating ? parseInt(rating.toString()) : undefined,
    search: search?.toString(),
    sort: sort.toString(),
    order: order.toString() as any,
  };

  if (isPublished !== undefined) {
    filters.isPublished = isPublished === 'true';
  } else if (status === 'published') {
    filters.isPublished = true;
  } else if (status === 'pending') {
    filters.isPublished = false;
  }

  const result = await reviewService.getAllReviews(filters);
  return sendSuccess(res, `Retrieved ${result.reviews.length} reviews`, result.reviews);
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 */
export const getReviewById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('Review ID is required', 400);
  }

  const review = await reviewService.getReviewById(id);
  return sendSuccess(res, 'Review retrieved successfully', review);
});

/**
 * @swagger
 * /api/reviews/category/{category}:
 *   get:
 *     summary: Get reviews by category
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Reviews retrieved
 */
export const getReviewsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;
  const { limit = '10' } = req.query;

  if (!category) {
    throw createError('Category is required', 400);
  }

  const reviews = await reviewService.getReviewsByCategory(category, parseInt(limit.toString()));
  return sendSuccess(res, `Retrieved ${reviews.length} reviews for ${category}`, reviews);
});

/**
 * @swagger
 * /api/reviews/stats:
 *   get:
 *     summary: Get review statistics
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Review statistics retrieved
 */
export const getReviewStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await reviewService.getReviewStatistics();
  return sendSuccess(res, 'Review statistics retrieved successfully', stats);
});

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Submit a new review (Public)
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review submitted successfully
 */
export const submitReview = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, role, content, rating, category, image } = req.body;

  const review = await reviewService.createReview({
    name,
    email,
    role,
    content,
    rating,
    category,
    image
  });

  // Send notification to admins (non-blocking)
  try {
    const { notifyNewReview } = await import('@/services/notification.service');
    notifyNewReview({
      reviewerName: name,
      company: role || 'N/A',
      rating: rating || 5,
      category: category || 'General',
    }).catch(err => console.error('Notification error:', err));
  } catch (notifError) {
    console.error('Failed to send notification:', notifError);
  }

  return sendSuccess(res, 'Thank you for your review! It will be published after moderation.', {
    id: review._id,
    submittedAt: review.createdAt,
  }, 201);
});

/**
 * @swagger
 * /api/reviews/{id}/status:
 *   patch:
 *     summary: Update review status (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Status updated
 */
export const updateReviewStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isPublished, isVerified, isFeatured } = req.body;

  if (!id) {
    throw createError('Review ID is required', 400);
  }

  const review = await reviewService.updateReviewStatus(id, {
    isPublished,
    isVerified,
    isFeatured
  });

  return sendSuccess(res, 'Review status updated successfully', review);
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   patch:
 *     summary: Update review details (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review updated
 */
export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, role, content, rating, category, image } = req.body;

  if (!id) {
    throw createError('Review ID is required', 400);
  }

  const review = await reviewService.updateReview(id, {
    name,
    role,
    content,
    rating,
    category,
    image
  });

  return sendSuccess(res, 'Review updated successfully', review);
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete review (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review deleted
 */
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('Review ID is required', 400);
  }

  await reviewService.deleteReview(id);
  return sendSuccess(res, 'Review deleted successfully');
});

/**
 * @swagger
 * /api/reviews/featured:
 *   get:
 *     summary: Get featured reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Featured reviews retrieved
 */
export const getFeaturedReviews = asyncHandler(async (req: Request, res: Response) => {
  const { limit = '5' } = req.query;
  const reviews = await reviewService.getFeaturedReviews(parseInt(limit.toString()));
  return sendSuccess(res, `Retrieved ${reviews.length} featured reviews`, reviews);
});

/**
 * @swagger
 * /api/reviews/recent:
 *   get:
 *     summary: Get recent reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Recent reviews retrieved
 */
export const getRecentReviews = asyncHandler(async (req: Request, res: Response) => {
  const { limit = '10' } = req.query;
  const reviews = await reviewService.getRecentReviews(parseInt(limit.toString()));
  return sendSuccess(res, `Retrieved ${reviews.length} recent reviews`, reviews);
});

/**
 * @swagger
 * /api/reviews/{id}/response:
 *   patch:
 *     summary: Add admin response to review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Response added
 */
export const addReviewResponse = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, respondedBy } = req.body;

  if (!id) {
    throw createError('Review ID is required', 400);
  }

  if (!content || !respondedBy) {
    throw createError('Content and respondedBy are required', 400);
  }

  const review = await reviewService.addReviewResponse(id, content, respondedBy);
  return sendSuccess(res, 'Review response added successfully', review);
});

/**
 * @swagger
 * /api/reviews/{id}/vote:
 *   post:
 *     summary: Vote on review helpfulness
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Vote recorded
 */
export const voteReviewHelpful = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { helpful } = req.body;

  if (!id) {
    throw createError('Review ID is required', 400);
  }

  if (typeof helpful !== 'boolean') {
    throw createError('Helpful field must be a boolean', 400);
  }

  const result = await reviewService.voteReviewHelpful(id, helpful);
  return sendSuccess(res, 'Vote recorded successfully', result);
});
