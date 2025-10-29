import { Request, Response } from 'express';
import { asyncHandler, sanitizeInput, validateEmail, createError } from '@/utils/helpers';
import { ApiResponse } from '@/types';
import path from 'path';
import { uploadResume } from '@/middleware/upload';
import * as jobApplicationService from '@/services/jobApplicationService';

/**
 * Job Application Controller
 * Handles job application form submissions
 */

// Cloudinary-based upload middleware
const upload = uploadResume;

/**
 * Submit job application
 * POST /api/job-application
 */
export const submitJobApplication = async (req: Request, res: Response) => {
  upload.single('resume')(req, res, async (err) => {
    if (err) {
      res.status(400).json({
        success: false,
        message: err.message || 'File upload failed',
      });
      return;
    }

    const { fullName, email, phone, location, experience, workMode, skillsDescription, hearAboutUs } = req.body;

    // Validation
    if (!fullName || !email || !phone || !location || !experience || !workMode || !skillsDescription || !hearAboutUs) {
      res.status(400).json({
        success: false,
        message: 'All required fields must be filled',
      });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Resume file is required',
      });
      return;
    }

    try {
      // Sanitize inputs
      const sanitizedData: any = {
        fullName: sanitizeInput(fullName),
        email: sanitizeInput(email),
        phone: sanitizeInput(phone),
        location: sanitizeInput(location),
        experience: sanitizeInput(experience),
        workMode: sanitizeInput(workMode),
        skillsDescription: sanitizeInput(skillsDescription),
        hearAboutUs: sanitizeInput(hearAboutUs),
      };

      // Multer-Cloudinary returns file.path as URL and file.filename/public_id
      if (req.file) {
        // @ts-ignore
        const cloudPath = (req.file as any).path as string;
        // @ts-ignore
        const publicId = (req.file as any).filename as string;
        sanitizedData.resumeUrl = cloudPath;
        sanitizedData.resumePublicId = publicId;
      }

      // Create application using service
      const application = await jobApplicationService.createJobApplication(sanitizedData);

      const response: ApiResponse = {
        success: true,
        message: 'Job application submitted successfully! Our HR team will review your details and contact you soon.',
        data: {
          id: application.id,
          submittedAt: application.submittedAt,
        },
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating job application:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit application',
      });
    }
  });
};

/**
 * Get all job applications (Admin only)
 * GET /api/job-application/submissions
 */
export const getJobApplications = asyncHandler(async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query as Record<string, string>)['page'] || '1') || 1;
    const limit = parseInt((req.query as Record<string, string>)['limit'] || '10') || 10;

    console.log('Fetching job applications, page:', page, 'limit:', limit);

    const result = await jobApplicationService.getAllJobApplications(page, limit);

    console.log('Job applications fetched successfully, count:', result.data.length);

    const response = {
      success: true,
      data: result.data,
      message: `Retrieved ${result.data.length} job applications`,
      meta: {
        pagination: {
          page: result.page,
          limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      },
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getJobApplications:', error);
    throw error;
  }
});

/**
 * Get job application by ID (Admin only)
 * GET /api/job-application/submissions/:id
 */
export const getJobApplicationById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const application = await jobApplicationService.getJobApplicationById(id);

  const response: ApiResponse = {
    success: true,
    data: application,
    message: 'Job application retrieved successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get job application statistics (Admin only)
 * GET /api/job-application/stats
 */
export const getJobApplicationStats = asyncHandler(async (_req: Request, res: Response) => {
  try {
    console.log('Fetching job application statistics');
    
    const stats = await jobApplicationService.getJobApplicationStatistics();

    console.log('Statistics fetched successfully');

    const response: ApiResponse = {
      success: true,
      data: stats,
      message: 'Job application statistics retrieved successfully',
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getJobApplicationStats:', error);
    throw error;
  }
});

/**
 * Download resume file
 * GET /api/job-application/submissions/:id/resume
 */
export const downloadResume = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const filePath = await jobApplicationService.getResumePath(id);
  const fileName = path.basename(filePath);

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).json({
        success: false,
        message: 'Error downloading resume',
      });
    }
  });
});

/**
 * Delete job application (Admin only)
 * DELETE /api/job-application/submissions/:id
 */
export const deleteJobApplication = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  await jobApplicationService.deleteJobApplication(id);

  const response: ApiResponse = {
    success: true,
    message: 'Job application deleted successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});
