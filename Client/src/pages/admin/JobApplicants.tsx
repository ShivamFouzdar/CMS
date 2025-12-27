import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, Download, Eye, Trash2, Users, TrendingUp, 
  MapPin, Mail, Phone, FileText
} from 'lucide-react';
import { 
  getJobApplications, 
  getJobApplicationById, 
  getJobApplicationStats,
  downloadResume,
  deleteJobApplication,
  type JobApplication,
  type JobApplicationStats 
} from '@/services/jobApplicationService';
import { fadeIn } from '@/lib/utils';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { usePagination } from '@/hooks/usePagination';
import { handleApiError } from '@/utils/errorHandler';
import { StatCard } from '@/components/ui/StatCard';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ActionButtons } from '@/components/ui/ActionButtons';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function JobApplicants() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [allApplications, setAllApplications] = useState<JobApplication[]>([]); // Store all applications for filtering
  const [stats, setStats] = useState<JobApplicationStats | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [workModeFilter, setWorkModeFilter] = useState<'Work from Home' | 'Office-Based' | 'Hybrid' | 'All'>('Work from Home');
  
  const { page, totalPages, total, setPage, setTotalPages, setTotal } = usePagination({
    initialPage: 1,
    itemsPerPage: 10,
  });

  const { execute: fetchDataExecute, loading, error } = useAsyncOperation({
    onSuccess: (data) => {
      if (data) {
        setAllApplications(data.applications || []);
        setStats(data.stats);
        setTotalPages(data.meta?.pagination.totalPages || 1);
        setTotal(data.meta?.pagination.total || 0);
        // Apply work mode filter
        applyWorkModeFilter(data.applications || [], workModeFilter);
      }
    },
  });

  const fetchData = () => fetchDataExecute(async () => {
    const [applicationsData, statsData] = await Promise.all([
      getJobApplications(page, 10),
      getJobApplicationStats(),
    ]);

    return {
      applications: applicationsData.data || [],
      stats: statsData.data,
      meta: applicationsData.meta,
    };
  }).catch((err) => {
    // Set empty data to prevent errors
    setApplications([]);
    setStats({
      total: 0,
      pending: 0,
      approved: 0,
      byExperience: {},
      byWorkMode: {},
      bySource: {},
      recent: [],
    });
    throw err;
  });

  const { execute: viewDetailsExecute } = useAsyncOperation({
    onSuccess: (data) => {
      if (data) {
        setSelectedApplication(data);
      }
    },
  });

  const { execute: downloadResumeFileExecute } = useAsyncOperation();

  const { execute: deleteApplicationExecute } = useAsyncOperation({
    onSuccess: () => {
      fetchData();
      if (selectedApplication?.id) {
        setSelectedApplication(null);
      }
    },
  });

  // Apply work mode filter - memoized
  const applyWorkModeFilter = useCallback((apps: JobApplication[], filter: typeof workModeFilter) => {
    if (filter === 'All') {
      setApplications(apps);
    } else {
      const filtered = apps.filter(app => app.workMode === filter);
      setApplications(filtered);
    }
  }, []);

  // Handle work mode filter change - memoized
  const handleWorkModeFilterClick = useCallback(() => {
    const modes: Array<'Work from Home' | 'Office-Based' | 'Hybrid' | 'All'> = ['Work from Home', 'Office-Based', 'Hybrid', 'All'];
    const currentIndex = modes.indexOf(workModeFilter);
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextFilter = modes[nextIndex];
    setWorkModeFilter(nextFilter);
    applyWorkModeFilter(allApplications, nextFilter);
  }, [workModeFilter, allApplications, applyWorkModeFilter]);

  // Fetch data on component mount and when page changes
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Apply filter when workModeFilter changes (for initial load)
  useEffect(() => {
    if (allApplications.length > 0) {
      applyWorkModeFilter(allApplications, workModeFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workModeFilter]);

  const handleViewDetails = useCallback(async (id: string) => {
    viewDetailsExecute(async () => {
      const response = await getJobApplicationById(id);
      return response.data;
    }).catch((err) => {
      const errorInfo = handleApiError(err);
      console.error('Failed to load application details:', errorInfo.message);
    });
  }, [viewDetailsExecute]);

  const handleDownloadResume = useCallback(async (id: string) => {
    downloadResumeFileExecute(async () => {
      await downloadResume(id);
    }).catch((err) => {
      const errorInfo = handleApiError(err);
      alert(errorInfo.message);
    });
  }, [downloadResumeFileExecute]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }

    deleteApplicationExecute(async () => {
      await deleteJobApplication(id);
    }).catch((err) => {
      const errorInfo = handleApiError(err);
      alert(errorInfo.message);
    });
  }, [deleteApplicationExecute]);

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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Briefcase className="h-8 w-8 mr-3 text-blue-600" />
            Job Applicants
          </h1>
          <p className="text-gray-600 mt-2">Manage and review job applications</p>
        </motion.div>

        {/* Statistics Cards */}
        {stats && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            animate="show"
          >
            <StatCard
              title="Total Applications"
              value={stats.total}
              icon={Users}
              gradient="blue"
            />
            <StatCard
              title="This Month"
              value={stats.thisMonth || 0}
              icon={TrendingUp}
              gradient="green"
            />
            <StatCard
              title={
                workModeFilter === 'All' 
                  ? 'All Work Modes' 
                  : workModeFilter === 'Work from Home'
                  ? 'Remote Candidates'
                  : workModeFilter === 'Office-Based'
                  ? 'Office-Based'
                  : 'Hybrid'
              }
              value={
                workModeFilter === 'All'
                  ? stats.total || 0
                  : stats.byWorkMode[workModeFilter] || 0
              }
              icon={Briefcase}
              gradient="purple"
              onClick={handleWorkModeFilterClick}
              subtitle="Click to filter"
            />
            <StatCard
              title="New Today"
              value={stats.newToday || 0}
              icon={FileText}
              gradient="yellow"
            />
          </motion.div>
        )}

        {/* Error Message */}
        <ErrorMessage message={error || ''} />

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Mode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.length === 0 && !loading && (
                  <EmptyState
                    icon={Briefcase}
                    title="No job applications yet"
                    description="Job applications will appear here when candidates submit their forms."
                    colSpan={6}
                  />
                )}
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {application.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.fullName}
                          </div>
                          <div className="text-sm text-gray-500">{application.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {application.experience}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.workMode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ActionButtons
                        actions={[
                          {
                            icon: Eye,
                            onClick: () => handleViewDetails(application.id),
                            label: 'View Details',
                            color: 'blue',
                          },
                          {
                            icon: Download,
                            onClick: () => handleDownloadResume(application.id),
                            label: 'Download Resume',
                            color: 'green',
                            show: !!application.resumePath,
                          },
                          {
                            icon: Trash2,
                            onClick: () => handleDelete(application.id),
                            label: 'Delete',
                            color: 'red',
                          },
                        ]}
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
            itemName="applications"
          />
        </div>

        {/* Application Details Modal */}
        {selectedApplication && (
          <ApplicationDetailsModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
            onDownloadResume={() => selectedApplication.resumePath && handleDownloadResume(selectedApplication.id)}
            onDelete={() => {
              handleDelete(selectedApplication.id);
              setSelectedApplication(null);
            }}
          />
        )}
        </div>
      </div>
    </AdminLayout>
  );
}

function ApplicationDetailsModal({
  application,
  onClose,
  onDownloadResume,
  onDelete,
}: {
  application: JobApplication;
  onClose: () => void;
  onDownloadResume: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>
          </div>

          <div className="bg-white px-6 py-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">{application.fullName}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">{application.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">{application.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">{application.location}</span>
                </div>
              </div>
            </div>

            {/* Experience & Preferences */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Experience & Preferences</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Experience</p>
                  <p className="text-sm text-gray-900">{application.experience}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Work Mode</p>
                  <p className="text-sm text-gray-900">{application.workMode}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Source</p>
                  <p className="text-sm text-gray-900">{application.hearAboutUs}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Applied Date</p>
                  <p className="text-sm text-gray-900">{new Date(application.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Skills Description */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Skills & Expertise</h4>
              <p className="text-sm text-gray-600">{application.skillsDescription}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              {application.resumePath && (
                <button
                  onClick={onDownloadResume}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </button>
              )}
              <button
                onClick={onDelete}
                className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
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

