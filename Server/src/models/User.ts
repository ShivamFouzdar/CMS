import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Model
 * Represents admin users and system administrators
 */

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'moderator' | 'viewer';
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  profile: {
    avatar?: string;
    phone?: string;
    department?: string;
    bio?: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    theme: 'light' | 'dark' | 'auto';
    language: string;
  };
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  incLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  updateLastLogin(): Promise<IUser>;
  activate(): Promise<IUser>;
  deactivate(): Promise<IUser>;
  verifyEmail(): Promise<IUser>;
  updateProfile(profileData: Partial<IUser['profile']>): Promise<IUser>;
  updatePreferences(preferencesData: Partial<IUser['preferences']>): Promise<IUser>;
  addPermission(permission: string): Promise<IUser>;
  removePermission(permission: string): Promise<IUser>;
  hasPermission(permission: string): boolean;
}

export interface IUserModel extends Model<IUser> {
  // Static methods
  findByEmail(email: string): Promise<IUser | null>;
  getActive(): Promise<IUser[]>;
  getByRole(role: string): Promise<IUser[]>;
  getStats(): Promise<any>;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters long'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters long'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'viewer'],
    default: 'viewer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLoginAt: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  profile: {
    avatar: {
      type: String,
      trim: true,
      maxlength: [500, 'Avatar URL cannot exceed 500 characters']
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^[\+]?[1-9][\d]{0,15}$/,
        'Please provide a valid phone number'
      ]
    },
    department: {
      type: String,
      trim: true,
      maxlength: [100, 'Department cannot exceed 100 characters']
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    }
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    language: {
      type: String,
      default: 'en',
      maxlength: [5, 'Language code cannot exceed 5 characters']
    }
  },
  permissions: [{
    type: String,
    trim: true,
    maxlength: [50, 'Permission cannot exceed 50 characters']
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
// Email index is already created by unique: true
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this['firstName']} ${this['lastName']}`;
});

// Virtual for account locked status
userSchema.virtual('isLocked').get(function() {
  return !!(this['lockUntil'] && this['lockUntil'] > new Date());
});

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  return `${this['firstName']} ${this['lastName']}`;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Pre-save middleware to update the updatedAt field
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance method to compare password
userSchema.methods['comparePassword'] = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this['password']);
};

// Instance method to increment login attempts
userSchema.methods['incLoginAttempts'] = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this['lockUntil'] && this['lockUntil'] < new Date()) {
    return this['updateOne']({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }

  const updates: any = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this['loginAttempts'] + 1 >= 5 && !this['isLocked']) {
    updates.$set = { lockUntil: new Date(Date.now() + 2 * 60 * 60 * 1000) };
  }

  return this['updateOne'](updates);
};

// Instance method to reset login attempts
userSchema.methods['resetLoginAttempts'] = function() {
  return this['updateOne']({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Instance method to update last login
userSchema.methods['updateLastLogin'] = function() {
  this['lastLoginAt'] = new Date();
  this['loginAttempts'] = 0;
  this['lockUntil'] = undefined;
  return this['save']();
};

// Instance method to activate user
userSchema.methods['activate'] = function() {
  this['isActive'] = true;
  this['updatedAt'] = new Date();
  return this['save']();
};

// Instance method to deactivate user
userSchema.methods['deactivate'] = function() {
  this['isActive'] = false;
  this['updatedAt'] = new Date();
  return this['save']();
};

// Instance method to verify email
userSchema.methods['verifyEmail'] = function() {
  this['isEmailVerified'] = true;
  this['updatedAt'] = new Date();
  return this['save']();
};

// Instance method to update profile
userSchema.methods['updateProfile'] = function(profileData: Partial<IUser['profile']>) {
  this['profile'] = { ...this['profile'], ...profileData };
  this['updatedAt'] = new Date();
  return this['save']();
};

// Instance method to update preferences
userSchema.methods['updatePreferences'] = function(preferencesData: Partial<IUser['preferences']>) {
  this['preferences'] = { ...this['preferences'], ...preferencesData };
  this['updatedAt'] = new Date();
  return this['save']();
};

// Instance method to add permission
userSchema.methods['addPermission'] = function(permission: string) {
  if (!this['permissions'].includes(permission)) {
    this['permissions'].push(permission);
    this['updatedAt'] = new Date();
    return this['save']();
  }
  return Promise.resolve(this);
};

// Instance method to remove permission
userSchema.methods['removePermission'] = function(permission: string) {
  this['permissions'] = this['permissions'].filter((p: string) => p !== permission);
  this['updatedAt'] = new Date();
  return this['save']();
};

// Instance method to check permission
userSchema.methods['hasPermission'] = function(permission: string): boolean {
  return this['permissions'].includes(permission) || this['role'] === 'admin';
};

// Static method to find by email
userSchema.statics['findByEmail'] = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to get active users
userSchema.statics['getActive'] = function() {
  return this.find({ isActive: true })
    .select('firstName lastName email role lastLoginAt createdAt')
    .sort({ createdAt: -1 });
};

// Static method to get users by role
userSchema.statics['getByRole'] = function(role: string) {
  return this.find({ role, isActive: true })
    .select('firstName lastName email lastLoginAt createdAt')
    .sort({ createdAt: -1 });
};

// Static method to get user statistics
userSchema.statics['getStats'] = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        verifiedUsers: {
          $sum: { $cond: [{ $eq: ['$isEmailVerified', true] }, 1, 0] }
        },
        roleDistribution: {
          $push: '$role'
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      totalUsers: 0,
      activeUsers: 0,
      verifiedUsers: 0,
      roleDistribution: {}
    };
  }

  const stat = stats[0];
  const roleDistribution = stat.roleDistribution.reduce((acc: Record<string, number>, role: string) => {
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  return {
    totalUsers: stat.totalUsers,
    activeUsers: stat.activeUsers,
    verifiedUsers: stat.verifiedUsers,
    roleDistribution
  };
};

export const User = model<IUser, IUserModel>('User', userSchema);
export default User;
