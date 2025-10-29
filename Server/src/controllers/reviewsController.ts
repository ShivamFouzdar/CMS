import { Request, Response } from 'express';
import { asyncHandler, createError } from '@/utils/helpers';
import { ApiResponse } from '@/types';
import * as reviewsService from '@/services/reviewsService';

/**
 * Reviews Controller
 * Handles testimonials and reviews management
 */

/**
 * Get all published reviews
 * GET /api/reviews
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

  const isPublishedStr = isPublished?.toString();
  const isPublishedValue = isPublishedStr === 'true';

  const filters: reviewsService.ReviewFilters = {
    page: parseInt(page.toString()),
    limit: parseInt(limit.toString()),
    category: category?.toString(),
    rating: rating ? parseInt(rating.toString()) : undefined,
    search: search?.toString(),
    sort: sort.toString(),
    order: order.toString() as 'asc' | 'desc',
    isPublished: isPublishedValue
  };

  const result = await reviewsService.getReviews(filters);
  
  const response: ApiResponse = {
    success: true,
    data: result.reviews,
    message: `Retrieved ${result.reviews.length} reviews`,
    meta: {
      pagination: result.pagination
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get all reviews (including unpublished - Admin only)
 * GET /api/reviews/all
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
    isPublished
  } = req.query;

  const filters: reviewsService.ReviewFilters = {
    page: parseInt(page.toString()),
    limit: parseInt(limit.toString()),
    category: category?.toString(),
    rating: rating ? parseInt(rating.toString()) : undefined,
    search: search?.toString(),
    sort: sort.toString(),
    order: order.toString() as 'asc' | 'desc',
  };

  if (isPublished !== undefined) {
    const isPublishedStr = isPublished.toString();
    filters.isPublished = isPublishedStr === 'true';
  }

  const result = await reviewsService.getAllReviews(filters);
  
  const response: ApiResponse = {
    success: true,
    data: result.reviews,
    message: `Retrieved ${result.reviews.length} reviews`,
    meta: {
      pagination: result.pagination
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get review by ID
 * GET /api/reviews/:id
 */
export const getReviewById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw createError('Review ID is required', 400);
  }
  
  const review = await reviewsService.getReviewById(id);
  
  const response: ApiResponse = {
    success: true,
    data: review,
    message: 'Review retrieved successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get reviews by category
 * GET /api/reviews/category/:category
 */
export const getReviewsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;
  const { limit = '10' } = req.query;

  if (!category) {
    throw createError('Category is required', 400);
  }
  
  const reviews = await reviewsService.getReviewsByCategory(category, parseInt(limit.toString()));

  const response: ApiResponse = {
    success: true,
    data: reviews,
    message: `Retrieved ${reviews.length} reviews for ${category}`,
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get review statistics
 * GET /api/reviews/stats
 */
export const getReviewStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await reviewsService.getReviewStatistics();

  const response: ApiResponse = {
    success: true,
    data: stats,
    message: 'Review statistics retrieved successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Submit a new review (Public)
 * POST /api/reviews
 */
export const submitReview = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, role, content, rating, category, image } = req.body;

  const review = await reviewsService.createReview({
    name,
    email,
    role,
    content,
    rating,
    category,
    image
  });

  const response: ApiResponse = {
    success: true,
    message: 'Thank you for your review! It will be published after moderation.',
    data: {
      id: review._id,
      submittedAt: review.createdAt,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(201).json(response);
});

/**
 * Update review status (Admin only)
 * PATCH /api/reviews/:id/status
 */
export const updateReviewStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isPublished, isVerified, isFeatured } = req.body;

  if (!id) {
    throw createError('Review ID is required', 400);
  }
  
  const review = await reviewsService.updateReviewStatus(id, {
    isPublished,
    isVerified,
    isFeatured
  });

  const response: ApiResponse = {
    success: true,
    data: review,
    message: 'Review status updated successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Update review (Admin only)
 * PATCH /api/reviews/:id
 */
export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, role, content, rating, category, image } = req.body;

  if (!id) {
    throw createError('Review ID is required', 400);
  }
  
  const review = await reviewsService.updateReview(id, {
    name,
    role,
    content,
    rating,
    category,
    image
  });

  const response: ApiResponse = {
    success: true,
    data: review,
    message: 'Review updated successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Delete review (Admin only)
 * DELETE /api/reviews/:id
 */
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('Review ID is required', 400);
  }
  
  await reviewsService.deleteReview(id);

  const response: ApiResponse = {
    success: true,
    message: 'Review deleted successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get featured reviews
 * GET /api/reviews/featured
 */
export const getFeaturedReviews = asyncHandler(async (req: Request, res: Response) => {
  const { limit = '5' } = req.query;
  
  const reviews = await reviewsService.getFeaturedReviews(parseInt(limit.toString()));

  const response: ApiResponse = {
    success: true,
    data: reviews,
    message: `Retrieved ${reviews.length} featured reviews`,
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get recent reviews
 * GET /api/reviews/recent
 */
export const getRecentReviews = asyncHandler(async (req: Request, res: Response) => {
  const { limit = '10' } = req.query;
  
  const reviews = await reviewsService.getRecentReviews(parseInt(limit.toString()));

  const response: ApiResponse = {
    success: true,
    data: reviews,
    message: `Retrieved ${reviews.length} recent reviews`,
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Add admin response to review
 * PATCH /api/reviews/:id/response
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

  const review = await reviewsService.addReviewResponse(id, content, respondedBy);

  const response: ApiResponse = {
    success: true,
    data: review,
    message: 'Review response added successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Vote on review helpfulness
 * POST /api/reviews/:id/vote
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

  const result = await reviewsService.voteReviewHelpful(id, helpful);

  const response: ApiResponse = {
    success: true,
    data: result,
    message: 'Vote recorded successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});
