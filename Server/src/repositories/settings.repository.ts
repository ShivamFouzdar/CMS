
import { BaseRepository } from '@/repositories/base.repository.js';
import { Settings, ISettings } from '@/models/Settings.js';

export class SettingsRepository extends BaseRepository<ISettings> {
    constructor() {
        super(Settings);
    }

    async getSettings(): Promise<ISettings> {
        return (this.model as any).getSettings();
    }

    async updateSettings(data: Partial<ISettings>): Promise<ISettings> {
        return (this.model as any).updateSettings(data);
    }
}
