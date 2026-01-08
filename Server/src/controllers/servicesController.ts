import { Request, Response } from 'express';
import { asyncHandler, createError, sanitizeInput } from '@/utils/helpers';
import { sendSuccess } from '@/utils/response.utils';
import { OfferingService } from '@/services/offering.service';

/**
 * Services Controller
 * Handles services data and management
 */

// Initialize Service
const offeringService = new OfferingService();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service Offerings and Management
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all active services
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter services by category
 *       - in: query
 *         name: featured
 *         schema: { type: boolean }
 *         description: Filter only featured services
 *     responses:
 *       200:
 *         description: List of services retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 */
export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const { category, featured } = req.query;

  const services = await offeringService.getServices(
    category?.toString(),
    featured === 'true'
  );

  return sendSuccess(res, `Retrieved ${services.length} services`, services);
});

/**
 * @swagger
 * /api/services/admin/all:
 *   get:
 *     summary: Get all services (Admin - includes inactive)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all services retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 */
export const getAdminServices = asyncHandler(async (_req: Request, res: Response) => {
  const services = await offeringService.getAllServicesAdmin();
  return sendSuccess(res, `Retrieved ${services.length} services for admin`, services);
});

/**
 * @swagger
 * /api/services/{slug}:
 *   get:
 *     summary: Get service by slug
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 */
export const getServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (!slug) {
    throw createError('Slug is required', 400);
  }

  const service = await offeringService.getServiceBySlug(slug);
  return sendSuccess(res, 'Service retrieved successfully', service);
});

/**
 * @swagger
 * /api/services/id/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 */
export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const service = await offeringService.getServiceById(id);
  return sendSuccess(res, 'Service retrieved successfully', service);
});

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create new service (Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 */
export const createService = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug, description, shortDescription, features, benefits, process, category, icon } = req.body;

  const sanitizedData = {
    name: sanitizeInput(name),
    slug: sanitizeInput(slug),
    description: sanitizeInput(description),
    shortDescription: sanitizeInput(shortDescription),
    category: sanitizeInput(category),
    features: features ? features.map((f: string) => sanitizeInput(f)) : [],
    benefits: benefits ? benefits.map((b: string) => sanitizeInput(b)) : [],
    process: process || [],
    icon: sanitizeInput(icon) || 'Briefcase',
  };

  const newService = await offeringService.createService(sanitizedData);
  return sendSuccess(res, 'Service created successfully', newService, 201);
});

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update service (Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Service updated successfully
 */
export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const sanitizedData: any = { ...updateData };
  if (updateData.name) sanitizedData.name = sanitizeInput(updateData.name);
  if (updateData.description) sanitizedData.description = sanitizeInput(updateData.description);
  if (updateData.shortDescription) sanitizedData.shortDescription = sanitizeInput(updateData.shortDescription);
  if (updateData.slug) sanitizedData.slug = sanitizeInput(updateData.slug);
  if (updateData.category) sanitizedData.category = sanitizeInput(updateData.category);

  if (!id) {
    throw createError('ID is required', 400);
  }

  const updatedService = await offeringService.updateService(id, sanitizedData);
  return sendSuccess(res, 'Service updated successfully', updatedService);
});

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete service (Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Service deleted successfully
 */
export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  await offeringService.deleteService(id);
  return sendSuccess(res, 'Service deleted successfully');
});

/**
 * @swagger
 * /api/services/categories:
 *   get:
 *     summary: Get all service categories
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Service categories retrieved
 */
export const getServiceCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await offeringService.getServiceCategories();
  return sendSuccess(res, 'Service categories retrieved successfully', categories);
});

/**
 * @swagger
 * /api/services/featured:
 *   get:
 *     summary: Get featured services
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 3 }
 *     responses:
 *       200:
 *         description: Featured services retrieved
 */
export const getFeaturedServices = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 3 } = req.query;
  const featuredServices = await offeringService.getFeaturedServices(parseInt(limit.toString()));
  return sendSuccess(res, `Retrieved ${featuredServices.length} featured services`, featuredServices);
});

/**
 * @swagger
 * /api/services/category/{category}:
 *   get:
 *     summary: Get services by category
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Services retrieved successfully
 */
export const getServicesByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;

  if (!category) {
    throw createError('Category parameter is required', 400);
  }

  const categoryServices = await offeringService.getServicesByCategory(category);
  return sendSuccess(res, `Retrieved ${categoryServices.length} services for ${category}`, categoryServices);
});

/**
 * @swagger
 * /api/services/stats:
 *   get:
 *     summary: Get service statistics
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Service statistics retrieved
 */
export const getServiceStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await offeringService.getServiceStatistics();
  return sendSuccess(res, 'Service statistics retrieved successfully', stats);
});

/**
 * @swagger
 * /api/services/{id}/activate:
 *   patch:
 *     summary: Activate service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Service activated successfully
 */
export const activateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const service = await offeringService.updateServiceStatus(id, true);
  return sendSuccess(res, 'Service activated successfully', service);
});

/**
 * @swagger
 * /api/services/{id}/deactivate:
 *   patch:
 *     summary: Deactivate service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Service deactivated successfully
 */
export const deactivateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const service = await offeringService.updateServiceStatus(id, false);
  return sendSuccess(res, 'Service deactivated successfully', service);
});

/**
 * @swagger
 * /api/services/{id}/toggle-status:
 *   patch:
 *     summary: Toggle service status
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Service status toggled successfully
 */
export const toggleServiceStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const service = await offeringService.toggleServiceStatus(id);
  return sendSuccess(res, 'Service status toggled successfully', service);
});

/**
 * @swagger
 * /api/services/{id}/feature:
 *   patch:
 *     summary: Feature service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Service featured successfully
 */
export const featureService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const service = await offeringService.updateServiceFeatured(id, true);
  return sendSuccess(res, 'Service featured successfully', service);
});

/**
 * @swagger
 * /api/services/{id}/unfeature:
 *   patch:
 *     summary: Unfeature service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Service unfeatured successfully
 */
export const unfeatureService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const service = await offeringService.updateServiceFeatured(id, false);
  return sendSuccess(res, 'Service unfeatured successfully', service);
});