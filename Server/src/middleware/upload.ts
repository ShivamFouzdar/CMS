import multer from 'multer';
import path from 'path';
import { configureCloudinary, cloudinaryFolderNames } from '@/config/cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Initialize Cloudinary with error handling
let cloudinary;
try {
  cloudinary = configureCloudinary();
} catch (error) {
  console.error('❌ Cloudinary configuration failed:', error instanceof Error ? error.message : error);
  console.error('⚠️  Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in your .env file');
  throw error;
}

const allowedMimes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Cloudinary storage for resumes (stored as raw files)
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: 'raw',
    public_id: (_req: any, file: Express.Multer.File) => {
      const base = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9-_]/g, '-');
      return `${cloudinaryFolderNames.resumes}/resume-${Date.now()}-${Math.round(Math.random() * 1e9)}-${base}`;
    },
    format: (_req: any, file: Express.Multer.File) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === '.pdf') return 'pdf';
      if (ext === '.doc') return 'doc';
      if (ext === '.docx') return 'docx';
      return 'pdf';
    },
  } as any,
});

export const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedMimes.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only PDF and Word documents are allowed'));
  },
});

// Cloudinary storage for generic media (images, docs)
const mediaStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'media', // Generic folder
    resource_type: 'auto',
    public_id: (_req: any, file: Express.Multer.File) => {
      const base = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9-_]/g, '-');
      return `media-${Date.now()}-${Math.round(Math.random() * 1e9)}-${base}`;
    },
  } as any,
});

export const uploadGeneric = multer({
  storage: mediaStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow images and docs
    const allowed = [
      ...allowedMimes,
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Invalid file type. Allowed: Images, PDF, Word docs.'));
  },
});

