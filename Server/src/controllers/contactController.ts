import { Request, Response } from 'express';
import { asyncHandler, createError } from '@/utils/helpers';
import { ApiResponse } from '@/types';
import * as contactService from '@/services/contactService';

/**
 * Contact Controller
 * Handles HTTP requests for contact form submissions
 */

/**
 * Submit contact form
 * POST /api/contact
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

  const response: ApiResponse = {
    success: true,
    message: 'Your message has been sent successfully! We will get back to you soon.',
    data: result,
    timestamp: new Date().toISOString(),
  };

  res.status(201).json(response);
});

/**
 * Get all contact submissions (Admin only)
 * GET /api/contact/submissions
 */
export const getContactSubmissions = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt((req.query as Record<string, string>)['page'] || '1') || 1;
  const limit = parseInt((req.query as Record<string, string>)['limit'] || '10') || 10;

  const result = await contactService.getAllContactSubmissions(page, limit);

  const response: ApiResponse = {
    success: true,
    data: result.data,
    message: `Retrieved ${result.data.length} contact submissions`,
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get contact submission by ID (Admin only)
 * GET /api/contact/submissions/:id
 */
export const getContactSubmissionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const submission = await contactService.getContactSubmissionById(id);

  const response: ApiResponse = {
    success: true,
    data: submission,
    message: 'Contact submission retrieved successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Update contact submission status (Admin only)
 * PATCH /api/contact/submissions/:id/status
 */
export const updateContactSubmissionStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const submission = await contactService.updateContactSubmissionStatus(id, status, notes);

  const response: ApiResponse = {
    success: true,
    data: submission,
    message: 'Contact submission status updated successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Delete contact submission (Admin only)
 * DELETE /api/contact/submissions/:id
 */
export const deleteContactSubmission = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  await contactService.deleteContactSubmission(id);

  const response: ApiResponse = {
    success: true,
    message: 'Contact submission deleted successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get contact statistics (Admin only)
 * GET /api/contact/stats
 */
export const getContactStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await contactService.getContactStatistics();

  const response: ApiResponse = {
    success: true,
    data: stats,
    message: 'Contact statistics retrieved successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get contacts by service (Admin only)
 * GET /api/contact/by-service/:service
 */
export const getContactsByService = asyncHandler(async (req: Request, res: Response) => {
  const { service } = req.params;
  const { limit } = req.query;

  if (!service) {
    throw createError('Service parameter is required', 400);
  }

  const contacts = await contactService.getContactsByService(service, parseInt(limit as string) || 10);

  const response: ApiResponse = {
    success: true,
    data: contacts,
    message: `Retrieved ${contacts.length} contacts for ${service}`,
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Mark contact as contacted (Admin only)
 * PATCH /api/contact/submissions/:id/contacted
 */
export const markContactAsContacted = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const submission = await contactService.markContactAsContacted(id);

  const response: ApiResponse = {
    success: true,
    data: submission,
    message: 'Contact marked as contacted successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});
