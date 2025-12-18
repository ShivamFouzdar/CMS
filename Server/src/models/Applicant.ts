import { Schema, model, Document, Model } from 'mongoose';

/**
 * Applicant Model
 * Represents job applicants (regular users who submit job applications)
 * These users DO NOT login - they only submit applications
 */

export interface IApplicant extends Document {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  workMode: string;
  skillsDescription: string;
  hearAboutUs: string;
  resumePath?: string;
  // Cloudinary metadata
  resumeUrl?: string;
  resumePublicId?: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  notes?: string;
  reviewedBy?: string; // Admin user ID who reviewed
  reviewedAt?: Date;
  submittedAt: Date;
  updatedAt: Date;
}

export interface IApplicantModel extends Model<IApplicant> {
  // Static methods
  getByStatus(status: string): Promise<IApplicant[]>;
  getByExperience(experience: string): Promise<IApplicant[]>;
  getStats(): Promise<any>;
}

const applicantSchema = new Schema<IApplicant>({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long'],
    maxlength: [100, 'Full name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address',
    ],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters'],
  },
  experience: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: ['Fresher', '0–1 year', '1–3 years', '3–5 years', '5+ years'],
  },
  workMode: {
    type: String,
    required: [true, 'Work mode preference is required'],
    enum: ['Work from Home', 'Office-Based', 'Hybrid'],
  },
  skillsDescription: {
    type: String,
    required: [true, 'Skills description is required'],
    trim: true,
    minlength: [20, 'Skills description must be at least 20 characters long'],
    maxlength: [1000, 'Skills description cannot exceed 1000 characters'],
  },
  hearAboutUs: {
    type: String,
    required: [true, 'Please specify how you heard about us'],
    enum: ['LinkedIn', 'Instagram', 'Job Portal', 'Referral', 'Other'],
  },
  resumePath: {
    type: String,
    trim: true,
  },
  resumeUrl: {
    type: String,
    trim: true,
  },
  resumePublicId: {
    type: String,
    trim: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'],
    default: 'new',
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
  reviewedBy: {
    type: String,
    trim: true,
  },
  reviewedAt: {
    type: Date,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better query performance
applicantSchema.index({ email: 1 });
applicantSchema.index({ status: 1 });
applicantSchema.index({ experience: 1 });
applicantSchema.index({ workMode: 1 });
applicantSchema.index({ submittedAt: -1 });

// Pre-save middleware to update the updatedAt field
applicantSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get applicants by status
applicantSchema.statics['getByStatus'] = async function(status: string) {
  return this.find({ status })
    .sort({ submittedAt: -1 })
    .select('fullName email location experience workMode status submittedAt');
};

// Static method to get applicants by experience
applicantSchema.statics['getByExperience'] = async function(experience: string) {
  return this.find({ experience })
    .sort({ submittedAt: -1 })
    .select('fullName email location status submittedAt');
};

// Static method to get applicant statistics
applicantSchema.statics['getStats'] = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        byStatus: {
          $push: '$status',
        },
        byExperience: {
          $push: '$experience',
        },
        byWorkMode: {
          $push: '$workMode',
        },
        bySource: {
          $push: '$hearAboutUs',
        },
      },
    },
  ]);

  if (stats.length === 0) {
    return {
      total: 0,
      byStatus: {},
      byExperience: {},
      byWorkMode: {},
      bySource: {},
    };
  }

  const stat = stats[0];
  
  // Count by status
  const byStatus = stat.byStatus.reduce((acc: Record<string, number>, status: string) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  // Count by experience
  const byExperience = stat.byExperience.reduce((acc: Record<string, number>, exp: string) => {
    acc[exp] = (acc[exp] || 0) + 1;
    return acc;
  }, {});
  
  // Count by work mode
  const byWorkMode = stat.byWorkMode.reduce((acc: Record<string, number>, mode: string) => {
    acc[mode] = (acc[mode] || 0) + 1;
    return acc;
  }, {});
  
  // Count by source
  const bySource = stat.bySource.reduce((acc: Record<string, number>, source: string) => {
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  return {
    total: stat.total,
    byStatus,
    byExperience,
    byWorkMode,
    bySource,
  };
};

export const Applicant = model<IApplicant, IApplicantModel>('Applicant', applicantSchema);
export default Applicant;

