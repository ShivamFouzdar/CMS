import { createError, validateEmail, sanitizeInput } from '@/utils/helpers';
import { Review, IReview } from '@/models/Review';

/**
 * Reviews Service
 * Handles business logic for reviews and testimonials using the database
 */

export interface ReviewFilters {
  page?: number;
  limit?: number;
  category?: string | undefined;
  rating?: number | undefined;
  search?: string | undefined;
  sort?: string;
  order?: string;
  isPublished?: boolean | undefined;
}

/**
 * Get all reviews with filters
 */
export const getReviews = async (filters: ReviewFilters = {}) => {
  try {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    // Filter by published status
    if (filters.isPublished !== undefined) {
      query.isPublished = filters.isPublished;
    } else {
      query.isPublished = true; // Only return published reviews by default
    }

    // Filter by category
    if (filters.category) {
      query.category = { $regex: new RegExp(filters.category, 'i') };
    }

    // Filter by rating
    if (filters.rating) {
      query.rating = { $gte: parseInt(filters.rating.toString()) };
    }

    // Search filter
    if (filters.search) {
      query.$or = [
        { name: { $regex: new RegExp(filters.search, 'i') } },
        { content: { $regex: new RegExp(filters.search, 'i') } },
        { role: { $regex: new RegExp(filters.search, 'i') } },
        { category: { $regex: new RegExp(filters.search, 'i') } }
      ];
    }

    // Validate sort field
    const validSortFields = ['createdAt', 'updatedAt', 'date', 'name', 'rating', 'category'];
    const sortField = filters.sort || 'date';
    const safeSortField = validSortFields.includes(sortField) ? sortField : 'date';
    const sortOrder = filters.order === 'asc' ? 1 : -1;
    const sort: any = { [safeSortField]: sortOrder };

    // Execute query
    const reviews = await Review.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Review.countDocuments(query);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error in getReviews:', error);
    return {
      reviews: [],
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 10,
        total: 0,
        totalPages: 0
      }
    };
  }
};

/**
 * Get all reviews (including unpublished - for admin)
 */
export const getAllReviews = async (filters: ReviewFilters = {}) => {
  try {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const query: any = {};

    // Filter by published status
    if (filters.isPublished !== undefined) {
      query.isPublished = filters.isPublished;
    }

    // Filter by category
    if (filters.category) {
      query.category = { $regex: new RegExp(filters.category, 'i') };
    }

    // Filter by rating
    if (filters.rating) {
      query.rating = { $gte: parseInt(filters.rating.toString()) };
    }

    // Search filter
    if (filters.search) {
      query.$or = [
        { name: { $regex: new RegExp(filters.search, 'i') } },
        { content: { $regex: new RegExp(filters.search, 'i') } },
        { role: { $regex: new RegExp(filters.search, 'i') } },
        { category: { $regex: new RegExp(filters.search, 'i') } }
      ];
    }

  // Build sort
  const sortField = filters.sort || 'createdAt';
  const sortOrder = filters.order === 'asc' ? 1 : -1;
  
  // Validate and create sort object
  const validSortFields = ['createdAt', 'updatedAt', 'date', 'name', 'rating', 'category'];
  const safeSortField = validSortFields.includes(sortField) ? sortField : 'createdAt';
  
  // For date field, use both date and createdAt as fallback
  const sort: any = { [safeSortField]: sortOrder };
  if (safeSortField === 'date') {
    sort.createdAt = sortOrder; // Secondary sort by createdAt
  }

    console.log('Query:', JSON.stringify(query, null, 2));
    console.log('Sort:', sort);

    // Execute query
    const reviews = await Review.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    console.log('Found reviews:', reviews.length);

    // Get total count
    const total = await Review.countDocuments(query);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error in getAllReviews:', error);
    // Return empty result instead of throwing
    return {
      reviews: [],
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 10,
        total: 0,
        totalPages: 0
      }
    };
  }
};

/**
 * Get review by ID
 */
export const getReviewById = async (id: string): Promise<IReview> => {
  const review = await Review.findById(id);

  if (!review) {
    throw createError('Review not found', 404);
  }

  return review;
};

/**
 * Create a new review
 */
export const createReview = async (data: {
  name: string;
  email: string;
  role?: string;
  content: string;
  rating: number;
  category: string;
  image?: string;
}): Promise<IReview> => {
  // Validation
  if (!data.name || !data.email || !data.content || !data.rating || !data.category) {
    throw createError('Name, email, content, rating, and category are required', 400);
  }

  if (!validateEmail(data.email)) {
    throw createError('Please provide a valid email address', 400);
  }

  if (data.rating < 1 || data.rating > 5) {
    throw createError('Rating must be between 1 and 5', 400);
  }

  // Sanitize inputs
  const sanitizedData = {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email).toLowerCase(),
    role: sanitizeInput(data.role || ''),
    content: sanitizeInput(data.content),
    category: sanitizeInput(data.category),
    rating: parseInt(data.rating.toString()),
    image: data.image || `/images/avatar-${Math.floor(Math.random() * 10) + 1}.jpg`,
    isVerified: false,
    isPublished: false // Requires admin approval
  };

  const review = new Review(sanitizedData);
  await review.save();

  return review;
};

/**
 * Update review status
 */
export const updateReviewStatus = async (
  id: string,
  updates: {
    isPublished?: boolean;
    isVerified?: boolean;
    isFeatured?: boolean;
  }
): Promise<IReview> => {
  const review = await Review.findById(id);

  if (!review) {
    throw createError('Review not found', 404);
  }

  if (updates.isPublished !== undefined) {
    review.isPublished = updates.isPublished;
  }

  if (updates.isVerified !== undefined) {
    review.isVerified = updates.isVerified;
  }

  if (updates.isFeatured !== undefined) {
    review.isFeatured = updates.isFeatured;
  }

  await review.save();
  return review;
};

/**
 * Update review
 */
export const updateReview = async (
  id: string,
  data: {
    name?: string;
    role?: string;
    content?: string;
    rating?: number;
    category?: string;
    image?: string;
  }
): Promise<IReview> => {
  const review = await Review.findById(id);

  if (!review) {
    throw createError('Review not found', 404);
  }

  if (data.name) review.name = sanitizeInput(data.name);
  if (data.role) review.role = sanitizeInput(data.role);
  if (data.content) review.content = sanitizeInput(data.content);
  if (data.rating) review.rating = parseInt(data.rating.toString());
  if (data.category) review.category = sanitizeInput(data.category);
  if (data.image) review.image = data.image;

  await review.save();
  return review;
};

/**
 * Delete review
 */
export const deleteReview = async (id: string): Promise<void> => {
  const review = await Review.findByIdAndDelete(id);

  if (!review) {
    throw createError('Review not found', 404);
  }
};

/**
 * Get reviews by category
 */
export const getReviewsByCategory = async (category: string, limit: number = 10): Promise<IReview[]> => {
  return await Review.find({ 
    category: { $regex: new RegExp(category, 'i') },
    isPublished: true 
  })
    .sort({ date: -1 })
    .limit(limit);
};

/**
 * Get review statistics
 */
export const getReviewStatistics = async () => {
  const stats = await Review.getStats();
  return stats;
};

/**
 * Get featured reviews
 */
export const getFeaturedReviews = async (limit: number = 5): Promise<IReview[]> => {
  try {
    const featured = await Review.getFeatured(limit);
    console.log('Featured reviews found:', featured.length);
    
    // If we don't have enough featured reviews, fall back to published reviews
    if (featured.length < limit) {
      const published = await Review.find({ 
        isPublished: true,
        _id: { $nin: featured.map(r => r._id) }
      })
        .sort({ date: -1, createdAt: -1 })
        .limit(limit - featured.length)
        .select('name role content rating image date category email isVerified isPublished isFeatured createdAt updatedAt');
      
      console.log('Adding published reviews as fallback:', published.length);
      return [...featured, ...published].slice(0, limit);
    }
    
    return featured;
  } catch (error) {
    console.error('Error fetching featured reviews:', error);
    // Fallback to published reviews
    return await Review.find({ isPublished: true })
      .sort({ date: -1, createdAt: -1 })
      .limit(limit)
      .select('name role content rating image date category email isVerified isPublished isFeatured createdAt updatedAt');
  }
};

/**
 * Get recent reviews
 */
export const getRecentReviews = async (limit: number = 10): Promise<IReview[]> => {
  return await Review.getRecent(limit);
};

/**
 * Add admin response to review
 */
export const addReviewResponse = async (
  id: string,
  content: string,
  respondedBy: string
): Promise<IReview> => {
  const review = await Review.findById(id);

  if (!review) {
    throw createError('Review not found', 404);
  }

  if (!content || !respondedBy) {
    throw createError('Content and respondedBy are required', 400);
  }

  await review.addResponse(sanitizeInput(content), sanitizeInput(respondedBy));
  return review;
};

/**
 * Vote on review helpfulness
 */
export const voteReviewHelpful = async (id: string, helpful: boolean) => {
  const review = await Review.findById(id);

  if (!review) {
    throw createError('Review not found', 404);
  }

  if (typeof helpful !== 'boolean') {
    throw createError('Helpful field must be a boolean', 400);
  }

  if (helpful) {
    await review.addHelpfulVote();
  } else {
    await review.addUnhelpfulVote();
  }

  const helpfulVotes = review.helpfulVotes || 0;
  const totalVotes = review.totalVotes || 0;
  const helpfulPercentage = totalVotes > 0 ? Math.round((helpfulVotes / totalVotes) * 100) : 0;

  return {
    helpfulVotes,
    totalVotes,
    helpfulPercentage
  };
};
