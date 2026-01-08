import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck, Eye, Trash2, Users, MessageSquare,
  Phone, Building, Mail, Clock, X, Info
} from 'lucide-react';
import { contactService, ContactStats } from '@/services/contactService';
import { ContactSubmission } from '@/types';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { usePagination } from '@/hooks/usePagination';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { StatCard } from '@/components/ui/StatCard';

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  const { page, totalPages, total, setPage, setTotalPages, setTotal } = usePagination({
    initialPage: 1,
    itemsPerPage: 10,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [submissionsRes, statsRes] = await Promise.all([
        contactService.getAllSubmissions(page, 10),
        contactService.getStats(),
      ]);

      setSubmissions(submissionsRes.data || []);
      setStats(statsRes.data);
      setTotalPages(submissionsRes.meta?.pagination?.totalPages || 1);
      setTotal(submissionsRes.meta?.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to fetch contact data:', err);
    } finally {
      setLoading(false);
    }
  }, [page, setTotal, setTotalPages]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await contactService.updateStatus(id, status);
      fetchData();
      if (selectedSubmission?.id === id) {
        const updated = await contactService.getSubmissionById(id);
        setSelectedSubmission(updated.data);
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;
    try {
      await contactService.deleteSubmission(id);
      fetchData();
      if (selectedSubmission?.id === id) setSelectedSubmission(null);
    } catch (err) {
      alert('Failed to delete submission');
    }
  };

  const columns = [
    {
      header: 'Inquiry Information',
      accessor: (sub: ContactSubmission) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
            {sub.fullName ? sub.fullName.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white mb-0.5 transition-colors">{sub.fullName}</div>
            <div className="text-xs text-slate-500 dark:text-slate-500">{sub.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Service',
      accessor: (sub: ContactSubmission) => (
        <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-white/5 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors">
          {sub.service || 'General Inquiry'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (sub: ContactSubmission) => (
        <StatusBadge
          status={sub.status}
          onClick={() => {
            const statuses = ['new', 'in-progress', 'completed', 'closed'];
            const next = statuses[(statuses.indexOf(sub.status) + 1) % statuses.length];
            handleStatusUpdate(sub.id, next);
          }}
        />
      ),
    },
    {
      header: 'Submitted',
      accessor: (sub: ContactSubmission) => (
        <div className="flex flex-col text-sm">
          <span className="text-slate-700 dark:text-slate-300 transition-colors">{new Date(sub.submittedAt).toLocaleDateString()}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-500">{new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (sub: ContactSubmission) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedSubmission(sub); }}
            className="p-2 hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors border border-transparent hover:border-indigo-500/20"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(sub.id); }}
            className="p-2 hover:bg-rose-500/10 text-rose-400 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white transition-colors">Inquiry Management</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium transition-colors">Track and manage all website inquiries and potential clients.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Total Inquiries"
            value={stats?.total || 0}
            icon={Users}
            gradient="blue"
          />
          <StatCard
            title="New Inquiries"
            value={stats?.byStatus.new || 0}
            icon={Clock}
            gradient="yellow"
          />
          <StatCard
            title="Active Files"
            value={stats?.byStatus.in_progress || 0}
            icon={MessageSquare}
            gradient="indigo"
          />
          <StatCard
            title="Conversion"
            value={stats?.byStatus.completed || 0}
            icon={UserCheck}
            gradient="green"
          />
        </div>

        {/* Leads Table */}
        <DataTable
          title="Inquiry Log"
          description="A detailed list of all contact form submissions."
          columns={columns as any}
          data={submissions}
          loading={loading}
          pagination={{
            page,
            totalPages,
            totalItems: total,
            onPageChange: setPage
          }}
          onRowClick={(sub) => setSelectedSubmission(sub)}
        />

        {/* Details Modal */}
        <AnimatePresence>
          {selectedSubmission && (
            <SubmissionModal
              submission={selectedSubmission}
              onClose={() => setSelectedSubmission(null)}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
            />
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}

function SubmissionModal({ submission, onClose, onStatusUpdate, onDelete }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden z-10"
      >
        {/* Modal Header */}
        <div className="bg-gray-50/50 dark:bg-white/[0.02] p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white transition-colors">Inquiry Investigation</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-slate-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Contact Person</label>
              <p className="text-lg font-bold text-slate-900 dark:text-white transition-colors">{submission.fullName}</p>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm transition-colors">
                <Mail className="w-4 h-4" /> {submission.email}
              </div>
            </div>
            <div className="space-y-1 text-right">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Inquiry Status</label>
              <div className="flex justify-end mt-1">
                <StatusBadge status={submission.status} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Requested Service</label>
            <div className="p-4 bg-gray-50/50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-4 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white transition-colors">{submission.service || 'General Inquiry'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">{submission.company || 'Private Individual'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Client Message</label>
            <div className="p-6 bg-gray-50/50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-white/5 text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic transition-colors">
              "{submission.message}"
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50/30 dark:bg-white/5 rounded-2xl transition-colors">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Phone</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><Phone className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> {submission.phone || 'N/A'}</span>
            </div>
            <div className="p-4 bg-gray-50/30 dark:bg-white/5 rounded-2xl text-right transition-colors">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Submitted On</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">{new Date(submission.submittedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
          <button
            onClick={() => onDelete(submission.id)}
            className="text-sm text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 font-bold px-4 py-2 transition-colors"
          >
            Purge Submission
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl text-sm font-bold transition-all border border-gray-200 dark:border-white/5"
            >
              Close
            </button>
            <button
              onClick={() => onStatusUpdate(submission.id, 'completed')}
              className="premium-button text-sm"
            >
              Mark as Resolved
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
