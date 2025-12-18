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
      console.error('File upload error:', err);
      res.status(400).json({
        success: false,
        message: err.message || 'File upload failed',
      });
      return;
    }

    const { fullName, email, phone, location, experience, workMode, skillsDescription, hearAboutUs } = req.body;

    // Log received data for debugging
    console.log('Received job application data:', {
      fullName,
      email,
      phone,
      location,
      experience,
      workMode,
      skillsDescription: skillsDescription ? `${skillsDescription.substring(0, 50)}...` : 'empty',
      hearAboutUs,
      hasFile: !!req.file,
      fileInfo: req.file ? { originalname: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size } : null,
    });

    // Validation - check for empty strings as well
    const missingFields: string[] = [];
    if (!fullName || fullName.trim() === '') missingFields.push('fullName');
    if (!email || email.trim() === '') missingFields.push('email');
    if (!phone || phone.trim() === '') missingFields.push('phone');
    if (!location || location.trim() === '') missingFields.push('location');
    if (!experience || experience.trim() === '') missingFields.push('experience');
    if (!workMode || workMode.trim() === '') missingFields.push('workMode');
    if (!skillsDescription || skillsDescription.trim() === '') missingFields.push('skillsDescription');
    if (!hearAboutUs || hearAboutUs.trim() === '') missingFields.push('hearAboutUs');

    if (missingFields.length > 0) {
      console.error('Validation failed - missing fields:', missingFields);
      res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields,
      });
      return;
    }

    if (!validateEmail(email)) {
      console.error('Validation failed - invalid email:', email);
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
      return;
    }

    if (!req.file) {
      console.error('Validation failed - no resume file uploaded');
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

      // Send notification to admins (non-blocking)
      try {
        const { notifyNewJobApplication } = await import('@/services/notificationService');
        notifyNewJobApplication({
          fullName: sanitizedData.fullName,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          experience: sanitizedData.experience,
        }).catch(err => console.error('Notification error:', err));
      } catch (notifError) {
        console.error('Failed to send notification:', notifError);
      }

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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({
        success: false,
        message: 'Failed to submit application',
        error: process.env['NODE_ENV'] === 'development' ? errorMessage : undefined,
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
