import mongoose from 'mongoose';
import { env } from '@/config/env.js';
import logger from '@/utils/logger.js';
import { seedReviews } from './seedReviews.js';


const MONGODB_URI = env.MONGODB_URI;

const runSeed = async () => {
    try {
        logger.info('Starting production seeding...');
        await mongoose.connect(MONGODB_URI);
        logger.info('Connected to MongoDB');

        // Run the specific review seeder which uses upsert logic
        // This ensures new reviews are added without duplicate errors or data loss
        await seedReviews();

        logger.info('Production seeding completed successfully');
        process.exit(0);
    } catch (error) {
        logger.error(`Seeding failed: ${error}`);
        process.exit(1);
    }
};

runSeed();
