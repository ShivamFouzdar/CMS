import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/helpers.js';
import { sendSuccess, sendError } from '@/utils/response.utils.js';
import Notification from '@/models/Notification.js';

/**
 * Get recent notifications (paginated)
 */
export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt((req.query as any).page as string) || 1;
    const limit = parseInt((req.query as any).limit as string) || 10;
    const type = (req.query as any).type as string;

    const query: any = {};
    if (type) query.type = type;

    const total = await Notification.countDocuments(query);
    const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    // Get unread count
    const unreadCount = await Notification.countDocuments({ read: false });

    return sendSuccess(res, 'Notifications fetched successfully', notifications, 200, {
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        },
        unreadCount
    });
});

/**
 * Mark a single notification as read
 */
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
        id,
        { read: true },
        { new: true }
    );

    if (!notification) {
        return sendError(res, 'Notification not found', 404);
    }

    return sendSuccess(res, 'Notification marked as read', notification);
});

/**
 * Mark all notifications as read
 */
export const markAllAsRead = asyncHandler(async (_req: Request, res: Response) => {
    await Notification.updateMany(
        { read: false },
        { read: true }
    );

    return sendSuccess(res, 'All notifications marked as read', undefined, 200);
});
