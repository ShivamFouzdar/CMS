import { Request, Response } from 'express';
import { asyncHandler, createError } from '@/utils/helpers';
import { sendSuccess } from '@/utils/response.utils';
import { ContactService } from '@/services/contact.service';

/**
 * Contact Controller
 * Handles HTTP requests for contact form submissions
 */

const contactService = new ContactService();

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact Form Submissions and Lead Management
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit contact form
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
export const submitContactForm = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, company, service, message } = req.body;

  const result = await contactService.submitContactForm({
    name,
    email,
    phone,
    company,
    service,
    message,
  });

  // Send notification to admins (non-blocking)
  try {
    const { notifyNewLead } = await import('@/services/notification.service');
    notifyNewLead({
      name,
      email,
      phone,
      service: service || 'General Enquiry',
      message,
    }).catch(err => console.error('Notification error:', err));
  } catch (notifError) {
    console.error('Failed to send notification:', notifError);
  }

  return sendSuccess(res, 'Your message has been sent successfully! We will get back to you soon.', result, 201);
});

/**
 * @swagger
 * /api/contact/submissions:
 *   get:
 *     summary: Get all contact submissions (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: List of contact submissions retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 */
export const getContactSubmissions = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt((req.query['page'] as string) || '1') || 1;
  const limit = parseInt((req.query['limit'] as string) || '10') || 10;

  const result = await contactService.getAllContactSubmissions(page, limit);

  return sendSuccess(res, `Retrieved ${result.data.length} contact submissions`, result.data, 200);
});

/**
 * @swagger
 * /api/contact/submissions/{id}:
 *   get:
 *     summary: Get contact submission by ID (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Contact submission retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 */
export const getContactSubmissionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const submission = await contactService.getContactSubmissionById(id);
  return sendSuccess(res, 'Contact submission retrieved successfully', submission);
});

/**
 * @swagger
 * /api/contact/submissions/{id}/status:
 *   patch:
 *     summary: Update contact submission status (Admin only)
 *     tags: [Contacts]
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
 *               status: { type: string }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
export const updateContactSubmissionStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const submission = await contactService.updateContactSubmissionStatus(id, status, notes);
  return sendSuccess(res, 'Contact submission status updated successfully', submission);
});

/**
 * @swagger
 * /api/contact/submissions/{id}:
 *   delete:
 *     summary: Delete contact submission (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Submission deleted
 */
export const deleteContactSubmission = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  await contactService.deleteContactSubmission(id);
  return sendSuccess(res, 'Contact submission deleted successfully');
});

/**
 * @swagger
 * /api/contact/stats:
 *   get:
 *     summary: Get contact statistics (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved
 */
export const getContactStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await contactService.getContactStatistics();
  return sendSuccess(res, 'Contact statistics retrieved successfully', stats);
});

/**
 * @swagger
 * /api/contact/by-service/{service}:
 *   get:
 *     summary: Get contacts by service (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: service
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Contacts retrieved
 */
export const getContactsByService = asyncHandler(async (req: Request, res: Response) => {
  const { service } = req.params;
  const { limit } = req.query;

  if (!service) {
    throw createError('Service parameter is required', 400);
  }

  const contacts = await contactService.getContactsByService(service, parseInt(limit as string) || 10);
  return sendSuccess(res, `Retrieved ${contacts.length} contacts for ${service}`, contacts);
});

/**
 * @swagger
 * /api/contact/submissions/{id}/contacted:
 *   patch:
 *     summary: Mark contact as contacted (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Contact marked as contacted
 */
export const markContactAsContacted = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const submission = await contactService.markContactAsContacted(id);
  return sendSuccess(res, 'Contact marked as contacted successfully', submission);
});
