
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';

export interface IBaseRepository<T extends Document> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    findAll(filter?: FilterQuery<T>, sort?: any, limit?: number): Promise<T[]>;
    update(id: string, data: UpdateQuery<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    count(filter?: FilterQuery<T>): Promise<number>;
    aggregate(pipeline: any[]): Promise<any[]>;
}

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
    constructor(protected readonly model: Model<T>) { }

    async create(data: Partial<T>): Promise<T> {
        const entity = new this.model(data);
        return await entity.save();
    }

    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id);
    }

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        return await this.model.findOne(filter);
    }

    async findAll(
        filter: FilterQuery<T> = {},
        sort: any = { createdAt: -1 },
        limit?: number
    ): Promise<T[]> {
        const query = this.model.find(filter).sort(sort);

        if (limit) {
            query.limit(limit);
        }

        return await query;
    }

    async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id);
        return !!result;
    }

    async count(filter: FilterQuery<T> = {}): Promise<number> {
        return await this.model.countDocuments(filter);
    }

    async aggregate(pipeline: any[]): Promise<any[]> {
        return await this.model.aggregate(pipeline);
    }
}
