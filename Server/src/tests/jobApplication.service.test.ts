import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JobApplicationService } from '../services/jobApplication.service.js';
import { JobApplicationRepository } from '../repositories/jobApplication.repository.js';
import { SettingsRepository } from '../repositories/settings.repository.js'; // Import SettingsRepository
import { emailService } from '../services/email.service.js';

// Mock dependencies
vi.mock('../repositories/jobApplication.repository');
vi.mock('../repositories/settings.repository'); // Mock SettingsRepository
vi.mock('../models/Settings');
vi.mock('../config/cloudinary', () => ({
    configureCloudinary: vi.fn().mockReturnValue({
        uploader: {
            destroy: vi.fn().mockResolvedValue({ result: 'ok' })
        }
    })
}));

// Mock email service
vi.mock('../services/email.service', () => ({
    emailService: {
        sendEmail: vi.fn().mockResolvedValue(undefined)
    },
    emailTemplates: {
        newJobApplication: vi.fn().mockReturnValue({
            subject: 'New Job Application',
            html: '<p>Test HTML</p>'
        })
    }
}));

describe('JobApplicationService', () => {
    let jobApplicationService: JobApplicationService;
    let mockRepo: any;
    let mockSettingsRepo: any; // Define mockSettingsRepo

    beforeEach(() => {
        vi.clearAllMocks();

        mockRepo = {
            create: vi.fn(),
            findWithPagination: vi.fn(),
            count: vi.fn(),
            findById: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            deleteMany: vi.fn()
        };

        mockSettingsRepo = { // Initialize mockSettingsRepo
            getSettings: vi.fn(),
            updateSettings: vi.fn()
        };

        (JobApplicationRepository as any).mockImplementation(() => mockRepo);
        (SettingsRepository as any).mockImplementation(() => mockSettingsRepo); // Mock implementation

        jobApplicationService = new JobApplicationService();
        (jobApplicationService as any).repository = mockRepo;
        (jobApplicationService as any).settingsRepository = mockSettingsRepo; // Inject mock
    });

    describe('createJobApplication', () => {
        it('should create a job application with valid data', async () => {
            const input = {
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+1234567890',
                location: 'New York',
                experience: '5 years',
                workMode: 'remote',
                skillsDescription: 'JavaScript, Node.js, React',
                hearAboutUs: 'LinkedIn'
            };

            const mockCreated = {
                _id: '123',
                ...input,
                status: 'new',
                submittedAt: new Date(),
                createdAt: new Date()
            };

            mockRepo.create.mockResolvedValue(mockCreated);
            mockSettingsRepo.getSettings.mockResolvedValue(null); // Use mockSettingsRepo

            const result = await jobApplicationService.createJobApplication(input);

            expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
                fullName: 'John Doe',
                email: 'john@example.com',
                status: 'new'
            }));
            expect(result).toHaveProperty('id', '123');
        });

        it('should send notification email if settings enabled', async () => {
            mockSettingsRepo.getSettings.mockResolvedValue({ // Use mockSettingsRepo
                emailNotifications: true,
                notificationAlerts: { jobApplications: true },
                contactEmail: 'admin@example.com'
            });

            mockRepo.create.mockResolvedValue({
                _id: '123',
                fullName: 'Test User',
                email: 'test@test.com',
                phone: '1234567890',
                location: 'NYC',
                experience: '3 years',
                workMode: 'hybrid',
                skillsDescription: 'Python',
                hearAboutUs: 'Website',
                submittedAt: new Date()
            });

            await jobApplicationService.createJobApplication({
                fullName: 'Test User',
                email: 'test@test.com',
                phone: '1234567890',
                location: 'NYC',
                experience: '3 years',
                workMode: 'hybrid',
                skillsDescription: 'Python',
                hearAboutUs: 'Website'
            });

            expect(emailService.sendEmail).toHaveBeenCalled();
        });
    });

    describe('bulkDeleteJobApplications', () => {
        it('should delete multiple applications by IDs', async () => {
            mockRepo.deleteMany.mockResolvedValue(3);

            const result = await jobApplicationService.bulkDeleteJobApplications(['1', '2', '3']);

            expect(mockRepo.deleteMany).toHaveBeenCalledWith(['1', '2', '3']);
            expect(result).toBe(3);
        });

        it('should return 0 for empty array', async () => {
            mockRepo.deleteMany.mockResolvedValue(0);

            const result = await jobApplicationService.bulkDeleteJobApplications([]);

            expect(result).toBe(0);
        });
    });
});
