import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Shield,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Key,
  Server,
  X,
  Smartphone,
  Info,
  FileText,
  RefreshCw,
  Upload,
  Download,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Eye,
  EyeOff,
  User
} from 'lucide-react';
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { adminService } from '@/services/adminService';
import { authService } from '@/services/authService';
import apiClient from '@/services/api';


interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  emailNotifications: boolean;
  notificationAlerts: {
    jobApplications: boolean;
    inquiries: boolean;
    reviews: boolean;
    systemAlerts: boolean;
  };
  maxFileSize: number;
  allowedFileTypes: string[];
  smtp: {
    host: string;
    port: number;
    user: string;
    password?: string;
    secure: boolean;
    fromEmail: string;
  };
  socialMedia: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
}

interface LogEntry {
  ip: string;
  timestamp: string;
  request: string;
  status: number;
  size: string;
  userAgent: string;
  raw?: string;
}

interface SettingFieldProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}

const SettingField = ({ label, value, onChange, type = "text", placeholder = "", className = "" }: SettingFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest ml-1 min-h-[20px] flex items-end mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl px-4 py-3 text-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all w-full pr-12"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'system' | 'smtp' | 'security' | 'notifications' | 'logs'>('system');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorStatus, setTwoFactorStatus] = useState(false);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);


  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'CareerMap Solutions',
    siteDescription: 'Your trusted partner for business solutions',
    contactEmail: '',
    contactPhone: '',
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotifications: true,
    notificationAlerts: {
      jobApplications: true,
      inquiries: true,
      reviews: true,
      systemAlerts: true,
    },
    maxFileSize: 10,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
    smtp: {
      host: '',
      port: 587,
      user: '',
      password: '',
      secure: false,
      fromEmail: ''
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      youtube: ''
    }
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [dbStats, setDbStats] = useState({ collections: 0, documents: 0, size: '0 B' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = authService.getCurrentUser();
        if (user) {
          setTwoFactorStatus(!!user.twoFactorEnabled);
        }

        const systemRes = await adminService.getSystemSettings();
        if (systemRes.success) setSystemSettings(systemRes.data);
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (type: string, data: any) => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (type === 'system') {
        await adminService.updateSystemSettings(data);
      } else if (type === 'password') {
        await apiClient.put('/api/users/me/password', data);
      }

      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      setLoading(true);
      const blob = await adminService.backupDatabase();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cms-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSuccess('Backup downloaded successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to download backup');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          await adminService.restoreDatabase(json);
          setSuccess('Database restored successfully');
          setTimeout(() => setSuccess(null), 3000);
          fetchDbStats(); // Refresh stats
        } catch (err) {
          setError('Invalid backup file');
        }
      };
      reader.readAsText(file);
    } catch (err) {
      setError('Failed to restore database');
    } finally {
      setLoading(false);
    }
  };

  const fetchDbStats = async () => {
    try {
      const res = await adminService.getDatabaseStats();
      if (res.success) setDbStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getSystemLogs();
      if (res.success) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    setTestResult(null);
    try {
      const res = await adminService.testSmtpConnection(systemSettings.smtp);
      if (res.success) {
        setTestResult('success');
        setSuccess('SMTP Connection established successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setTestResult('failed');
        setError('SMTP Connection failed');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err: any) {
      setTestResult('failed');
      setError(err.message || 'SMTP Connection failed');
      setTimeout(() => setError(null), 3000);
    } finally {
      setTestingSmtp(false);
      setTimeout(() => setTestResult(null), 5000);
    }
  };

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    } else if (activeTab === 'system') {
      fetchDbStats();
    }
  }, [activeTab]);

  const tabs = [
    { id: 'system', label: 'Architecture', icon: Server },
    { id: 'smtp', label: 'Communication Hub', icon: Mail },
    { id: 'security', label: 'Cybersecurity', icon: Shield },
    { id: 'notifications', label: 'Transmissions', icon: Bell },
    { id: 'logs', label: 'System Logs', icon: FileText },
  ];

  if (loading && activeTab !== 'logs') {
    return (
      <AdminLayout>
        <div className="p-4 sm:p-6 lg:p-10 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
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

        <div className="flex items-center gap-2 p-1.5 bg-gray-100 dark:bg-slate-900/50 border border-gray-200 dark:border-white/5 rounded-2xl w-fit backdrop-blur-md">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
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
                className="space-y-10"
              >
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
                        className="premium-button w-full"
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
              </motion.div>
            )}

            {activeTab === 'system' && (
              <motion.div
                key="system"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
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
              </motion.div>
            )}

            {activeTab === 'smtp' && (
              <motion.div
                key="smtp"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
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
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
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
                      Your transmission settings control how the platform communicates with internal and external entities.
                      Ensure your communication endpoints are correctly calibrated for optimal throughput.
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    onClick={() => handleSave('system', systemSettings)}
                    className="premium-button"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Confirm Synchronization State
                  </button>
                </div>
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
                  <h4 className="text-xl font-bold font-display text-slate-900 dark:text-white transition-colors">System Access Logs</h4>
                  <button
                    onClick={fetchLogs}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold hover:bg-indigo-500/20 transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-white/5">
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Timestamp</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Method & Path</th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">IP Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {logs.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-slate-500">No logs available.</td>
                          </tr>
                        ) : (
                          logs.map((log, i) => {
                            const method = log.request?.split(' ')[0] || '-';
                            const path = log.request?.split(' ')[1] || '-';
                            return (
                              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="p-4 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                  {log.timestamp ? log.timestamp.replace(' +0530', '') : '-'}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${log.status >= 500 ? 'bg-rose-500/10 text-rose-500' :
                                    log.status >= 400 ? 'bg-amber-500/10 text-amber-500' :
                                      log.status >= 300 ? 'bg-blue-500/10 text-blue-500' :
                                        'bg-emerald-500/10 text-emerald-500'
                                    }`}>
                                    {log.status || 200}
                                  </span>
                                </td>
                                <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">
                                  <span className="font-bold text-indigo-500 mr-2">{method}</span>
                                  {path}
                                </td>
                                <td className="p-4 text-sm text-slate-500 font-mono">
                                  {log.ip || '-'}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2FA Modal */}
        {show2FASetup && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShow2FASetup(false)} />
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 w-full max-w-lg rounded-3xl p-8 relative z-10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white transition-colors">2FA Synchronization</h3>
                <button onClick={() => setShow2FASetup(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors"><X /></button>
              </div>
              <TwoFactorSetup
                onComplete={() => { setShow2FASetup(false); setTwoFactorStatus(true); }}
                onCancel={() => setShow2FASetup(false)}
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
