import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContactService } from '../services/contact.service.js';
import { ContactRepository } from '../repositories/contact.repository.js';
import { SettingsRepository } from '../repositories/settings.repository.js'; // Import SettingsRepository
import { emailService } from '../services/email.service.js';

// Mock dependencies
vi.mock('../repositories/contact.repository');
vi.mock('../repositories/settings.repository'); // Mock SettingsRepository
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
    let mockSettingsRepo: any; // Define mockSettingsRepo

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
            deleteMany: vi.fn(),
            getStats: vi.fn().mockResolvedValue({ total: 10 }), // Mock getStats
            getByService: vi.fn().mockResolvedValue([]) // Mock getByService
        };

        mockSettingsRepo = { // Initialize mockSettingsRepo
            getSettings: vi.fn(),
            updateSettings: vi.fn()
        };

        // Inject mock repo
        (ContactRepository as any).mockImplementation(() => mockRepo);
        (SettingsRepository as any).mockImplementation(() => mockSettingsRepo); // Mock SettingsRepository

        contactService = new ContactService();
        // Force replace repo
        (contactService as any).repository = mockRepo;
        (contactService as any).settingsRepository = mockSettingsRepo; // Inject mockSettingsRepo
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
        mockSettingsRepo.getSettings.mockResolvedValue(null); // Use mockSettingsRepo

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
        mockSettingsRepo.getSettings.mockResolvedValue({ // Use mockSettingsRepo
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
