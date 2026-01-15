import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import Notification from '../src/models/Notification';
import { NotificationService } from '../src/services/notification.service';
import mongoose from 'mongoose';

// Mock Auth Middleware to bypass login
vi.mock('../src/middleware/auth', () => ({
    authenticateToken: (req: any, res: any, next: any) => {
        req.user = { id: 'test_admin_id', role: 'admin' };
        next();
    },
    requireRole: (roles: any) => (req: any, res: any, next: any) => next()
}));

// Mock Email Service to avoid sending real emails
vi.mock('../src/services/email.service', () => ({
    sendNotificationEmail: vi.fn(),
    emailTemplates: {
        newJobApplication: vi.fn(() => ({ subject: 'Test', html: 'Test' })),
        newLead: vi.fn(() => ({ subject: 'Test', html: 'Test' })),
        newReview: vi.fn(() => ({ subject: 'Test', html: 'Test' })),
        systemAlert: vi.fn(() => ({ subject: 'Test', html: 'Test' }))
    }
}));

// Mock Settings and User Repo for NotificationService logic
vi.mock('../src/models/Settings', () => ({
    Settings: {
        getSettings: vi.fn().mockResolvedValue({
            emailNotifications: true,
            notificationAlerts: {
                inquiries: true,
                jobApplications: true,
                reviews: true,
                systemAlerts: true
            }
        })
    }
}));

vi.mock('../src/repositories/user.repository', () => ({
    UserRepository: vi.fn().mockImplementation(() => ({
        findWithPagination: vi.fn().mockResolvedValue([
            { email: 'admin@example.com', preferences: { notifications: { email: true, alerts: { inquiries: true, jobApplications: true, reviews: true, systemAlerts: true } } } }
        ])
    }))
}));

describe('Notification System', () => {
    let notificationService: NotificationService;

    // Connect to MongoDB before running tests
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test_db');
        }
    });

    // Close connection after tests
    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        notificationService = new NotificationService();
        await Notification.deleteMany({});
    });

    describe('NotificationService Persistence', () => {
        it('should save a notification when a new lead comes in', async () => {
            await notificationService.notifyNewLead({
                name: 'Test User',
                email: 'test@example.com',
                service: 'Web Dev',
                message: 'Hello'
            });

            const notification = await Notification.findOne({ type: 'new-lead' });
            expect(notification).toBeTruthy();
            expect(notification?.title).toBe('New Inquiry');
            expect(notification?.data.email).toBe('test@example.com');
        });

        it('should save a notification when a new job application comes in', async () => {
            await notificationService.notifyNewJobApplication({
                fullName: 'Job Candidate',
                email: 'candidate@example.com',
                phone: '1234567890',
                experience: '5 years'
            });

            const notification = await Notification.findOne({ type: 'job-application' });
            expect(notification).toBeTruthy();
            expect(notification?.title).toBe('New Job Application');
        });
    });

    describe('Notification API Endpoints', () => {
        beforeEach(async () => {
            // Seed some notifications
            await Notification.create([
                { type: 'new-lead', title: 'Lead 1', message: 'Msg 1', read: false },
                { type: 'review', title: 'Review 1', message: 'Msg 2', read: true },
                { type: 'new-lead', title: 'Lead 2', message: 'Msg 3', read: false }
            ]);
        });

        it('GET /api/notifications should return paginated notifications', async () => {
            const res = await request(app).get('/api/notifications');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(3);
            expect(res.body.meta.unreadCount).toBe(2);
        });

        it('PUT /api/notifications/:id/read should mark notification as read', async () => {
            const notification = await Notification.findOne({ title: 'Lead 1' });
            const res = await request(app).put(`/api/notifications/${notification?._id}/read`);

            expect(res.status).toBe(200);
            expect(res.body.data.read).toBe(true);

            const updated = await Notification.findById(notification?._id);
            expect(updated?.read).toBe(true);
        });

        it('PUT /api/notifications/mark-all-read should mark all as read', async () => {
            const res = await request(app).put('/api/notifications/mark-all-read');

            expect(res.status).toBe(200);

            const unreadCount = await Notification.countDocuments({ read: false });
            expect(unreadCount).toBe(0);
        });
    });
});
