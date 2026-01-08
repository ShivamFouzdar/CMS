
import { BaseRepository } from './base.repository';
import { Contact, IContact } from '@/models';

export class ContactRepository extends BaseRepository<IContact> {
    constructor() {
        super(Contact);
    }

    async getStats(): Promise<any> {
        return await (this.model as any).getStats();
    }

    async findWithPagination(filter: any, sort: any, skip: number, limit: number): Promise<IContact[]> {
        // Use lean() for performance if not saving documents immediately, but BaseRepo usually returns hydration.
        // Keeping consistent with other repos
        return await this.model.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }

    async getByService(service: string, limit: number): Promise<IContact[]> {
        return await (this.model as any).getByService(service, limit);
    }
}
