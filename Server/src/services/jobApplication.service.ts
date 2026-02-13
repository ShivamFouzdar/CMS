import { createError } from '@/utils/helpers.js';
import logger from '@/utils/logger.js';
import path from 'path';
import fs from 'fs/promises';
import { IApplicant } from '@/models/Applicant.js';
import { JobApplicationRepository } from '@/repositories/jobApplication.repository.js';
import { SettingsRepository } from '@/repositories/settings.repository.js';
import { configureCloudinary } from '@/config/cloudinary.js';
import { emailService, emailTemplates } from './email.service.js';
import { env } from '@/config/env.js';

export interface JobApplicationData {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    experience: string;
    workMode: string;
    skillsDescription: string;
    hearAboutUs: string;
    resumePath?: string | undefined;
    resumeUrl?: string | undefined;
    resumePublicId?: string | undefined;
    submittedAt: string;
}

export class JobApplicationService {
    private repository: JobApplicationRepository;
    private settingsRepository: SettingsRepository;

    constructor() {
        this.repository = new JobApplicationRepository();
        this.settingsRepository = new SettingsRepository();
    }

    async createJobApplication(data: Omit<JobApplicationData, 'id' | 'submittedAt'>): Promise<JobApplicationData> {
        const applicant = await this.repository.create({
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            location: data.location,
            experience: data.experience,
            workMode: data.workMode,
            skillsDescription: data.skillsDescription,
            hearAboutUs: data.hearAboutUs,
            resumePath: data.resumePath,
            resumeUrl: data.resumeUrl,
            resumePublicId: data.resumePublicId,
            status: 'new',
        } as any);

        // Send Admin Notification
        try {
            const settings = await this.settingsRepository.getSettings();
            if (settings?.emailNotifications && (settings?.notificationAlerts as any)?.jobApplications) {
                const adminEmail = settings.contactEmail || env.CONTACT_EMAIL;
                if (adminEmail) {
                    const emailData = emailTemplates.newJobApplication({
                        fullName: applicant.fullName,
                        email: applicant.email,
                        phone: applicant.phone,
                        position: 'General Application', // Or add position field if available
                        experience: applicant.experience
                    });

                    await emailService.sendEmail({
                        to: adminEmail,
                        subject: emailData.subject,
                        html: emailData.html
                    });
                }
            }
        } catch (error) {
            logger.error(`Failed to send job application notification email: ${error}`);
            // Fail silently
        }

        return this.mapToDTO(applicant);
    }

    async getAllJobApplications(page: number = 1, limit: number = 10, search?: string): Promise<{ data: JobApplicationData[]; total: number; page: number; totalPages: number }> {
        const skip = (page - 1) * limit;
        const query: any = {};

        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            query.$or = [
                { fullName: searchRegex },
                { email: searchRegex },
                { experience: searchRegex }
            ];
        }

        const [applicants, total] = await Promise.all([
            this.repository.findWithPagination(query, { submittedAt: -1 }, skip, limit),
            this.repository.count(query)
        ]);

        const data = applicants.map(app => this.mapToDTO(app));

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getJobApplicationById(id: string): Promise<JobApplicationData> {
        const applicant = await this.repository.findById(id);
        if (!applicant) {
            throw createError('Job application not found', 404);
        }
        return this.mapToDTO(applicant);
    }

    async deleteJobApplication(id: string): Promise<void> {
        const applicant = await this.repository.findById(id);
        if (!applicant) {
            throw createError('Job application not found', 404);
        }

        if (applicant.resumePath && !applicant.resumePath.startsWith('http')) {
            try {
                const filePath = path.join(process.cwd(), applicant.resumePath);
                await fs.unlink(filePath);
            } catch (error) {
                logger.error(`Error deleting local resume file: ${error}`);
            }
        } else if (applicant.resumePublicId) {
            // Optional: Delete from Cloudinary using public_id
            // Not implemented here to avoid extra dependency in service, 
            // but could import cloudinary utils if available.
        }

        await this.repository.delete(id);
    }

    async bulkDeleteJobApplications(ids: string[]): Promise<number> {
        if (!ids || ids.length === 0) return 0;

        // Note: This does not delete associated files for each application efficiently. 
        // Ideally, we should fetch all applications, delete files, then delete records.
        // For now, doing a simple database delete. File cleanup can be a background cron or improved later.

        return await this.repository.deleteMany(ids);
    }

    async exportApplications(): Promise<string> {
        // Fetch all applications
        const applicants = await this.repository.findWithPagination({}, { submittedAt: -1 }, 0, 10000);

        const headers = ['Full Name', 'Email', 'Phone', 'Location', 'Experience', 'Work Mode', 'Skills Description', 'Hear About Us', 'Submitted At'];

        const escapeCsv = (field: any) => {
            if (field === null || field === undefined) return '';
            const stringField = String(field);
            if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
                return `"${stringField.replace(/"/g, '""')}"`;
            }
            return stringField;
        };

        const rows = applicants.map(app => [
            escapeCsv(app.fullName),
            escapeCsv(app.email),
            escapeCsv(app.phone),
            escapeCsv(app.location),
            escapeCsv(app.experience),
            escapeCsv(app.workMode),
            escapeCsv(app.skillsDescription),
            escapeCsv(app.hearAboutUs),
            escapeCsv(app.submittedAt.toISOString())
        ]);

        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    async getResumePath(id: string): Promise<string> {
        const applicant = await this.repository.findById(id);
        if (!applicant) throw createError('Job application not found', 404);

        // If stored in Cloudinary logic 
        if (applicant.resumePublicId) {
            try {
                const cloudinary = configureCloudinary();
                // Generate signed URL for secure access
                // resource_type 'raw' is required for non-image files uploaded as raw
                // Using private_download_url helper which handles signature generation effectively
                // Format must be empty string to avoid double extension if public_id already has it
                const url = cloudinary.utils.private_download_url(applicant.resumePublicId, '', {
                    resource_type: 'raw',
                    type: 'upload',
                    attachment: true,
                    expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour validity
                });

                return url;
            } catch (error) {
                logger.warn(`Failed to generate signed Cloudinary URL, falling back to stored URL: ${error}`);
                if (applicant.resumeUrl) return applicant.resumeUrl;
                if (applicant.resumePath && applicant.resumePath.startsWith('http')) return applicant.resumePath;
            }
        }

        // Prefer resumeUrl or resumePath
        const resumeLocation = applicant.resumeUrl || applicant.resumePath;
        if (!resumeLocation) throw createError('Resume not found', 404);

        if (resumeLocation.startsWith('http')) {
            return resumeLocation;
        }

        const filePath = path.join(process.cwd(), resumeLocation);
        try {
            await fs.access(filePath);
            return filePath;
        } catch {
            throw createError('Resume file not found on server', 404);
        }
    }

    async getJobApplicationStatistics(): Promise<any> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const [total, newToday, thisMonth, stats, recentApplicants] = await Promise.all([
            this.repository.count(),
            this.repository.count({ submittedAt: { $gte: today, $lte: endOfToday } }),
            this.repository.count({ submittedAt: { $gte: startOfMonth } }),
            this.repository.getStats(),
            this.repository.getRecent(5)
        ]);

        return {
            total,
            newToday,
            thisMonth,
            ...stats,
            recent: recentApplicants.map(app => ({
                id: (app._id as any).toString(),
                fullName: app.fullName,
                email: app.email,
                experience: app.experience,
                submittedAt: app.submittedAt.toISOString(),
            }))
        };
    }

    private mapToDTO(applicant: IApplicant): JobApplicationData {
        return {
            id: (applicant._id as any).toString(),
            fullName: applicant.fullName,
            email: applicant.email,
            phone: applicant.phone,
            location: applicant.location,
            experience: applicant.experience,
            workMode: applicant.workMode,
            skillsDescription: applicant.skillsDescription,
            hearAboutUs: applicant.hearAboutUs,
            resumePath: applicant.resumePath || undefined,
            resumeUrl: applicant.resumeUrl || undefined,
            resumePublicId: applicant.resumePublicId || undefined,
            submittedAt: applicant.submittedAt.toISOString(),
        };
    }
}
