
import { motion } from 'framer-motion';
import { Star, Quote, MoreHorizontal } from 'lucide-react';
import { Review } from '@/services/reviewsService';

interface ReviewCardProps {
    review: Review;
    onClick?: (review: Review) => void;
    className?: string;
    showCategory?: boolean;
}

const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? 'text-purple-500 fill-current' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
};

export function ReviewCard({ review, onClick, className = "", showCategory = true }: ReviewCardProps) {
    // Check if content is long enough to potentially need interaction
    const shouldTruncate = review.content.length > 150;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`bg-white p-6 rounded-2xl border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group ${className}`}
            onClick={() => onClick && onClick(review)}
        >
            {/* Quote Icon */}
            <div className="mb-4 relative">
                <div className="absolute -top-2 -left-2 bg-purple-50 rounded-full p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <Quote className="w-5 h-5 text-purple-600" />
                </div>
                <Quote className="w-8 h-8 text-purple-100 ml-1 mt-1 opacity-0" /> {/* Spacer/Placeholder style if needed, or just specific styling */}
            </div>

            {/* Content */}
            <div className="mb-6 flex-grow">
                <p className={`text-gray-600 leading-relaxed text-[15px] ${shouldTruncate ? 'line-clamp-4' : ''}`}>
                    "{review.content}"
                </p>

                {shouldTruncate && onClick && (
                    <button
                        className="mt-2 text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick(review);
                        }}
                    >
                        Read more <MoreHorizontal className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Rating & Date */}
            <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-50">
                <StarRating rating={review.rating} />
                <span className="text-xs font-medium text-gray-400">
                    {new Date(review.date || review.createdAt || new Date().toISOString()).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full ring-2 ring-purple-50 p-0.5">
                        <img
                            src={review.image || '/images/default-avatar.jpg'}
                            alt={review.name}
                            className="w-full h-full rounded-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=7c3aed&color=fff&bold=true`;
                            }}
                        />
                    </div>
                    {review.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white rounded-full w-4 h-4 flex items-center justify-center" title="Verified Client">
                            <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </div>

                <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{review.name}</h4>
                    <p className="text-xs text-purple-600 font-medium truncate mb-0.5">{review.role}</p>
                    {showCategory && review.category && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700">
                            {review.category}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
