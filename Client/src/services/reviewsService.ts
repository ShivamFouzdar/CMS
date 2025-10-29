export interface Review {
  _id?: string;
  id?: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  date: string;
  category: string;
  email?: string;
  isVerified?: boolean;
  isPublished?: boolean;
  isFeatured?: boolean;
  helpfulVotes?: number;
  totalVotes?: number;
  response?: {
    content: string;
    respondedBy: string;
    respondedAt: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Helper function to make API requests
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Failed to fetch data');
  }

  const data = await response.json();
  return data;
};

// Main service functions
export const reviewsService = {
  // Get all reviews
  async getAllReviews(): Promise<Review[]> {
    try {
      const data = await apiRequest(`${API_BASE_URL}/api/reviews`);
      console.log('Reviews API Response:', data);
      
      // Check if data.data exists and is an array
      if (!data.data || !Array.isArray(data.data)) {
        console.warn('Invalid response format:', data);
        return [];
      }
      
      // Map database format to frontend format
      return data.data.map((review: any) => this.mapReviewToFrontend(review));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Get reviews by category
  async getReviewsByCategory(category: string): Promise<Review[]> {
    try {
      const data = await apiRequest(`${API_BASE_URL}/api/reviews/category/${encodeURIComponent(category)}`);
      return data.data.map(this.mapReviewToFrontend);
    } catch (error) {
      console.error('Error fetching reviews by category:', error);
      throw error;
    }
  },

  // Search reviews
  async searchReviews(query: string): Promise<Review[]> {
    try {
      const data = await apiRequest(`${API_BASE_URL}/api/reviews?search=${encodeURIComponent(query)}`);
      return data.data.map(this.mapReviewToFrontend);
    } catch (error) {
      console.error('Error searching reviews:', error);
      throw error;
    }
  },

  // Get reviews with pagination
  async getReviewsWithPagination(page: number, limit: number = 6): Promise<{ reviews: Review[], totalPages: number, currentPage: number }> {
    try {
      const data = await apiRequest(`${API_BASE_URL}/api/reviews?page=${page}&limit=${limit}`);
      return {
        reviews: data.data.map(this.mapReviewToFrontend),
        totalPages: data.meta?.pagination?.totalPages || 1,
        currentPage: data.meta?.pagination?.page || page
      };
    } catch (error) {
      console.error('Error fetching paginated reviews:', error);
      throw error;
    }
  },

  // Get available categories
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
  },

  // Get featured reviews (for homepage)
  async getFeaturedReviews(limit: number = 7): Promise<Review[]> {
    try {
      const data = await apiRequest(`${API_BASE_URL}/api/reviews/featured?limit=${limit}`);
      console.log('Featured Reviews API Response:', data);
      
      if (!data.data || !Array.isArray(data.data)) {
        console.warn('Invalid featured reviews response format:', data);
        return [];
      }
      
      const mapped = data.data.map(this.mapReviewToFrontend);
      console.log('Mapped featured reviews:', mapped);
      return mapped;
    } catch (error) {
      console.error('Error fetching featured reviews:', error);
      return [];
    }
  },

  // Submit a new review
  async submitReview(reviewData: {
    name: string;
    email: string;
    role?: string;
    content: string;
    rating: number;
    category: string;
  }): Promise<{ id: string; submittedAt: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to submit review' }));
        throw new Error(error.message || 'Failed to submit review');
      }

      const data = await response.json();
      return {
        id: data.data.id,
        submittedAt: data.data.submittedAt
      };
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },

  // Map database review to frontend format
  mapReviewToFrontend(review: any): Review {
    // Handle date formatting
    let dateStr = '';
    if (review.date) {
      dateStr = typeof review.date === 'string' 
        ? review.date.split('T')[0] 
        : new Date(review.date).toISOString().split('T')[0];
    } else if (review.createdAt) {
      dateStr = typeof review.createdAt === 'string'
        ? review.createdAt.split('T')[0]
        : new Date(review.createdAt).toISOString().split('T')[0];
    } else {
      dateStr = new Date().toISOString().split('T')[0];
    }

    return {
      id: review._id?.toString() || review.id?.toString(),
      _id: review._id?.toString(),
      name: review.name || '',
      role: review.role || '',
      content: review.content || '',
      rating: review.rating || 0,
      image: review.image || `/images/avatar-${Math.floor(Math.random() * 10) + 1}.jpg`,
      date: dateStr,
      category: review.category || '',
      isVerified: review.isVerified || false,
      isPublished: review.isPublished !== undefined ? review.isPublished : true,
      isFeatured: review.isFeatured || false,
      email: review.email,
      helpfulVotes: review.helpfulVotes || 0,
      totalVotes: review.totalVotes || 0,
      response: review.response,
      createdAt: review.createdAt ? (typeof review.createdAt === 'string' ? review.createdAt : review.createdAt.toISOString()) : undefined,
      updatedAt: review.updatedAt ? (typeof review.updatedAt === 'string' ? review.updatedAt : review.updatedAt.toISOString()) : undefined
    };
  }
};
