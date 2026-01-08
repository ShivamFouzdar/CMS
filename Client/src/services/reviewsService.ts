import apiClient from './api';
import { ApiResponse, Review } from '@/types';

export type { Review };

/**
 * Reviews Service
 * Handles all business logic for customer testimonials and reviews.
 */

export const reviewsService = {
  /**
   * Get reviews for public display (published only)
   */
  async getReviews(params?: { page?: number; limit?: number; category?: string; rating?: number }): Promise<ApiResponse<Review[]>> {
    return apiClient.get('/api/reviews', { params });
  },

  /**
   * Get all reviews with optional pagination and filters (Admin)
   */
  async getAllReviews(params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<ApiResponse<Review[]>> {
    return apiClient.get('/api/reviews/all', { params });
  },

  /**
   * Get review by ID
   */
  async getReviewById(id: string): Promise<ApiResponse<Review>> {
    return apiClient.get(`/api/reviews/${id}`);
  },

  /**
   * Get reviews by category
   */
  async getReviewsByCategory(category: string): Promise<ApiResponse<Review[]>> {
    return apiClient.get(`/api/reviews/category/${encodeURIComponent(category)}`);
  },

  /**
   * Search reviews (Public)
   */
  async searchReviews(query: string): Promise<ApiResponse<Review[]>> {
    return apiClient.get(`/api/reviews`, { params: { search: query } });
  },

  /**
   * Get featured reviews (for homepage)
   */
  async getFeaturedReviews(limit: number = 7): Promise<ApiResponse<Review[]>> {
    return apiClient.get('/api/reviews/featured', { params: { limit } });
  },

  /**
   * Submit a new review
   */
  async submitReview(reviewData: Partial<Review>): Promise<ApiResponse<{ id: string; submittedAt: string }>> {
    return apiClient.post('/api/reviews', reviewData);
  },

  /**
   * Update review status (Admin)
   */
  async updateStatus(id: string, updates: Partial<Review>): Promise<ApiResponse<Review>> {
    return apiClient.patch(`/api/reviews/${id}/status`, updates);
  },

  /**
   * Delete review (Admin)
   */
  async deleteReview(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/reviews/${id}`);
  },

  /**
   * Get review statistics (Admin)
   */
  async getStats(): Promise<ApiResponse<any>> {
    return apiClient.get('/api/reviews/stats');
  },

  /**
   * Get available categories
   */
  getCategories(): string[] {
    return [
      'All',
      'BPO Services',
      'IT Services',
      'Recruitment',
      'Legal Services',
      'KPO Services',
      'Customer Support',
      'General'
    ];
  }
};
