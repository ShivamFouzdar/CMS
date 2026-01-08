/**
 * Global API Response Interface
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
    meta?: {
        pagination?: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
    error?: {
        message: string;
        stack?: string;
    };
}

/**
 * Common Entity Interfaces
 */

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: 'admin' | 'moderator' | 'viewer' | 'user';
    twoFactorEnabled?: boolean;
    permissions?: string[];
    isEmailVerified: boolean;
    avatar?: string;
    preferences?: {
        notifications: {
            email: boolean;
            sms: boolean;
            push: boolean;
            alerts: {
                jobApplications: boolean;
                inquiries: boolean;
                reviews: boolean;
                systemAlerts: boolean;
            };
        };
        theme: 'light' | 'dark' | 'auto';
        language: string;
    };
    createdAt?: string;
}

export interface Service {
    id: string;
    name: string;
    shortDescription: string;
    description: string;
    icon: string;
    slug: string;
    category: string;
    isActive: boolean;
    isFeatured: boolean;
}

export interface Review {
    id?: string;
    _id?: string;
    name: string;
    email?: string;
    role: string;
    content: string;
    rating: number;
    image?: string;
    date?: string;
    category: string;
    isPublished: boolean;
    isFeatured: boolean;
    isVerified?: boolean;
    createdAt?: string;
}

export interface JobApplication {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    location?: string;
    experience: string;
    workMode: string;
    skillsDescription?: string;
    hearAboutUs?: string;
    resumeUrl: string;
    resumePath?: string;
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
    notes?: string;
    submittedAt: string;
}

export interface ContactSubmission {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    company?: string;
    service: string;
    message: string;
    status: 'new' | 'in-progress' | 'completed' | 'closed';
    priority?: 'low' | 'medium' | 'high';
    notes?: string;
    source?: string;
    tags?: string[];
    submittedAt: string;
    updatedAt?: string;
}

/**
 * Settings Interfaces
 */
export interface PublicSettings {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    allowRegistrations: boolean;
    socialMedia: {
        facebook: string;
        twitter: string;
        linkedin: string;
        instagram: string;
        youtube: string;
    };
}

export interface SystemSettings extends PublicSettings {
    maintenanceMode: boolean;
    emailNotifications: boolean;
    notificationAlerts: {
        jobApplications: boolean;
        inquiries: boolean;
        reviews: boolean;
        systemAlerts: boolean;
    };
    maxFileSize: number;
    allowedFileTypes: string[];
    smtp: {
        host: string;
        port: number;
        user: string;
        secure: boolean;
        fromEmail: string;
    };
}
