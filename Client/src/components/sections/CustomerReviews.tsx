import { motion } from 'framer-motion';
import { ReviewCard } from '@/components/ui/ReviewCard';
import { useEffect, useState } from 'react';
import { Review, reviewsService } from '@/services/reviewsService';

import { ReviewModal } from '@/components/ui/ReviewModal';

interface CustomerReviewsProps {
    category: string;
    title?: string;
    subtitle?: string;
}

export function CustomerReviews({
    category,
    title = "What Our Clients Say",
    subtitle = "Real feedback from businesses that have transformed their digital presence"
}: CustomerReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await reviewsService.getReviewsByCategory(category);
                // Handle both possible response structures (array or object with data property)
                const data = Array.isArray(response) ? response : (response as any).data || [];
                setReviews(data);
            } catch (error) {
                console.error(`Error fetching reviews for category ${category}:`, error);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [category]);

    // If loading or no reviews, don't render the section (or render a placeholder if preferred)
    if (!loading && reviews.length === 0) {
        return null;
    }

    // Fallback to static data if no API data is available (optional, for demo purposes)
    // For now, we will just render what we have.

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            {title}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            {subtitle}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((testimonial) => (
                            <ReviewCard
                                key={testimonial.id || testimonial._id}
                                review={testimonial}
                                className="h-full"
                                onClick={() => {
                                    setSelectedReview(testimonial);
                                    setIsModalOpen(true);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <ReviewModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedReview(null);
                }}
                review={selectedReview}
            />
        </section>
    );
}
