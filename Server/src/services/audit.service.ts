import AuditLog, { IAuditLog } from '@/models/AuditLog';
import { Request } from 'express';

export class AuditService {
    /**
     * Log an action to the database
     * @param req Express request object (to extract user, IP, UserRequest)
     * @param action Action name (e.g., 'LOGIN', 'CREATE_SERVICE')
     * @param resource Resource name (e.g., 'Auth', 'Service')
     * @param resourceId Optional ID of the resource affected
     * @param details Optional JSON details
     */
    async logAction(
        req: Request,
        action: string,
        resource: string,
        resourceId?: string,
        details?: Record<string, any>
    ): Promise<IAuditLog | null> {
        try {
            const user = req.user?.id;

            // If no user is authenticated (e.g., failed login), we might want to log it differently
            // requiring a user reference. For purely public actions or failed logins where we don't know the user,
            // this might fail if we enforce 'user' required.
            // However, for admin actions, user is always present.
            // For failed login, we can't link to a user ID easily unless we look it up.
            // We'll skip logging if no user is found for now, or use a system user ID if needed.

            if (!user) {
                // console.warn('AuditLog: No user found for action', action);
                return null;
            }

            const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
            const userAgent = req.headers['user-agent'] || '';

            const log = await AuditLog.create({
                user,
                action,
                resource,
                resourceId,
                details,
                ip,
                userAgent
            });

            return log;
        } catch (error) {
            console.error('Failed to create audit log:', error);
            // We don't want audit logging failure to block the main request
            return null;
        }
    }

    /**
     * Get logs with pagination and filtering
     */
    async getLogs(page: number = 1, limit: number = 20, filters: any = {}) {
        const skip = (page - 1) * limit;

        // Build query based on filters
        const query: any = {};
        if (filters.action) query.action = filters.action;
        if (filters.resource) query.resource = filters.resource;
        if (filters.userId) query.user = filters.userId;
        if (filters.startDate && filters.endDate) {
            query.createdAt = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate)
            };
        }

        const logs = await AuditLog.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'firstName lastName email role');

        const total = await AuditLog.countDocuments(query);

        return {
            logs,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page
        };
    }
}

export const auditService = new AuditService();
