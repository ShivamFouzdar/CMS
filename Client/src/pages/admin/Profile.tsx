import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Smartphone, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/services/api';
import { User as UserType } from '@/types';

export default function Profile() {
    const { user, refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    const handleSave = async () => {
        setStatus('saving');
        try {
            const res = await apiClient.put('/api/users/me/profile', formData);
            if (res.data.success) {
                const updatedUser = { ...user, ...formData } as UserType;
                localStorage.setItem('user', JSON.stringify(updatedUser));
                refreshUser();
                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.response?.data?.message || 'Failed to update profile');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <AdminLayout>
            <div className="p-4 sm:p-6 lg:p-10 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 dark:from-white dark:via-indigo-200 dark:to-indigo-400">
                            User Profile
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                            Manage your administrative details and contact information.
                        </p>
                    </div>

                    <AnimatePresence>
                        {status === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" /> Profile Synchronized!
                            </motion.div>
                        )}
                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                            >
                                <AlertCircle className="w-4 h-4" /> {errorMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ID Card / Avatar Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-card rounded-3xl p-8 flex flex-col items-center text-center space-y-6 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-indigo-500/5">
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-5xl font-bold text-white shadow-2xl shadow-indigo-500/30 relative group">
                                {formData.firstName.charAt(0)}
                                <div className="absolute inset-0 bg-black/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-not-allowed">
                                    <span className="text-xs uppercase font-bold tracking-widest text-white">Identity</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {formData.firstName} {formData.lastName}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{user?.email}</p>
                            </div>
                            <div className="w-full pt-4 border-t border-gray-100 dark:border-white/5">
                                <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase tracking-widest rounded-full border border-indigo-500/20">
                                    {user?.role || 'Administrator'}
                                </span>
                            </div>
                        </div>

                        <div className="glass-card rounded-3xl p-6 bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-amber-600 dark:text-amber-500 text-sm">Update Frequency</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Ensure your profile data is current to maintain accurate system audit logs and internal communications.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form Section */}
                    <div className="lg:col-span-2">
                        <div className="glass-card rounded-3xl p-8 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl pl-12 pr-4 py-3 text-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                            placeholder="First Name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl pl-12 pr-4 py-3 text-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                            placeholder="Last Name"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Secure Email (Primary ID)</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full bg-gray-100 dark:bg-slate-800/30 border border-gray-200 dark:border-slate-700/30 rounded-2xl pl-12 pr-4 py-3 text-slate-400 dark:text-slate-500 outline-none cursor-not-allowed font-medium"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 ml-1">Email cannot be changed directly for security reasons.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Communication Protocol (Phone)</label>
                                <div className="relative group">
                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl pl-12 pr-4 py-3 text-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={status === 'saving'}
                                    className="premium-button min-w-[200px]"
                                >
                                    {status === 'saving' ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Syncing Neural Data...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            <span>Update Profile Identity</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
