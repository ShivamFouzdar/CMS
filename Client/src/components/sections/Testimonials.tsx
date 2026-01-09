import { motion } from 'framer-motion';
import { Star, Quote, ArrowRight, Eye, MoreHorizontal } from 'lucide-react';
import { fadeIn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { reviewsService, Review } from '@/services/reviewsService';
import { useState, useEffect } from 'react';
import { ReviewModal } from '@/components/ui/ReviewModal';

// Remove the hardcoded testimonials array - now using service

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-purple-400 fill-current' : 'text-gray-600'}`}
        />
      ))}
    </div>
  );
};

export function Testimonials() {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFeaturedReviews = async () => {
      try {
        setLoading(true);
        console.log('Fetching featured reviews...');
        const response = await reviewsService.getFeaturedReviews(7);
        console.log('Featured reviews received:', response);
        setTestimonials(response.data || []);
      } catch (error) {
        console.error('Error fetching featured reviews:', error);
        // Fallback to empty array on error
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedReviews();
  }, []);

  const handleReadMore = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  if (loading) {
    return (
      <section id="testimonials" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50 relative overflow-hidden">


      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-purple-600 text-base sm:text-lg md:text-xl mt-1">Testimonials</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-3 sm:mb-4">
            What Our Clients Say
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 text-center max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about working with us.
          </p>
        </motion.div>

        {/* Scrollable Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide overscroll-x-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex gap-3 sm:gap-4 md:gap-6 pb-4" style={{ width: 'max-content' }}>
              {/* Regular Testimonial Cards */}
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white p-4 rounded-lg border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-md w-[280px] sm:w-60 h-auto min-h-[240px] sm:min-h-[240px] flex flex-col cursor-pointer group touch-manipulation flex-shrink-0"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeIn('up', 0)}
                  whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
                  onClick={() => handleReadMore(testimonial)}
                >
                  {/* Quote Icon */}
                  <div className="mb-3 relative">
                    <Quote className="w-5 h-5 text-purple-100 absolute -top-1 -left-1" />
                    <Quote className="w-4 h-4 text-purple-400 relative z-10" />
                  </div>

                  {/* Review Content */}
                  <p className="text-gray-500 text-sm mb-3 flex-grow leading-relaxed line-clamp-3 overflow-hidden break-words">
                    "{testimonial.content}"
                  </p>

                  {/* Read More Button */}
                  {testimonial.content.length > 100 && (
                    <div className="flex items-center justify-center mb-3">
                      <div className="flex items-center text-purple-600 text-sm font-medium group-hover:text-purple-700 transition-colors">
                        <MoreHorizontal className="w-4 h-4 mr-1" />
                        Read More
                      </div>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="mb-3">
                    <StarRating rating={testimonial.rating} />
                  </div>

                  {/* User Info */}
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 p-0.5 mr-3 flex-shrink-0">
                      <div className="bg-white w-full h-full rounded-full overflow-hidden">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=7e22ce&color=fff`;
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm truncate">{testimonial.name}</h4>
                      <p className="text-sm text-purple-600 truncate">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* View All Reviews Card */}
              <motion.div
                className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 rounded-lg border border-purple-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 w-[280px] sm:w-60 h-auto min-h-[240px] sm:min-h-[240px] flex flex-col cursor-pointer group touch-manipulation flex-shrink-0"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeIn('up', 0)}
                whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
                onClick={() => navigate('/reviews')}
              >
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-white text-base font-bold mb-2">
                    View All
                  </h3>

                  <p className="text-purple-100 text-sm mb-3 leading-relaxed line-clamp-2">
                    Discover more testimonials
                  </p>

                  <div className="flex items-center text-white text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                    Explore
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-200 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-200 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-200 rounded-full"></div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="mt-12 sm:mt-16 lg:mt-20 text-center relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-purple-500/10 rounded-xl sm:rounded-2xl -m-3 sm:-m-6 blur-2xl -z-10"></div>
          {/* <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-purple-900/30">
            <motion.h3 
              className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4"
              variants={fadeIn('up', 0.2)}
            >
              Ready to experience the difference?
            </motion.h3>
            <motion.p 
              className="text-gray-300 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base"
              variants={fadeIn('up', 0.3)}
            >
              Join hundreds of satisfied clients who have transformed their businesses with our solutions.
            </motion.p>
            <motion.div
              variants={fadeIn('up', 0.4)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Get Started Today
              </Button>
            </motion.div>
          </div> */}
        </motion.div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        review={selectedReview}
      />
    </section>
  );
}



