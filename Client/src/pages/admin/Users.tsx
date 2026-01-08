import { useState, useEffect, useMemo } from 'react';
import {
    Users as UsersIcon,
    UserPlus,
    Trash2,
    Shield,
    ShieldCheck,
    ShieldAlert,
    Search,
    Mail,
    Calendar,
    User as UserIcon,
    CheckCircle,
    XCircle,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService, AdminUser } from '@/services/adminService';
import { useNotification } from '@/context/NotificationContext';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatCard } from '@/components/ui/StatCard';

export default function Users() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const { showNotification } = useNotification();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'admin' as AdminUser['role']
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllUsers();
            setUsers(data || []);
        } catch (error) {
            showNotification('error', 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setFormLoading(true);
            await adminService.createUser(formData);
            showNotification('success', 'User created successfully');
            setShowAddModal(false);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                role: 'admin'
            });
            fetchUsers();
        } catch (error: any) {
            showNotification('error', error.message || 'Failed to create user');
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggleStatus = async (user: AdminUser) => {
        try {
            await adminService.toggleUserStatus(user.id, !user.isActive);
            showNotification('success', `User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
            fetchUsers();
        } catch (error) {
            showNotification('error', 'Failed to update user status');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await adminService.deleteUser(userId);
            showNotification('success', 'User deleted successfully');
            fetchUsers();
        } catch (error) {
            showNotification('error', 'Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = useMemo(() => {
        return {
            total: users.length,
            superAdmins: users.filter(u => u.role === 'super_admin').length,
            admins: users.filter(u => u.role === 'admin').length,
            active: users.filter(u => u.isActive).length,
        };
    }, [users]);

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'super_admin': return <ShieldCheck className="w-4 h-4 text-purple-500" />;
            case 'admin': return <Shield className="w-4 h-4 text-indigo-500" />;
            case 'moderator': return <ShieldAlert className="w-4 h-4 text-amber-500" />;
            default: return <UserIcon className="w-4 h-4 text-slate-500" />;
        }
    };

    return (
        <AdminLayout>
            <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 lg:space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                    >
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 dark:from-white dark:via-indigo-200 dark:to-indigo-400">
                            Admin Management
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                            Manage your team of administrators and system controllers.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <UserPlus className="w-5 h-5" />
                            Add Administrator
                        </button>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    <StatCard
                        title="Total Staff"
                        value={stats.total}
                        icon={UsersIcon}
                        gradient="blue"
                    />
                    <StatCard
                        title="Super Admins"
                        value={stats.superAdmins}
                        icon={ShieldCheck}
                        gradient="purple"
                    />
                    <StatCard
                        title="Active Now"
                        value={stats.active}
                        icon={CheckCircle}
                        gradient="green"
                    />
                    <StatCard
                        title="System Controllers"
                        value={stats.admins}
                        icon={Shield}
                        gradient="indigo"
                    />
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                {/* Users List */}
                <div className="glass-card rounded-3xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-xl">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-white/[0.02]">
                        <h3 className="text-lg font-bold font-display flex items-center gap-2">
                            <Shield className="w-5 h-5 text-indigo-500" />
                            Administrator Directory
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-gray-100 dark:border-white/5">
                                    <th className="px-6 py-5">Administrator</th>
                                    <th className="px-6 py-5">Access Level</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5">Date Joined</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {loading ? (
                                    [...Array(3)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-6 py-8 text-center">
                                                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full max-w-sm mx-auto" />
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                                            <div className="flex flex-col items-center gap-2">
                                                <UsersIcon className="w-8 h-8 opacity-20" />
                                                No administrators found matching your search.
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-bold group-hover:scale-110 transition-transform duration-300">
                                                        {user.firstName[0]}{user.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">
                                                            {user.firstName} {user.lastName}
                                                        </p>
                                                        <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                                                            <Mail className="w-3 h-3" />
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl w-fit border border-indigo-100 dark:border-indigo-500/20">
                                                    {getRoleIcon(user.role)}
                                                    <span className="text-xs font-bold capitalize text-indigo-600 dark:text-indigo-400">
                                                        {user.role.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleStatus(user)}
                                                    className={`
                                                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wide border transition-all hover:scale-105 active:scale-95
                                                        ${user.isActive
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                                        }
                                                    `}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                                                        disabled={user.role === 'super_admin'}
                                                        title={user.role === 'super_admin' ? "Super Admins cannot be deleted" : "Delete Account"}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add User Modal */}
                <AnimatePresence>
                    {showAddModal && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowAddModal(false)}
                                className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
                            >
                                <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden pointer-events-auto">
                                    <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                                <UserPlus className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-bold text-xl font-display text-slate-900 dark:text-white">Add New Administrator</h3>
                                        </div>
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <form onSubmit={handleCreateUser} className="p-6 space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <AuthInput
                                                label="First Name"
                                                placeholder="e.g. John"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                required
                                            />
                                            <AuthInput
                                                label="Last Name"
                                                placeholder="e.g. Doe"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <AuthInput
                                            label="Email Address"
                                            type="email"
                                            placeholder="john@careermap.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                        <AuthInput
                                            label="Initial Password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 ml-1">
                                                System Role
                                            </label>
                                            <div className="relative group">
                                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
                                                <select
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-semibold appearance-none"
                                                >
                                                    <option value="moderator">Moderator (Limited Access)</option>
                                                    <option value="admin">Administrator (Full Access)</option>
                                                    <option value="super_admin">Super Admin (System Control)</option>
                                                </select>
                                                <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="pt-4 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowAddModal(false)}
                                                className="flex-1 px-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <AuthButton
                                                type="submit"
                                                loading={formLoading}
                                                variant="premium"
                                                className="flex-[2] py-3.5"
                                            >
                                                Create Account
                                            </AuthButton>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
}
