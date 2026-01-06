import { Service } from '@/models';
import { createError } from '@/utils/helpers';

/**
 * Services Service
 * Handles business logic for services management
 */

// Service interface (aligned with Model)
interface ServiceData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  features: string[];
  benefits: string[];
  process: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  pricing?: {
    basic: number;
    premium: number;
    enterprise: number;
  };
  category: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

/**
 * Get all active services
 */
export const getServices = async (category?: string, featured?: boolean) => {
  const query: any = { isActive: true };

  if (category) {
    query.slug = category;
  }

  if (featured) {
    query.isFeatured = true;
  }

  // If featured is specifically requested as true, limit to 3, otherwise return all matching
  const servicesQuery = Service.find(query).sort({ order: 1, createdAt: -1 });

  if (featured) {
    servicesQuery.limit(3);
  }

  return await servicesQuery;
};

/**
 * Get service by slug
 */
export const getServiceBySlug = async (slug: string) => {
  const service = await Service.findOne({ slug, isActive: true });

  if (!service) {
    throw createError('Service not found', 404);
  }

  return service;
};

/**
 * Get service by ID
 */
export const getServiceById = async (id: string) => {
  const service = await Service.findOne({ _id: id, isActive: true });

  if (!service) {
    throw createError('Service not found', 404);
  }

  return service;
};

/**
 * Create new service
 */
export const createService = async (data: ServiceData) => {
  // Check if slug already exists
  const existingService = await Service.findOne({ slug: data.slug });
  if (existingService) {
    throw createError('Service with this slug already exists', 400);
  }

  const service = await Service.create({
    ...data,
    isActive: true,
    isFeatured: false,
  });

  return service;
};

/**
 * Update service
 */
export const updateService = async (id: string, data: Partial<ServiceData>) => {
  const service = await Service.findById(id);

  if (!service) {
    throw createError('Service not found', 404);
  }

  // If updating slug, check if it exists
  if (data.slug && data.slug !== service.slug) {
    const existingService = await Service.findOne({ slug: data.slug });
    if (existingService) {
      throw createError('Service with this slug already exists', 400);
    }
  }

  Object.assign(service, data);
  await service.save();

  return service;
};

/**
 * Delete service (Soft delete)
 */
export const deleteService = async (id: string) => {
  const service = await Service.findById(id);

  if (!service) {
    throw createError('Service not found', 404);
  }

  service.isActive = false;
  await service.save();

  return { message: 'Service deleted successfully' };
};

/**
 * Get service categories
 */
export const getServiceCategories = async () => {
  return await Service.getCategories();
};

/**
 * Get featured services
 */
export const getFeaturedServices = async (limit: number = 3) => {
  return await Service.getFeatured(limit);
};

/**
 * Get services by category
 */
export const getServicesByCategory = async (category: string) => {
  return await Service.getByCategory(category);
};

/**
 * Get service statistics
 */
export const getServiceStatistics = async () => {
  return await Service.getStats();
};

/**
 * Update service status (activate/deactivate)
 */
export const updateServiceStatus = async (id: string, isActive: boolean) => {
  const service = await Service.findById(id);

  if (!service) {
    throw createError('Service not found', 404);
  }

  service.isActive = isActive;
  await service.save();

  return service;
};

/**
 * Update service featured status
 */
export const updateServiceFeatured = async (id: string, isFeatured: boolean) => {
  const service = await Service.findById(id);

  if (!service) {
    throw createError('Service not found', 404);
  }

  service.isFeatured = isFeatured;
  await service.save();

  return service;
};


