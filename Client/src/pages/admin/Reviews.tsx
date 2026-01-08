import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Star, Trash2, MessageSquare,
  CheckCircle, Eye, EyeOff, X, Award, ShieldCheck,
  Activity
} from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { reviewsService, Review } from '@/services/reviewsService';
import { DataTable } from '@/components/common/DataTable';
import { StatCard } from '@/components/ui/StatCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'pending'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await reviewsService.getAllReviews({
        limit: 100,
        search: debouncedSearchTerm,
        status: filterPublished !== 'all' ? filterPublished : undefined
      });
      setReviews(response.data || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, filterPublished]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleStatusUpdate = async (reviewId: string, updates: any) => {
    try {
      await reviewsService.updateStatus(reviewId, updates);
      fetchReviews();
      const id = selectedReview?.id || selectedReview?._id;
      if (id === reviewId) {
        const updated = await reviewsService.getReviewById(reviewId);
        setSelectedReview(updated.data);
      }
    } catch (error) {
      alert('Failed to update review status');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewsService.deleteReview(reviewId);
      fetchReviews();
      const id = selectedReview?.id || selectedReview?._id;
      if (id === reviewId) setSelectedReview(null);
    } catch (error) {
      alert('Failed to delete review');
    }
  };

  const columns = [
    {
      header: 'Reviewer',
      accessor: (rev: Review) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold border border-purple-500/20">
            {rev.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white mb-0.5 transition-colors">{rev.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-500">{rev.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Rating',
      accessor: (rev: Review) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-slate-700'}`}
            />
          ))}
          <span className="ml-2 text-xs font-bold text-slate-500 dark:text-slate-400">{rev.rating}.0</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (rev: Review) => (
        <span className="text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800/40 border border-gray-200 dark:border-white/5 transition-colors">
          {rev.category}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (rev: Review) => (
        <div className="flex flex-wrap gap-2">
          {rev.isPublished ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-tight">Published</span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-tight">Pending</span>
          )}
          {rev.isVerified && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-tight">Verified</span>
          )}
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: (rev: Review) => (
        <span className="text-slate-400 text-xs">
          {new Date(rev.date || rev.createdAt || '').toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (rev: Review) => {
        const id = rev.id || rev._id || '';
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedReview(rev); }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(id); }}
              className="p-2 hover:bg-rose-500/10 text-rose-400 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const stats = useMemo(() => ({
    total: reviews.length,
    published: reviews.filter(r => r.isPublished).length,
    pending: reviews.filter(r => !r.isPublished).length,
    verified: reviews.filter(r => r.isVerified).length,
  }), [reviews]);

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white transition-colors">Trust & Feedback</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium transition-colors">Moderating user reviews and client testimonials for the platform.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-800/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 sm:w-64 transition-all"
              />
            </div>
            <select
              value={filterPublished}
              onChange={(e) => setFilterPublished(e.target.value as any)}
              className="bg-white dark:bg-slate-800/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Total Reviews"
            value={stats.total}
            icon={MessageSquare}
            gradient="blue"
          />
          <StatCard
            title="Published"
            value={stats.published}
            icon={Activity}
            gradient="green"
          />
          <StatCard
            title="Pending Approval"
            value={stats.pending}
            icon={EyeOff}
            gradient="yellow"
          />
          <StatCard
            title="Verified Users"
            value={stats.verified}
            icon={Award}
            gradient="purple"
          />
        </div>

        {/* Reviews Table */}
        <DataTable
          title="Review Log"
          description="A moderation queue for all customer feedback."
          columns={columns as any}
          data={reviews}
          loading={loading}
          onRowClick={(rev) => setSelectedReview(rev)}
        />

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedReview && (
            <ReviewModal
              review={selectedReview}
              onClose={() => setSelectedReview(null)}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
            />
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}

function ReviewModal({ review, onClose, onStatusUpdate, onDelete }: any) {
  const id = review.id || review._id;

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
        <div className="bg-gray-50/50 dark:bg-white/[0.02] p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white transition-colors">Review Moderation</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-slate-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-purple-500/30">
                {review.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{review.name}</h4>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm transition-colors">
                  <span>{review.email}</span>
                  <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-slate-700 rounded-full" />
                  <span>{review.role || 'Verified Customer'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50/50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-white/5 transition-colors">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Customer Rating</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-slate-700'}`}
                  />
                ))}
              </div>
            </div>
            <div className="p-4 bg-gray-50/50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-white/5 transition-colors">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Category</p>
              <p className="text-slate-900 dark:text-white font-bold transition-colors">{review.category}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Review Transcript</label>
            <div className="p-6 bg-gray-50/50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-white/5 text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic break-words transition-colors">
              "{review.content}"
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${review.isPublished ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                {review.isPublished ? <CheckCircle className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Visibility Status</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">{review.isPublished ? 'Live on Site' : 'Hidden / Pending'}</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              Submitted: {new Date(review.date || review.createdAt || '').toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-3 overflow-x-auto">
          <button
            onClick={() => onDelete(id)}
            className="text-sm text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 font-bold px-4 py-2 transition-colors shrink-0"
          >
            Delete Review
          </button>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onStatusUpdate(id, { isVerified: !review.isVerified })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${review.isVerified ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/5 text-slate-500 dark:text-slate-400'}`}
            >
              {review.isVerified ? 'Unverify' : 'Verify Reviewer'}
            </button>
            <button
              onClick={() => onStatusUpdate(id, { isFeatured: !review.isFeatured })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${review.isFeatured ? 'bg-purple-500/20 border-purple-500/30 text-purple-600 dark:text-purple-400' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/5 text-slate-500 dark:text-slate-400'}`}
            >
              {review.isFeatured ? 'Unfeature' : 'Feature Review'}
            </button>
            <button
              onClick={() => onStatusUpdate(id, { isPublished: !review.isPublished })}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${review.isPublished ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20 hover:bg-amber-500/20' : 'premium-button'}`}
            >
              {review.isPublished ? 'Unpublish' : 'Publish to Site'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
