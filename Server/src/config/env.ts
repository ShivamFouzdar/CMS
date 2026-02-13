
import dotenv from 'dotenv';
import { z } from 'zod';


dotenv.config();

const envSchema = z.object({
    // Server
    PORT: z.string().transform(Number).default('5000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    CLIENT_URL: z.string().default('http://localhost:3000'), // Keep as string, let cors config handle splitting if needed

    // Database
    MONGODB_URI: z.string().url(),

    // Authenication & Security
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.string().default('7d'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

    // Admin Seed
    ADMIN_INITIAL_EMAIL: z.string().email(),
    ADMIN_INITIAL_PASSWORD: z.string().min(1),

    // Rate Limiting / Security Defaults
    MAX_LOGIN_ATTEMPTS: z.string().transform(Number).default('5'),
    LOCKOUT_DURATION_HOURS: z.string().transform(Number).default('1'),

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    CLOUDINARY_FOLDER_NAME: z.string().default('careermap'),

    // Email (SMTP)
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.string().transform(Number).default('587'),
    SMTP_USER: z.string().min(1),
    SMTP_PASS: z.string().min(1),
    SMTP_FROM: z.string().email(),
    BCRYPT_SALT_ROUNDS: z.string().transform(Number).default('12'),
    CONTACT_EMAIL: z.string().email().optional(),
});

// Validate
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    console.error('❌ Invalid environment variables:', JSON.stringify(errorMap, null, 2));
    // Use console.error directly because logger might not be ready or might depend on env vars
    process.exit(1);
}

export const env = parsed.data;
