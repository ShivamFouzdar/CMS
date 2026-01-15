
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Hoist the mock object
const { mockService } = vi.hoisted(() => {
    return {
        mockService: {
            createJobApplication: vi.fn(),
            getAllJobApplications: vi.fn(),
            getJobApplicationById: vi.fn(),
            deleteJobApplication: vi.fn(),
            bulkDeleteJobApplications: vi.fn(),
            exportApplications: vi.fn(),
            getJobApplicationStatistics: vi.fn(),
            getResumePath: vi.fn()
        }
    };
});

// Mock Dependencies
vi.mock('../../middleware/auth', () => ({
    authenticateToken: (req: any, res: any, next: any) => {
        req.user = { id: 'admin_id', role: 'admin' };
        next();
    },
    requireRole: (roles: any) => (req: any, res: any, next: any) => next()
}));

vi.mock('../../middleware/upload', () => ({
    uploadResume: {
        single: () => (req: any, res: any, next: any) => {
            req.file = { path: 'http://cloudinary.com/dummy.pdf', filename: 'dummy_public_id' };
            next();
        }
    },
    uploadGeneric: {
        single: () => (req: any, res: any, next: any) => next(),
        array: () => (req: any, res: any, next: any) => next()
    }
}));

vi.mock('../../services/notification.service', () => ({
    notifyNewJobApplication: vi.fn().mockResolvedValue(true)
}));

// Mock Service Class
vi.mock('../../services/jobApplication.service', () => ({
    JobApplicationService: vi.fn().mockImplementation(() => mockService)
}));

// Import app AFTER mocks
import app from '../../app';

describe('Job Application Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST /api/job-applications', () => {
        it('should submit a valid application', async () => {
            const input = {
                fullName: 'Alice Test',
                email: 'alice@test.com',
                phone: '1234567890',
                location: 'Wonderland',
                experience: 'Junior',
                workMode: 'Remote',
                skillsDescription: 'TypeScript, Node.js, Magic',
                hearAboutUs: 'Internet'
            };

            mockService.createJobApplication.mockResolvedValue({
                id: 'job_123',
                ...input,
                submittedAt: new Date()
            });

            const res = await request(app).post('/api/job-application').send(input);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(mockService.createJobApplication).toHaveBeenCalled();
        });

        it('should fail if required fields are missing', async () => {
            const res = await request(app).post('/api/job-application').send({ fullName: 'Just Name' });
            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/job-application/submissions', () => {
        it('should return paginated applications for admin', async () => {
            mockService.getAllJobApplications.mockResolvedValue({
                data: [{ id: '1', fullName: 'Candidate 1' }],
                total: 1, page: 1, totalPages: 1
            });

            const res = await request(app).get('/api/job-application/submissions');

            expect(res.status).toBe(200);
            expect(mockService.getAllJobApplications).toHaveBeenCalled();
        });
    });

    describe('DELETE /api/job-application/submissions/:id', () => {
        it('should delete an application', async () => {
            mockService.deleteJobApplication.mockResolvedValue(true);
            const res = await request(app).delete('/api/job-application/submissions/job_123');
            expect(res.status).toBe(200);
            expect(mockService.deleteJobApplication).toHaveBeenCalledWith('job_123');
        });
    });
});
