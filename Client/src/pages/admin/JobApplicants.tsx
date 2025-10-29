import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, Download, Eye, Trash2, Users, TrendingUp, 
  Calendar, MapPin, Mail, Phone, FileText, Loader2,
  AlertCircle
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

export default function JobApplicants() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<JobApplicationStats | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [applicationsData, statsData] = await Promise.all([
        getJobApplications(page, 10),
        getJobApplicationStats(),
      ]);

      setApplications(applicationsData.data || []);
      setStats(statsData.data);
      setTotalPages(applicationsData.meta?.pagination.totalPages || 1);
      setTotal(applicationsData.meta?.pagination.total || 0);
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK') {
        setError('Server is not running. Please start the server.');
      } else {
        setError('Failed to load job applications');
      }
      console.error(err);
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
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const response = await getJobApplicationById(id);
      setSelectedApplication(response.data);
    } catch (err) {
      console.error('Failed to load application details:', err);
    }
  };

  const handleDownloadResume = async (id: string) => {
    try {
      await downloadResume(id);
    } catch (err) {
      alert('Failed to download resume');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      await deleteJobApplication(id);
      fetchData();
      if (selectedApplication?.id === id) {
        setSelectedApplication(null);
      }
    } catch (err) {
      alert('Failed to delete application');
      console.error(err);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.values(stats.bySource).reduce((a, b) => a + b, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Remote Candidates</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.byWorkMode['Work from Home'] || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">New Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.recent.length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

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
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No job applications yet</p>
                        <p className="text-gray-400 text-sm mt-2">
                          Job applications will appear here when candidates submit their forms.
                        </p>
                      </div>
                    </td>
                  </tr>
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(application.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {application.resumePath && (
                        <button
                          onClick={() => handleDownloadResume(application.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Download Resume"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(application.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {page} of {totalPages} ({total} total)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
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

