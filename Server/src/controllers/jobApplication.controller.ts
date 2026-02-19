import { Request, Response } from 'express';
import logger from '@/utils/logger.js';
import { asyncHandler, createError } from '@/utils/helpers.js';
import { sendSuccess, sendError } from '@/utils/response.utils.js';
import path from 'path';
import { JobApplicationService } from '@/services/jobApplication.service.js';

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
    const { notifyNewJobApplication } = await import('@/services/notification.service.js');
    notifyNewJobApplication({
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      experience: application.experience,
    }).catch(err => logger.error(`Notification error: ${err}`));
  } catch (notifError) {
    logger.error(`Failed to send notification: ${notifError}`);
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
  const search = (req.query['search'] as string) || '';

  const result = await jobApplicationService.getAllJobApplications(page, limit, search);
  return sendSuccess(res, `Retrieved ${result.data.length} job applications`, result.data);
});

/**
 * @swagger
 * /api/job-application/export:
 *   get:
 *     summary: Export applications to CSV (Admin)
 *     tags: [Job Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file download
 */
export const exportApplications = asyncHandler(async (_req: Request, res: Response) => {
  const csv = await jobApplicationService.exportApplications();
  const date = new Date().toISOString().split('T')[0];

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=applications-${date}.csv`);
  res.status(200).send(csv);
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
  const application = await jobApplicationService.getJobApplicationById(id!);
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
  const filePath = await jobApplicationService.getResumePath(id!);
  const fileName = path.basename(filePath);

  if (filePath.startsWith('http')) {
    res.redirect(filePath);
  } else {
    res.download(filePath, fileName, (err) => {
      if (err) {
        logger.error(`Error downloading file: ${err}`);
        if (!res.headersSent) {
          sendError(res, 'Error downloading resume', err, 500);
        }
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
  await jobApplicationService.deleteJobApplication(id!);
  return sendSuccess(res, 'Job application deleted successfully');
});

/**
 * @swagger
 * /api/job-application/submissions/bulk-delete:
 *   post:
 *     summary: Bulk delete job applications (Admin)
 *     tags: [Job Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       200:
 *         description: Applications deleted
 */
export const bulkDeleteJobApplications = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = req.body;
  const count = await jobApplicationService.bulkDeleteJobApplications(ids);
  return sendSuccess(res, `Deleted ${count} job applications successfully`, { count });
});

/**
 * @swagger
 * /api/job-application/submissions/{id}/status:
 *   patch:
 *     summary: Update job application status (Admin)
 *     tags: [Job Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: 
 *                 type: string
 *                 enum: [new, reviewing, shortlisted, rejected, hired]
 *     responses:
 *       200:
 *         description: Status updated
 */
export const updateJobApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const application = await jobApplicationService.updateJobApplicationStatus(id!, status);
  return sendSuccess(res, 'Job application status updated successfully', application);
});

/**
 * @swagger
 * /api/job-application/submissions/bulk-status:
 *   patch:
 *     summary: Bulk update job application status (Admin)
 *     tags: [Job Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items: { type: string }
 *               status:
 *                 type: string
 *                 enum: [new, reviewing, shortlisted, rejected, hired]
 *     responses:
 *       200:
 *         description: Statuses updated
 */
export const bulkUpdateJobApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
  const { ids, status } = req.body;
  const count = await jobApplicationService.bulkUpdateJobApplicationStatus(ids, status);
  return sendSuccess(res, `Updated ${count} job applications successfully`, { count });
});
