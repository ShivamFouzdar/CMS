import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JobApplicationService } from '../services/jobApplication.service.js';
import { JobApplicationRepository } from '../repositories/jobApplication.repository.js';
import { Settings } from '../models/Settings.js';

// Mock dependencies
vi.mock('../repositories/jobApplication.repository');
vi.mock('../models/Settings');
vi.mock('../config/cloudinary', () => ({
    configureCloudinary: vi.fn().mockReturnValue({
        uploader: {
            destroy: vi.fn().mockResolvedValue({ result: 'ok' })
        }
    })
}));

describe('JobApplicationService - Status Updates', () => {
    let jobApplicationService: JobApplicationService;
    let mockRepo: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockRepo = {
            findById: vi.fn(),
            updateMany: vi.fn(),
        };

        // Mock the repository implementation
        (JobApplicationRepository as any).mockImplementation(() => mockRepo);
        jobApplicationService = new JobApplicationService();
        // Force inject mock repo if constructor doesn't use the mock class instance directly (common issue in tests)
        (jobApplicationService as any).repository = mockRepo;
    });

    describe('updateJobApplicationStatus', () => {
        it('should update status successfully', async () => {
            const mockApp = {
                _id: '123',
                fullName: 'Test Candidate',
                status: 'new',
                save: vi.fn().mockResolvedValue(true),
                toObject: () => ({ _id: '123', fullName: 'Test Candidate', status: 'shortlisted' }) // Simplified mapToDTO
            };
            mockRepo.findById.mockResolvedValue(mockApp);

            // Mock mapToDTO to return raw object for simplicity in this unit test
            (jobApplicationService as any).mapToDTO = (app: any) => ({ ...app, id: app._id });

            const result = await jobApplicationService.updateJobApplicationStatus('123', 'shortlisted');

            expect(mockRepo.findById).toHaveBeenCalledWith('123');
            expect(mockApp.status).toBe('shortlisted');
            expect(mockApp.save).toHaveBeenCalled();
            expect(result.status).toBe('shortlisted');
        });

        it('should throw error if application is not found', async () => {
            mockRepo.findById.mockResolvedValue(null);

            await expect(jobApplicationService.updateJobApplicationStatus('999', 'hired'))
                .rejects.toThrow('Job application not found');
        });

        it('should throw error if status is invalid', async () => {
            const mockApp = { _id: '123', status: 'new' };
            mockRepo.findById.mockResolvedValue(mockApp);

            await expect(jobApplicationService.updateJobApplicationStatus('123', 'invalid-status'))
                .rejects.toThrow('Invalid status');
        });
    });

    describe('bulkUpdateJobApplicationStatus', () => {
        it('should update multiple applications successfully', async () => {
            mockRepo.updateMany.mockResolvedValue(5); // Return count directly based on service implementation

            const ids = ['1', '2', '3', '4', '5'];
            const status = 'rejected';

            const result = await jobApplicationService.bulkUpdateJobApplicationStatus(ids, status);

            expect(mockRepo.updateMany).toHaveBeenCalledWith(
                { _id: { $in: ids } },
                { $set: { status: 'rejected' } }
            );
            expect(result).toBe(5);
        });

        it('should return 0 if ids array is empty', async () => {
            const result = await jobApplicationService.bulkUpdateJobApplicationStatus([], 'hired');
            expect(result).toBe(0);
            expect(mockRepo.updateMany).not.toHaveBeenCalled();
        });

        it('should throw error if status is invalid', async () => {
            await expect(jobApplicationService.bulkUpdateJobApplicationStatus(['1'], 'super-hired'))
                .rejects.toThrow('Invalid status');
        });
    });
});
