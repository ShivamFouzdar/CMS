import { Settings } from '@/models';
import { createError } from '@/utils/helpers';

/**
 * Settings Service
 * Handles business logic for system settings
 */

export interface SystemSettingsData {
  siteName?: string;
  siteDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  maintenanceMode?: boolean;
  allowRegistrations?: boolean;
  emailNotifications?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
}

/**
 * Get current system settings
 */
export const getSystemSettings = async () => {
  try {
    const settings = await Settings.getSettings();
    return {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      maintenanceMode: settings.maintenanceMode,
      allowRegistrations: settings.allowRegistrations,
      emailNotifications: settings.emailNotifications,
      maxFileSize: settings.maxFileSize,
      allowedFileTypes: settings.allowedFileTypes,
    };
  } catch (error) {
    console.error('Error fetching system settings:', error);
    throw createError('Failed to fetch system settings', 500);
  }
};

/**
 * Update system settings
 */
export const updateSystemSettings = async (data: SystemSettingsData) => {
  try {
    // Validation
    if (data.siteName !== undefined && !data.siteName.trim()) {
      throw createError('Site name is required', 400);
    }

    if (data.contactEmail !== undefined && data.contactEmail && 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
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

    const settings = await Settings.updateSettings(data);
    
    return {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      maintenanceMode: settings.maintenanceMode,
      allowRegistrations: settings.allowRegistrations,
      emailNotifications: settings.emailNotifications,
      maxFileSize: settings.maxFileSize,
      allowedFileTypes: settings.allowedFileTypes,
    };
  } catch (error) {
    if (error instanceof Error && (error as any).statusCode) {
      throw error;
    }
    console.error('Error updating system settings:', error);
    throw createError('Failed to update system settings', 500);
  }
};

/**
 * Check if maintenance mode is enabled
 */
export const isMaintenanceMode = async (): Promise<boolean> => {
  try {
    const settings = await Settings.getSettings();
    return settings.maintenanceMode;
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    return false; // Default to false if error
  }
};

/**
 * Check if registrations are allowed
 */
export const areRegistrationsAllowed = async (): Promise<boolean> => {
  try {
    const settings = await Settings.getSettings();
    return settings.allowRegistrations;
  } catch (error) {
    console.error('Error checking registration status:', error);
    return true; // Default to true if error
  }
};

/**
 * Get file upload limits
 */
export const getFileUploadLimits = async () => {
  try {
    const settings = await Settings.getSettings();
    return {
      maxFileSize: settings.maxFileSize * 1024 * 1024, // Convert MB to bytes
      allowedFileTypes: settings.allowedFileTypes,
    };
  } catch (error) {
    console.error('Error fetching file upload limits:', error);
    return {
      maxFileSize: 10 * 1024 * 1024, // Default 10 MB
      allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
    };
  }
};

