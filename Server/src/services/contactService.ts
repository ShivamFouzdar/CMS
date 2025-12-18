import { ContactFormData } from '@/types';
import { createError, validateEmail, sanitizeInput } from '@/utils/helpers';
import { Contact } from '@/models';

/**
 * Contact Service
 * Handles business logic for contact form submissions
 * Saves all contact form submissions to the database
 */

/**
 * Submit contact form
 */
export const submitContactForm = async (data: ContactFormData): Promise<{ id: string; submittedAt: string }> => {
  // Validation
  if (!data.name || !data.email || !data.message) {
    throw createError('Name, email, and message are required', 400);
  }

  if (!validateEmail(data.email)) {
    throw createError('Please provide a valid email address', 400);
  }

  // Sanitize inputs
  const sanitizedData = {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email).toLowerCase(),
    phone: data.phone ? sanitizeInput(data.phone) : undefined,
    company: data.company ? sanitizeInput(data.company) : undefined,
    service: data.service ? sanitizeInput(data.service) : 'General Enquiry',
    message: sanitizeInput(data.message),
    status: 'new' as const,
    priority: 'medium' as const,
    source: 'website' as const,
  };

  // Create and save contact submission to database
  const contact = new Contact(sanitizedData);
  await contact.save();

  console.log('✅ Contact form submission saved to database:', contact._id);

  return {
    id: (contact._id as any).toString(),
    submittedAt: contact.submittedAt.toISOString(),
  };
};

/**
 * Get all contact submissions with pagination
 */
export const getAllContactSubmissions = async (
  page: number = 1,
  limit: number = 10
): Promise<{ data: any[]; total: number; page: number; totalPages: number }> => {
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    Contact.find()
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Contact.countDocuments(),
  ]);

  return {
    data: data.map(contact => ({
      id: (contact._id as any).toString(),
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      service: contact.service,
      message: contact.message,
      status: contact.status,
      priority: contact.priority,
      notes: contact.notes,
      submittedAt: contact.submittedAt.toISOString(),
      updatedAt: contact.updatedAt.toISOString(),
      source: contact.source,
      tags: contact.tags,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get contact submission by ID
 */
export const getContactSubmissionById = async (id: string): Promise<any> => {
  const contact = await Contact.findById(id);

  if (!contact) {
    throw createError('Contact submission not found', 404);
  }

  return {
    id: (contact._id as any).toString(),
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    service: contact.service,
    message: contact.message,
    status: contact.status,
    priority: contact.priority,
    notes: contact.notes,
    assignedTo: contact.assignedTo,
    submittedAt: contact.submittedAt.toISOString(),
    updatedAt: contact.updatedAt.toISOString(),
    lastContactedAt: contact.lastContactedAt?.toISOString(),
    source: contact.source,
    tags: contact.tags,
  };
};

/**
 * Update contact submission status
 */
export const updateContactSubmissionStatus = async (
  id: string,
  status: string,
  notes?: string
): Promise<any> => {
  const contact = await Contact.findById(id);

  if (!contact) {
    throw createError('Contact submission not found', 404);
  }

  contact.status = status as any;
  if (notes !== undefined) {
    contact.notes = notes;
  }
  contact.updatedAt = new Date();

  await contact.save();

  return {
    id: (contact._id as any).toString(),
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    service: contact.service,
    message: contact.message,
    status: contact.status,
    priority: contact.priority,
    notes: contact.notes,
    submittedAt: contact.submittedAt.toISOString(),
    updatedAt: contact.updatedAt.toISOString(),
  };
};

/**
 * Delete contact submission
 */
export const deleteContactSubmission = async (id: string): Promise<void> => {
  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) {
    throw createError('Contact submission not found', 404);
  }
};

/**
 * Get contact statistics
 */
export const getContactStatistics = async () => {
  const stats = await Contact.getStats();
  
  // Get service breakdown
  const serviceStats = await Contact.aggregate([
    {
      $group: {
        _id: '$service',
        count: { $sum: 1 }
      }
    }
  ]);

  const byService = serviceStats.reduce((acc, stat) => {
    acc[stat._id || 'General Enquiry'] = stat.count;
    return acc;
  }, {} as Record<string, number>);

  // Get recent submissions
  const recent = await Contact.find()
    .sort({ submittedAt: -1 })
    .limit(5)
    .select('name email service status submittedAt')
    .lean();

  return {
    total: stats.total,
    byStatus: stats.byStatus,
    byService,
    recent: recent.map(c => ({
      id: (c._id as any).toString(),
      name: c.name,
      email: c.email,
      service: c.service,
      status: c.status,
      submittedAt: c.submittedAt.toISOString(),
    })),
  };
};

/**
 * Get contacts by service
 */
export const getContactsByService = async (service: string, limit: number = 10) => {
  const contacts = await Contact.getByService(service, limit);

  return contacts.map(contact => ({
    id: (contact._id as any).toString(),
    name: contact.name,
    email: contact.email,
    service: contact.service,
    status: contact.status,
    submittedAt: contact.submittedAt.toISOString(),
    message: contact.message ? contact.message.substring(0, 100) + '...' : '',
  }));
};

/**
 * Mark contact as contacted
 */
export const markContactAsContacted = async (id: string): Promise<any> => {
  const contact = await Contact.findById(id);

  if (!contact) {
    throw createError('Contact submission not found', 404);
  }

  await contact.markAsContacted();

  return {
    id: (contact._id as any).toString(),
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    service: contact.service,
    message: contact.message,
    status: contact.status,
    priority: contact.priority,
    notes: contact.notes,
    submittedAt: contact.submittedAt.toISOString(),
    updatedAt: contact.updatedAt.toISOString(),
    lastContactedAt: contact.lastContactedAt?.toISOString(),
  };
};

