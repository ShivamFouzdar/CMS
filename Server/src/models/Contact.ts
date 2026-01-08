import { Schema, model, Document, Model } from 'mongoose';

/**
 * Contact Model
 * Represents contact form submissions and inquiries
 * 
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - message
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         company:
 *           type: string
 *         service:
 *           type: string
 *           enum: [BPO Services, IT Services, Recruitment, Legal Services, KPO Services, Customer Support, General Enquiry]
 *         message:
 *           type: string
 *         status:
 *           type: string
 *           enum: [new, in_progress, completed, closed]
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *         submittedAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  status: 'new' | 'in_progress' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  assignedTo?: string;
  submittedAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
  source: 'website' | 'phone' | 'email' | 'referral' | 'other';
  tags: string[];

  // Instance methods
  markAsContacted(): Promise<IContact>;
  updateStatus(status: string, notes?: string): Promise<IContact>;
}

export interface IContactModel extends Model<IContact> {
  // Static methods
  getStats(): Promise<any>;
  getByService(service: string, limit?: number): Promise<IContact[]>;
}

const contactSchema = new Schema<IContact>({
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
  phone: {
    type: String,
    trim: true,
    match: [
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please provide a valid phone number'
    ]
  },
  company: {
    type: String,
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  service: {
    type: String,
    trim: true,
    enum: [
      'BPO Services',
      'IT Services',
      'Recruitment',
      'Legal Services',
      'KPO Services',
      'Brand Promotion & Marketing',
      'Customer Support',
      'General Enquiry'
    ],
    default: 'General Enquiry'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'completed', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  assignedTo: {
    type: String,
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastContactedAt: {
    type: Date
  },
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'referral', 'other'],
    default: 'website'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ service: 1 });
contactSchema.index({ submittedAt: -1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ assignedTo: 1 });

// Virtual for full name (if needed for display)
contactSchema.virtual('fullName').get(function () {
  return this.name;
});

// Pre-save middleware to update the updatedAt field
contactSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get contact statistics
contactSchema.statics['getStats'] = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const total = await this.countDocuments();
  const statusCounts = stats.reduce((acc, stat) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    byStatus: statusCounts,
    new: statusCounts.new || 0,
    inProgress: statusCounts.in_progress || 0,
    completed: statusCounts.completed || 0,
    closed: statusCounts.closed || 0
  };
};

// Static method to get contacts by service
contactSchema.statics['getByService'] = async function (service: string, limit = 10) {
  return this.find({ service })
    .sort({ submittedAt: -1 })
    .limit(limit)
    .select('name email service message status submittedAt');
};

// Instance method to mark as contacted
contactSchema.methods['markAsContacted'] = function () {
  this['lastContactedAt'] = new Date();
  return this['save']();
};

// Instance method to update status
contactSchema.methods['updateStatus'] = function (status: string, notes?: string) {
  this['status'] = status;
  if (notes) {
    this['notes'] = notes;
  }
  this['updatedAt'] = new Date();
  return this['save']();
};

export const Contact = model<IContact, IContactModel>('Contact', contactSchema);
export default Contact;
