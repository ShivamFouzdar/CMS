import { createError } from '@/utils/helpers';
import fs from 'fs/promises';
import path from 'path';
import { Applicant } from '@/models';

/**
 * Job Application Service
 * Handles business logic for job applications
 */

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
  resumePath?: string;
  resumeUrl?: string;
  resumePublicId?: string;
  submittedAt: string;
}

/**
 * Create a new job application
 */
export const createJobApplication = async (
  data: Omit<JobApplicationData, 'id' | 'submittedAt'>
): Promise<JobApplicationData> => {
  try {
    const applicant = await Applicant.create({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      location: data.location,
      experience: data.experience,
      workMode: data.workMode,
      skillsDescription: data.skillsDescription,
      hearAboutUs: data.hearAboutUs,
      resumePath: data.resumePath,
      // @ts-ignore
      resumeUrl: (data as any).resumeUrl,
      // @ts-ignore
      resumePublicId: (data as any).resumePublicId,
      status: 'new',
    });

    const result: JobApplicationData = {
      id: (applicant._id as any).toString(),
      fullName: applicant.fullName,
      email: applicant.email,
      phone: applicant.phone,
      location: applicant.location,
      experience: applicant.experience,
      workMode: applicant.workMode,
      skillsDescription: applicant.skillsDescription,
      hearAboutUs: applicant.hearAboutUs,
      submittedAt: applicant.submittedAt.toISOString(),
    };

    if (applicant.resumePath) result.resumePath = applicant.resumePath;
    // @ts-ignore
    if ((applicant as any).resumeUrl) result.resumeUrl = (applicant as any).resumeUrl as string;
    // @ts-ignore
    if ((applicant as any).resumePublicId) result.resumePublicId = (applicant as any).resumePublicId as string;

    return result;
  } catch (error) {
    console.error('Error creating job application:', error);
    throw createError('Failed to create job application', 500);
  }
};

/**
 * Get all job applications with pagination
 */
export const getAllJobApplications = async (
  page: number = 1,
  limit: number = 10
): Promise<{ data: JobApplicationData[]; total: number; page: number; totalPages: number }> => {
  try {
    const skip = (page - 1) * limit;

    console.log('Querying database for job applications...');
    console.log('Page:', page, 'Limit:', limit, 'Skip:', skip);

    const [applicants, total] = await Promise.all([
      Applicant.find({})
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Applicant.countDocuments({}),
    ]);

    console.log('Found applicants:', applicants.length, 'Total:', total);

    const data = applicants.map((applicant) => ({
      id: (applicant._id as any).toString(),
      fullName: applicant.fullName,
      email: applicant.email,
      phone: applicant.phone,
      location: applicant.location,
      experience: applicant.experience,
      workMode: applicant.workMode,
      skillsDescription: applicant.skillsDescription,
      hearAboutUs: applicant.hearAboutUs,
      ...(applicant.resumePath && { resumePath: applicant.resumePath }),
      ...(applicant as any).resumeUrl && { resumeUrl: (applicant as any).resumeUrl as string },
      ...(applicant as any).resumePublicId && { resumePublicId: (applicant as any).resumePublicId as string },
      submittedAt: applicant.submittedAt.toISOString(),
    })) as JobApplicationData[];

    console.log('Mapped data count:', data.length);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Error fetching job applications:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw createError('Failed to fetch job applications', 500);
  }
};

/**
 * Get job application by ID
 */
export const getJobApplicationById = async (id: string): Promise<JobApplicationData> => {
  try {
    const applicant = await Applicant.findById(id);

    if (!applicant) {
      throw createError('Job application not found', 404);
    }

    const result: JobApplicationData = {
      id: (applicant._id as any).toString(),
      fullName: applicant.fullName,
      email: applicant.email,
      phone: applicant.phone,
      location: applicant.location,
      experience: applicant.experience,
      workMode: applicant.workMode,
      skillsDescription: applicant.skillsDescription,
      hearAboutUs: applicant.hearAboutUs,
      submittedAt: applicant.submittedAt.toISOString(),
    };

    if (applicant.resumePath) result.resumePath = applicant.resumePath;
    if ((applicant as any).resumeUrl) result.resumeUrl = (applicant as any).resumeUrl as string;
    if ((applicant as any).resumePublicId) result.resumePublicId = (applicant as any).resumePublicId as string;

    return result;
  } catch (error) {
    console.error('Error fetching job application:', error);
    throw createError('Failed to fetch job application', 500);
  }
};

/**
 * Get job application statistics
 */
export const getJobApplicationStatistics = async () => {
  try {
    // Get start of today (00:00:00) and end of today (23:59:59)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Get start of this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [total, allApplicants, newToday, thisMonth] = await Promise.all([
      Applicant.countDocuments({}),
      Applicant.find({}).sort({ submittedAt: -1 }).limit(5).lean(),
      Applicant.countDocuments({
        submittedAt: {
          $gte: today,
          $lte: endOfToday,
        },
      }),
      Applicant.countDocuments({
        submittedAt: {
          $gte: startOfMonth,
        },
      }),
    ]);

    const byExperience = await Applicant.aggregate([
      { $group: { _id: '$experience', count: { $sum: 1 } } },
      { $project: { experience: '$_id', count: 1, _id: 0 } },
    ]);

    const byWorkMode = await Applicant.aggregate([
      { $group: { _id: '$workMode', count: { $sum: 1 } } },
      { $project: { workMode: '$_id', count: 1, _id: 0 } },
    ]);

    const bySource = await Applicant.aggregate([
      { $group: { _id: '$hearAboutUs', count: { $sum: 1 } } },
      { $project: { source: '$_id', count: 1, _id: 0 } },
    ]);

    const byExperienceMap = byExperience.reduce((acc, item) => {
      acc[item.experience] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const byWorkModeMap = byWorkMode.reduce((acc, item) => {
      acc[item.workMode] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const bySourceMap = bySource.reduce((acc, item) => {
      acc[item.source] = item.count;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      newToday,
      thisMonth,
      byExperience: byExperienceMap,
      byWorkMode: byWorkModeMap,
      bySource: bySourceMap,
      recent: allApplicants.map(app => ({
        id: (app._id as any).toString(),
        fullName: app.fullName,
        email: app.email,
        experience: app.experience,
        submittedAt: app.submittedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Error fetching job application statistics:', error);
    throw createError('Failed to fetch job application statistics', 500);
  }
};

/**
 * Delete job application
 */
export const deleteJobApplication = async (id: string): Promise<void> => {
  try {
    const applicant = await Applicant.findById(id);

    if (!applicant) {
      throw createError('Job application not found', 404);
    }

    // Delete the resume file if it exists
    if (applicant.resumePath) {
      try {
        const filePath = path.join(process.cwd(), applicant.resumePath);
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting resume file:', error);
        // Continue with deletion even if file deletion fails
      }
    }

    await Applicant.findByIdAndDelete(id);
  } catch (error) {
    console.error('Error deleting job application:', error);
    throw createError('Failed to delete job application', 500);
  }
};

/**
 * Get resume file path
 */
export const getResumePath = async (id: string): Promise<string> => {
  try {
    const applicant = await Applicant.findById(id);

    if (!applicant) {
      throw createError('Job application not found', 404);
    }

    if (!applicant.resumePath) {
      throw createError('Resume not found', 404);
    }

    const filePath = path.join(process.cwd(), applicant.resumePath);

    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      throw createError('Resume file not found on server', 404);
    }
  } catch (error) {
    console.error('Error fetching resume path:', error);
    throw error;
  }
};

