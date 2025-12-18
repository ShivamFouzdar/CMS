import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Database,
  Shield,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Key,
  Server,
  FileText,
  Palette
} from 'lucide-react';
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { fadeIn } from '@/lib/utils';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';

interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
}

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  emailNotifications: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'system' | 'security' | 'notifications'>('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorStatus, setTwoFactorStatus] = useState(false);

  const [userSettings, setUserSettings] = useState<UserSettings>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'CareerMap Solutions',
    siteDescription: 'Your trusted partner for business solutions',
    contactEmail: '',
    contactPhone: '',
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotifications: true,
    maxFileSize: 10,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    sms: false,
    push: true,
    newLeads: true,
    jobApplications: true,
    reviews: true,
    systemAlerts: true,
  });

  useEffect(() => {
    fetchUserData();
    fetchSystemSettings();
    fetch2FAStatus();
    fetchNotificationPreferences();
  }, []);

  const fetch2FAStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      // Check user data for 2FA status
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        // You can add 2FA status to user object or fetch from API
        setTwoFactorStatus(securitySettings.twoFactorEnabled);
      }
    } catch (err) {
      console.error('Error fetching 2FA status:', err);
    }
  };

  const fetchUserData = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserSettings({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'admin',
        });
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await axios.get(API_ENDPOINTS.admin?.settings || '/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && response.data.data) {
        setSystemSettings(prev => ({
          ...prev,
          ...response.data.data
        }));
      }
    } catch (err) {
      console.error('Error fetching system settings:', err);
    }
  };

  const fetchNotificationPreferences = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.preferences?.notifications) {
          setNotificationPreferences(prev => ({
            ...prev,
            email: user.preferences.notifications.email ?? true,
            sms: user.preferences.notifications.sms ?? false,
            push: user.preferences.notifications.push ?? true,
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching notification preferences:', err);
    }
  };

  const handleSaveNotificationPreferences = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Not authenticated');
        setSaving(false);
        return;
      }

      const response = await axios.put(
        API_ENDPOINTS.users.updatePreferences,
        {
          notifications: {
            email: notificationPreferences.email,
            sms: notificationPreferences.sms,
            push: notificationPreferences.push,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSuccess('Notification preferences saved successfully!');
        setTimeout(() => setSuccess(null), 3000);

        // Update local storage user data
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          user.preferences = {
            ...user.preferences,
            notifications: {
              email: notificationPreferences.email,
              sms: notificationPreferences.sms,
              push: notificationPreferences.push,
            },
          };
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save notification preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleUserSettingsChange = (field: keyof UserSettings, value: string) => {
    setUserSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSystemSettingsChange = (field: keyof SystemSettings, value: any) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSecuritySettingsChange = (field: keyof SecuritySettings, value: string | boolean) => {
    if (field === 'twoFactorEnabled' && value === true && !twoFactorStatus) {
      // Show 2FA setup modal
      setShow2FASetup(true);
      return;
    }
    
    if (field === 'twoFactorEnabled' && value === false && twoFactorStatus) {
      // Disable 2FA
      handleDisable2FA();
      return;
    }

    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable 2FA? You will need to enter your password.')) {
      return;
    }

    const password = prompt('Enter your password to disable 2FA:');
    if (!password) {
      setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: true }));
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        API_ENDPOINTS.twoFactor?.disable || '/api/2fa/disable',
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setTwoFactorStatus(false);
        setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: false }));
        setSuccess('2FA disabled successfully');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to disable 2FA');
      setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: true }));
    } finally {
      setSaving(false);
    }
  };

  const handle2FAComplete = () => {
    setShow2FASetup(false);
    setTwoFactorStatus(true);
    setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: true }));
    setSuccess('2FA enabled successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (!userSettings.firstName.trim()) {
      setError('First name is required');
      setSaving(false);
      return;
    }

    if (!userSettings.lastName.trim()) {
      setError('Last name is required');
      setSaving(false);
      return;
    }

    if (!userSettings.email.trim()) {
      setError('Email is required');
      setSaving(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userSettings.email)) {
      setError('Please enter a valid email address');
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required. Please login again.');
        setSaving(false);
        return;
      }

      const response = await axios.put(
        API_ENDPOINTS.users?.updateProfile || '/api/users/me/profile',
        {
          firstName: userSettings.firstName.trim(),
          lastName: userSettings.lastName.trim(),
          email: userSettings.email.trim(),
          phone: userSettings.phone?.trim() || '',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          const updatedUser = { ...user, ...userSettings };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          localStorage.clear();
          window.location.href = '/auth/login';
        }, 2000);
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid data. Please check your inputs.');
      } else if (err.response?.status === 409) {
        setError('Email already exists. Please use a different email.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to update profile');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSystem = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (!systemSettings.siteName.trim()) {
      setError('Site name is required');
      setSaving(false);
      return;
    }

    if (systemSettings.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(systemSettings.contactEmail)) {
      setError('Please enter a valid contact email address');
      setSaving(false);
      return;
    }

    if (systemSettings.maxFileSize < 1 || systemSettings.maxFileSize > 100) {
      setError('Max file size must be between 1 and 100 MB');
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required. Please login again.');
        setSaving(false);
        return;
      }

      const response = await axios.put(
        API_ENDPOINTS.admin?.settings || '/api/admin/settings',
        systemSettings,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess('System settings updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          localStorage.clear();
          window.location.href = '/auth/login';
        }, 2000);
      } else if (err.response?.status === 403) {
        setError('You do not have permission to update system settings.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid data. Please check your inputs.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to update system settings');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (!securitySettings.currentPassword.trim()) {
      setError('Current password is required');
      setSaving(false);
      return;
    }

    if (!securitySettings.newPassword.trim()) {
      setError('New password is required');
      setSaving(false);
      return;
    }

    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      setError('New passwords do not match');
      setSaving(false);
      return;
    }

    if (securitySettings.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setSaving(false);
      return;
    }

    // Check if new password is same as current
    if (securitySettings.currentPassword === securitySettings.newPassword) {
      setError('New password must be different from current password');
      setSaving(false);
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(securitySettings.newPassword);
    const hasLowerCase = /[a-z]/.test(securitySettings.newPassword);
    const hasNumbers = /\d/.test(securitySettings.newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(securitySettings.newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required. Please login again.');
        setSaving(false);
        return;
      }

      const response = await axios.put(
        API_ENDPOINTS.users?.changePassword || '/api/users/me/password',
        {
          currentPassword: securitySettings.currentPassword,
          newPassword: securitySettings.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess('Password changed successfully!');
        setSecuritySettings({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          twoFactorEnabled: securitySettings.twoFactorEnabled,
        });
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          localStorage.clear();
          window.location.href = '/auth/login';
        }, 2000);
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid password. Please check your current password.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to change password');
      }
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'system', label: 'System', icon: Server },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            variants={fadeIn('up', 0.1)}
            initial="hidden"
            animate="show"
          >
            <div className="flex items-center space-x-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <SettingsIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account and system preferences</p>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg flex items-center"
            >
              <Loader2 className="h-5 w-5 text-blue-500 mr-3 animate-spin" />
              <p className="text-blue-700 font-medium">Loading settings...</p>
            </motion.div>
          )}

          {/* Success/Error Messages */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-center shadow-sm"
            >
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <p className="text-green-700 font-medium">{success}</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center shadow-sm"
            >
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <p className="text-red-700 font-medium flex-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-500 hover:text-red-700"
                aria-label="Dismiss error"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="mb-8 border-b border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${isActive
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 lg:p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={userSettings.firstName}
                        onChange={(e) => handleUserSettingsChange('firstName', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={userSettings.lastName}
                        onChange={(e) => handleUserSettingsChange('lastName', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={userSettings.email}
                          onChange={(e) => handleUserSettingsChange('email', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={userSettings.phone}
                        onChange={(e) => handleUserSettingsChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={userSettings.role}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Site Name
                        </label>
                        <input
                          type="text"
                          value={systemSettings.siteName}
                          onChange={(e) => handleSystemSettingsChange('siteName', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          value={systemSettings.contactEmail}
                          onChange={(e) => handleSystemSettingsChange('contactEmail', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          value={systemSettings.contactPhone}
                          onChange={(e) => handleSystemSettingsChange('contactPhone', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Max File Size (MB)
                        </label>
                        <input
                          type="number"
                          value={systemSettings.maxFileSize}
                          onChange={(e) => handleSystemSettingsChange('maxFileSize', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Site Description
                      </label>
                      <textarea
                        value={systemSettings.siteDescription}
                        onChange={(e) => handleSystemSettingsChange('siteDescription', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h3 className="font-semibold text-gray-900">Maintenance Mode</h3>
                          <p className="text-sm text-gray-600">Enable maintenance mode to restrict site access</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={systemSettings.maintenanceMode}
                            onChange={(e) => handleSystemSettingsChange('maintenanceMode', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h3 className="font-semibold text-gray-900">Allow Registrations</h3>
                          <p className="text-sm text-gray-600">Allow new users to register</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={systemSettings.allowRegistrations}
                            onChange={(e) => handleSystemSettingsChange('allowRegistrations', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleSaveSystem}
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Save Settings</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={securitySettings.currentPassword}
                          onChange={(e) => handleSecuritySettingsChange('currentPassword', e.target.value)}
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={securitySettings.newPassword}
                          onChange={(e) => handleSecuritySettingsChange('newPassword', e.target.value)}
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter new password (min. 8 characters)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={securitySettings.confirmPassword}
                          onChange={(e) => handleSecuritySettingsChange('confirmPassword', e.target.value)}
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-600">
                            {twoFactorStatus 
                              ? '2FA is enabled. Your account is protected.' 
                              : 'Add an extra layer of security to your account'}
                          </p>
                          {twoFactorStatus && (
                            <p className="text-xs text-green-600 mt-1 font-medium">
                              ✓ Last used: {securitySettings.twoFactorEnabled ? 'Recently' : 'Never'}
                            </p>
                          )}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={twoFactorStatus || securitySettings.twoFactorEnabled}
                          onChange={(e) => handleSecuritySettingsChange('twoFactorEnabled', e.target.checked)}
                          className="sr-only peer"
                          disabled={saving}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                      </label>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleChangePassword}
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Changing...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Change Password</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive email notifications for important events</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationPreferences.email}
                          onChange={(e) => {
                            setNotificationPreferences(prev => ({ ...prev, email: e.target.checked }));
                            handleSaveNotificationPreferences();
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Notification Types</h3>
                      <div className="space-y-3">
                        {[
                          { id: 'new-leads', label: 'New Leads', description: 'Get notified when new leads are submitted' },
                          { id: 'job-applications', label: 'Job Applications', description: 'Receive notifications for new job applications' },
                          { id: 'reviews', label: 'New Reviews', description: 'Get notified when new reviews are posted' },
                          { id: 'system-alerts', label: 'System Alerts', description: 'Important system updates and alerts' },
                        ].map((notification) => {
                          const prefKey = notification.id === 'new-leads' ? 'newLeads' :
                                         notification.id === 'job-applications' ? 'jobApplications' :
                                         notification.id === 'reviews' ? 'reviews' : 'systemAlerts';
                          return (
                            <div key={notification.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{notification.label}</p>
                                <p className="text-sm text-gray-600">{notification.description}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={notificationPreferences[prefKey as keyof typeof notificationPreferences] as boolean}
                                  onChange={(e) => {
                                    setNotificationPreferences(prev => ({ ...prev, [prefKey]: e.target.checked }));
                                    // Auto-save on change
                                    setTimeout(() => handleSaveNotificationPreferences(), 500);
                                  }}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={handleSaveNotificationPreferences}
                        disabled={saving}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Preferences
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {show2FASetup && (
        <TwoFactorSetup
          onComplete={handle2FAComplete}
          onCancel={() => {
            setShow2FASetup(false);
            setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: false }));
          }}
        />
      )}
    </AdminLayout>
  );
}

