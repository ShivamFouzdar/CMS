import { createError } from '@/utils/helpers';
import path from 'path';
import fs from 'fs/promises';
import { IApplicant } from '@/models/Applicant';
import { JobApplicationRepository } from '@/repositories/jobApplication.repository';

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

    constructor() {
        this.repository = new JobApplicationRepository();
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

        return this.mapToDTO(applicant);
    }

    async getAllJobApplications(page: number = 1, limit: number = 10): Promise<{ data: JobApplicationData[]; total: number; page: number; totalPages: number }> {
        const skip = (page - 1) * limit;

        const [applicants, total] = await Promise.all([
            this.repository.findWithPagination({}, { submittedAt: -1 }, skip, limit),
            this.repository.count({})
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
                console.error('Error deleting local resume file:', error);
            }
        } else if (applicant.resumePublicId) {
            // Optional: Delete from Cloudinary using public_id
            // Not implemented here to avoid extra dependency in service, 
            // but could import cloudinary utils if available.
        }

        await this.repository.delete(id);
    }

    async getResumePath(id: string): Promise<string> {
        const applicant = await this.repository.findById(id);
        if (!applicant) throw createError('Job application not found', 404);

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
