import { Schema, model, Document, Model } from 'mongoose';

/**
 * Settings Model
 * Stores system-wide configuration settings
 * 
 * @swagger
 * components:
 *   schemas:
 *     Settings:
 *       type: object
 *       properties:
 *         siteName: { type: string }
 *         siteDescription: { type: string }
 *         contactEmail: { type: string }
 *         contactPhone: { type: string }
 *         maintenanceMode: { type: boolean }
 *         allowRegistrations: { type: boolean }
 *         emailNotifications: { type: boolean }
 *         smtp:
 *           type: object
 *           properties:
 *             host: { type: string }
 *             port: { type: integer }
 *             user: { type: string }
 *             secure: { type: boolean }
 *             fromEmail: { type: string }
 *         socialMedia:
 *           type: object
 *           properties:
 *             facebook: { type: string }
 *             twitter: { type: string }
 *             linkedin: { type: string }
 *             instagram: { type: string }
 *             youtube: { type: string }
 */

export interface ISettings extends Document {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  emailNotifications: boolean;
  notificationAlerts: {
    jobApplications: boolean;
    inquiries: boolean;
    reviews: boolean;
    systemAlerts: boolean;
  };
  maxFileSize: number; // in MB
  allowedFileTypes: string[];
  smtp: {
    host: string;
    port: number;
    user: string;
    password?: string;
    secure: boolean;
    fromEmail: string;
  };
  socialMedia: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
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
      default: process.env['SITE_NAME'] || 'CareerMap Solutions',
      trim: true,
      maxlength: [100, 'Site name cannot exceed 100 characters'],
    },
    siteDescription: {
      type: String,
      default: process.env['SITE_DESCRIPTION'] || 'Your trusted partner for business solutions',
      trim: true,
      maxlength: [500, 'Site description cannot exceed 500 characters'],
    },
    contactEmail: {
      type: String,
      default: process.env['CONTACT_EMAIL'] || 'info@careermapsolutions.com',
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    contactPhone: {
      type: String,
      default: process.env['CONTACT_PHONE'] || '+91 90129 50370',
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
    notificationAlerts: {
      jobApplications: { type: Boolean, default: true },
      inquiries: { type: Boolean, default: true },
      reviews: { type: Boolean, default: true },
      systemAlerts: { type: Boolean, default: true },
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
    smtp: {
      host: { type: String, trim: true, default: process.env['SMTP_HOST'] || '' },
      port: { type: Number, default: 587 },
      user: { type: String, trim: true, default: process.env['SMTP_USER'] || '' },
      password: { type: String, select: false, default: process.env['SMTP_PASS'] || '' },
      secure: { type: Boolean, default: process.env['SMTP_SECURE'] === 'true' },
      fromEmail: { type: String, trim: true, default: process.env['SMTP_FROM'] || '' }
    },
    socialMedia: {
      facebook: { type: String, trim: true, default: process.env['SOCIAL_FACEBOOK'] || 'https://www.facebook.com/people/CareerMap-Solutions/61581367203854/' },
      twitter: { type: String, trim: true, default: process.env['SOCIAL_TWITTER'] || 'https://x.com/CareerMap_Com' },
      linkedin: { type: String, trim: true, default: process.env['SOCIAL_LINKEDIN'] || 'https://www.linkedin.com/company/careermapsolutions/' },
      instagram: { type: String, trim: true, default: process.env['SOCIAL_INSTAGRAM'] || 'https://www.instagram.com/careermapsolutions_official/?hl=en' },
      youtube: { type: String, trim: true, default: process.env['SOCIAL_YOUTUBE'] || '' }
    }
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
  } else {
    // Backfill empty fields from env vars if available - ensuring current env vars are reflected in DB
    let changed = false;

    // Check Site Identity
    if (settings.siteName === 'CareerMap Solutions' && process.env['SITE_NAME']) { settings.siteName = process.env['SITE_NAME']; changed = true; }
    if (settings.siteDescription === 'Your trusted partner for business solutions' && process.env['SITE_DESCRIPTION']) { settings.siteDescription = process.env['SITE_DESCRIPTION']; changed = true; }

    // Check SMTP
    if (!settings.smtp) settings.smtp = {} as any;
    if (!settings.smtp.host && process.env['SMTP_HOST']) { settings.smtp.host = process.env['SMTP_HOST']; changed = true; }
    if (!settings.smtp.port && process.env['SMTP_PORT']) {
      const port = parseInt(process.env['SMTP_PORT']);
      if (!isNaN(port)) {
        settings.smtp.port = port;
        changed = true;
      }
    }
    if (!settings.smtp.user && process.env['SMTP_USER']) { settings.smtp.user = process.env['SMTP_USER']; changed = true; }
    // We don't check/set password here because select:false hides it, so we can't easily know if it's empty without selecting.
    // However, if other SMTP settings are missing, it's likely password is too. 
    // But safely we can skip password backfill to avoid overwriting unless we are sure.
    // The user asked to "fill the field". If users see the form empty, they can enter password.

    if (!settings.smtp.fromEmail && process.env['SMTP_FROM']) { settings.smtp.fromEmail = process.env['SMTP_FROM']; changed = true; }

    // Check Social
    if (!settings.socialMedia) settings.socialMedia = {} as any;

    // Facebook
    if ((!settings.socialMedia.facebook || settings.socialMedia.facebook === 'https://facebook.com' || settings.socialMedia.facebook === 'https://www.facebook.com/people/CareerMap-Solutions/61581367203854/') && process.env['SOCIAL_FACEBOOK']) {
      settings.socialMedia.facebook = process.env['SOCIAL_FACEBOOK'];
      changed = true;
    }
    if ((!settings.socialMedia.facebook || settings.socialMedia.facebook === 'https://facebook.com') && !process.env['SOCIAL_FACEBOOK']) {
      settings.socialMedia.facebook = 'https://www.facebook.com/people/CareerMap-Solutions/61581367203854/';
      changed = true;
    }

    // Twitter
    if ((!settings.socialMedia.twitter || settings.socialMedia.twitter === 'https://twitter.com' || settings.socialMedia.twitter === 'https://x.com/CareerMap_Com') && process.env['SOCIAL_TWITTER']) {
      settings.socialMedia.twitter = process.env['SOCIAL_TWITTER'];
      changed = true;
    }
    if ((!settings.socialMedia.twitter || settings.socialMedia.twitter === 'https://twitter.com') && !process.env['SOCIAL_TWITTER']) {
      settings.socialMedia.twitter = 'https://x.com/CareerMap_Com';
      changed = true;
    }

    // LinkedIn
    if ((!settings.socialMedia.linkedin || settings.socialMedia.linkedin === 'https://linkedin.com' || settings.socialMedia.linkedin === 'https://www.linkedin.com/company/careermapsolutions/') && process.env['SOCIAL_LINKEDIN']) {
      settings.socialMedia.linkedin = process.env['SOCIAL_LINKEDIN'];
      changed = true;
    }
    if ((!settings.socialMedia.linkedin || settings.socialMedia.linkedin === 'https://linkedin.com') && !process.env['SOCIAL_LINKEDIN']) {
      settings.socialMedia.linkedin = 'https://www.linkedin.com/company/careermapsolutions/';
      changed = true;
    }

    // Instagram
    if ((!settings.socialMedia.instagram || settings.socialMedia.instagram === 'https://instagram.com' || settings.socialMedia.instagram === 'https://www.instagram.com/careermapsolutions_official/?hl=en') && process.env['SOCIAL_INSTAGRAM']) {
      settings.socialMedia.instagram = process.env['SOCIAL_INSTAGRAM'];
      changed = true;
    }
    if ((!settings.socialMedia.instagram || settings.socialMedia.instagram === 'https://instagram.com') && !process.env['SOCIAL_INSTAGRAM']) {
      settings.socialMedia.instagram = 'https://www.instagram.com/careermapsolutions_official/?hl=en';
      changed = true;
    }

    // YouTube
    if ((!settings.socialMedia.youtube || settings.socialMedia.youtube === 'https://youtube.com') && process.env['SOCIAL_YOUTUBE']) {
      settings.socialMedia.youtube = process.env['SOCIAL_YOUTUBE'];
      changed = true;
    }
    if ((!settings.socialMedia.youtube || settings.socialMedia.youtube === 'https://youtube.com') && !process.env['SOCIAL_YOUTUBE']) {
      settings.socialMedia.youtube = '';
      changed = true;
    }

    // Check Contact
    if ((!settings.contactEmail || settings.contactEmail === 'info@careermapsolutions.com') && process.env['CONTACT_EMAIL']) { settings.contactEmail = process.env['CONTACT_EMAIL']; changed = true; }
    if (!settings.contactEmail && !process.env['CONTACT_EMAIL']) { settings.contactEmail = 'info@careermapsolutions.com'; changed = true; }

    if ((!settings.contactPhone || settings.contactPhone === '+91 90129 50370') && process.env['CONTACT_PHONE']) { settings.contactPhone = process.env['CONTACT_PHONE']; changed = true; }
    if (!settings.contactPhone && !process.env['CONTACT_PHONE']) { settings.contactPhone = '+91 90129 50370'; changed = true; }

    if (changed) {
      await settings.save();
    }
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

// Mongoose handles the _id unique index by default

export const Settings = model<ISettings, ISettingsModel>('Settings', settingsSchema);
export default Settings;
