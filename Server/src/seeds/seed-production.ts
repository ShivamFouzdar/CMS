import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedReviews } from './seedReviews.js';

dotenv.config();

const MONGODB_URI = process.env['MONGODB_URI'];

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not defined');
    process.exit(1);
}

const runSeed = async () => {
    try {
        console.log('🚀 Starting production seeding...');
        await mongoose.connect(MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        // Run the specific review seeder which uses upsert logic
        // This ensures new reviews are added without duplicate errors or data loss
        await seedReviews();

        console.log('✅ Production seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

runSeed();
