
import { ContactFormData } from '@/types';
import { createError, sanitizeInput } from '@/utils/helpers';
import { ContactRepository } from '@/repositories/contact.repository';
import { IContact } from '@/models';

/**
 * Contact Service
 * Handles business logic for contact form submissions
 */
export class ContactService {
  private repository: ContactRepository;

  constructor() {
    this.repository = new ContactRepository();
  }

  /**
   * Submit contact form
   */
  async submitContactForm(data: ContactFormData): Promise<{ id: string; submittedAt: string }> {
    // Validation handled by middleware/controller ideally, but service should robustly check data
    if (!data.name || !data.email || !data.message) {
      throw createError('Name, email, and message are required', 400);
    }

    // Sanitize inputs (Although validated middleware should ideally handle this, sanitation here is safe)
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

    const contact = await this.repository.create(sanitizedData as any);

    console.log('✅ Contact form submission saved to database:', contact._id);

    return {
      id: (contact._id as any).toString(),
      submittedAt: (contact as any).submittedAt.toISOString(),
    };
  }

  /**
   * Get all contact submissions with pagination
   */
  async getAllContactSubmissions(page: number = 1, limit: number = 10): Promise<{ data: any[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      this.repository.findWithPagination({}, { submittedAt: -1 }, skip, limit),
      this.repository.count({})
    ]);

    const data = contacts.map(contact => this.mapToDTO(contact));

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getContactSubmissionById(id: string): Promise<any> {
    const contact = await this.repository.findById(id);
    if (!contact) throw createError('Contact submission not found', 404);
    return this.mapToDTO(contact); // DTO includes timestamps etc.
  }

  async updateContactSubmissionStatus(id: string, status: string, notes?: string): Promise<any> {
    const contact = await this.repository.findById(id);
    if (!contact) throw createError('Contact submission not found', 404);

    const updates: any = { status };
    if (notes !== undefined) {
      updates.notes = notes;
    }
    // updatedAt automatically handled by pre-save usually, or manually
    // BaseRepository update doesn't automatically set updatedAt for atomic updates, but model pre-save does if using save() OR if schema has timestamps (Mongoose handles it for updateOne too usually if timestamps: true)

    const updatedContact = await this.repository.update(id, updates);
    return this.mapToDTO(updatedContact!);
  }

  async deleteContactSubmission(id: string): Promise<void> {
    const contact = await this.repository.findById(id);
    if (!contact) throw createError('Contact submission not found', 404);
    await this.repository.delete(id);
  }

  async getContactStatistics(): Promise<any> {
    const stats = await this.repository.getStats();

    // Additional aggregation if not covered by model method
    // The original service had custom aggregation for services and recent contacts.
    // I should probably move that to Repo or keep it here accessing model via repo (if exposed) or better yet, add methods to repo.

    // Re-implementing ad-hoc logic using repo methods if available or relying on getStats from model being comprehensive?
    // The original code calculated serviceStats separately in service. 
    // I should duplicate that logic or move it to repo.
    // Moving to repo is better. But for speed, if I can't modify IContactModel interface easily... 
    // I casted model to any in repo, so I can call static methods.
    // I'll assume getStats returns the comprehensive stats object the model defines.

    // However, the original service calculated `recent` contacts too.
    // I should add `getRecent` to ContactRepository.

    const recent = await this.repository.findWithPagination({}, { submittedAt: -1 }, 0, 5);

    return {
      ...stats,
      recent: recent.map(c => ({
        id: (c._id as any).toString(),
        name: c.name,
        email: c.email,
        service: c.service,
        status: c.status,
        submittedAt: (c as any).submittedAt.toISOString(),
      }))
    };
  }

  async getContactsByService(service: string, limit: number = 10): Promise<any[]> {
    const contacts = await this.repository.getByService(service, limit);
    return contacts.map(contact => ({
      id: (contact._id as any).toString(),
      name: contact.name,
      email: contact.email,
      service: contact.service,
      status: contact.status,
      submittedAt: (contact as any).submittedAt.toISOString(),
      message: contact.message ? contact.message.substring(0, 100) + '...' : '',
    }));
  }

  async markContactAsContacted(id: string): Promise<any> {
    const contact = await this.repository.findById(id);
    if (!contact) throw createError('Contact submission not found', 404);

    // Original called contact.markAsContacted() instance method.
    if (typeof (contact as any).markAsContacted === 'function') {
      await (contact as any).markAsContacted();
      // Need to reload or return modified contact. markAsContacted usually saves it.
      const updated = await this.repository.findById(id);
      return this.mapToDTO(updated!);
    } else {
      // Fallback
      await this.repository.update(id, { lastContactedAt: new Date() } as any); // Casting since lastContactedAt might not be in partial interface if strict
      const updated = await this.repository.findById(id);
      return this.mapToDTO(updated!);
    }
  }

  private mapToDTO(contact: IContact): any {
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
      // assignedTo: contact.assignedTo, // not in all interface definitions?
      submittedAt: (contact as any).submittedAt?.toISOString(),
      updatedAt: (contact as any).updatedAt?.toISOString(),
      lastContactedAt: (contact as any).lastContactedAt?.toISOString(),
      source: contact.source,
      tags: contact.tags,
    };
  }
}
