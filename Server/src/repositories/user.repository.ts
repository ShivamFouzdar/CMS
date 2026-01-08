
import { BaseRepository } from './base.repository';
import { IUser } from '@/models/User';
import User from '@/models/User';

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return this.model.findOne({ email: email.toLowerCase() }).select('+password');
    }

    async findByEmailWithoutPassword(email: string): Promise<IUser | null> {
        return this.model.findOne({ email: email.toLowerCase() });
    }

    async getActive(): Promise<IUser[]> {
        return this.model.find({ isActive: true })
            .select('firstName lastName email role lastLoginAt createdAt')
            .sort({ createdAt: -1 });
    }

    async getByRole(role: string): Promise<IUser[]> {
        return this.model.find({ role, isActive: true })
            .select('firstName lastName email lastLoginAt createdAt')
            .sort({ createdAt: -1 });
    }

    async getStats(): Promise<any> {
        return await (this.model as any).getStats();
    }

    async findWithPagination(filter: any, sort: any, skip: number, limit: number): Promise<IUser[]> {
        return await this.model.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }

    async findByIdWithPassword(id: string): Promise<IUser | null> {
        return this.model.findById(id).select('+password');
    }
}
