
import { createError, sanitizeInput } from '@/utils/helpers';
import { UserRepository } from '@/repositories/user.repository';
import { IUser } from '@/models/User';

export interface UserFilters {
    role?: string;
    isActive?: boolean;
}

export class UserService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    async getAllUsers(filters: UserFilters = {}, page: number = 1, limit: number = 20): Promise<{ users: IUser[]; total: number }> {
        const skip = (page - 1) * limit;
        const query: any = {};
        if (filters.role) query.role = filters.role;
        if (filters.isActive !== undefined) query.isActive = filters.isActive;

        const [users, total] = await Promise.all([
            this.repository.findWithPagination(query, { createdAt: -1 }, skip, limit),
            this.repository.count(query)
        ]);

        return { users, total };
    }

    async getUserById(id: string): Promise<IUser> {
        const user = await this.repository.findById(id);
        if (!user) {
            throw createError('User not found', 404);
        }
        return user;
    }

    async updateProfile(id: string, data: any): Promise<IUser> {
        const user = await this.repository.findById(id);
        if (!user) throw createError('User not found', 404);

        // Update top-level fields
        if (data.firstName) user.firstName = data.firstName;
        if (data.lastName) user.lastName = data.lastName;
        if (data.email) user.email = data.email;

        // Update profile sub-object
        if (data.phone) user.profile.phone = data.phone;
        if (data.profile) {
            user.profile = { ...user.profile, ...data.profile };
        }

        // Update preferences (deep merge for notifications)
        if (data.preferences) {
            const prefs = data.preferences;
            if (prefs.notifications) {
                const existingNotifs = user.preferences.notifications || {};
                const newNotifs = prefs.notifications;

                user.preferences.notifications = {
                    ...existingNotifs,
                    ...newNotifs,
                    alerts: {
                        ...(existingNotifs.alerts || {}),
                        ...(newNotifs.alerts || {})
                    }
                };
            }

            if (prefs.theme) user.preferences.theme = prefs.theme;
            if (prefs.language) user.preferences.language = prefs.language;
        }

        await user.save();
        return user;
    }

    async updatePreferences(id: string, preferencesData: any): Promise<IUser> {
        const user = await this.repository.findById(id);
        if (!user) throw createError('User not found', 404);

        // Deep merge for notifications alerts
        const existingPrefs = user.preferences || {};
        const newPrefs = preferencesData;

        if (newPrefs.notifications) {
            const existingNotifs = existingPrefs.notifications || {};
            const newNotifs = newPrefs.notifications;

            user.preferences.notifications = {
                ...existingNotifs,
                ...newNotifs,
                alerts: {
                    ...(existingNotifs.alerts || {}),
                    ...(newNotifs.alerts || {})
                }
            };
        }

        if (newPrefs.theme) user.preferences.theme = newPrefs.theme;
        if (newPrefs.language) user.preferences.language = newPrefs.language;

        await user.save();
        return user;
    }

    async updateUser(id: string, updates: Partial<IUser>): Promise<IUser> {
        const user = await this.repository.findById(id);
        if (!user) {
            throw createError('User not found', 404);
        }

        // Sanitize updates
        const sanitizedUpdates: any = {};
        if (updates.firstName) sanitizedUpdates.firstName = sanitizeInput(updates.firstName);
        if (updates.lastName) sanitizedUpdates.lastName = sanitizeInput(updates.lastName);
        if (updates.email) sanitizedUpdates.email = sanitizeInput(updates.email);
        if (updates.role) sanitizedUpdates.role = updates.role;
        // ... other fields

        return (await this.repository.update(id, sanitizedUpdates))!;
    }

    async deleteUser(id: string): Promise<void> {
        const user = await this.repository.findById(id);
        if (!user) {
            throw createError('User not found', 404);
        }
        await this.repository.delete(id);
    }

    async activateUser(id: string): Promise<IUser> {
        const user = await this.repository.findById(id);
        if (!user) throw createError('User not found', 404);
        user.isActive = true;
        return await user.save(); // Using model instance method or repo update
        // Repo update is cleaner:
        // return (await this.repository.update(id, { isActive: true }))!;
    }

    async deactivateUser(id: string): Promise<IUser> {
        return (await this.repository.update(id, { isActive: false }))!;
    }

    async getUserStats(): Promise<any> {
        return await this.repository.getStats();
    }
}
