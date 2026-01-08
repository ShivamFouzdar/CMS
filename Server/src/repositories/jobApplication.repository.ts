
import { BaseRepository } from './base.repository';
import { IApplicant } from '@/models/Applicant';
import Applicant from '@/models/Applicant';

export class JobApplicationRepository extends BaseRepository<IApplicant> {
    constructor() {
        super(Applicant);
    }

    async getStats(): Promise<any> {
        return await (this.model as any).getStats();
    }

    async findWithPagination(filter: any, sort: any, skip: number, limit: number): Promise<IApplicant[]> {
        return await this.model.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }

    async getRecent(limit: number): Promise<IApplicant[]> {
        return await this.model.find({})
            .sort({ submittedAt: -1 })
            .limit(limit);
    }
}
