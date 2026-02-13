import { v2 as cloudinary } from 'cloudinary';
import logger from '@/utils/logger.js';
import { env } from '@/config/env.js';

// Initialize Cloudinary using environment variables
// Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  logger.info('Cloudinary configured successfully');
  return cloudinary;
};

export type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  url: string;
  bytes: number;
  format: string;
  resource_type: string;
};

const baseFolder = env.CLOUDINARY_FOLDER_NAME;

export const cloudinaryFolderNames = {
  resumes: `${baseFolder}/resumes`,
} as const;


