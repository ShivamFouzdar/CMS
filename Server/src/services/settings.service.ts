
import { SettingsRepository } from '@/repositories/settings.repository';
import { createError } from '@/utils/helpers';
import { ISettings } from '@/models/Settings';

export interface SystemSettingsData {
    siteName?: string;
    siteDescription?: string;
    contactEmail?: string;
    contactPhone?: string;
    maintenanceMode?: boolean;
    allowRegistrations?: boolean;
    emailNotifications?: boolean;
    notificationAlerts?: {
        jobApplications?: boolean;
        inquiries?: boolean;
        reviews?: boolean;
        systemAlerts?: boolean;
    };
    maxFileSize?: number;
    allowedFileTypes?: string[];
}

export class SettingsService {
    private repository: SettingsRepository;

    constructor() {
        this.repository = new SettingsRepository();
    }

    async getSystemSettings(): Promise<ISettings> {
        try {
            const settings = await this.repository.getSettings();
            return settings;
        } catch (error) {
            console.error('Error fetching system settings:', error);
            throw createError('Failed to fetch system settings', 500);
        }
    }

    async updateSystemSettings(data: SystemSettingsData): Promise<ISettings> {
        try {
            // Validation validation logic here if needed, most basic validation is in schema/router
            if (data.siteName !== undefined && !data.siteName.trim()) {
                throw createError('Site name is required', 400);
            }
            if (data.contactEmail !== undefined && data.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
                throw createError('Please provide a valid email address', 400);
            }
            if (data.maxFileSize !== undefined) {
                if (data.maxFileSize < 1 || data.maxFileSize > 100) {
                    throw createError('Max file size must be between 1 and 100 MB', 400);
                }
            }
            if (data.allowedFileTypes !== undefined) {
                if (!Array.isArray(data.allowedFileTypes) || data.allowedFileTypes.length === 0) {
                    throw createError('At least one file type must be allowed', 400);
                }
            }

            const settings = await this.repository.updateSettings(data as any);
            return settings;
        } catch (error) {
            if (error instanceof Error && (error as any).statusCode) {
                throw error;
            }
            console.error('Error updating system settings:', error);
            throw createError('Failed to update system settings', 500);
        }
    }
}

export const settingsService = new SettingsService();

export const areRegistrationsAllowed = async (): Promise<boolean> => {
    const settings = await settingsService.getSystemSettings();
    return settings.allowRegistrations;
};

export const getSystemSettings = settingsService.getSystemSettings.bind(settingsService);
export const updateSystemSettings = settingsService.updateSystemSettings.bind(settingsService);

export const isMaintenanceMode = async (): Promise<boolean> => {
    const settings = await settingsService.getSystemSettings();
    return settings.maintenanceMode;
};
