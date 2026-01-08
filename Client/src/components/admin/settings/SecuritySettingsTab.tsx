import React from 'react';
import { Key, Smartphone, Shield } from 'lucide-react';
import { SettingField } from './SettingField';
import { useSettings } from '@/context/SettingsContext';

export const SecuritySettingsTab: React.FC = () => {
    const {
        securitySettings, setSecuritySettings, handleSave,
        twoFactorStatus, setShow2FASetup
    } = useSettings();

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <h4 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
                        <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Password Calibration
                    </h4>
                    <div className="space-y-4">
                        <SettingField
                            type="password"
                            placeholder="Current Password"
                            value={securitySettings.currentPassword}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                            label=""
                        />
                        <SettingField
                            type="password"
                            placeholder="New Secure Password"
                            value={securitySettings.newPassword}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                            label=""
                        />
                        <SettingField
                            type="password"
                            placeholder="Confirm New Password"
                            value={securitySettings.confirmPassword}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                            label=""
                        />
                        <button
                            onClick={() => handleSave('password', securitySettings)}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all w-full shadow-lg shadow-indigo-500/20"
                        >
                            Update Security Key
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
                        <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Two-Factor Authentication
                    </h4>
                    <div className={`p-6 rounded-3xl border ${twoFactorStatus ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-gray-100 dark:bg-slate-800/40 border-gray-200 dark:border-white/5'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white transition-colors">Status: {twoFactorStatus ? 'Fortified' : 'Vulnerable'}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 transition-colors">
                                    Adds an extra layer of security to your account.
                                </p>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${twoFactorStatus ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-gray-200 dark:bg-slate-700 text-slate-500 dark:text-slate-500'}`}>
                                <Shield className="w-6 h-6" />
                            </div>
                        </div>
                        <button
                            onClick={() => setShow2FASetup(true)}
                            className={`w-full py-3 rounded-xl font-bold transition-all ${twoFactorStatus ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-transparent' : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20'}`}
                        >
                            {twoFactorStatus ? 'Reconfigure 2FA' : 'Activate 2FA'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
