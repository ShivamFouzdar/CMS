/**
 * Global API Response Interface
 */
export interface ApiResponse<T = unknown> {
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
        [key: string]: any;
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
    role: 'super_admin' | 'admin' | 'moderator' | 'viewer' | 'user';
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
    };
    theme: 'light' | 'dark' | 'auto';
    language: string;
    createdAt?: string;
}

export interface UserProfile {
    avatar?: string;
    phone?: string;
    department?: string;
    bio?: string;
}

export interface AdminUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'super_admin' | 'admin' | 'moderator' | 'viewer';
    isActive: boolean;
    lastLoginAt?: string;
    createdAt: string;
    profile?: UserProfile;
}

export interface LoginCredentials {
    email: string;
    password?: string;
    code?: string; // For 2FA or backup codes
    provider?: string;
    accessToken?: string;
}

export interface LoginResponse {
    user: User;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
    requires2FA?: boolean;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role?: string;
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
    contactAddress: string;
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

export interface ActivityLog {
    id: string;
    action: string;
    type: string;
    description: string;
    userId: string;
    user?: {
        firstName: string;
        lastName: string;
    };
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
}

export interface LogEntry {
    ip: string;
    timestamp: string;
    request: string;
    status: number;
    size: string;
    userAgent: string;
    raw?: string;
    user?: User;
    action?: string;
    resource?: string;
    resourceId?: string;
    details?: any;
}

export interface DatabaseStats {
    collections: number;
    documents: number;
    size: string;
}

export interface SystemHealth {
    status: 'healthy' | 'degraded' | 'down';
    uptime: number;
    timestamp: string;
    serverLoad: number;
    memoryUsage: number;
    disk: {
        total: number;
        used: number;
        free: number;
        percentage: number;
    };
    database: {
        status: string;
    };
    smtp: {
        connected: boolean;
    };
    services: {
        database: 'up' | 'down';
        redis?: 'up' | 'down';
        mail?: 'up' | 'down';
    };
    system: {
        platform: string;
        arch: string;
        nodeVersion: string;
        cpus: number;
    };
    memory: { // Keep existing memory structure as optional if needed, or merge
        total: number;
        used: number;
        free: number;
    };
}
