import { Schema, model, Document, Model } from 'mongoose';

/**
 * Service Model
 * Represents business services offered by the company
 * 
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *         - description
 *         - shortDescription
 *         - icon
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           minlength: 2
 *           maxlength: 100
 *         slug:
 *           type: string
 *           description: URL-friendly identifier
 *         description:
 *           type: string
 *           minlength: 50
 *           maxlength: 2000
 *         shortDescription:
 *           type: string
 *           minlength: 20
 *           maxlength: 200
 *         icon:
 *           type: string
 *           description: Lucide icon name
 *         image:
 *           type: string
 *         features:
 *           type: array
 *           items: { type: string }
 *         benefits:
 *           type: array
 *           items: { type: string }
 *         category:
 *           type: string
 *           enum: [BPO Services, IT Services, Recruitment, Legal Services, KPO Services, Customer Support, Other]
 *         isActive:
 *           type: boolean
 *           default: true
 *         isFeatured:
 *           type: boolean
 *           default: false
 *         order:
 *           type: integer
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export interface IServiceProcess {
  step: number;
  title: string;
  description: string;
}

export interface IServicePricing {
  basic: number;
  premium: number;
  enterprise: number;
  currency: string;
}

export interface IService extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  image?: string;
  features: string[];
  benefits: string[];
  process: IServiceProcess[];
  pricing?: IServicePricing;
  isActive: boolean;
  isFeatured: boolean;
  category: string;
  tags: string[];
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  order: number;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  activate(): Promise<IService>;
  deactivate(): Promise<IService>;
  feature(): Promise<IService>;
  unfeature(): Promise<IService>;
  updateOrder(order: number): Promise<IService>;
}

export interface IServiceModel extends Model<IService> {
  // Static methods
  getActive(): Promise<IService[]>;
  getFeatured(limit?: number): Promise<IService[]>;
  getByCategory(category: string): Promise<IService[]>;
  getBySlug(slug: string): Promise<IService | null>;
  getCategories(): Promise<string[]>;
  getStats(): Promise<any>;
}

const serviceProcessSchema = new Schema<IServiceProcess>({
  step: {
    type: Number,
    required: [true, 'Step number is required'],
    min: [1, 'Step number must be at least 1']
  },
  title: {
    type: String,
    required: [true, 'Process title is required'],
    trim: true,
    maxlength: [100, 'Process title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Process description is required'],
    trim: true,
    maxlength: [500, 'Process description cannot exceed 500 characters']
  }
}, { _id: false });

const servicePricingSchema = new Schema<IServicePricing>({
  basic: {
    type: Number,
    required: [true, 'Basic pricing is required'],
    min: [0, 'Basic pricing cannot be negative']
  },
  premium: {
    type: Number,
    required: [true, 'Premium pricing is required'],
    min: [0, 'Premium pricing cannot be negative']
  },
  enterprise: {
    type: Number,
    required: [true, 'Enterprise pricing is required'],
    min: [0, 'Enterprise pricing cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR'],
    maxlength: [3, 'Currency code cannot exceed 3 characters']
  }
}, { _id: false });

const serviceSchema = new Schema<IService>({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    unique: true,
    minlength: [2, 'Service name must be at least 2 characters long'],
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Service slug is required'],
    trim: true,
    unique: true,
    lowercase: true,
    match: [
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ],
    minlength: [2, 'Slug must be at least 2 characters long'],
    maxlength: [50, 'Slug cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    minlength: [50, 'Description must be at least 50 characters long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    minlength: [20, 'Short description must be at least 20 characters long'],
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  icon: {
    type: String,
    required: [true, 'Service icon is required'],
    trim: true,
    maxlength: [50, 'Icon name cannot exceed 50 characters']
  },
  image: {
    type: String,
    trim: true,
    maxlength: [500, 'Image URL cannot exceed 500 characters']
  },
  features: [{
    type: String,
    required: [true, 'Feature is required'],
    trim: true,
    maxlength: [100, 'Feature cannot exceed 100 characters']
  }],
  benefits: [{
    type: String,
    required: [true, 'Benefit is required'],
    trim: true,
    maxlength: [100, 'Benefit cannot exceed 100 characters']
  }],
  process: [serviceProcessSchema],
  pricing: servicePricingSchema,
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    trim: true,
    enum: [
      'BPO Services',
      'IT Services',
      'Recruitment',
      'Legal Services',
      'KPO Services',
      'Customer Support',
      'Other'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  seo: {
    title: {
      type: String,
      trim: true,
      maxlength: [60, 'SEO title cannot exceed 60 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [160, 'SEO description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      trim: true,
      maxlength: [50, 'Keyword cannot exceed 50 characters']
    }]
  },
  order: {
    type: Number,
    default: 0,
    min: [0, 'Order cannot be negative']
  },
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
// Slug index is already created by unique: true
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ isFeatured: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ order: 1 });
serviceSchema.index({ createdAt: -1 });

// Compound indexes
serviceSchema.index({ isActive: 1, isFeatured: 1 });
serviceSchema.index({ category: 1, isActive: 1 });

// Virtual for URL-friendly slug
serviceSchema.virtual('url').get(function () {
  return `/services/${this.slug}`;
});

// Virtual for display name
serviceSchema.virtual('displayName').get(function () {
  return this.name;
});

// Pre-save middleware to update the updatedAt field
serviceSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware to generate slug from name if not provided
serviceSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Static method to get active services
serviceSchema.statics['getActive'] = async function () {
  return this.find({ isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .select('name slug shortDescription icon category isFeatured');
};

// Static method to get featured services
serviceSchema.statics['getFeatured'] = async function (limit = 3) {
  return this.find({
    isActive: true,
    isFeatured: true
  })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit)
    .select('name slug shortDescription icon category');
};

// Static method to get services by category
serviceSchema.statics['getByCategory'] = async function (category: string) {
  return this.find({
    category: new RegExp(category, 'i'),
    isActive: true
  })
    .sort({ order: 1, createdAt: -1 })
    .select('name slug shortDescription icon');
};

// Static method to get service by slug
serviceSchema.statics['getBySlug'] = async function (slug: string) {
  return this.findOne({
    slug: slug.toLowerCase(),
    isActive: true
  });
};

// Static method to get service categories
serviceSchema.statics['getCategories'] = async function () {
  const categories = await this.distinct('category', { isActive: true });
  return categories.sort();
};

// Static method to get service statistics
serviceSchema.statics['getStats'] = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalServices: { $sum: 1 },
        activeServices: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        featuredServices: {
          $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] }
        },
        categoryDistribution: {
          $push: '$category'
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      totalServices: 0,
      activeServices: 0,
      featuredServices: 0,
      categoryDistribution: {}
    };
  }

  const stat = stats[0];
  const categoryDistribution = stat.categoryDistribution.reduce((acc: Record<string, number>, category: string) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return {
    totalServices: stat.totalServices,
    activeServices: stat.activeServices,
    featuredServices: stat.featuredServices,
    categoryDistribution
  };
};

// Instance method to activate service
serviceSchema.methods['activate'] = function () {
  this['isActive'] = true;
  this['updatedAt'] = new Date();
  return this['save']();
};

// Instance method to deactivate service
serviceSchema.methods['deactivate'] = function () {
  this['isActive'] = false;
  this['updatedAt'] = new Date();
  return this['save']();
};

// Instance method to feature service
serviceSchema.methods['feature'] = function () {
  this['isFeatured'] = true;
  this['updatedAt'] = new Date();
  return this['save']();
};

// Instance method to unfeature service
serviceSchema.methods['unfeature'] = function () {
  this['isFeatured'] = false;
  this['updatedAt'] = new Date();
  return this['save']();
};

// Instance method to update order
serviceSchema.methods['updateOrder'] = function (order: number) {
  this['order'] = order;
  this['updatedAt'] = new Date();
  return this['save']();
};

export const Service = model<IService, IServiceModel>('Service', serviceSchema);
export default Service;
