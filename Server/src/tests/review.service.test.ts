import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReviewService } from '../services/review.service.js';
import { ReviewRepository } from '../repositories/review.repository.js';

// Mock dependencies
vi.mock('../repositories/review.repository');

describe('ReviewService', () => {
    let reviewService: ReviewService;
    let mockRepo: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockRepo = {
            create: vi.fn(),
            findReviews: vi.fn(),
            count: vi.fn(),
            findById: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            deleteMany: vi.fn()
        };

        (ReviewRepository as any).mockImplementation(() => mockRepo);
        reviewService = new ReviewService();
        (reviewService as any).repository = mockRepo;
    });

    describe('createReview', () => {
        it('should create a review with valid data', async () => {
            const input = {
                name: 'Alice Johnson',
                email: 'alice@example.com',
                role: 'CEO',
                content: 'Excellent service!',
                rating: 5,
                category: 'IT Services'
            };

            const mockCreated = {
                _id: '123',
                ...input,
                isPublished: false,
                isFeatured: false,
                isVerified: false,
                date: new Date(),
                createdAt: new Date()
            };

            mockRepo.create.mockResolvedValue(mockCreated);

            const result = await reviewService.createReview(input as any);

            expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Alice Johnson',
                content: 'Excellent service!',
                rating: 5,
                isPublished: false
            }));
            // Service returns the raw document without converting _id to id
            expect(result).toHaveProperty('_id', '123');
        });

        it('should throw error if email is invalid', async () => {
            const input = {
                name: 'Test',
                email: 'invalid-email', // Invalid email format
                content: 'Review',
                rating: 5,
                role: 'CEO',
                category: 'IT'
            };

            await expect(reviewService.createReview(input as any))
                .rejects
                .toThrow('Please provide a valid email address');
        });

        it('should default isPublished to false', async () => {
            const input = {
                name: 'Test',
                email: 'test@example.com',
                content: 'Great!',
                rating: 4,
                role: 'Manager',
                category: 'BPO'
            };

            mockRepo.create.mockResolvedValue({
                _id: '123',
                ...input,
                isPublished: false
            });

            await reviewService.createReview(input as any);

            expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
                isPublished: false
            }));
        });
    });

    describe('bulkDeleteReviews', () => {
        it('should delete multiple reviews by IDs', async () => {
            mockRepo.deleteMany.mockResolvedValue(4);

            const result = await reviewService.bulkDeleteReviews(['1', '2', '3', '4']);

            expect(mockRepo.deleteMany).toHaveBeenCalledWith(['1', '2', '3', '4']);
            expect(result).toBe(4);
        });

        it('should handle empty array gracefully', async () => {
            mockRepo.deleteMany.mockResolvedValue(0);

            const result = await reviewService.bulkDeleteReviews([]);

            expect(result).toBe(0);
        });
    });

    describe('updateReviewStatus', () => {
        it('should update review isPublished status', async () => {
            const mockExisting = {
                _id: '123',
                name: 'Test',
                isPublished: false
            };

            const mockUpdated = {
                _id: '123',
                name: 'Test',
                isPublished: true,
                isFeatured: false
            };

            mockRepo.findById.mockResolvedValue(mockExisting);
            mockRepo.update.mockResolvedValue(mockUpdated);

            const result = await reviewService.updateReviewStatus('123', { isPublished: true });

            expect(result.isPublished).toBe(true);
        });

        it('should update isFeatured status', async () => {
            const mockExisting = {
                _id: '123',
                name: 'Test'
            };

            const mockUpdated = {
                _id: '123',
                name: 'Test',
                isFeatured: true
            };

            mockRepo.findById.mockResolvedValue(mockExisting);
            mockRepo.update.mockResolvedValue(mockUpdated);

            const result = await reviewService.updateReviewStatus('123', { isFeatured: true });

            expect(result.isFeatured).toBe(true);
        });

        it('should handle partial updates', async () => {
            const mockExisting = {
                _id: '123',
                name: 'Test'
            };

            const mockUpdated = {
                _id: '123',
                name: 'Test',
                isVerified: true
            };

            mockRepo.findById.mockResolvedValue(mockExisting);
            mockRepo.update.mockResolvedValue(mockUpdated);

            await reviewService.updateReviewStatus('123', { isVerified: true });

            expect(mockRepo.update).toHaveBeenCalledWith('123', { isVerified: true });
        });
    });

    describe('getReviews', () => {
        it('should get published reviews only for public endpoint', async () => {
            const mockReviews = [
                { _id: '1', name: 'User 1', isPublished: true },
                { _id: '2', name: 'User 2', isPublished: true }
            ];

            mockRepo.findReviews.mockResolvedValue(mockReviews);
            mockRepo.count.mockResolvedValue(2);

            const result = await reviewService.getReviews({ isPublished: true });

            expect(mockRepo.findReviews).toHaveBeenCalledWith(
                expect.objectContaining({ isPublished: true }),
                expect.any(Object),
                expect.any(Number),
                expect.any(Number)
            );
            expect(result.reviews).toHaveLength(2);
        });

        it('should filter by category', async () => {
            mockRepo.findReviews.mockResolvedValue([]);
            mockRepo.count.mockResolvedValue(0);

            await reviewService.getReviews({ category: 'IT Services' });

            expect(mockRepo.findReviews).toHaveBeenCalledWith(
                expect.objectContaining({
                    category: expect.objectContaining({ $regex: expect.any(RegExp) })
                }),
                expect.any(Object),
                expect.any(Number),
                expect.any(Number)
            );
        });

        it('should filter by minimum rating', async () => {
            mockRepo.findReviews.mockResolvedValue([]);
            mockRepo.count.mockResolvedValue(0);

            await reviewService.getReviews({ rating: 4 });

            expect(mockRepo.findReviews).toHaveBeenCalledWith(
                expect.objectContaining({
                    rating: expect.objectContaining({ $gte: 4 })
                }),
                expect.any(Object),
                expect.any(Number),
                expect.any(Number)
            );
        });
    });
});
