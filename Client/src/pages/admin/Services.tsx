import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit2,
    CheckCircle,
    Briefcase,
    Loader2,
    Star,
    Layers,
    EyeOff,
    X
} from 'lucide-react';
import { servicesService } from '@/services/servicesService';
import { Service } from '@/types';
import { useNotification } from '@/context/NotificationContext';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatCard } from '@/components/ui/StatCard';

const ALLOWED_SERVICE_SLUGS = ['bpo', 'kpo', 'legal', 'recruitment', 'it', 'brand-promotion', 'support'];

export default function AdminServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState<Partial<Service>>({
        name: '',
        shortDescription: '',
        description: '',
        category: '',
        icon: 'Briefcase',
        slug: '',
        isActive: true,
        isFeatured: false
    });
    const [saving, setSaving] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await servicesService.getAllServices();
            if (response.success) {
                setServices(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch services:', error);
            showNotification('error', 'Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingService) {
                await servicesService.updateService(editingService.id, formData);
                showNotification('success', 'Service updated successfully');
            } else {
                await servicesService.createService(formData);
                showNotification('success', 'Service created successfully');
            }
            setIsModalOpen(false);
            fetchServices();
            resetForm();
        } catch (error: any) {
            console.error('Failed to save service:', error);
            const errorMessage = error.response?.data?.error?.message || 'Failed to save service';
            showNotification('error', errorMessage);
        } finally {
            setSaving(false);
        }
    };


    const handleToggleStatus = async (id: string) => {
        try {
            await servicesService.toggleStatus(id);
            showNotification('success', 'Service status updated');
            fetchServices(); // Refresh to get updated state
        } catch (error) {
            showNotification('error', 'Failed to update status');
        }
    };

    const resetForm = () => {
        setEditingService(null);
        setFormData({
            name: '',
            shortDescription: '',
            description: '',
            category: '',
            icon: 'Briefcase',
            slug: '',
            isActive: true,
            isFeatured: false
        });
    };

    const openEditModal = (service: Service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            shortDescription: service.shortDescription || '',
            description: service.description,
            category: service.category || '',
            icon: service.icon || 'Briefcase',
            slug: service.slug,
            isActive: service.isActive,
            isFeatured: service.isFeatured
        });
        setIsModalOpen(true);
    };

    const filteredServices = services
        .filter(service => ALLOWED_SERVICE_SLUGS.includes(service.slug))
        .filter(service =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const stats = useMemo(() => {
        const activeSlugs = services.filter(s => ALLOWED_SERVICE_SLUGS.includes(s.slug));
        return {
            total: activeSlugs.length,
            active: activeSlugs.filter(s => s.isActive).length,
            featured: activeSlugs.filter(s => s.isFeatured).length,
            inactive: activeSlugs.filter(s => !s.isActive).length,
        };
    }, [services]);

    return (
        <AdminLayout>
            <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 lg:space-y-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white transition-colors">Services Visibility</h1>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium transition-colors">Enable or disable core services displayed on the website.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    <StatCard
                        title="Total Services"
                        value={stats.total}
                        icon={Layers}
                        gradient="blue"
                    />
                    <StatCard
                        title="Active Services"
                        value={stats.active}
                        icon={CheckCircle}
                        gradient="green"
                    />
                    <StatCard
                        title="Featured"
                        value={stats.featured}
                        icon={Star}
                        gradient="purple"
                    />
                    <StatCard
                        title="Inactive"
                        value={stats.inactive}
                        icon={EyeOff}
                        gradient="purple"
                    />
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-gray-400 transition-all"
                        />
                    </div>
                </div>

                {/* Services List */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                        <h3 className="font-bold text-slate-900 dark:text-white">Service Catalog</h3>
                    </div>
                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        </div>
                    ) : filteredServices.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 dark:text-slate-400">
                            No services found matching your criteria.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-white/5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        <th className="px-6 py-4">Service Details</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Featured</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {filteredServices.map((service) => (
                                        <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                                                        <Briefcase className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">{service.name}</p>
                                                        <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{service.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleStatus(service.id)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border transition-all hover:scale-105 active:scale-95 ${service.isActive
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                        : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10'
                                                        }`}
                                                >
                                                    {service.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                {service.isFeatured ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold border border-amber-500/20">
                                                        <Star className="w-3 h-3 fill-current" /> Featured
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs font-medium">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEditModal(service)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all"
                                                        title="Settings"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                        Manage
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Add/Edit Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsModalOpen(false)}
                                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                            >
                                <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-white/10">
                                    <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                {editingService ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                            </div>
                                            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                                                {editingService ? 'Service Settings' : 'Service Info'}
                                            </h2>
                                        </div>
                                        <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-slate-500 transition-colors">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSave} className="p-6 space-y-5">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex justify-between">
                                                    <span>Service Details</span>
                                                    <span className="text-[10px] text-amber-500 italic">Static content locked to maintain design integrity</span>
                                                </label>
                                                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 space-y-3">
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Title</p>
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{formData.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Category</p>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{formData.category}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 pt-2">
                                                <label className={`flex-1 flex items-center justify-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.isActive ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.isActive}
                                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-white/20"
                                                    />
                                                    <span className={`text-sm font-bold ${formData.isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>Active Service</span>
                                                </label>

                                                <label className={`flex-1 flex items-center justify-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.isFeatured ? 'bg-amber-500/5 border-amber-500/30' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.isFeatured}
                                                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300 dark:border-white/20"
                                                    />
                                                    <span className={`text-sm font-bold ${formData.isFeatured ? 'text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'}`}>Featured</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="pt-2 flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className="px-5 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl font-bold transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                                            >
                                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                                Save Changes
                                            </button>
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
