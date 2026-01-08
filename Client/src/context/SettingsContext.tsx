import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminService } from '@/services/adminService';
import { authService } from '@/services/authService';
import apiClient from '@/services/api';

// --- Interfaces ---

export interface SystemSettings {
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

export interface LogEntry {
    ip: string;
    timestamp: string;
    request: string;
    status: number;
    size: string;
    userAgent: string;
    raw?: string;
}

interface SecuritySettings {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    twoFactorEnabled: boolean;
}

interface SettingsContextType {
    // State
    activeTab: 'system' | 'smtp' | 'security' | 'notifications' | 'logs';
    setActiveTab: (tab: 'system' | 'smtp' | 'security' | 'notifications' | 'logs') => void;
    loading: boolean;
    saving: boolean;
    success: string | null;
    error: string | null;
    systemSettings: SystemSettings;
    securitySettings: SecuritySettings;
    logs: LogEntry[];
    dbStats: { collections: number; documents: number; size: string };
    twoFactorStatus: boolean;
    testingSmtp: boolean;
    testResult: 'success' | 'failed' | null;
    show2FASetup: boolean;

    // Setters
    setSystemSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
    setSecuritySettings: React.Dispatch<React.SetStateAction<SecuritySettings>>;
    setShow2FASetup: (show: boolean) => void;
    setTwoFactorStatus: (status: boolean) => void;
    setSuccess: (msg: string | null) => void; // Exposed for manual clearing if needed

    // Actions
    fetchLogs: () => Promise<void>;
    fetchDbStats: () => Promise<void>;
    handleSave: (type: string, data: any) => Promise<void>;
    handleBackup: () => Promise<void>;
    handleRestore: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleTestSmtp: () => Promise<void>;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [activeTab, setActiveTab] = useState<'system' | 'smtp' | 'security' | 'notifications' | 'logs'>('system');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [show2FASetup, setShow2FASetup] = useState(false);
    const [twoFactorStatus, setTwoFactorStatus] = useState(false);
    const [testingSmtp, setTestingSmtp] = useState(false);
    const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);

    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [dbStats, setDbStats] = useState({ collections: 0, documents: 0, size: '0 B' });

    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false,
    });

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

    // --- Effects ---

    const refreshSettings = async () => {
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

    useEffect(() => {
        refreshSettings();
    }, []);

    useEffect(() => {
        if (activeTab === 'logs') {
            fetchLogs();
        } else if (activeTab === 'system') {
            fetchDbStats();
        }
    }, [activeTab]);

    // --- Handlers ---

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

    const value = {
        activeTab, setActiveTab,
        loading, saving, success, error,
        systemSettings, securitySettings, logs,
        dbStats, twoFactorStatus, testingSmtp, testResult, show2FASetup,

        setSystemSettings, setSecuritySettings,
        setShow2FASetup, setTwoFactorStatus, setSuccess,

        fetchLogs, fetchDbStats, handleSave, handleBackup,
        handleRestore, handleTestSmtp, refreshSettings
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}
