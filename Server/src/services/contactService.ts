import { ContactFormData } from '@/types';
import { createError, validateEmail, sanitizeInput } from '@/utils/helpers';

/**
 * Contact Service
 * Handles business logic for contact form submissions
 */

// Mock data storage (replace with database in production)
let contactSubmissions: Array<ContactFormData & { id: string; submittedAt: string; status?: string; notes?: string }> = [];

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
  const sanitizedData: ContactFormData = {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email),
    phone: data.phone ? sanitizeInput(data.phone) : '',
    company: data.company ? sanitizeInput(data.company) : '',
    service: data.service ? sanitizeInput(data.service) : 'General Enquiry',
    message: sanitizeInput(data.message),
  };

  // Create submission record
  const submission = {
    id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    submittedAt: new Date().toISOString(),
    ...sanitizedData,
  };

  // Store submission locally
  contactSubmissions.push(submission);

  // Forward to Web3Forms via server-side request
  const accessKey = process.env['WEB3FORMS_ACCESS_KEY'];
  if (!accessKey) {
    throw createError('Web3Forms access key not configured. Set WEB3FORMS_ACCESS_KEY in Server/.env', 500);
  }

  const payload = {
    access_key: accessKey,
    subject: `New Contact Form Submission${sanitizedData.service ? ` - ${sanitizedData.service}` : ''}`,
    from_name: sanitizedData.name,
    reply_to: sanitizedData.email,
    name: sanitizedData.name,
    email: sanitizedData.email,
    phone: sanitizedData.phone,
    company: sanitizedData.company,
    service: sanitizedData.service,
    message: sanitizedData.message,
  } as Record<string, string>;

  const fetchFn = (global as any).fetch as any;
  if (!fetchFn) {
    throw createError('Fetch API not available in Node environment', 500);
  }

  const web3formsResponse = await fetchFn('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await web3formsResponse.json().catch(() => ({} as any));
  if (!web3formsResponse.ok || !result || result.success === false) {
    const errorMessage = (result && (result.message || result.error)) || 'Failed to send message';
    throw createError(errorMessage, 502);
  }

  return {
    id: submission.id,
    submittedAt: submission.submittedAt,
  };
};

/**
 * Get all contact submissions with pagination
 */
export const getAllContactSubmissions = async (
  page: number = 1,
  limit: number = 10
): Promise<{ data: any[]; total: number; page: number; totalPages: number }> => {
  const total = contactSubmissions.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedSubmissions = contactSubmissions.slice(startIndex, endIndex);

  return {
    data: paginatedSubmissions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get contact submission by ID
 */
export const getContactSubmissionById = async (id: string): Promise<any> => {
  const submission = contactSubmissions.find(sub => sub.id === id);

  if (!submission) {
    throw createError('Contact submission not found', 404);
  }

  return submission;
};

/**
 * Update contact submission status
 */
export const updateContactSubmissionStatus = async (
  id: string,
  status: string,
  notes?: string
): Promise<any> => {
  const submissionIndex = contactSubmissions.findIndex(sub => sub.id === id);

  if (submissionIndex === -1) {
    throw createError('Contact submission not found', 404);
  }

  const currentSubmission = contactSubmissions[submissionIndex];
  if (currentSubmission) {
    contactSubmissions[submissionIndex] = {
      ...currentSubmission,
      status: status || 'processed',
      notes: notes || '',
      updatedAt: new Date().toISOString(),
    };
  }

  return contactSubmissions[submissionIndex];
};

/**
 * Delete contact submission
 */
export const deleteContactSubmission = async (id: string): Promise<void> => {
  const submissionIndex = contactSubmissions.findIndex(sub => sub.id === id);

  if (submissionIndex === -1) {
    throw createError('Contact submission not found', 404);
  }

  contactSubmissions.splice(submissionIndex, 1);
};

/**
 * Get contact statistics
 */
export const getContactStatistics = async () => {
  const stats = {
    total: contactSubmissions.length,
    byStatus: {
      new: contactSubmissions.filter(c => c.status === 'new').length,
      in_progress: contactSubmissions.filter(c => c.status === 'in_progress').length,
      completed: contactSubmissions.filter(c => c.status === 'completed').length,
      closed: contactSubmissions.filter(c => c.status === 'closed').length,
    },
    byService: contactSubmissions.reduce((acc, contact) => {
      const service = contact.service || 'General Enquiry';
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    recent: contactSubmissions.slice(-5).map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      service: c.service,
      status: c.status,
      submittedAt: c.submittedAt,
    })),
  };

  return stats;
};

/**
 * Get contacts by service
 */
export const getContactsByService = async (service: string, limit: number = 10) => {
  const serviceContacts = contactSubmissions
    .filter(contact =>
      contact.service?.toLowerCase().includes(service.toLowerCase()) || false
    )
    .slice(0, limit)
    .map(contact => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      service: contact.service,
      status: contact.status,
      submittedAt: contact.submittedAt,
      message: contact.message.substring(0, 100) + '...',
    }));

  return serviceContacts;
};

/**
 * Mark contact as contacted
 */
export const markContactAsContacted = async (id: string): Promise<any> => {
  const submissionIndex = contactSubmissions.findIndex(sub => sub.id === id);

  if (submissionIndex === -1) {
    throw createError('Contact submission not found', 404);
  }

  const currentSubmission = contactSubmissions[submissionIndex];
  if (currentSubmission) {
    contactSubmissions[submissionIndex] = {
      ...currentSubmission,
      updatedAt: new Date().toISOString(),
    } as any;
  }

  return contactSubmissions[submissionIndex];
};

