import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Plus, Edit2, GripVertical,
    Loader2, CheckCircle,
    Trash2, EyeOff, Linkedin, Twitter, Mail, X
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SearchBar } from '@/components/ui/SearchBar';
import { teamService, TeamMember } from '@/services/teamService';
import { useNotification } from '@/context/NotificationContext';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatCard } from '@/components/ui/StatCard';

interface SortableRowProps {
    member: TeamMember;
    openEditModal: (member: TeamMember) => void;
    handleDelete: (id: string) => void;
}

function SortableRow({ member, openEditModal, handleDelete }: SortableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: member._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
        position: 'relative' as const,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group ${isDragging ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <div {...attributes} {...listeners} className="cursor-grab hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-400 transition-colors">
                        <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
                            }}
                        />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">{member.name}</p>
                        <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{member.role}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex gap-2">
                    {member.social.linkedin && <Linkedin className="w-4 h-4 text-blue-600" />}
                    {member.social.twitter && <Twitter className="w-4 h-4 text-sky-500" />}
                    {member.social.email && <Mail className="w-4 h-4 text-slate-500" />}
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${member.isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10'
                    }`}
                >
                    {member.isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => openEditModal(member)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-500 transition-colors"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(member._id)}
                        className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function TeamSettings() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [formData, setFormData] = useState<Partial<TeamMember>>({
        name: '',
        role: '',
        image: '',
        bio: '',
        social: { twitter: '', linkedin: '', email: '' },
        isActive: true
    });
    const [saving, setSaving] = useState(false);
    const { showNotification } = useNotification();

    const fetchMembers = useCallback(async () => {
        try {
            const response = await teamService.getAdminMembers();
            if (response.success) {
                setMembers(response.data);
            }
        } catch {
            showNotification('error', 'Failed to load team members');
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingMember) {
                await teamService.updateMember(editingMember._id, formData);
                showNotification('success', 'Team member updated successfully');
            } else {
                await teamService.createMember(formData);
                showNotification('success', 'Team member added successfully');
            }
            setIsModalOpen(false);
            fetchMembers();
            resetForm();
        } catch (err) {
            console.error('Failed to save member:', err);
            showNotification('error', 'Failed to save team member');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;
        try {
            await teamService.deleteMember(id);
            showNotification('success', 'Team member deleted');
            fetchMembers();
        } catch {
            showNotification('error', 'Failed to delete member');
        }
    };

    const resetForm = () => {
        setEditingMember(null);
        setFormData({
            name: '',
            role: '',
            image: '',
            bio: '',
            social: { twitter: '', linkedin: '', email: '' },
            isActive: true
        });
    };

    const openEditModal = (member: TeamMember) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            role: member.role,
            image: member.image,
            bio: member.bio,
            social: { ...member.social },
            isActive: member.isActive
        });
        setIsModalOpen(true);
    };

    const filteredMembers = members
        .filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const stats = useMemo(() => {
        return {
            total: members.length,
            active: members.filter(m => m.isActive).length,
            inactive: members.filter(m => !m.isActive).length,
        };
    }, [members]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setMembers((items) => {
                const oldIndex = items.findIndex((item) => item._id === active.id);
                const newIndex = items.findIndex((item) => item._id === over.id);

                const newOrder = arrayMove(items, oldIndex, newIndex);

                const updates = newOrder.map((member, index) => ({
                    id: member._id,
                    order: index
                }));

                teamService.reorderMembers(updates).catch(() => {
                    showNotification('error', 'Failed to save new order');
                    fetchMembers();
                });

                return newOrder;
            });
        }
    };

    return (
        <AdminLayout>
            <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 lg:space-y-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white transition-colors">Team Management</h1>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium transition-colors">Manage team members and social profiles.</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Member
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    <StatCard
                        title="Total Members"
                        value={stats.total}
                        icon={Users}
                        gradient="blue"
                    />
                    <StatCard
                        title="Active Members"
                        value={stats.active}
                        icon={CheckCircle}
                        gradient="green"
                    />
                    <StatCard
                        title="Inactive"
                        value={stats.inactive}
                        icon={EyeOff}
                        gradient="purple"
                    />
                </div>

                <div className="space-y-6">
                    {/* List Header & Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white transition-colors">Team Directory</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">Drag and drop to reorder members.</p>
                        </div>
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search by name or role..."
                            className="w-full md:w-[400px]"
                        />
                    </div>

                    {/* Members List */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
                        {loading ? (
                            <div className="p-12 flex justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            </div>
                        ) : filteredMembers.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                                <Users className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">No team members found.</p>
                                    <p className="text-slate-400 dark:text-slate-500 text-sm">Add a new member or load defaults.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={async () => {
                                            if (!confirm('This will replace all current team members with defaults. Continue?')) return;
                                            setLoading(true);
                                            try {
                                                await teamService.seedMembers();
                                                showNotification('success', 'Default team loaded');
                                                fetchMembers();
                                            } catch {
                                                showNotification('error', 'Failed to seed team');
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors"
                                    >
                                        Load Default Team
                                    </button>
                                    <button
                                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                                        className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium transition-colors"
                                    >
                                        Add Member
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-white/5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                <th className="px-6 py-4">Member Info</th>
                                                <th className="px-6 py-4">Social Profiles</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                            <SortableContext
                                                items={filteredMembers.map(m => m._id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                {filteredMembers.map((member) => (
                                                    <SortableRow
                                                        key={member._id}
                                                        member={member}
                                                        openEditModal={openEditModal}
                                                        handleDelete={handleDelete}
                                                    />
                                                ))}
                                            </SortableContext>
                                        </tbody>
                                    </table>
                                </DndContext>
                            </div>
                        )}
                    </div>
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
                                                {editingMember ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                            </div>
                                            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                                                {editingMember ? 'Edit Member' : 'Add New Member'}
                                            </h2>
                                        </div>
                                        <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-slate-500 transition-colors">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSave} className="p-6 space-y-5">
                                        <div className="space-y-4">
                                            {/* Basic Info */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Name</label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Role</label>
                                                    <input
                                                        type="text"
                                                        value={formData.role}
                                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Image URL</label>
                                                <input
                                                    type="url"
                                                    value={formData.image}
                                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                    required
                                                    placeholder="https://example.com/image.jpg"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Bio</label>
                                                <textarea
                                                    value={formData.bio}
                                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[80px]"
                                                    required
                                                />
                                            </div>

                                            {/* Social Links */}
                                            <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-white/5">
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Social Profiles</h3>

                                                <div className="relative">
                                                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                                                    <input
                                                        type="url"
                                                        value={formData.social?.linkedin || ''}
                                                        onChange={(e) => setFormData({ ...formData, social: { ...formData.social, linkedin: e.target.value } })}
                                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                                                        placeholder="LinkedIn Profile URL"
                                                    />
                                                </div>

                                                <div className="relative">
                                                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500" />
                                                    <input
                                                        type="url"
                                                        value={formData.social?.twitter || ''}
                                                        onChange={(e) => setFormData({ ...formData, social: { ...formData.social, twitter: e.target.value } })}
                                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                                                        placeholder="Twitter/X Profile URL"
                                                    />
                                                </div>

                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                    <input
                                                        type="email"
                                                        value={formData.social?.email || ''}
                                                        onChange={(e) => setFormData({ ...formData, social: { ...formData.social, email: e.target.value } })}
                                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                                                        placeholder="Email Address"
                                                    />
                                                    <p className="text-[10px] text-slate-400 mt-1 ml-1">Use 'mailto:email@example.com' format for links, or just the email for display</p>
                                                </div>
                                            </div>

                                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.isActive ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isActive}
                                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-white/20"
                                                />
                                                <span className={`text-sm font-bold ${formData.isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>Active Member</span>
                                            </label>
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
                                                Save Member
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
