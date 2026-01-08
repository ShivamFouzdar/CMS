import { ContactRepository } from '@/repositories/contact.repository';
import { ReviewRepository } from '@/repositories/review.repository';
import { ServiceRepository } from '@/repositories/service.repository';
import { UserRepository } from '@/repositories/user.repository';
import { JobApplicationRepository } from '@/repositories/jobApplication.repository';

export class AdminService {
    private contactRepo: ContactRepository;
    private reviewRepo: ReviewRepository;
    private serviceRepo: ServiceRepository;
    private userRepo: UserRepository;
    private jobRepo: JobApplicationRepository;

    constructor() {
        this.contactRepo = new ContactRepository();
        this.reviewRepo = new ReviewRepository();
        this.serviceRepo = new ServiceRepository();
        this.userRepo = new UserRepository();
        this.jobRepo = new JobApplicationRepository();
    }

    /**
     * Get comprehensive dashboard statistics
     */
    async getDashboardStats() {
        const [
            contactStats,
            reviewStats,
            serviceCount,
            userStats,
            jobCount
        ] = await Promise.all([
            this.contactRepo.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        new: {
                            $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] }
                        },
                        inProgress: {
                            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
                        },
                        completed: {
                            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                        }
                    }
                }
            ]),
            this.reviewRepo.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        published: {
                            $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
                        },
                        pending: {
                            $sum: { $cond: [{ $eq: ['$isPublished', false] }, 1, 0] }
                        },
                        averageRating: { $avg: '$rating' }
                    }
                }
            ]),
            this.serviceRepo.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: {
                            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                        },
                        featured: {
                            $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] }
                        }
                    }
                }
            ]),
            this.userRepo.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: { $sum: 1 }
                    }
                }
            ]),
            this.jobRepo.count({})
        ]);

        const cStats = contactStats[0] || { total: 0, new: 0, inProgress: 0, completed: 0 };
        const rStats = reviewStats[0] || { total: 0, published: 0, pending: 0, averageRating: 0 };
        const uStats = userStats[0] || { total: 0, active: 0 };

        const sStats = serviceCount[0] || { total: 0, active: 0, featured: 0 };

        return {
            contacts: {
                total: cStats.total,
                new: cStats.new,
                inProgress: cStats.inProgress,
                completed: cStats.completed
            },
            reviews: {
                total: rStats.total,
                published: rStats.published,
                pending: rStats.pending,
                averageRating: Math.round((rStats.averageRating || 0) * 10) / 10
            },
            services: {
                total: sStats.total,
                active: sStats.active,
                featured: sStats.featured
            },
            users: {
                total: uStats.total,
                active: uStats.active,
                byRole: {}
            },
            jobs: {
                total: jobCount
            }
        };
    }

    /**
     * Get recent system activity
     */
    async getRecentActivity(limit: number = 10) {
        const [contacts, reviews] = await Promise.all([
            this.contactRepo.findAll({}, { createdAt: -1 }, limit),
            this.reviewRepo.findAll({}, { createdAt: -1 }, limit)
        ]);

        const activity = [
            ...contacts.map((c: any) => ({
                id: c._id,
                type: 'contact',
                action: 'submitted',
                user: c.name || 'Anonymous',
                timestamp: c.createdAt
            })),
            ...reviews.map((r: any) => ({
                id: r._id,
                type: 'review',
                action: 'posted',
                user: r.name || 'Anonymous',
                timestamp: r.createdAt
            }))
        ];

        return activity
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
    }
}

export const adminService = new AdminService();
