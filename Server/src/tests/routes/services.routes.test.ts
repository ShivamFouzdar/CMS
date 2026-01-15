
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Hoist the mock object so it's available in the vi.mock factory
const { mockService } = vi.hoisted(() => {
    return {
        mockService: {
            getServices: vi.fn(),
            getAllServicesAdmin: vi.fn(),
            getServiceBySlug: vi.fn(),
            createService: vi.fn(),
            updateService: vi.fn(),
            deleteService: vi.fn(),
            reorderServices: vi.fn(),
            bulkWrite: vi.fn()
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
    uploadResume: { single: () => (req: any, res: any, next: any) => next() },
    uploadGeneric: { single: () => (req: any, res: any, next: any) => next() }
}));

vi.mock('../../services/email.service', () => ({
    emailService: { sendEmail: vi.fn() },
    emailTemplates: {}
}));

// Mock OfferingService
vi.mock('../../services/offering.service', () => ({
    OfferingService: vi.fn().mockImplementation(() => mockService)
}));

import app from '../../app';

describe('Services Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /api/services', () => {
        it('should return public services', async () => {
            mockService.getServices.mockResolvedValue([
                { name: 'Web Dev', slug: 'web-dev' }
            ]);

            const res = await request(app).get('/api/services');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(1);
            expect(mockService.getServices).toHaveBeenCalled();
        });
    });

    describe('POST /api/services', () => {
        it('should create a service as admin', async () => {
            const input = {
                name: 'New Service',
                slug: 'new-service',
                description: 'A very long description that satisfies the validation requirements of at least 50 chars '.repeat(2),
                shortDescription: 'Short description '.repeat(3), // > 20 chars
                category: 'IT',
                icon: 'Code'
            };

            mockService.createService.mockResolvedValue({ id: 'srv_1', ...input });

            const res = await request(app)
                .post('/api/services')
                .send(input);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(mockService.createService).toHaveBeenCalled();
        });
    });

    describe('PUT /api/services/reorder', () => {
        it('should reorder services', async () => {
            const items = [{ id: '1', order: 1 }, { id: '2', order: 2 }];

            mockService.bulkWrite.mockResolvedValue({ modifiedCount: 2 });

            const res = await request(app)
                .put('/api/services/reorder')
                .send({ items });

            expect(res.status).toBe(200);
            expect(mockService.bulkWrite).toHaveBeenCalled();
        });
    });
});
