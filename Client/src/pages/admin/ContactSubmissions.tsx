import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, Eye, Trash2, Users, MessageSquare, 
  Phone, Building, TrendingUp, X, Mail, Clock, CheckCircle
} from 'lucide-react';
import { 
  getContactSubmissions, 
  getContactSubmissionById, 
  getContactStats,
  deleteContactSubmission,
  updateContactStatus,
  type ContactSubmission,
  type ContactStats 
} from '@/services/contactService';
import { fadeIn } from '@/lib/utils';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { usePagination } from '@/hooks/usePagination';
import { handleApiError } from '@/utils/errorHandler';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ActionButtons } from '@/components/ui/ActionButtons';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  
  const { page, totalPages, total, setPage, setTotalPages, setTotal } = usePagination({
    initialPage: 1,
    itemsPerPage: 10,
  });

  const { execute: fetchDataExecute, loading, error } = useAsyncOperation({
    onSuccess: (data) => {
      if (data) {
        setSubmissions(data.submissions || []);
        setStats(data.stats);
        setTotalPages(data.meta?.pagination.totalPages || 1);
        setTotal(data.meta?.pagination.total || 0);
      }
    },
  });

  const fetchData = () => fetchDataExecute(async () => {
    const [submissionsData, statsData] = await Promise.all([
      getContactSubmissions(page, 10),
      getContactStats(),
    ]);

    return {
      submissions: submissionsData.data || [],
      stats: statsData.data,
      meta: submissionsData.meta,
    };
  }).catch((err) => {
    setSubmissions([]);
    setStats({
      total: 0,
      byStatus: {},
      byService: {},
      recent: [],
    });
    throw err;
  });

  useEffect(() => {
    fetchData();
  }, [page]);

  const { execute: viewDetailsExecute } = useAsyncOperation({
    onSuccess: (data) => {
      if (data) {
        setSelectedSubmission(data);
      }
    },
  });

  const { execute: deleteSubmissionExecute } = useAsyncOperation({
    onSuccess: () => {
      fetchData();
      if (selectedSubmission?.id) {
        setSelectedSubmission(null);
      }
    },
  });

  const { execute: updateStatusExecute } = useAsyncOperation({
    onSuccess: () => {
      fetchData();
      // Update selected submission if it's the one being updated
      if (selectedSubmission) {
        getContactSubmissionById(selectedSubmission.id)
          .then((response) => {
            setSelectedSubmission(response.data);
          })
          .catch((err) => {
            console.error('Failed to refresh selected submission:', err);
          });
      }
    },
  });

  const handleViewDetails = useCallback(async (id: string) => {
    viewDetailsExecute(async () => {
      const response = await getContactSubmissionById(id);
      return response.data;
    }).catch((err) => {
      const errorInfo = handleApiError(err);
      console.error('Failed to load contact details:', errorInfo.message);
    });
  }, [viewDetailsExecute]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) {
      return;
    }

    deleteSubmissionExecute(async () => {
      await deleteContactSubmission(id);
    }).catch((err) => {
      const errorInfo = handleApiError(err);
      alert(errorInfo.message);
    });
  }, [deleteSubmissionExecute]);

  const handleStatusUpdate = useCallback(async (id: string, status: string) => {
    updateStatusExecute(async () => {
      await updateContactStatus(id, status);
      // Update the submission in the list immediately
      setSubmissions(prev => prev.map(sub => 
        sub.id === id ? { ...sub, status: status as any } : sub
      ));
      // Update selected submission if it's the one being updated
      if (selectedSubmission?.id === id) {
        const updated = await getContactSubmissionById(id);
        setSelectedSubmission(updated.data);
      }
    }).catch((err) => {
      const errorInfo = handleApiError(err);
      alert(errorInfo.message);
    });
  }, [updateStatusExecute, selectedSubmission]);

  // Handle status click to cycle through statuses - memoized
  const handleStatusClick = useCallback((id: string, currentStatus: string) => {
    const statuses: Array<'new' | 'in_progress' | 'completed' | 'closed'> = ['new', 'in_progress', 'completed', 'closed'];
    const currentIndex = statuses.indexOf(currentStatus as any);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];
    handleStatusUpdate(id, nextStatus);
  }, [handleStatusUpdate]);


  if (loading && !stats) {
    return (
      <AdminLayout>
        <LoadingSpinner size="lg" fullScreen />
      </AdminLayout>
    );
  }

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <UserCheck className="h-7 w-7 text-white" />
                </div>
                Leads Management
              </h1>
              <p className="text-gray-600 mt-2 ml-16">Manage and track all contact form leads</p>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        {stats && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            animate="show"
          >
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl shadow-lg border border-yellow-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">New Leads</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.byStatus.new || 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.byStatus.completed || 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.byStatus.in_progress || 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        <ErrorMessage message={error || ''} />

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Leads</h2>
            <p className="text-sm text-gray-600 mt-1">View and manage all contact form leads</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Lead Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Service Interest
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Submitted Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.length === 0 && !loading && (
                  <EmptyState
                    icon={UserCheck}
                    title="No leads yet"
                    description="Contact form leads will appear here when visitors submit inquiries through your website."
                    colSpan={5}
                    className="px-6 py-16"
                  />
                )}
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 border-b border-gray-100">
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-lg">
                            {submission.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900 mb-1">
                            {submission.name}
                          </div>
                          <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {submission.email}
                          </div>
                          {submission.phone && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {submission.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg border border-purple-200">
                        {submission.service || 'General Enquiry'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge
                        status={submission.status}
                        onClick={() => handleStatusClick(submission.id, submission.status)}
                      />
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                      {new Date(submission.submittedAt).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <ActionButtons
                        actions={[
                          {
                            icon: Eye,
                            onClick: () => handleViewDetails(submission.id),
                            label: 'View Details',
                            color: 'blue',
                          },
                          {
                            icon: Trash2,
                            onClick: () => handleDelete(submission.id),
                            label: 'Delete',
                            color: 'red',
                          },
                        ]}
                        className="gap-3"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
            itemName="leads"
            className="bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-gray-200"
          />
        </div>

        {/* Lead Details Modal */}
        {selectedSubmission && (
          <LeadDetailsModal
            submission={selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
            onStatusUpdate={handleStatusUpdate}
            onDelete={() => {
              handleDelete(selectedSubmission.id);
              setSelectedSubmission(null);
            }}
          />
        )}
        </div>
      </div>
    </AdminLayout>
  );
}

function LeadDetailsModal({
  submission,
  onClose,
  onStatusUpdate,
  onDelete,
}: {
  submission: ContactSubmission;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 border-b border-blue-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Lead Details</h3>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="bg-white px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Lead Information */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200">
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Lead Information</h4>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                    <p className="text-sm font-semibold text-gray-900">{submission.name}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                    <a href={`mailto:${submission.email}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                      {submission.email}
                    </a>
                  </div>
                </div>
                {submission.phone && (
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-4">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                      <a href={`tel:${submission.phone}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                        {submission.phone}
                      </a>
                    </div>
                  </div>
                )}
                {submission.company && (
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-4">
                      <Building className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Company</p>
                      <p className="text-sm font-semibold text-gray-900">{submission.company}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Service & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Service Interest</p>
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold text-sm border border-purple-200">
                  {submission.service || 'General Enquiry'}
                </span>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Lead Status</p>
                <select
                  value={submission.status}
                  onChange={(e) => onStatusUpdate(submission.id, e.target.value)}
                  className="w-full text-sm font-semibold border-2 border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Message</p>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{submission.message}</p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Submitted</p>
                <p className="text-sm font-semibold text-gray-900">{new Date(submission.submittedAt).toLocaleString('en-GB', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Last Updated</p>
                <p className="text-sm font-semibold text-gray-900">{new Date(submission.updatedAt).toLocaleString('en-GB', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t-2 border-gray-200">
              <button
                onClick={onDelete}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Delete Lead
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

