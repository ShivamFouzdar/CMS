import { Request, Response } from 'express';
import { asyncHandler, createError, sanitizeInput } from '@/utils/helpers';
import { ApiResponse } from '@/types';

/**
 * Services Controller
 * Handles services data and management
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

// Mock services data (replace with database in production)
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
      'Quality Assurance'
    ],
    benefits: [
      'Cost Reduction',
      'Improved Efficiency',
      '24/7 Support',
      'Scalable Solutions',
      'Expert Team',
      'Advanced Technology'
    ],
    process: [
      {
        step: 1,
        title: 'Consultation',
        description: 'We analyze your business needs and requirements'
      },
      {
        step: 2,
        title: 'Customization',
        description: 'Tailored solutions designed for your specific processes'
      },
      {
        step: 3,
        title: 'Implementation',
        description: 'Seamless integration with your existing systems'
      },
      {
        step: 4,
        title: 'Monitoring',
        description: 'Continuous monitoring and optimization for best results'
      }
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
      'Deployment & DevOps'
    ],
    benefits: [
      'Modern Technology Stack',
      'Scalable Architecture',
      'Fast Development',
      'Cross-Platform Compatibility',
      'Real-time Applications',
      'Cloud Integration'
    ],
    process: [
      {
        step: 1,
        title: 'Planning',
        description: 'Technical architecture and project planning'
      },
      {
        step: 2,
        title: 'Development',
        description: 'Agile development using MERN stack'
      },
      {
        step: 3,
        title: 'Testing',
        description: 'Comprehensive testing and quality assurance'
      },
      {
        step: 4,
        title: 'Deployment',
        description: 'Production deployment and ongoing support'
      }
    ],
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'recruitment',
    name: 'Recruitment',
    slug: 'recruitment',
    description: 'Expert talent acquisition services to help you find the right candidates for your organization.',
    shortDescription: 'Find the right talent for your organization',
    icon: 'Users',
    category: 'hr',
    features: [
      'Executive Search',
      'Technical Recruitment',
      'Temporary Staffing',
      'Background Verification',
      'Interview Coordination',
      'Onboarding Support'
    ],
    benefits: [
      'Access to Top Talent',
      'Reduced Time-to-Hire',
      'Cost-Effective Solutions',
      'Industry Expertise',
      'Quality Assurance',
      'Long-term Partnership'
    ],
    process: [
      {
        step: 1,
        title: 'Requirement Analysis',
        description: 'Understanding your hiring needs and culture'
      },
      {
        step: 2,
        title: 'Sourcing',
        description: 'Active sourcing from multiple channels'
      },
      {
        step: 3,
        title: 'Screening',
        description: 'Comprehensive candidate screening and assessment'
      },
      {
        step: 4,
        title: 'Placement',
        description: 'Final selection and successful placement'
      }
    ],
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'legal-services',
    name: 'Legal Services',
    slug: 'legal',
    description: 'Professional legal process outsourcing to support your legal operations with expert knowledge and efficiency.',
    shortDescription: 'Professional legal process outsourcing solutions',
    icon: 'Scale',
    category: 'legal',
    features: [
      'Contract Review',
      'Legal Research',
      'Document Drafting',
      'Compliance Management',
      'Litigation Support',
      'Intellectual Property'
    ],
    benefits: [
      'Expert Legal Knowledge',
      'Cost Reduction',
      'Faster Turnaround',
      'Quality Assurance',
      'Confidentiality',
      'Scalable Services'
    ],
    process: [
      {
        step: 1,
        title: 'Case Analysis',
        description: 'Thorough analysis of legal requirements'
      },
      {
        step: 2,
        title: 'Research',
        description: 'Comprehensive legal research and documentation'
      },
      {
        step: 3,
        title: 'Drafting',
        description: 'Professional document drafting and review'
      },
      {
        step: 4,
        title: 'Delivery',
        description: 'Timely delivery with quality assurance'
      }
    ],
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'kpo-services',
    name: 'KPO Services',
    slug: 'kpo',
    description: 'Knowledge Process Outsourcing solutions leveraging domain expertise to deliver high-value analytical and research services.',
    shortDescription: 'High-value analytical and research services',
    icon: 'Brain',
    category: 'analytics',
    features: [
      'Market Research',
      'Data Analytics',
      'Financial Analysis',
      'Business Intelligence',
      'Risk Assessment',
      'Strategic Planning'
    ],
    benefits: [
      'Domain Expertise',
      'Advanced Analytics',
      'Strategic Insights',
      'Cost Efficiency',
      'Quality Deliverables',
      'Competitive Advantage'
    ],
    process: [
      {
        step: 1,
        title: 'Requirement Gathering',
        description: 'Understanding your analytical needs'
      },
      {
        step: 2,
        title: 'Data Collection',
        description: 'Comprehensive data gathering and validation'
      },
      {
        step: 3,
        title: 'Analysis',
        description: 'Advanced analytical processing and insights'
      },
      {
        step: 4,
        title: 'Reporting',
        description: 'Detailed reports and actionable recommendations'
      }
    ],
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'customer-support',
    name: 'Customer Support',
    slug: 'support',
    description: '24/7 customer support services to enhance customer satisfaction and build lasting relationships.',
    shortDescription: '24/7 customer support for enhanced satisfaction',
    icon: 'Headphones',
    category: 'support',
    features: [
      '24/7 Support',
      'Multi-channel Support',
      'Technical Support',
      'Customer Onboarding',
      'Issue Resolution',
      'Customer Feedback'
    ],
    benefits: [
      'Round-the-Clock Support',
      'Improved Satisfaction',
      'Reduced Response Time',
      'Expert Support Team',
      'Cost-Effective',
      'Scalable Solutions'
    ],
    process: [
      {
        step: 1,
        title: 'Setup',
        description: 'Support infrastructure and team setup'
      },
      {
        step: 2,
        title: 'Training',
        description: 'Comprehensive training on your products/services'
      },
      {
        step: 3,
        title: 'Launch',
        description: 'Go-live with full support coverage'
      },
      {
        step: 4,
        title: 'Optimization',
        description: 'Continuous improvement and optimization'
      }
    ],
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

/**
 * Get all active services
 * GET /api/services
 */
export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const { category, featured } = req.query;
  
  let filteredServices = services.filter(service => service.isActive);

  // Filter by category if provided
  if (category) {
    filteredServices = filteredServices.filter(service => 
      service.slug === category.toString()
    );
  }

  // Filter featured services if requested
  if (featured === 'true') {
    // In a real app, you'd have a featured field
    filteredServices = filteredServices.slice(0, 3);
  }

  const response: ApiResponse = {
    success: true,
    data: filteredServices,
    message: `Retrieved ${filteredServices.length} services`,
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
  
  const service = services.find(s => s.slug === slug && s.isActive);
  
  if (!service) {
    throw createError('Service not found', 404);
  }

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
  
  const service = services.find(s => s.id === id && s.isActive);
  
  if (!service) {
    throw createError('Service not found', 404);
  }

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

  // Check if slug already exists
  const existingService = services.find(s => s.slug === slug);
  if (existingService) {
    throw createError('Service with this slug already exists', 400);
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
  };

  // Create new service
  const newService: Service = {
    id: slug,
    ...sanitizedData,
    icon: 'Briefcase', // Default icon
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Store service (in production, save to database)
  services.push(newService);

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
  
  const serviceIndex = services.findIndex(s => s.id === id);
  
  if (serviceIndex === -1) {
    throw createError('Service not found', 404);
  }

  // Sanitize update data
  const currentService = services[serviceIndex];
  if (currentService) {
    const sanitizedData = {
      ...updateData,
      name: updateData.name ? sanitizeInput(updateData.name) : currentService.name,
      description: updateData.description ? sanitizeInput(updateData.description) : currentService.description,
      shortDescription: updateData.shortDescription ? sanitizeInput(updateData.shortDescription) : currentService.shortDescription,
    };

    // Update service
    services[serviceIndex] = {
      ...currentService,
      ...sanitizedData,
      updatedAt: new Date().toISOString(),
    };
  }

  const response: ApiResponse = {
    success: true,
    data: services[serviceIndex],
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
  
  const serviceIndex = services.findIndex(s => s.id === id);
  
  if (serviceIndex === -1) {
    throw createError('Service not found', 404);
  }

  // Soft delete - set isActive to false
  const currentService = services[serviceIndex];
  if (currentService) {
    services[serviceIndex] = {
      ...currentService,
      isActive: false,
      updatedAt: new Date().toISOString(),
    };
  }

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
  const categories = services
    .filter(service => service.isActive)
    .map(service => ({
      id: service.id,
      name: service.name,
      slug: service.slug,
      shortDescription: service.shortDescription,
      icon: service.icon,
    }));

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
  
  const featuredServices = services
    .filter(service => service.isActive && service.isFeatured)
    .slice(0, parseInt(limit.toString()));

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
  
  const categoryServices = services.filter(service => 
    service.category && service.category.toLowerCase() === category.toLowerCase() && 
    service.isActive
  );

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
  const stats = {
    totalServices: services.length,
    activeServices: services.filter(s => s.isActive).length,
    featuredServices: services.filter(s => s.isFeatured).length,
    categoryDistribution: services.reduce((acc, service) => {
      if (service.category) {
        acc[service.category] = (acc[service.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>)
  };

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
  
  const serviceIndex = services.findIndex(s => s.id === id);
  
  if (serviceIndex === -1) {
    throw createError('Service not found', 404);
  }

  // Activate service
  const currentService = services[serviceIndex];
  if (currentService) {
    services[serviceIndex] = {
      ...currentService,
      isActive: true,
      updatedAt: new Date().toISOString(),
    };
  }

  const response: ApiResponse = {
    success: true,
    data: services[serviceIndex],
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
  
  const serviceIndex = services.findIndex(s => s.id === id);
  
  if (serviceIndex === -1) {
    throw createError('Service not found', 404);
  }

  // Deactivate service
  const currentService = services[serviceIndex];
  if (currentService) {
    services[serviceIndex] = {
      ...currentService,
      isActive: false,
      updatedAt: new Date().toISOString(),
    };
  }

  const response: ApiResponse = {
    success: true,
    data: services[serviceIndex],
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
  
  const serviceIndex = services.findIndex(s => s.id === id);
  
  if (serviceIndex === -1) {
    throw createError('Service not found', 404);
  }

  // Feature service
  const currentService = services[serviceIndex];
  if (currentService) {
    services[serviceIndex] = {
      ...currentService,
      isFeatured: true,
      updatedAt: new Date().toISOString(),
    };
  }

  const response: ApiResponse = {
    success: true,
    data: services[serviceIndex],
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
  
  const serviceIndex = services.findIndex(s => s.id === id);
  
  if (serviceIndex === -1) {
    throw createError('Service not found', 404);
  }

  // Unfeature service
  const currentService = services[serviceIndex];
  if (currentService) {
    services[serviceIndex] = {
      ...currentService,
      isFeatured: false,
      updatedAt: new Date().toISOString(),
    };
  }

  const response: ApiResponse = {
    success: true,
    data: services[serviceIndex],
    message: 'Service unfeatured successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});