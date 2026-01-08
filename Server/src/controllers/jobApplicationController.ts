import { Request, Response } from 'express';
import { asyncHandler, createError } from '@/utils/helpers';
import { sendSuccess } from '@/utils/response.utils';
import path from 'path';
import { JobApplicationService } from '@/services/jobApplication.service';

/**
 * Job Application Controller
 * Handles job application form submissions
 */

const jobApplicationService = new JobApplicationService();

/**
 * @swagger
 * tags:
 *   name: Job Applications
 *   description: Recruitment and Job Submissions
 */

/**
 * @swagger
 * /api/job-application:
 *   post:
 *     summary: Submit a job application
 *     tags: [Job Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Applicant'
 *               - type: object
 *                 properties:
 *                   resume: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Application submitted successfully
 */
export const submitJobApplication = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw createError('Resume file is required', 400);
  }

  const { fullName, email, phone, location, experience, workMode, skillsDescription, hearAboutUs } = req.body;

  const fileData: any = {};
  if (req.file) {
    // @ts-ignore
    fileData.resumePath = (req.file as any).path;
    // @ts-ignore
    fileData.resumeUrl = (req.file as any).path;
    // @ts-ignore
    fileData.resumePublicId = (req.file as any).filename;
  }

  const application = await jobApplicationService.createJobApplication({
    fullName,
    email,
    phone,
    location,
    experience,
    workMode,
    skillsDescription,
    hearAboutUs,
    ...fileData
  });

  // Send notification to admins (non-blocking)
  try {
    const { notifyNewJobApplication } = await import('@/services/notification.service');
    notifyNewJobApplication({
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      experience: application.experience,
    }).catch(err => console.error('Notification error:', err));
  } catch (notifError) {
    console.error('Failed to send notification:', notifError);
  }

  return sendSuccess(res, 'Job application submitted successfully! Our HR team will review your details and contact you soon.', {
    id: application.id,
    submittedAt: application.submittedAt,
  }, 201);
});

/**
 * @swagger
 * /api/job-application/submissions:
 *   get:
 *     summary: Get all job applications (Admin)
 *     tags: [Job Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Applications retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Applicant'
 */
export const getJobApplications = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt((req.query['page'] as string) || '1') || 1;
  const limit = parseInt((req.query['limit'] as string) || '10') || 10;

  const result = await jobApplicationService.getAllJobApplications(page, limit);
  return sendSuccess(res, `Retrieved ${result.data.length} job applications`, result.data);
});

/**
 * @swagger
 * /api/job-application/submissions/{id}:
 *   get:
 *     summary: Get application by ID (Admin)
 *     tags: [Job Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Application retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Applicant'
 */
export const getJobApplicationById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const application = await jobApplicationService.getJobApplicationById(id);
  return sendSuccess(res, 'Job application retrieved successfully', application);
});

/**
 * @swagger
 * /api/job-application/stats:
 *   get:
 *     summary: Get recruitment statistics (Admin)
 *     tags: [Job Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved
 */
export const getJobApplicationStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await jobApplicationService.getJobApplicationStatistics();
  return sendSuccess(res, 'Job application statistics retrieved successfully', stats);
});

/**
 * @swagger
 * /api/job-application/submissions/{id}/resume:
 *   get:
 *     summary: Download candidate resume (Admin)
 *     tags: [Job Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Redirects to cloud file or starts download
 */
export const downloadResume = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const filePath = await jobApplicationService.getResumePath(id);
  const fileName = path.basename(filePath);

  if (filePath.startsWith('http')) {
    res.redirect(filePath);
  } else {
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({
          success: false,
          message: 'Error downloading resume',
        });
      }
    });
  }
});

/**
 * @swagger
 * /api/job-application/submissions/{id}:
 *   delete:
 *     summary: Delete job application (Admin)
 *     tags: [Job Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Application deleted
 */
export const deleteJobApplication = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  await jobApplicationService.deleteJobApplication(id);
  return sendSuccess(res, 'Job application deleted successfully');
});
