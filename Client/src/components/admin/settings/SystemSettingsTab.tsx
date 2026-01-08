import React from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Save, Loader2, Info, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { SettingField } from './SettingField';
import { useSettings } from '@/context/SettingsContext';

export const SystemSettingsTab: React.FC = () => {
    const {
        systemSettings, setSystemSettings, handleSave,
        dbStats, handleBackup, handleRestore, saving
    } = useSettings();

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
                <SettingField
                    label="Platform Name"
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings({ ...systemSettings, siteName: e.target.value })}
                />
                <SettingField
                    label="Global Contact"
                    value={systemSettings.contactEmail}
                    onChange={(e) => setSystemSettings({ ...systemSettings, contactEmail: e.target.value })}
                />
                <SettingField
                    label="Contact Phone"
                    value={systemSettings.contactPhone}
                    onChange={(e) => setSystemSettings({ ...systemSettings, contactPhone: e.target.value })}
                />
                <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest ml-1">Core Description</label>
                    <textarea
                        rows={3}
                        value={systemSettings.siteDescription}
                        onChange={(e) => setSystemSettings({ ...systemSettings, siteDescription: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl px-4 py-3 text-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div className="p-6 bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-white/5 rounded-3xl space-y-6">
                        <h5 className="font-bold text-slate-900 dark:text-white transition-colors">Boundary Controls</h5>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">Open Registration</p>
                                <p className="text-xs text-slate-500">Allow new users to join the platform.</p>
                            </div>
                            <button
                                onClick={() => setSystemSettings({ ...systemSettings, allowRegistrations: !systemSettings.allowRegistrations })}
                                className={`w-12 h-6 rounded-full transition-all relative ${systemSettings.allowRegistrations ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-slate-700'}`}
                            >
                                <motion.div
                                    animate={{ x: systemSettings.allowRegistrations ? 24 : 4 }}
                                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-white/5 rounded-3xl space-y-4">
                        <h5 className="font-bold text-slate-900 dark:text-white transition-colors">Database Integrity</h5>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-center border border-gray-100 dark:border-white/5">
                                <span className="block text-lg font-bold text-indigo-500">{dbStats.collections}</span>
                                <span className="text-[10px] text-slate-500 uppercase font-bold">Collections</span>
                            </div>
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-center border border-gray-100 dark:border-white/5">
                                <span className="block text-lg font-bold text-indigo-500">{dbStats.documents}</span>
                                <span className="text-[10px] text-slate-500 uppercase font-bold">Documents</span>
                            </div>
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-center border border-gray-100 dark:border-white/5">
                                <span className="block text-lg font-bold text-indigo-500">{dbStats.size}</span>
                                <span className="text-[10px] text-slate-500 uppercase font-bold">Size</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={handleBackup}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all"
                            >
                                <Download className="w-3 h-3" /> Backup
                            </button>
                            <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-all">
                                <Upload className="w-3 h-3" /> Restore
                                <input type="file" onChange={handleRestore} accept=".json" className="hidden" />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="p-6 bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-white/5 rounded-3xl space-y-4">
                        <h5 className="font-bold text-slate-900 dark:text-white transition-colors">Social Presence</h5>
                        <div className="space-y-4">
                            <div className="relative">
                                <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={systemSettings.socialMedia?.facebook || ''}
                                    onChange={(e) => setSystemSettings({
                                        ...systemSettings,
                                        socialMedia: { ...systemSettings.socialMedia, facebook: e.target.value }
                                    })}
                                    placeholder="Facebook URL"
                                    className="pl-10 w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                            <div className="relative">
                                <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={systemSettings.socialMedia?.twitter || ''}
                                    onChange={(e) => setSystemSettings({
                                        ...systemSettings,
                                        socialMedia: { ...systemSettings.socialMedia, twitter: e.target.value }
                                    })}
                                    placeholder="Twitter URL"
                                    className="pl-10 w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                            <div className="relative">
                                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={systemSettings.socialMedia?.linkedin || ''}
                                    onChange={(e) => setSystemSettings({
                                        ...systemSettings,
                                        socialMedia: { ...systemSettings.socialMedia, linkedin: e.target.value }
                                    })}
                                    placeholder="LinkedIn URL"
                                    className="pl-10 w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                            <div className="relative">
                                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={systemSettings.socialMedia?.instagram || ''}
                                    onChange={(e) => setSystemSettings({
                                        ...systemSettings,
                                        socialMedia: { ...systemSettings.socialMedia, instagram: e.target.value }
                                    })}
                                    placeholder="Instagram URL"
                                    className="pl-10 w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                            <div className="relative">
                                <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={systemSettings.socialMedia?.youtube || ''}
                                    onChange={(e) => setSystemSettings({
                                        ...systemSettings,
                                        socialMedia: { ...systemSettings.socialMedia, youtube: e.target.value }
                                    })}
                                    placeholder="YouTube URL"
                                    className="pl-10 w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-white/5 rounded-3xl space-y-4">
                        <h5 className="font-bold text-slate-900 dark:text-white transition-colors">File Management</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <SettingField
                                label="Max Size (MB)"
                                type="number"
                                value={systemSettings.maxFileSize}
                                onChange={(e) => setSystemSettings({ ...systemSettings, maxFileSize: parseInt(e.target.value) })}
                            />
                            <SettingField
                                label="Allowed Extensions"
                                value={systemSettings.allowedFileTypes.join(', ')}
                                onChange={(e) => setSystemSettings({
                                    ...systemSettings,
                                    allowedFileTypes: e.target.value.split(',').map(t => t.trim())
                                })}
                                placeholder="pdf, doc, jpg, png"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Info className="w-6 h-6" />
                </div>
                <div>
                    <p className="font-bold text-amber-500">Maintenance Protocol</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Activating maintenance mode will restrict public access to the platform.
                    </p>
                    <button
                        onClick={() => setSystemSettings({ ...systemSettings, maintenanceMode: !systemSettings.maintenanceMode })}
                        className={`mt-4 px-6 py-2 rounded-xl text-sm font-bold border transition-all ${systemSettings.maintenanceMode ? 'bg-amber-500 text-white' : 'border-amber-500/30 text-amber-500 hover:bg-amber-500/10'}`}
                    >
                        {systemSettings.maintenanceMode ? 'Disable Protocol' : 'Engage Protocol'}
                    </button>
                </div>
            </div>

            <div className="pt-6 flex justify-end">
                <button
                    onClick={() => handleSave('system', systemSettings)}
                    className="premium-button"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Apply Global Runtime Config
                </button>
            </div>
        </div>
    );
};
