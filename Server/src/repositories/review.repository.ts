
import { BaseRepository } from './base.repository';
import { IReview } from '@/models/Review';
import Review from '@/models/Review';

export class ReviewRepository extends BaseRepository<IReview> {
    constructor() {
        super(Review);
    }

    async findReviews(filter: any, sort: any, skip: number, limit: number): Promise<IReview[]> {
        return await this.model.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }

    async getFeatured(limit: number): Promise<IReview[]> {
        return await this.model.find({
            isFeatured: true,
            isPublished: true
        })
            .sort({ rating: -1, createdAt: -1 })
            .limit(limit);
    }

    async getRecent(limit: number): Promise<IReview[]> {
        return await this.model.find({
            isPublished: true
        })
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    async getStats(): Promise<any> {
        const stats = await this.model.aggregate([
            {
                $group: {
                    _id: null,
                    totalReviews: { $sum: 1 },
                    avgRating: { $avg: '$rating' },
                    publishedReviews: {
                        $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
                    },
                    pendingReviews: {
                        $sum: { $cond: [{ $eq: ['$isPublished', false] }, 1, 0] }
                    }
                }
            }
        ]);
        return stats[0] || { totalReviews: 0, avgRating: 0, publishedReviews: 0, pendingReviews: 0 };
    }
}
