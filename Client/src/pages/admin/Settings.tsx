import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Shield,
  Loader2,
  CheckCircle,
  AlertCircle,
  Server,
  FileText,
  Mail,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

// Context
import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';

// Sub Components
import { SystemSettingsTab } from '@/components/admin/settings/SystemSettingsTab';
import { SmtpSettingsTab } from '@/components/admin/settings/SmtpSettingsTab';
import { SecuritySettingsTab } from '@/components/admin/settings/SecuritySettingsTab';
import { NotificationsTab } from '@/components/admin/settings/NotificationsTab';

function SettingsContent() {
  const { isSuperAdmin } = useAuth();
  const {
    activeTab, setActiveTab,
    loading, success, error,
    logs, fetchLogs, clearLogs,
    show2FASetup, setShow2FASetup, setTwoFactorStatus, setSuccess,
    logsPagination, logsFilters, setLogsPage, setLogsFilters
  } = useSettings();

  const [searchParams, setSearchParams] = useSearchParams();

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab && ['system', 'smtp', 'security', 'notifications', 'logs'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  // Handle Tab Change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as any);
    setSearchParams({ tab: tabId }, { replace: true });
  };

  const tabs = [
    { id: 'system', label: 'Architecture', icon: Server },
    { id: 'smtp', label: 'Communication Hub', icon: Mail },
    { id: 'security', label: 'Cybersecurity', icon: Shield },
    { id: 'notifications', label: 'Transmissions', icon: Bell },
    { id: 'logs', label: 'System Logs', icon: FileText },
  ];

  // NOTE: REMOVED BLOCKING LOADER HERE to prevent flickering.
  // The SettingsContext handles loading internally if needed, or we show localized loaders.

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 lg:space-y-10">
      {loading && activeTab !== 'logs' && (
        <div className="fixed top-0 left-0 w-full h-1 bg-indigo-500/20 z-50">
          <div className="h-full bg-indigo-500 animate-progress origin-left"></div>
        </div>
      )}
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
              onClick={() => handleTabChange(tab.id)}
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
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">System Logs</h3>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={logsFilters.action}
                      onChange={(e) => setLogsFilters({ ...logsFilters, action: e.target.value })}
                      className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <option value="">All Actions</option>
                      <option value="LOGIN">Login</option>
                      <option value="UPDATE">Update</option>
                      <option value="CREATE">Create</option>
                      <option value="DELETE">Delete</option>
                    </select>
                  </div>
                  {isSuperAdmin && (
                    <button
                      onClick={clearLogs}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Clear Logs"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => fetchLogs()} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
              <div className="border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-3 font-medium">Timestamp</th>
                      <th className="px-6 py-3 font-medium">User</th>
                      <th className="px-6 py-3 font-medium">Action</th>
                      <th className="px-6 py-3 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                    {logs.map((log, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-3 font-mono text-xs whitespace-nowrap text-slate-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            {log.user ? (
                              <>
                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                  {/* Handle potential undefined firstName/lastName safely */}
                                  {(log.user.firstName?.[0] || 'U')}{(log.user.lastName?.[0] || '')}
                                </div>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                  {log.user.firstName} {log.user.lastName}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs text-slate-400 italic">System / Unknown</span>
                            )}
                          </div>
                          {log.ip && <div className="text-[10px] text-slate-400 ml-8">{log.ip}</div>}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wide
                            ${log.action === 'DELETE' ? 'bg-red-100 text-red-600' :
                              log.action === 'UPDATE' ? 'bg-amber-100 text-amber-600' :
                                log.action === 'LOGIN' ? 'bg-blue-100 text-blue-600' :
                                  'bg-indigo-50 text-indigo-600'
                            }`}>
                            {log.action || 'INFO'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-slate-600 dark:text-slate-400 text-xs">
                          <div className="font-semibold text-slate-900 dark:text-white mb-0.5">
                            {log.resource} {log.resourceId ? <span className="text-slate-400">#{log.resourceId.substring(0, 8)}</span> : ''}
                          </div>
                          <div className="truncate max-w-xs opacity-75" title={typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}>
                            {log.details ? (typeof log.details === 'string' ? log.details : JSON.stringify(log.details)) : log.request}
                          </div>
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

              {/* Pagination Controls */}
              {logsPagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                  <p className="text-sm text-slate-500">
                    Showing page <span className="font-bold">{logsPagination.page}</span> of <span className="font-bold">{logsPagination.totalPages}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLogsPage(Math.max(1, logsPagination.page - 1))}
                      disabled={logsPagination.page === 1}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setLogsPage(Math.min(logsPagination.totalPages, logsPagination.page + 1))}
                      disabled={logsPagination.page === logsPagination.totalPages}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Settings() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const validTabs = ['system', 'smtp', 'security', 'notifications', 'logs'];
  const initialTab = (tabParam && validTabs.includes(tabParam)) ? tabParam : 'system';

  return (
    <AdminLayout>
      <SettingsProvider initialTab={initialTab as any}>
        <SettingsContent />
      </SettingsProvider>
    </AdminLayout>
  );
}
