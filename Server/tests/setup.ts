import { vi } from 'vitest';

// Mock Environment Variables
process.env.PORT = '5001';
process.env.JWT_SECRET = 'test_secret_key_123';
process.env.MONGO_URI = 'mongodb://localhost:27017/cms_test_db';
process.env.NODE_ENV = 'test';

// Mock Cloudinary Env Vars to prevent config crash
process.env.CLOUDINARY_CLOUD_NAME = 'test_cloud';
process.env.CLOUDINARY_API_KEY = '1234567890';
process.env.CLOUDINARY_API_SECRET = 'test_secret';

// Global Console Mocks (Optional: clean up output)
// global.console.log = vi.fn(); 

// Mock Settings Service to avoid DB calls in middleware
vi.mock('@/services/settings.service', () => ({
    getSystemSettings: vi.fn().mockResolvedValue({
        maintenanceMode: false,
        contactEmail: 'test@example.com',
        contactPhone: '1234567890',
        siteName: 'Test Site'
    })
})); 
