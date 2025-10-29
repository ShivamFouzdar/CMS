import { v2 as cloudinary } from 'cloudinary';

// Initialize Cloudinary using environment variables
// Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
export const configureCloudinary = () => {
  const cloudName = process.env['CLOUDINARY_CLOUD_NAME'] || '';
  const apiKey = process.env['CLOUDINARY_API_KEY'] || '';
  const apiSecret = process.env['CLOUDINARY_API_SECRET'] || '';

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
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

export const cloudinaryFolderNames = {
  resumes: 'careermap/resumes',
} as const;


