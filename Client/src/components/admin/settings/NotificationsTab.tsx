import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Server, User, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export const NotificationsTab: React.FC = () => {
    const { systemSettings, setSystemSettings } = useSettings();

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-white/5 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                <Bell className="w-5 h-5" />
                            </div>
                            <h5 className="font-bold text-slate-900 dark:text-white transition-colors">Global Transmission Alerts</h5>
                        </div>
                        <button
                            onClick={() => setSystemSettings({ ...systemSettings, emailNotifications: !systemSettings.emailNotifications })}
                            className={`w-12 h-6 rounded-full transition-all relative ${systemSettings.emailNotifications ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-slate-700'}`}
                        >
                            <motion.div
                                animate={{ x: systemSettings.emailNotifications ? 24 : 4 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                        </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                        When enabled, the system will broadcast critical event alerts via the primary communication protocol.
                    </p>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-white/5 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                                <Server className="w-5 h-5" />
                            </div>
                            <h5 className="font-bold text-slate-900 dark:text-white transition-colors">Synchronization Protocol</h5>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                        The core telemetry sync is currently operational. Pulse check: 100% data integrity verified.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <h4 className="text-xl font-bold font-display text-slate-900 dark:text-white transition-colors">Granular Email Alerts</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { id: 'jobApplications', label: 'Talent Pipeline (Job Apps)', icon: User },
                        { id: 'inquiries', label: 'Client Inquiries (leads)', icon: Bell },
                        { id: 'reviews', label: 'Platform Reviews/Trust', icon: CheckCircle },
                        { id: 'systemAlerts', label: 'Critical System Alerts', icon: AlertCircle },
                    ].map((alert) => (
                        <div key={alert.id} className="p-5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                    <alert.icon className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{alert.label}</span>
                            </div>
                            <button
                                onClick={() => setSystemSettings({
                                    ...systemSettings,
                                    notificationAlerts: {
                                        ...systemSettings.notificationAlerts,
                                        [alert.id]: !(systemSettings.notificationAlerts as any)[alert.id]
                                    }
                                })}
                                className={`w-10 h-5 rounded-full transition-all relative ${((systemSettings.notificationAlerts as any)[alert.id]) ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-slate-700'}`}
                            >
                                <motion.div
                                    animate={{ x: ((systemSettings.notificationAlerts as any)[alert.id]) ? 22 : 2 }}
                                    className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                    <Info className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                    <h6 className="font-bold text-indigo-500">Neural Network Transmissions</h6>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                        Automated neural pathways (webhooks) are currently dormant. To activate external integrations with Zapier or Slack, please upgrade your plan.
                    </p>
                </div>
            </div>
        </div>
    );
};
