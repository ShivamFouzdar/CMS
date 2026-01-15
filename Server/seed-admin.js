
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './dist/models/User.js'; // Import compiled model

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

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: adminUser.email });

        if (existingAdmin) {
            console.log('Admin user already exists. Updating role...');
            existingAdmin.role = 'super_admin';
            existingAdmin.isActive = true;
            existingAdmin.password = adminUser.password; // Triggers hash on save
            await existingAdmin.save();
            console.log('✅ Admin user updated.');
        } else {
            console.log('Creating new Admin user...');
            const newUser = new User(adminUser);
            await newUser.save();
            console.log('✅ Admin user created.');
        }

        console.log('🎉 Admin Seed Complete!');
        console.log('Email: admin@careermapsolution.com');
        console.log('Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
