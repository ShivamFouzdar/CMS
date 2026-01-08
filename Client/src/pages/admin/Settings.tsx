import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Shield,
  Loader2,
  CheckCircle,
  AlertCircle,
  Server,
  FileText,
  Mail
} from 'lucide-react';
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { AdminLayout } from '@/components/layout/AdminLayout';

// Context
import { SettingsProvider, useSettings } from '@/context/SettingsContext';

// Sub Components
import { SystemSettingsTab } from '@/components/admin/settings/SystemSettingsTab';
import { SmtpSettingsTab } from '@/components/admin/settings/SmtpSettingsTab';
import { SecuritySettingsTab } from '@/components/admin/settings/SecuritySettingsTab';
import { NotificationsTab } from '@/components/admin/settings/NotificationsTab';

function SettingsContent() {
  const {
    activeTab, setActiveTab,
    loading, success, error,
    logs, fetchLogs,
    show2FASetup, setShow2FASetup, setTwoFactorStatus, setSuccess
  } = useSettings();

  const tabs = [
    { id: 'system', label: 'Architecture', icon: Server },
    { id: 'smtp', label: 'Communication Hub', icon: Mail },
    { id: 'security', label: 'Cybersecurity', icon: Shield },
    { id: 'notifications', label: 'Transmissions', icon: Bell },
    { id: 'logs', label: 'System Logs', icon: FileText },
  ];

  if (loading && activeTab !== 'logs') {
    return (
      <div className="p-4 sm:p-6 lg:p-10 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 lg:space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white transition-colors">Advanced Settings</h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium transition-colors">Configure global parameters and security protocols.</p>
        </div>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" /> {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {show2FASetup && (
        <TwoFactorSetup
          onCancel={() => setShow2FASetup(false)}
          onComplete={() => {
            setTwoFactorStatus(true);
            setSuccess('2FA Activated Successfully');
            setShow2FASetup(false);
          }}
        />
      )}

      <div className="flex items-center gap-2 p-1.5 bg-gray-100 dark:bg-slate-900/50 border border-gray-200 dark:border-white/5 rounded-2xl w-fit backdrop-blur-md overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative whitespace-nowrap ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] rounded-xl z-0"
                />
              )}
              <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-white' : ''}`} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="glass-card rounded-3xl p-8 min-h-[500px]">
        <AnimatePresence mode="wait">

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SecuritySettingsTab />
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div
              key="system"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SystemSettingsTab />
            </motion.div>
          )}

          {activeTab === 'smtp' && (
            <motion.div
              key="smtp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SmtpSettingsTab />
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <NotificationsTab />
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">System Logs</h3>
                <button onClick={fetchLogs} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-3 font-medium">Timestamp</th>
                      <th className="px-6 py-3 font-medium">Level</th>
                      <th className="px-6 py-3 font-medium">Message</th>
                      <th className="px-6 py-3 font-medium">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                    {logs.map((log, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-3 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${log.status >= 500 ? 'bg-red-100 text-red-600' :
                            log.status >= 400 ? 'bg-orange-100 text-orange-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 max-w-md truncate" title={log.request}>{log.request}</td>
                        <td className="px-6 py-3 text-slate-500">
                          {log.ip}
                        </td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                          No logs found for the current period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <AdminLayout>
      <SettingsProvider>
        <SettingsContent />
      </SettingsProvider>
    </AdminLayout>
  );
}
