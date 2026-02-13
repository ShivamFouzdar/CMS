import { BaseRepository } from './base.repository.js';
import Notification, { INotification } from '@/models/Notification.js';

export class NotificationRepository extends BaseRepository<INotification> {
    constructor() {
        super(Notification);
    }

    async findByType(type: string, limit: number = 10): Promise<INotification[]> {
        return this.findAll({ type }, { createdAt: -1 }, limit);
    }
}
