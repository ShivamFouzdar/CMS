import { createError } from '@/utils/helpers';

/**
 * Services Service
 * Handles business logic for services management
 */

// Service interface
interface Service {
  id: string;
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
  isActive: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock services data
let services: Service[] = [
  {
    id: 'bpo-services',
    name: 'BPO Services',
    slug: 'bpo',
    description: 'Comprehensive Business Process Outsourcing solutions to streamline your operations and reduce costs while maintaining high quality standards.',
    shortDescription: 'Streamline operations with our comprehensive BPO solutions',
    icon: 'Briefcase',
    category: 'outsourcing',
    features: [
      'Customer Support',
      'Data Entry & Processing',
      'Back Office Operations',
      'Call Center Services',
      'Document Management',
      'Quality Assurance',
    ],
    benefits: [
      'Cost Reduction',
      'Improved Efficiency',
      '24/7 Support',
      'Scalable Solutions',
      'Expert Team',
      'Advanced Technology',
    ],
    process: [
      {
        step: 1,
        title: 'Consultation',
        description: 'We analyze your business needs and requirements',
      },
      {
        step: 2,
        title: 'Customization',
        description: 'Tailored solutions designed for your specific processes',
      },
      {
        step: 3,
        title: 'Implementation',
        description: 'Seamless integration with your existing systems',
      },
      {
        step: 4,
        title: 'Monitoring',
        description: 'Continuous monitoring and optimization for best results',
      },
    ],
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'it-services',
    name: 'IT Services',
    slug: 'it',
    description: 'Full-stack MERN development and comprehensive IT solutions to modernize your business with cutting-edge technology.',
    shortDescription: 'Modernize your business with our MERN stack development',
    icon: 'Code',
    category: 'technology',
    features: [
      'React Frontend Development',
      'Express.js Backend',
      'MongoDB Database Design',
      'Node.js Server Development',
      'Full-Stack Integration',
      'Deployment & DevOps',
    ],
    benefits: [
      'Modern Technology Stack',
      'Scalable Architecture',
      'Fast Development',
      'Cross-Platform Compatibility',
      'Real-time Applications',
      'Cloud Integration',
    ],
    process: [
      {
        step: 1,
        title: 'Planning',
        description: 'Technical architecture and project planning',
      },
      {
        step: 2,
        title: 'Development',
        description: 'Agile development using MERN stack',
      },
      {
        step: 3,
        title: 'Testing',
        description: 'Comprehensive testing and quality assurance',
      },
      {
        step: 4,
        title: 'Deployment',
        description: 'Production deployment and ongoing support',
      },
    ],
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

/**
 * Get all active services
 */
export const getServices = async (category?: string, featured?: boolean): Promise<Service[]> => {
  let filteredServices = services.filter(service => service.isActive);

  // Filter by category if provided
  if (category) {
    filteredServices = filteredServices.filter(service => service.slug === category);
  }

  // Filter featured services if requested
  if (featured === true) {
    filteredServices = filteredServices.filter(service => service.isFeatured).slice(0, 3);
  }

  return filteredServices;
};

/**
 * Get service by slug
 */
export const getServiceBySlug = async (slug: string): Promise<Service> => {
  const service = services.find(s => s.slug === slug && s.isActive);

  if (!service) {
    throw createError('Service not found', 404);
  }

  return service;
};

/**
 * Get service by ID
 */
export const getServiceById = async (id: string): Promise<Service> => {
  const service = services.find(s => s.id === id && s.isActive);

  if (!service) {
    throw createError('Service not found', 404);
  }

  return service;
};

/**
 * Get service categories
 */
export const getServiceCategories = async () => {
  return services
    .filter(service => service.isActive)
    .map(service => ({
      id: service.id,
      name: service.name,
      slug: service.slug,
      shortDescription: service.shortDescription,
      icon: service.icon,
    }));
};

/**
 * Get featured services
 */
export const getFeaturedServices = async (limit: number = 3): Promise<Service[]> => {
  return services
    .filter(service => service.isActive && service.isFeatured)
    .slice(0, limit);
};

/**
 * Get services by category
 */
export const getServicesByCategory = async (category: string): Promise<Service[]> => {
  return services.filter(service =>
    service.category && service.category.toLowerCase() === category.toLowerCase() && service.isActive
  );
};

/**
 * Get service statistics
 */
export const getServiceStatistics = async () => {
  return {
    totalServices: services.length,
    activeServices: services.filter(s => s.isActive).length,
    featuredServices: services.filter(s => s.isFeatured).length,
    categoryDistribution: services.reduce((acc, service) => {
      if (service.category) {
        acc[service.category] = (acc[service.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
  };
};

/**
 * Update service status (activate/deactivate)
 */
export const updateServiceStatus = async (id: string, isActive: boolean): Promise<Service> => {
  const serviceIndex = services.findIndex(s => s.id === id);

  if (serviceIndex === -1) {
    throw createError('Service not found', 404);
  }

  const currentService = services[serviceIndex];
  if (!currentService) {
    throw createError('Service not found', 404);
  }

  services[serviceIndex] = {
    ...currentService,
    isActive,
    updatedAt: new Date().toISOString(),
  };

  return services[serviceIndex]!;
};

/**
 * Update service featured status
 */
export const updateServiceFeatured = async (id: string, isFeatured: boolean): Promise<Service> => {
  const serviceIndex = services.findIndex(s => s.id === id);

  if (serviceIndex === -1) {
    throw createError('Service not found', 404);
  }

  const currentService = services[serviceIndex];
  if (!currentService) {
    throw createError('Service not found', 404);
  }

  services[serviceIndex] = {
    ...currentService,
    isFeatured,
    updatedAt: new Date().toISOString(),
  };

  return services[serviceIndex]!;
};

