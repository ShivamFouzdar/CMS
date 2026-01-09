import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import path from 'path';

// Hoist mocks to be available inside vi.mock factory
const mocks = vi.hoisted(() => ({
    submitContactForm: vi.fn(),
    getAllContactSubmissions: vi.fn(),
    createJobApplication: vi.fn(),
}));

// Mock Services using Class Syntax
vi.mock('@/services/contact.service', () => {
    return {
        ContactService: class {
            submitContactForm = mocks.submitContactForm;
            getAllContactSubmissions = mocks.getAllContactSubmissions;
        }
    };
});

vi.mock('@/services/jobApplication.service', () => {
    return {
        JobApplicationService: class {
            createJobApplication = mocks.createJobApplication;
        }
    };
});

// Mock Upload Middleware to bypass Cloudinary
// We manually set req.file to simulate a successful upload.
vi.mock('@/middleware/upload', () => ({
    uploadResume: {
        single: () => (req: any, _res: any, next: any) => {
            req.file = {
                path: 'http://cloudinary.com/fake-resume.pdf',
                filename: 'fake-resume',
                originalname: 'resume.pdf',
                mimetype: 'application/pdf',
                size: 1024
            };
            next();
        }
    },
    uploadGeneric: {
        single: () => (req: any, _res: any, next: any) => next(),
        array: () => (req: any, _res: any, next: any) => next(),
        fields: () => (req: any, _res: any, next: any) => next(),
    }
}));

// Mock Notification Service
vi.mock('@/services/notification.service', () => ({
    notifyNewLead: vi.fn().mockResolvedValue(true),
    notifyNewJobApplication: vi.fn().mockResolvedValue(true)
}));

describe('Submission Endpoints', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST /api/contact', () => {
        it('should submit a contact form successfully', async () => {
            mocks.submitContactForm.mockResolvedValue({
                id: '123',
                createdAt: new Date(),
                name: 'John Doe',
                email: 'john@example.com'
            });

            const res = await request(app)
                .post('/api/contact')
                .send({
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                    message: 'Hello World! This is a long enough message to pass validation.', // > 10 chars
                    service: 'IT'
                });

            if (res.status !== 201) {
                console.log('Contact Error Body:', JSON.stringify(res.body, null, 2));
            }

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(mocks.submitContactForm).toHaveBeenCalled();
        });
    });

    describe('POST /api/job-application', () => {
        it('should submit a job application with resume', async () => {
            mocks.createJobApplication.mockResolvedValue({
                id: '456',
                submittedAt: new Date(),
                fullName: 'Jane Doe',
                email: 'jane@example.com'
            });

            // We send JSON because we mocked the upload middleware to ignore body parsing (it just calls next)
            // AND we mocked req.file injection.
            // Sending JSON ensures req.body is populated by express.json()
            const res = await request(app)
                .post('/api/job-application')
                .send({
                    fullName: 'Jane Doe',
                    email: 'jane@example.com',
                    phone: '9876543210',
                    location: 'New York',
                    experience: '3 Years',
                    workMode: 'Remote',
                    skillsDescription: 'TypeScript, Node.js, React, Testing - enough content for validation rules.',
                    hearAboutUs: 'LinkedIn'
                });

            if (res.status !== 201) {
                console.log('Job App Error Body:', JSON.stringify(res.body, null, 2));
            }

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(mocks.createJobApplication).toHaveBeenCalled();
        });
    });
});
