import { BaseRepository } from './base.repository.js';
import AuditLog, { IAuditLog } from '@/models/AuditLog.js';

export class AuditRepository extends BaseRepository<IAuditLog> {
    constructor() {
        super(AuditLog);
    }

    async findByResource(resource: string, resourceId: string): Promise<IAuditLog[]> {
        return this.findAll({ resource, resourceId });
    }

    async findByUser(userId: string): Promise<IAuditLog[]> {
        return this.findAll({ user: userId });
    }

    async findWithUser(query: any, skip: number, limit: number): Promise<IAuditLog[]> {
        return this.model.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'firstName lastName email role');
    }

    async clearAll(): Promise<void> {
        await this.model.deleteMany({});
    }
}
