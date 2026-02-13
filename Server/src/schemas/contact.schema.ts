import { z } from 'zod';

export const createContactSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name is required'),
        email: z.string().email('Valid email is required'),
        message: z.string().min(10, 'Message is required (min 10 chars)'),
        phone: z.string().optional(),
        company: z.string().optional(),
        service: z.string().optional()
    })
});

export const updateContactStatusSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'ID is required')
    }),
    body: z.object({
        status: z.string().min(1, 'Status is required'),
        notes: z.string().optional()
    })
});

export const contactIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'ID is required')
    })
});

export const bulkDeleteContactSchema = z.object({
    body: z.object({
        ids: z.array(z.string()).min(1, 'IDs array is required')
    })
});
