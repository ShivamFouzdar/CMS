import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Quote } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { reviewsService, Review } from '@/services/reviewsService';
import { useState, useEffect } from 'react';
import { ReviewForm } from '@/components/forms/ReviewForm';
import { ReviewCard } from '@/components/ui/ReviewCard';

import { ReviewModal } from '@/components/ui/ReviewModal';

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await reviewsService.getReviews();
        setReviews(response.data || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFormSuccess = () => {
    // Refresh reviews after submission
    const fetchData = async () => {
      try {
        const response = await reviewsService.getReviews();
        setReviews(response.data || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-purple-600 hover:text-purple-700 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Client Reviews</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12">
        {/* Reviews Count and Submit Button */}
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">All Client Reviews</h2>
              <p className="text-gray-600">Showing {reviews.length} reviews from our satisfied clients</p>
            </div>
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2 inline" />
              Write a Review
            </Button>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-gray-400 mb-4">
              <Quote className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No reviews available</h3>
            <p className="text-gray-500">Check back later for client testimonials</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id || review._id}
                review={review}
                className="h-full"
                onClick={() => {
                  setSelectedReview(review);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-8 py-4 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Load More Reviews
          </Button>
        </motion.div>
      </div>

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowReviewForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <ReviewForm
                onSuccess={handleFormSuccess}
                onClose={() => setShowReviewForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReview(null);
        }}
        review={selectedReview}
      />
    </div>
  );
}