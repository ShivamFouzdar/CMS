import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';
import { Star, Search, Eye, EyeOff, Trash2, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'pending'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/auth/login');
      return;
    }

    fetchReviews();
  }, [navigate]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${API_ENDPOINTS.reviews.all || 'http://localhost:8000/api/reviews/all'}?limit=100`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Admin Reviews API Response:', response.data);
      console.log('Response data structure:', {
        success: response.data.success,
        dataLength: response.data.data?.length,
        data: response.data.data
      });

      if (response.data.success && response.data.data) {
        const reviewsData = Array.isArray(response.data.data) ? response.data.data : [];
        console.log('Setting reviews:', reviewsData.length, 'reviews');
        setReviews(reviewsData);
      } else {
        console.error('Failed to fetch reviews or invalid response:', response.data);
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reviewId: string, updates: Partial<{ isPublished: boolean; isVerified: boolean; isFeatured: boolean }>) => {
    try {
      const token = localStorage.getItem('accessToken');
      const url = API_ENDPOINTS.reviews.updateStatus ? API_ENDPOINTS.reviews.updateStatus(reviewId) : `http://localhost:8000/api/reviews/${reviewId}/status`;
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
        setSelectedReview({ ...selectedReview, ...updates });
      }
    } catch (error) {
      console.error('Error updating review status:', error);
      alert('Failed to update review status');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(
        `http://localhost:8000/api/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setReviews(prev => prev.filter(r => r._id !== reviewId));
      if (selectedReview?._id === reviewId) {
        setShowDetails(false);
        setSelectedReview(null);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filterPublished === 'published') {
      matchesFilter = review.isPublished === true;
    } else if (filterPublished === 'pending') {
      matchesFilter = review.isPublished === false;
    }

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: reviews.length,
    published: reviews.filter(r => r.isPublished).length,
    pending: reviews.filter(r => !r.isPublished).length,
    verified: reviews.filter(r => r.isVerified).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
                <p className="text-sm text-gray-600">Manage customer testimonials and reviews</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="text-center py-12">
              <p className="text-gray-500">No reviews found</p>
            </div>
          )}
        </div>
      </main>

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
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    selectedReview.isPublished
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedReview.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedReview._id, { isVerified: !selectedReview.isVerified })}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    selectedReview.isVerified
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {selectedReview.isVerified ? 'Unverify' : 'Verify'}
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedReview._id, { isFeatured: !selectedReview.isFeatured })}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    selectedReview.isFeatured
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
  );
}

