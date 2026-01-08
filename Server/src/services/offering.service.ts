
import { ServiceRepository } from '@/repositories/service.repository';
import { IService } from '@/models/Service';
import { createError } from '@/utils/helpers';

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
        currency: string;
    };
    category: string;
    isActive?: boolean;
    isFeatured?: boolean;
}

export class OfferingService {
    private repository: ServiceRepository;

    constructor() {
        this.repository = new ServiceRepository();
    }

    /**
     * Get all active services
     */
    async getServices(category?: string, featured?: boolean): Promise<IService[]> {
        const limit = featured ? 3 : undefined;

        // Note: The original logic had a specific "If featured is specifically requested as true, limit to 3" rule.
        // I am preserving that logic here.
        return await this.repository.findActive(category, featured, limit);
    }

    /**
     * Get all services including inactive (Admin)
     */
    async getAllServicesAdmin(): Promise<IService[]> {
        return await this.repository.findAll();
    }

    /**
     * Get service by slug
     */
    async getServiceBySlug(slug: string): Promise<IService> {
        const service = await this.repository.findBySlug(slug);

        if (!service) {
            throw createError('Service not found', 404);
        }

        return service;
    }

    /**
     * Get service by ID
     */
    async getServiceById(id: string): Promise<IService> {
        const service = await this.repository.findById(id);

        if (!service) {
            throw createError('Service not found', 404);
        }

        // Ensure we only return active services for public view if that was the intent.
        // Original code: findOne({ _id: id, isActive: true })
        // valid check:
        if (!service.isActive) {
            throw createError('Service not found', 404);
        }

        return service;
    }

    /**
     * Create new service
     */
    async createService(data: ServiceData): Promise<IService> {
        // Check if slug already exists
        const existingService = await this.repository.findOne({ slug: data.slug });
        if (existingService) {
            throw createError('Service with this slug already exists', 400);
        }

        return await this.repository.create({
            ...data,
            isActive: true,
            isFeatured: false,
        });
    }

    /**
     * Update service
     */
    async updateService(id: string, data: Partial<ServiceData>): Promise<IService> {
        const service = await this.repository.findById(id);

        if (!service) {
            throw createError('Service not found', 404);
        }

        // If updating slug, check if it exists
        if (data.slug && data.slug !== service.slug) {
            const existingService = await this.repository.findOne({ slug: data.slug });
            if (existingService) {
                throw createError('Service with this slug already exists', 400);
            }
        }

        const updated = await this.repository.update(id, data);
        if (!updated) {
            throw createError('Failed to update service', 500);
        }
        return updated;
    }

    /**
     * Delete service (Soft delete)
     */
    async deleteService(id: string): Promise<{ message: string }> {
        const service = await this.repository.findById(id);

        if (!service) {
            throw createError('Service not found', 404);
        }

        // Soft delete: set isActive to false
        await this.repository.update(id, { isActive: false });

        return { message: 'Service deleted successfully' };
    }

    /**
     * Get service categories
     */
    async getServiceCategories(): Promise<string[]> {
        return await this.repository.getCategories();
    }

    /**
     * Get featured services
     */
    async getFeaturedServices(limit: number = 3): Promise<IService[]> {
        return await this.repository.findActive(undefined, true, limit);
    }

    /**
     * Get services by category
     */
    async getServicesByCategory(category: string): Promise<IService[]> {
        return await this.repository.findByCategory(category);
    }

    /**
     * Get service statistics
     */
    async getServiceStatistics(): Promise<any> {
        return await this.repository.getStats();
    }

    /**
     * Update service status (activate/deactivate)
     */
    async updateServiceStatus(id: string, isActive: boolean): Promise<IService> {
        const service = await this.repository.findById(id);

        if (!service) {
            throw createError('Service not found', 404);
        }

        const updated = await this.repository.update(id, { isActive });
        if (!updated) throw createError('Update failed', 500);
        return updated;
    }

    /**
     * Toggle service status
     */
    async toggleServiceStatus(id: string): Promise<IService> {
        const service = await this.repository.findById(id);

        if (!service) {
            throw createError('Service not found', 404);
        }

        const updated = await this.repository.update(id, { isActive: !service.isActive });
        if (!updated) throw createError('Update failed', 500);
        return updated;
    }

    /**
     * Update service featured status
     */
    async updateServiceFeatured(id: string, isFeatured: boolean): Promise<IService> {
        const service = await this.repository.findById(id);

        if (!service) {
            throw createError('Service not found', 404);
        }

        const updated = await this.repository.update(id, { isFeatured });
        if (!updated) throw createError('Update failed', 500);
        return updated;
    }
}
