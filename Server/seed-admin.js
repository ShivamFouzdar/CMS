
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './dist/models/User.js'; // Import compiled model
import logger from './dist/utils/logger.js';

// Load env
dotenv.config();

const adminUser = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@careermapsolution.com',
    password: 'admin123', // Will be hashed by pre-save hook
    role: 'super_admin',
    isActive: true,
    isEmailVerified: true,
    loginAttempts: 0
};

async function seedAdmin() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing from environment');
        }

        logger.info('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        logger.info('Connected!');

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: adminUser.email });

        if (existingAdmin) {
            logger.info('Admin user already exists. Updating role...');
            existingAdmin.role = 'super_admin';
            existingAdmin.isActive = true;
            existingAdmin.password = adminUser.password; // Triggers hash on save
            await existingAdmin.save();
            logger.info('Admin user updated.');
        } else {
            logger.info('Creating new Admin user...');
            const newUser = new User(adminUser);
            await newUser.save();
            logger.info('Admin user created.');
        }

        logger.info('Admin Seed Complete!');
        logger.info('Email: admin@careermapsolution.com');
        logger.info('Password: admin123');

        process.exit(0);
    } catch (error) {
        logger.error(`Error seeding admin: ${error}`);
        process.exit(1);
    }
}

seedAdmin();
