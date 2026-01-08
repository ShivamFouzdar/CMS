
import { createError, validateEmail, sanitizeInput } from '@/utils/helpers';
import { IReview } from '@/models/Review';
import { ReviewRepository } from '@/repositories/review.repository';

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

export class ReviewService {
    private repository: ReviewRepository;

    constructor() {
        this.repository = new ReviewRepository();
    }

    /**
     * Get all reviews with filters
     */
    async getReviews(filters: ReviewFilters = {}) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const skip = (page - 1) * limit;

        const query: any = {};

        if (filters.isPublished !== undefined) {
            query.isPublished = filters.isPublished;
        }

        if (filters.category) {
            query.category = { $regex: new RegExp(filters.category, 'i') };
        }

        if (filters.rating) {
            query.rating = { $gte: Number(filters.rating) };
        }

        if (filters.search) {
            query.$or = [
                { name: { $regex: new RegExp(filters.search, 'i') } },
                { content: { $regex: new RegExp(filters.search, 'i') } },
                { role: { $regex: new RegExp(filters.search, 'i') } },
                { category: { $regex: new RegExp(filters.search, 'i') } }
            ];
        }

        const sortField = filters.sort && ['createdAt', 'updatedAt', 'date', 'name', 'rating', 'category'].includes(filters.sort) ? filters.sort : 'date';
        const sortOrder = filters.order === 'asc' ? 1 : -1;
        const sort: any = { [sortField]: sortOrder };

        const reviews = await this.repository.findReviews(query, sort, skip, limit);
        const total = await this.repository.count(query);

        return {
            reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * Get all reviews (Admin) - Reuses getReviews logic
     */
    async getAllReviews(filters: ReviewFilters = {}) {
        // Admin specific tweaks if needed, otherwise maps to getReviews
        // Note: original getAllReviews had complex sorting logic fallback, keeping simple for now
        return this.getReviews(filters);
    }

    async getReviewById(id: string): Promise<IReview> {
        const review = await this.repository.findById(id);
        if (!review) throw createError('Review not found', 404);
        return review;
    }

    async createReview(data: {
        name: string;
        email: string;
        role?: string;
        content: string;
        rating: number;
        category: string;
        image?: string;
    }): Promise<IReview> {
        if (!validateEmail(data.email)) {
            throw createError('Please provide a valid email address', 400);
        }
        if (data.rating < 1 || data.rating > 5) {
            throw createError('Rating must be between 1 and 5', 400);
        }

        const sanitizedData = {
            name: sanitizeInput(data.name),
            email: sanitizeInput(data.email).toLowerCase(),
            role: sanitizeInput(data.role || ''),
            content: sanitizeInput(data.content),
            category: sanitizeInput(data.category),
            rating: Number(data.rating),
            image: data.image || `/images/avatar-${Math.floor(Math.random() * 10) + 1}.jpg`,
            isVerified: false,
            isPublished: false
        };

        return await this.repository.create(sanitizedData);
    }

    async updateReviewStatus(id: string, updates: { isPublished?: boolean; isVerified?: boolean; isFeatured?: boolean }): Promise<IReview> {
        const review = await this.repository.findById(id);
        if (!review) throw createError('Review not found', 404);

        return (await this.repository.update(id, updates))!;
    }

    async updateReview(id: string, data: Partial<IReview>): Promise<IReview> {
        const review = await this.repository.findById(id);
        if (!review) throw createError('Review not found', 404);

        // Sanitize input data before update
        const updates: any = {};
        if (data.name) updates.name = sanitizeInput(data.name);
        if (data.role) updates.role = sanitizeInput(data.role);
        if (data.content) updates.content = sanitizeInput(data.content);
        if (data.rating) updates.rating = Number(data.rating);
        if (data.category) updates.category = sanitizeInput(data.category);
        if (data.image) updates.image = data.image;

        return (await this.repository.update(id, updates))!;
    }

    async deleteReview(id: string): Promise<void> {
        const deleted = await this.repository.delete(id);
        if (!deleted) throw createError('Review not found', 404);
    }

    async getReviewsByCategory(category: string, limit: number = 10): Promise<IReview[]> {
        return await this.repository.findReviews(
            { category: { $regex: new RegExp(category, 'i') }, isPublished: true },
            { date: -1 },
            0,
            limit
        );
    }

    async getReviewStatistics(): Promise<any> {
        return await this.repository.getStats();
    }

    async getFeaturedReviews(limit: number = 5): Promise<IReview[]> {
        const featured = await this.repository.getFeatured(limit);
        if (featured.length < limit) {
            const needed = limit - featured.length;
            // Avoid duplication by excluding already found featured reviews
            const featuredIds = featured.map(r => r._id);
            const fallback = await this.repository.findReviews(
                { isPublished: true, _id: { $nin: featuredIds } },
                { date: -1 },
                0,
                needed
            );
            return [...featured, ...fallback];
        }
        return featured;
    }

    async getRecentReviews(limit: number = 10): Promise<IReview[]> {
        return await this.repository.getRecent(limit);
    }

    async addReviewResponse(id: string, content: string, respondedBy: string): Promise<IReview> {
        const review = await this.repository.findById(id);
        if (!review) throw createError('Review not found', 404);

        // Using direct update instead of method to avoid mixing patterns, 
        // or we could cast to any to call method if it's strictly an instance method.
        // Better to use repository update for consistency here.
        const response = {
            content: sanitizeInput(content),
            respondedBy: sanitizeInput(respondedBy),
            respondedAt: new Date()
        };

        return (await this.repository.update(id, { response }))!;
    }

    async voteReviewHelpful(id: string, helpful: boolean) {
        const review = await this.repository.findById(id);
        if (!review) throw createError('Review not found', 404);

        if (helpful) {
            await this.repository.update(id, { $inc: { helpfulVotes: 1, totalVotes: 1 } });
        } else {
            await this.repository.update(id, { $inc: { totalVotes: 1 } });
        }

        // Fetch updated to return calculated stats
        const updated = await this.repository.findById(id);
        if (!updated) throw createError('Review not found', 404);

        return {
            helpfulVotes: updated.helpfulVotes,
            totalVotes: updated.totalVotes,
            helpfulPercentage: updated.totalVotes > 0 ? Math.round((updated.helpfulVotes / updated.totalVotes) * 100) : 0
        };
    }
}
