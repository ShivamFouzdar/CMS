import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';
import { Star, Search, Eye, EyeOff, Trash2, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { handleApiError } from '@/utils/errorHandler';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Review {
  _id: string;
  name: string;
  email: string;
  role?: string;
  content: string;
  rating: number;
  category: string;
  isPublished: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  date: string;
  createdAt: string;
}

export default function Reviews() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce search input
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'pending'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const { execute: fetchReviewsExecute, loading } = useAsyncOperation({
    onSuccess: (data) => {
      if (data && Array.isArray(data)) {
        setReviews(data);
      }
    },
  });

  const fetchReviews = () => fetchReviewsExecute(async () => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(
      `${API_ENDPOINTS.reviews.all}?limit=100`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.success && response.data.data) {
      const reviewsData = Array.isArray(response.data.data) ? response.data.data : [];
      return reviewsData;
    }
    return [];
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const { execute: updateStatusExecute } = useAsyncOperation({
    onSuccess: () => {
      fetchReviews();
    },
  });

  const { execute: deleteReviewExecute } = useAsyncOperation({
    onSuccess: () => {
      fetchReviews();
      if (selectedReview?._id) {
        setSelectedReview(null);
      }
    },
  });

  const handleStatusUpdate = useCallback(async (reviewId: string, updates: Partial<{ isPublished: boolean; isVerified: boolean; isFeatured: boolean }>) => {
    updateStatusExecute(async () => {
      const token = localStorage.getItem('accessToken');
      const url = API_ENDPOINTS.reviews.updateStatus(reviewId);
      await axios.patch(
        url,
        updates,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update local state
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, ...updates } : r));
      if (selectedReview?._id === reviewId) {
        setSelectedReview(prev => prev ? { ...prev, ...updates } : null);
      }
    }).catch((error: unknown) => {
      const errorInfo = handleApiError(error);
      alert(errorInfo.message);
    });
  }, [updateStatusExecute, selectedReview]);

  const handleDelete = useCallback(async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    deleteReviewExecute(async () => {
      const token = localStorage.getItem('accessToken');
      await axios.delete(
        API_ENDPOINTS.reviews.delete(reviewId),
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setReviews(prev => prev.filter(r => r._id !== reviewId));
      if (selectedReview?._id === reviewId) {
        setShowDetails(false);
        setSelectedReview(null);
      }
    }).catch((error: unknown) => {
      const errorInfo = handleApiError(error);
      alert(errorInfo.message);
    });
  }, [deleteReviewExecute, selectedReview]);

  // Memoize filtered reviews to avoid recalculating on every render
  // Use debounced search term for better performance
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
      const matchesSearch = review.name.toLowerCase().includes(lowerSearchTerm) ||
        review.email.toLowerCase().includes(lowerSearchTerm) ||
        review.content.toLowerCase().includes(lowerSearchTerm);

      let matchesFilter = true;
      if (filterPublished === 'published') {
        matchesFilter = review.isPublished === true;
      } else if (filterPublished === 'pending') {
        matchesFilter = review.isPublished === false;
      }

      return matchesSearch && matchesFilter;
    });
  }, [reviews, debouncedSearchTerm, filterPublished]);

  // Memoize stats calculation
  const stats = useMemo(() => {
    return {
      total: reviews.length,
      published: reviews.filter(r => r.isPublished).length,
      pending: reviews.filter(r => !r.isPublished).length,
      verified: reviews.filter(r => r.isVerified).length,
    };
  }, [reviews]);

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner size="lg" fullScreen />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-gray-600 mt-2">Manage customer testimonials and reviews</p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.published}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <EyeOff className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">{stats.verified}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterPublished}
                  onChange={(e) => setFilterPublished(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Reviews</option>
                  <option value="published">Published</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{review.name}</div>
                        <div className="text-sm text-gray-500">{review.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {review.isPublished ? (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Published</span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                          )}
                          {review.isVerified && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Verified</span>
                          )}
                          {review.isFeatured && (
                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">Featured</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(review.date || review.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedReview(review);
                              setShowDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          {!review.isPublished && (
                            <button
                              onClick={() => handleStatusUpdate(review._id, { isPublished: true })}
                              className="text-green-600 hover:text-green-900"
                            >
                              Publish
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredReviews.length === 0 && (
              <tbody>
                <EmptyState
                  icon={MessageSquare}
                  title="No reviews found"
                  description="Try adjusting your search or filter criteria."
                  colSpan={6}
                />
              </tbody>
            )}
          </div>

          {/* Review Details Modal */}
          {showDetails && selectedReview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Review Details</h2>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700">Name</h3>
                      <p className="text-gray-900">{selectedReview.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Email</h3>
                      <p className="text-gray-900">{selectedReview.email}</p>
                    </div>
                    {selectedReview.role && (
                      <div>
                        <h3 className="font-semibold text-gray-700">Role</h3>
                        <p className="text-gray-900">{selectedReview.role}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-700">Rating</h3>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-6 h-6 ${star <= selectedReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Category</h3>
                      <p className="text-gray-900">{selectedReview.category}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Review Content</h3>
                      <p className="text-gray-900">{selectedReview.content}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Submitted</h3>
                      <p className="text-gray-900">
                        {new Date(selectedReview.date || selectedReview.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => handleStatusUpdate(selectedReview._id, { isPublished: !selectedReview.isPublished })}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium ${selectedReview.isPublished
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                    >
                      {selectedReview.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedReview._id, { isVerified: !selectedReview.isVerified })}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium ${selectedReview.isVerified
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      {selectedReview.isVerified ? 'Unverify' : 'Verify'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedReview._id, { isFeatured: !selectedReview.isFeatured })}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium ${selectedReview.isFeatured
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                    >
                      {selectedReview.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

