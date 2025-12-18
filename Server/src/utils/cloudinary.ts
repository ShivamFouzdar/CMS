import { v2 as cloudinary } from 'cloudinary';

// Initialize Cloudinary using environment variables
// Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
export const configureCloudinary = () => {
  const cloudName = process.env['CLOUDINARY_CLOUD_NAME'];
  const apiKey = process.env['CLOUDINARY_API_KEY'];
  const apiSecret = process.env['CLOUDINARY_API_SECRET'];

  // Validate that all required environment variables are present
  const missingVars: string[] = [];
  if (!cloudName || cloudName.trim() === '') missingVars.push('CLOUDINARY_CLOUD_NAME');
  if (!apiKey || apiKey.trim() === '') missingVars.push('CLOUDINARY_API_KEY');
  if (!apiSecret || apiSecret.trim() === '') missingVars.push('CLOUDINARY_API_SECRET');

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Cloudinary environment variables: ${missingVars.join(', ')}. ` +
      `Please add them to your .env file. See env.example for reference.`
    );
  }

  // At this point, TypeScript knows these values are defined (non-null) due to validation above
  cloudinary.config({
    cloud_name: cloudName as string,
    api_key: apiKey as string,
    api_secret: apiSecret as string,
    secure: true,
  });
  
  console.log('✅ Cloudinary configured successfully');
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


