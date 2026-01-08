import React from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Info, RefreshCw, Save, Loader2 } from 'lucide-react';
import { SettingField } from './SettingField';
import { useSettings } from '@/context/SettingsContext';

export const SmtpSettingsTab: React.FC = () => {
    const {
        systemSettings, setSystemSettings, handleSave,
        handleTestSmtp, testingSmtp, testResult, saving
    } = useSettings();

    return (
        <div className="space-y-8">
            <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                    <Mail className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                    <h6 className="font-bold text-indigo-500">SMTP Relay Configuration</h6>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                        Configure your external SMTP provider (Gmail, AWS SES, SendGrid, etc.) to enable system transactional emails.
                        Ensure port `587` (TLS) or `465` (SSL) is correctly mapped.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <SettingField
                    label="SMTP Host"
                    value={systemSettings.smtp.host}
                    onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        smtp: { ...systemSettings.smtp, host: e.target.value }
                    })}
                    placeholder="smtp.example.com"
                />
                <SettingField
                    label="SMTP Port"
                    type="number"
                    value={systemSettings.smtp.port}
                    onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        smtp: { ...systemSettings.smtp, port: parseInt(e.target.value) }
                    })}
                    placeholder="587"
                />
                <SettingField
                    label="Username / API User"
                    value={systemSettings.smtp.user}
                    onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        smtp: { ...systemSettings.smtp, user: e.target.value }
                    })}
                />
                <SettingField
                    label="Password / API Key"
                    type="password"
                    value={systemSettings.smtp.password || ''}
                    onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        smtp: { ...systemSettings.smtp, password: e.target.value }
                    })}
                    placeholder="••••••••••••"
                />
                <SettingField
                    label="From Email Address"
                    value={systemSettings.smtp.fromEmail}
                    onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        smtp: { ...systemSettings.smtp, fromEmail: e.target.value }
                    })}
                    placeholder="noreply@domain.com"
                />

                <div className="p-6 bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-white/5 rounded-3xl flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">Secure Connection (SSL/TLS)</p>
                        <p className="text-xs text-slate-500">Enforce encryption for mail transport.</p>
                    </div>
                    <button
                        onClick={() => setSystemSettings({
                            ...systemSettings,
                            smtp: { ...systemSettings.smtp, secure: !systemSettings.smtp.secure }
                        })}
                        className={`w-12 h-6 rounded-full transition-all relative ${systemSettings.smtp.secure ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-slate-700'}`}
                    >
                        <motion.div
                            animate={{ x: systemSettings.smtp.secure ? 24 : 4 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                    </button>
                </div>
            </div>

            <div className="pt-6 flex justify-between">
                <button
                    onClick={handleTestSmtp}
                    disabled={testingSmtp}
                    className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${testResult === 'success' ? 'bg-emerald-500 text-white border-transparent' :
                        testResult === 'failed' ? 'bg-rose-500 text-white border-transparent' :
                            'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                >
                    {testingSmtp ? (
                        <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Testing...
                        </>
                    ) : testResult === 'success' ? (
                        <>
                            <CheckCircle className="w-4 h-4" /> Success
                        </>
                    ) : testResult === 'failed' ? (
                        <>
                            <Info className="w-4 h-4" /> Failed
                        </>
                    ) : (
                        <>
                            <RefreshCw className="w-4 h-4" /> Test Connection
                        </>
                    )}
                </button>

                <button
                    onClick={() => handleSave('system', systemSettings)}
                    className="premium-button"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save SMTP Protocol
                </button>
            </div>
        </div>
    );
};
