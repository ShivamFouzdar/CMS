import { Schema, model, Document, Model } from 'mongoose';

/**
 * Settings Model
 * Stores system-wide configuration settings
 */

export interface ISettings extends Document {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  emailNotifications: boolean;
  maxFileSize: number; // in MB
  allowedFileTypes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISettingsModel extends Model<ISettings> {
  getSettings(): Promise<ISettings>;
  updateSettings(data: Partial<ISettings>): Promise<ISettings>;
}

const settingsSchema = new Schema<ISettings>(
  {
    siteName: {
      type: String,
      required: true,
      default: 'CareerMap Solutions',
      trim: true,
      maxlength: [100, 'Site name cannot exceed 100 characters'],
    },
    siteDescription: {
      type: String,
      default: 'Your trusted partner for business solutions',
      trim: true,
      maxlength: [500, 'Site description cannot exceed 500 characters'],
    },
    contactEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    contactPhone: {
      type: String,
      default: '',
      trim: true,
      maxlength: [50, 'Phone number cannot exceed 50 characters'],
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    allowRegistrations: {
      type: Boolean,
      default: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    maxFileSize: {
      type: Number,
      default: 10,
      min: [1, 'Max file size must be at least 1 MB'],
      max: [100, 'Max file size cannot exceed 100 MB'],
    },
    allowedFileTypes: {
      type: [String],
      default: ['pdf', 'doc', 'docx', 'jpg', 'png'],
      validate: {
        validator: (types: string[]) => {
          return types.length > 0 && types.every(type => /^[a-z0-9]+$/i.test(type));
        },
        message: 'File types must be valid extensions',
      },
    },
  },
  {
    timestamps: true,
    collection: 'settings',
  }
);

// Ensure only one settings document exists
settingsSchema.statics['getSettings'] = async function (): Promise<ISettings> {
  let settings = await this.findOne();
  
  if (!settings) {
    // Create default settings if none exist
    settings = await this.create({});
  }
  
  return settings;
};

settingsSchema.statics['updateSettings'] = async function (
  data: Partial<ISettings>
): Promise<ISettings> {
  let settings = await this.findOne();
  
  if (!settings) {
    // Create if doesn't exist
    settings = await this.create(data);
  } else {
    // Update existing
    Object.assign(settings, data);
    await settings.save();
  }
  
  return settings;
};

// Index to ensure only one settings document
settingsSchema.index({ _id: 1 }, { unique: true });

export const Settings = model<ISettings, ISettingsModel>('Settings', settingsSchema);

