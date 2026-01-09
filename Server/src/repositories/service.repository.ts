
import { BaseRepository } from './base.repository';
import { IService } from '@/models/Service';
import Service from '@/models/Service';

export class ServiceRepository extends BaseRepository<IService> {
    constructor() {
        super(Service);
    }

    async findActive(category?: string, featured?: boolean, limit?: number): Promise<IService[]> {
        const query: any = { isActive: true };

        if (category) {
            // Case-insensitive match for category (from slug or name)
            // Note: original code checked query.slug = category, but that seems odd if category is "BPO Services".
            // Let's assume the parameter 'category' maps to the Service 'slug' or 'category' field. 
            // Original code: if (category) query.slug = category;
            query.slug = category;
        }

        if (featured) {
            query.isFeatured = true;
        }

        const dbQuery = this.model.find(query)
            .select('name slug description shortDescription icon features category isActive isFeatured order createdAt')
            .sort({ order: 1, createdAt: -1 });

        if (limit) {
            dbQuery.limit(limit);
        }

        return await dbQuery;
    }

    async findBySlug(slug: string): Promise<IService | null> {
        return await this.model.findOne({ slug, isActive: true });
    }

    async findByCategory(category: string): Promise<IService[]> {
        return await this.model.find({
            category: new RegExp(category, 'i'),
            isActive: true
        })
            .sort({ order: 1, createdAt: -1 });
    }

    async getCategories(): Promise<string[]> {
        const categories = await this.model.distinct('category', { isActive: true });
        return categories.sort();
    }

    async getStats(): Promise<any> {
        const stats = await this.model.aggregate([
            {
                $group: {
                    _id: null,
                    totalServices: { $sum: 1 },
                    activeServices: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                    },
                    featuredServices: {
                        $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] }
                    },
                    categoryDistribution: {
                        $push: '$category'
                    }
                }
            }
        ]);

        if (stats.length === 0) {
            return {
                totalServices: 0,
                activeServices: 0,
                featuredServices: 0,
                categoryDistribution: {}
            };
        }

        const stat = stats[0];
        const categoryDistribution = stat.categoryDistribution.reduce((acc: Record<string, number>, category: string) => {
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        return {
            totalServices: stat.totalServices,
            activeServices: stat.activeServices,
            featuredServices: stat.featuredServices,
            categoryDistribution
        };
    }
}
