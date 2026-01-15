import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Download, Eye, Trash2, Users,
  MapPin, Mail, Phone, FileText, X, Info,
  TrendingUp, Calendar
} from 'lucide-react';
import {
  jobApplicationService,
  JobApplication,
  JobApplicationStats
} from '@/services/jobApplicationService';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { usePagination } from '@/hooks/usePagination';
import { DataTable } from '@/components/common/DataTable';
import { StatCard } from '@/components/ui/StatCard';
import { SearchBar } from '@/components/ui/SearchBar';

export default function JobApplicants() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<JobApplicationStats | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { page, totalPages, total, setPage, setTotalPages, setTotal } = usePagination({
    initialPage: 1,
    itemsPerPage: 10,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, setPage]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [appsRes, statsRes] = await Promise.all([
        jobApplicationService.getAllApplications(page, 10, debouncedSearch),
        jobApplicationService.getStats(),
      ]);

      setApplications(appsRes.data || []);
      setStats(statsRes.data);
      setTotalPages(appsRes.meta?.pagination?.totalPages || 1);
      setTotal(appsRes.meta?.pagination?.total || 0);
    } catch {
      console.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, setTotal, setTotalPages]);

  useEffect(() => {
    fetchData();
  }, [page, fetchData]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await jobApplicationService.exportApplications();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applications-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export applications');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      await jobApplicationService.deleteApplication(id);
      fetchData();
      if (selectedApplication?.id === id) setSelectedApplication(null);
    } catch {
      alert('Failed to delete application');
    }
  };

  const handleDownload = async (id: string) => {
    try {
      await jobApplicationService.downloadResume(id);
    } catch {
      alert('Failed to download resume');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} applications?`)) return;
    try {
      await jobApplicationService.bulkDeleteApplications(selectedIds);
      setSelectedIds([]);
      fetchData();
    } catch (error) {
      console.error('Bulk delete failed:', error);
      alert('Failed to delete applications');
    }
  };

  const columns = [
    {
      header: 'Applicant',
      accessor: (app: JobApplication) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
            {app.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white mb-0.5 transition-colors">{app.fullName}</div>
            <div className="text-xs text-slate-500 dark:text-slate-500">{app.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Experience',
      accessor: (app: JobApplication) => (
        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
          {app.experience}
        </span>
      ),
    },
    {
      header: 'Work Mode',
      accessor: (app: JobApplication) => (
        <span className="text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1.5 transition-colors">
          <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          {app.workMode}
        </span>
      ),
    },
    {
      header: 'Submitted',
      accessor: (app: JobApplication) => (
        <div className="flex flex-col">
          <span className="text-slate-700 dark:text-slate-300 transition-colors">{new Date(app.submittedAt).toLocaleDateString()}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-500">{new Date(app.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (app: JobApplication) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedApplication(app); }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDownload(app.id); }}
            className="p-2 hover:bg-emerald-500/10 text-emerald-400 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(app.id); }}
            className="p-2 hover:bg-rose-500/10 text-rose-400 rounded-lg transition-colors"
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
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white transition-colors">Talent Pipeline</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium transition-colors">Review and manage professional applications and resumes.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors font-medium shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Total Talent"
            value={stats?.total || 0}
            icon={Users}
            gradient="blue"
          />
          <StatCard
            title="Monthly Growth"
            value={stats?.thisMonth || 0}
            icon={TrendingUp}
            gradient="green"
          />
          <StatCard
            title="Active Sourcing"
            value={stats?.pending || 0}
            icon={Briefcase}
            gradient="purple"
          />
          <StatCard
            title="Joined Today"
            value={stats?.newToday || 0}
            icon={FileText}
            gradient="yellow"
          />
        </div>

        {/* Applicants Table */}
        <DataTable
          title="Candidate Log"
          description="A comprehensive list of all professional inquiries."
          columns={columns}
          data={applications}
          loading={loading}
          pagination={{
            page,
            totalPages,
            totalItems: total,
            onPageChange: setPage
          }}
          onRowClick={(app) => setSelectedApplication(app)}
          selectable={true}
          onSelectionChange={setSelectedIds}
          searchBar={
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by name, email, or experience..."
              className="w-full md:w-[400px]"
            />
          }
        />

        {/* Details Modal */}
        <AnimatePresence>
          {selectedApplication && (
            <ApplicationModal
              application={selectedApplication}
              onClose={() => setSelectedApplication(null)}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}

interface ApplicationModalProps {
  application: JobApplication;
  onClose: () => void;
  onDownload: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function ApplicationModal({ application, onClose, onDownload, onDelete }: ApplicationModalProps) {
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
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white transition-colors">Candidate Insight</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-slate-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/30">
                {application.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{application.fullName}</h4>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm transition-colors">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {application.email}</span>
                  <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-slate-700 rounded-full" />
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {application.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50/50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-white/5 transition-colors">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Professional Level</p>
              <p className="text-slate-900 dark:text-white font-bold transition-colors">{application.experience}</p>
            </div>
            <div className="p-4 bg-gray-50/50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-white/5 transition-colors">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Work Mode</p>
              <p className="text-slate-900 dark:text-white font-bold transition-colors">{application.workMode}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Skills & Narrative</label>
            <div className="p-6 bg-gray-50/50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-white/5 text-slate-700 dark:text-slate-300 text-sm leading-relaxed transition-colors">
              {application.skillsDescription || "No additional description provided."}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50/30 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Applied On</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">{new Date(application.submittedAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-tight text-right">Location</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">{application.location || 'Remote/Global'}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
          <button
            onClick={() => onDelete(application.id)}
            className="text-sm text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 font-bold px-4 py-2 transition-colors"
          >
            Archive Candidate
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl text-sm font-bold transition-all border border-gray-200 dark:border-white/5"
            >
              Close
            </button>
            <button
              onClick={() => onDownload(application.id)}
              className="premium-button text-sm"
            >
              <Download className="w-4 h-4" /> Download Resume
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
