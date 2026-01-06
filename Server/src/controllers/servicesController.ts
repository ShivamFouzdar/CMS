import { Request, Response } from 'express';
import { asyncHandler, createError, sanitizeInput } from '@/utils/helpers';
import { ApiResponse } from '@/types';
import * as servicesService from '@/services/servicesService';

/**
 * Services Controller
 * Handles services data and management
 */

/**
 * Get all active services
 * GET /api/services
 */
export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const { category, featured } = req.query;

  const services = await servicesService.getServices(
    category?.toString(),
    featured === 'true'
  );

  const response: ApiResponse = {
    success: true,
    data: services,
    message: `Retrieved ${services.length} services`,
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get service by slug
 * GET /api/services/:slug
 */
export const getServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (!slug) {
    throw createError('Slug is required', 400);
  }

  const service = await servicesService.getServiceBySlug(slug);

  const response: ApiResponse = {
    success: true,
    data: service,
    message: 'Service retrieved successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get service by ID
 * GET /api/services/id/:id
 */
export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const service = await servicesService.getServiceById(id);

  const response: ApiResponse = {
    success: true,
    data: service,
    message: 'Service retrieved successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Create new service (Admin only)
 * POST /api/services
 */
export const createService = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug, description, shortDescription, features, benefits, process, category } = req.body;

  // Validation
  if (!name || !slug || !description || !shortDescription || !category) {
    throw createError('Name, slug, description, shortDescription, and category are required', 400);
  }

  // Sanitize inputs
  const sanitizedData = {
    name: sanitizeInput(name),
    slug: sanitizeInput(slug),
    description: sanitizeInput(description),
    shortDescription: sanitizeInput(shortDescription),
    category: sanitizeInput(category),
    features: features ? features.map((f: string) => sanitizeInput(f)) : [],
    benefits: benefits ? benefits.map((b: string) => sanitizeInput(b)) : [],
    process: process || [],
    icon: 'Briefcase', // Default icon, should be updated to accept icon from body if needed
  };

  const newService = await servicesService.createService(sanitizedData);

  const response: ApiResponse = {
    success: true,
    data: newService,
    message: 'Service created successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(201).json(response);
});

/**
 * Update service (Admin only)
 * PUT /api/services/:id
 */
export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  // Sanitize update data
  const sanitizedData: any = { ...updateData };
  if (updateData.name) sanitizedData.name = sanitizeInput(updateData.name);
  if (updateData.description) sanitizedData.description = sanitizeInput(updateData.description);
  if (updateData.shortDescription) sanitizedData.shortDescription = sanitizeInput(updateData.shortDescription);
  if (updateData.slug) sanitizedData.slug = sanitizeInput(updateData.slug);
  if (updateData.category) sanitizedData.category = sanitizeInput(updateData.category);

  if (!id) {
    throw createError('ID is required', 400);
  }

  const updatedService = await servicesService.updateService(id, sanitizedData);

  const response: ApiResponse = {
    success: true,
    data: updatedService,
    message: 'Service updated successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Delete service (Admin only)
 * DELETE /api/services/:id
 */
export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  await servicesService.deleteService(id);

  const response: ApiResponse = {
    success: true,
    message: 'Service deleted successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get service categories
 * GET /api/services/categories
 */
export const getServiceCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await servicesService.getServiceCategories();

  const response: ApiResponse = {
    success: true,
    data: categories,
    message: 'Service categories retrieved successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get featured services
 * GET /api/services/featured
 */
export const getFeaturedServices = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 3 } = req.query;

  const featuredServices = await servicesService.getFeaturedServices(parseInt(limit.toString()));

  const response: ApiResponse = {
    success: true,
    data: featuredServices,
    message: `Retrieved ${featuredServices.length} featured services`,
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get services by category
 * GET /api/services/category/:category
 */
export const getServicesByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;

  if (!category) {
    throw createError('Category parameter is required', 400);
  }

  const categoryServices = await servicesService.getServicesByCategory(category);

  const response: ApiResponse = {
    success: true,
    data: categoryServices,
    message: `Retrieved ${categoryServices.length} services for ${category}`,
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get service statistics
 * GET /api/services/stats
 */
export const getServiceStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await servicesService.getServiceStatistics();

  const response: ApiResponse = {
    success: true,
    data: stats,
    message: 'Service statistics retrieved successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Activate service
 * PATCH /api/services/:id/activate
 */
export const activateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const service = await servicesService.updateServiceStatus(id, true);

  const response: ApiResponse = {
    success: true,
    data: service,
    message: 'Service activated successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Deactivate service
 * PATCH /api/services/:id/deactivate
 */
export const deactivateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const service = await servicesService.updateServiceStatus(id, false);

  const response: ApiResponse = {
    success: true,
    data: service,
    message: 'Service deactivated successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Feature service
 * PATCH /api/services/:id/feature
 */
export const featureService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const service = await servicesService.updateServiceFeatured(id, true);

  const response: ApiResponse = {
    success: true,
    data: service,
    message: 'Service featured successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Unfeature service
 * PATCH /api/services/:id/unfeature
 */
export const unfeatureService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createError('ID is required', 400);
  }

  const service = await servicesService.updateServiceFeatured(id, false);

  const response: ApiResponse = {
    success: true,
    data: service,
    message: 'Service unfeatured successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});