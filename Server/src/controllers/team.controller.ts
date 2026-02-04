import { Request, Response } from 'express';
import { TeamMember } from '../models/TeamMember.js';

/**
 * Get all team members (Public)
 */
export const getAllMembers = async (_req: Request, res: Response) => {
    try {
        const members = await TeamMember.find({ isActive: true }).sort({ order: 1 });
        res.status(200).json({
            success: true,
            data: members
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching team members',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Get all team members (Admin - includes inactive)
 */
export const getAdminMembers = async (_req: Request, res: Response) => {
    try {
        const members = await TeamMember.find().sort({ order: 1 });
        res.status(200).json({
            success: true,
            data: members
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching team members',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Create new team member (Admin)
 */
export const createMember = async (req: Request, res: Response) => {
    try {
        const lastMember = await TeamMember.findOne().sort({ order: -1 });
        const order = lastMember ? lastMember.order + 1 : 0;

        const member = await TeamMember.create({
            ...req.body,
            order
        });

        res.status(201).json({
            success: true,
            message: 'Team member created successfully',
            data: member
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating team member',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Update team member (Admin)
 */
export const updateMember = async (req: Request, res: Response) => {
    try {
        const member = await TeamMember.findByIdAndUpdate(
            req.params['id'],
            req.body,
            { new: true, runValidators: true }
        );

        if (!member) {
            res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Team member updated successfully',
            data: member
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating team member',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Delete team member (Admin)
 */
export const deleteMember = async (req: Request, res: Response) => {
    try {
        const member = await TeamMember.findByIdAndDelete(req.params['id']);

        if (!member) {
            res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Team member deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting team member',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Reorder team members (Admin)
 */
export const reorderMembers = async (req: Request, res: Response) => {
    try {
        const { items } = req.body; // Array of { id: string, order: number }

        if (!Array.isArray(items)) {
            res.status(400).json({
                success: false,
                message: 'Invalid items format'
            });
            return;
        }

        const updates = items.map((item: { id: string, order: number }) =>
            TeamMember.findByIdAndUpdate(item.id, { order: item.order })
        );

        await Promise.all(updates);

        res.status(200).json({
            success: true,
            message: 'Team members reordered successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error reordering team members',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
