import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContactService } from '../services/contact.service.js';
import { ContactRepository } from '../repositories/contact.repository.js';
import { emailService } from '../services/email.service.js';
import { Settings } from '../models/Settings.js';

// Mock dependencies
vi.mock('../repositories/contact.repository');
vi.mock('../models/Settings');

// Explicitly mock email service and templates
vi.mock('../services/email.service', () => ({
    emailService: {
        sendEmail: vi.fn().mockResolvedValue(undefined)
    },
    emailTemplates: {
        newLead: vi.fn().mockReturnValue({
            subject: 'Test Subject',
            html: '<p>Test HTML</p>'
        })
    }
}));

describe('ContactService', () => {
    let contactService: ContactService;
    let mockRepo: any;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        // Setup mock implementations
        mockRepo = {
            create: vi.fn(),
            findWithPagination: vi.fn(),
            count: vi.fn(),
            findById: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            deleteMany: vi.fn()
        };

        // Inject mock repo (casting as any to bypass private property access if needed, or by constructor if possible)
        // Since repo is private and instantiated in constructor, we might need to mock the module or prototype.
        // For simplicity in this environment, let's mock the class constructor
        (ContactRepository as any).mockImplementation(() => mockRepo);

        contactService = new ContactService();
        // Force replace repo if constructor logic makes it hard
        (contactService as any).repository = mockRepo;
    });

    it('should create a contact submission', async () => {
        const input = {
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Hello World',
            service: 'IT Services'
        };

        const mockCreated = {
            _id: '123',
            ...input,
            submittedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockRepo.create.mockResolvedValue(mockCreated);
        (Settings.findOne as any).mockResolvedValue(null); // No settings, no email

        const result = await contactService.submitContactForm(input);

        expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Hello World'
        }));
        expect(result).toHaveProperty('id', '123');
    });

    it('should throw error if required fields are missing', async () => {
        const input = {
            email: 'john@example.com' // Missing name and message
        };

        await expect(contactService.submitContactForm(input as any))
            .rejects
            .toThrow('Name, email, and message are required');
    });

    it('should send notification email if settings enabled', async () => {
        // Mock Settings
        (Settings.findOne as any).mockResolvedValue({
            emailNotifications: true,
            notificationAlerts: { inquiries: true },
            contactEmail: 'admin@example.com'
        });

        // Mock Repo
        mockRepo.create.mockResolvedValue({
            _id: '123',
            name: 'Test',
            email: 'test@test.com',
            message: 'msg',
            submittedAt: new Date()
        });

        await contactService.submitContactForm({
            name: 'Test',
            email: 'test@test.com',
            message: 'msg'
        });

        expect(emailService.sendEmail).toHaveBeenCalled();
    });

    it('should bulk delete contacts', async () => {
        mockRepo.deleteMany.mockResolvedValue(5);

        const result = await contactService.bulkDeleteContacts(['1', '2', '3']);

        expect(mockRepo.deleteMany).toHaveBeenCalledWith(['1', '2', '3']);
        expect(result).toBe(5);
    });
});
