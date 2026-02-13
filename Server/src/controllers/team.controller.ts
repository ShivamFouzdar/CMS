import { Request, Response } from 'express';
import { TeamMember } from '../models/TeamMember.js';
import { asyncHandler, createError } from '@/utils/helpers.js';
import { sendSuccess } from '@/utils/response.utils.js';

/**
 * Get all team members (Public)
 */
export const getAllMembers = asyncHandler(async (_req: Request, res: Response) => {
    const members = await TeamMember.find({ isActive: true }).sort({ order: 1 });
    return sendSuccess(res, 'Team members retrieved successfully', members);
});

/**
 * Get all team members (Admin - includes inactive)
 */
export const getAdminMembers = asyncHandler(async (_req: Request, res: Response) => {
    const members = await TeamMember.find().sort({ order: 1 });
    return sendSuccess(res, 'All team members retrieved successfully', members);
});

/**
 * Create new team member (Admin)
 */
export const createMember = asyncHandler(async (req: Request, res: Response) => {
    const lastMember = await TeamMember.findOne().sort({ order: -1 });
    const order = lastMember ? lastMember.order + 1 : 0;

    const member = await TeamMember.create({
        ...req.body,
        order
    });

    return sendSuccess(res, 'Team member created successfully', member, 201);
});

/**
 * Update team member (Admin)
 */
export const updateMember = asyncHandler(async (req: Request, res: Response) => {
    const member = await TeamMember.findByIdAndUpdate(
        req.params['id'],
        req.body,
        { new: true, runValidators: true }
    );

    if (!member) {
        throw createError('Team member not found', 404);
    }

    return sendSuccess(res, 'Team member updated successfully', member);
});

/**
 * Delete team member (Admin)
 */
export const deleteMember = asyncHandler(async (req: Request, res: Response) => {
    const member = await TeamMember.findByIdAndDelete(req.params['id']);

    if (!member) {
        throw createError('Team member not found', 404);
    }

    return sendSuccess(res, 'Team member deleted successfully');
});

/**
 * Reorder team members (Admin)
 */
export const reorderMembers = asyncHandler(async (req: Request, res: Response) => {
    const { items } = req.body; // Array of { id: string, order: number }

    if (!Array.isArray(items)) {
        throw createError('Invalid items format', 400);
    }

    const updates = items.map((item: { id: string, order: number }) =>
        TeamMember.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updates);

    return sendSuccess(res, 'Team members reordered successfully');
});

/**
 * Seed default team members (Admin)
 */
export const seedMembers = asyncHandler(async (_req: Request, res: Response) => {
    const teamMembers = [
        {
            name: 'Shivam Fouzdar',
            role: 'CEO & Founder',
            image: '/Shivam.jpeg',
            bio: 'Shivam has over 7+ years of experience in business strategy and leadership, helping companies scale and achieve their goals.',
            social: {
                twitter: '#',
                linkedin: '#',
                email: 'mailto:shivam@careermapsolutions.com'
            },
            order: 0,
            isActive: true
        },
        {
            name: 'Ankush Yadav',
            role: 'Finance Manager',
            image: '/ankush.png',
            bio: 'Ankush specializes in finance strategy, accounting and ensuring our solutions meet real business needs.',
            social: {
                twitter: '#',
                linkedin: '#',
                email: 'mailto:Ankush@careermapsolutions.com'
            },
            order: 1,
            isActive: true
        },
        {
            name: 'Shushant Singh',
            role: 'Head of Customer Success',
            image: '/sushant.png',
            bio: 'Shushant ensures our clients achieve their desired outcomes through exceptional service and support.',
            social: {
                twitter: '#',
                linkedin: '#',
                email: 'mailto:shushant@careermapsolutions.com'
            },
            order: 2,
            isActive: true
        },
        {
            name: 'Nandita Shukla',
            role: 'CFO ',
            image: '/nandita.png',
            bio: 'Chief Financial Officer responsible for financial strategy, governance, and driving sustainable growth for the organization..',
            social: {
                twitter: '#',
                linkedin: '#',
                email: 'mailto:Nandita@careermapsolutions.com'
            },
            order: 3,
            isActive: true
        }
    ];

    // Clear existing members
    await TeamMember.deleteMany({});

    // Insert new members
    await TeamMember.insertMany(teamMembers);

    return sendSuccess(res, 'Team members seeded successfully', teamMembers);
});
