import { Schema, model, Document, Model } from 'mongoose';

/**
 * Review Model
 * Represents customer testimonials and reviews
 */

export interface IReview extends Document {
  name: string;
  email: string;
  role?: string;
  content: string;
  rating: number;
  image?: string;
  date: Date;
  category: string;
  service?: string;
  isVerified: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  helpfulVotes: number;
  totalVotes: number;
  response?: {
    content: string;
    respondedBy: string;
    respondedAt: Date;
  };
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    source: 'website' | 'email' | 'admin' | 'import';
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  publish(): Promise<IReview>;
  unpublish(): Promise<IReview>;
  verify(): Promise<IReview>;
  addHelpfulVote(): Promise<IReview>;
  addUnhelpfulVote(): Promise<IReview>;
  addResponse(content: string, respondedBy: string): Promise<IReview>;
}

export interface IReviewModel extends Model<IReview> {
  // Static methods
  getStats(): Promise<any>;
  getByCategory(category: string, limit?: number): Promise<IReview[]>;
  getFeatured(limit?: number): Promise<IReview[]>;
  getRecent(limit?: number): Promise<IReview[]>;
}

const reviewSchema = new Schema<IReview>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  role: {
    type: String,
    trim: true,
    maxlength: [200, 'Role cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    trim: true,
    minlength: [20, 'Review must be at least 20 characters long'],
    maxlength: [2000, 'Review cannot exceed 2000 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be a whole number'
    }
  },
  image: {
    type: String,
    trim: true,
    default: '/images/default-avatar.jpg'
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: [
      'BPO Services',
      'IT Services',
      'Recruitment', 
      'Legal Services',
      'KPO Services',
      'Customer Support',
      'General'
    ]
  },
  service: {
    type: String,
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0,
    min: [0, 'Helpful votes cannot be negative']
  },
  totalVotes: {
    type: Number,
    default: 0,
    min: [0, 'Total votes cannot be negative']
  },
  response: {
    content: {
      type: String,
      trim: true,
      maxlength: [1000, 'Response cannot exceed 1000 characters']
    },
    respondedBy: {
      type: String,
      trim: true
    },
    respondedAt: {
      type: Date
    }
  },
  metadata: {
    ipAddress: {
      type: String,
      trim: true
    },
    userAgent: {
      type: String,
      trim: true
    },
    source: {
      type: String,
      enum: ['website', 'email', 'admin', 'import'],
      default: 'website'
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
reviewSchema.index({ rating: 1 });
reviewSchema.index({ category: 1 });
reviewSchema.index({ isPublished: 1 });
reviewSchema.index({ isVerified: 1 });
reviewSchema.index({ isFeatured: 1 });
reviewSchema.index({ date: -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ email: 1 });

// Compound indexes
reviewSchema.index({ category: 1, isPublished: 1 });
reviewSchema.index({ rating: 1, isPublished: 1 });

// Virtual for helpful percentage
reviewSchema.virtual('helpfulPercentage').get(function() {
  if (this.totalVotes === 0) return 0;
  return Math.round((this.helpfulVotes / this.totalVotes) * 100);
});

// Virtual for display name
reviewSchema.virtual('displayName').get(function() {
  return this.name;
});

// Pre-save middleware to update the updatedAt field
reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get review statistics
reviewSchema.statics['getStats'] = async function() {
  const stats = await this.aggregate([
    {
      $match: { isPublished: true }
    },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        ratingDistribution: {
          $push: '$rating'
        },
        categoryDistribution: {
          $push: '$category'
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      categoryDistribution: {}
    };
  }

  const stat = stats[0];
  const ratingDistribution = stat.ratingDistribution.reduce((acc: Record<number, number>, rating: number) => {
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});

  const categoryDistribution = stat.categoryDistribution.reduce((acc: Record<string, number>, category: string) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return {
    totalReviews: stat.totalReviews,
    averageRating: Math.round(stat.averageRating * 10) / 10,
    ratingDistribution,
    categoryDistribution
  };
};

// Static method to get reviews by category
reviewSchema.statics['getByCategory'] = async function(category: string, limit = 10) {
  return this.find({ 
    category: new RegExp(category, 'i'), 
    isPublished: true 
  })
    .sort({ date: -1 })
    .limit(limit)
    .select('name role content rating image date category email isVerified isPublished isFeatured createdAt updatedAt');
};

// Static method to get featured reviews
reviewSchema.statics['getFeatured'] = async function(limit = 5) {
  return this.find({ 
    isPublished: true, 
    isFeatured: true 
  })
    .sort({ date: -1 })
    .limit(limit)
    .select('name role content rating image date category email isVerified isPublished isFeatured createdAt updatedAt');
};

// Static method to get recent reviews
reviewSchema.statics['getRecent'] = async function(limit = 10) {
  return this.find({ isPublished: true })
    .sort({ date: -1 })
    .limit(limit)
    .select('name role content rating image date category email isVerified isPublished isFeatured createdAt updatedAt');
};

// Instance method to publish review
reviewSchema.methods['publish'] = function() {
  this['isPublished'] = true;
  this['updatedAt'] = new Date();
  return this['save']();
};

// Instance method to unpublish review
reviewSchema.methods['unpublish'] = function() {
  this['isPublished'] = false;
  this['updatedAt'] = new Date();
  return this['save']();
};

// Instance method to verify review
reviewSchema.methods['verify'] = function() {
  this['isVerified'] = true;
  this['updatedAt'] = new Date();
  return this['save']();
};

// Instance method to add helpful vote
reviewSchema.methods['addHelpfulVote'] = function() {
  this['helpfulVotes'] += 1;
  this['totalVotes'] += 1;
  this['updatedAt'] = new Date();
  return this['save']();
};

// Instance method to add unhelpful vote
reviewSchema.methods['addUnhelpfulVote'] = function() {
  this['totalVotes'] += 1;
  this['updatedAt'] = new Date();
  return this['save']();
};

// Instance method to add response
reviewSchema.methods['addResponse'] = function(content: string, respondedBy: string) {
  this['response'] = {
    content,
    respondedBy,
    respondedAt: new Date()
  };
  this['updatedAt'] = new Date();
  return this['save']();
};

export const Review = model<IReview, IReviewModel>('Review', reviewSchema);
export default Review;
