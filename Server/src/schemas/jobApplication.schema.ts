import { z } from 'zod';

export const createJobApplicationSchema = z.object({
    body: z.object({
        fullName: z.string().min(2, 'Full Name is required'),
        email: z.string().email('Valid email is required'),
        phone: z.string().min(10, 'Valid phone number is required'),
        location: z.string().min(2, 'Location is required'),
        experience: z.string().min(1, 'Experience is required'),
        workMode: z.enum(['remote', 'hybrid', 'onsite'], {
            errorMap: () => ({ message: 'Work mode must be remote, hybrid, or onsite' })
        }).optional().or(z.string()),
        skillsDescription: z.string().min(10, 'Skills description is required'),
        hearAboutUs: z.string().optional(),
        // Resume file validation is handled by Multer usually, but if URL provided directly:
        resumeUrl: z.string().url().optional()
    })
});

export const jobApplicationIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'ID is required')
    })
});

export const bulkDeleteJobApplicationSchema = z.object({
    body: z.object({
        ids: z.array(z.string()).min(1, 'IDs array is required')
    })
});
