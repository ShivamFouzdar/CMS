
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { Service } from './dist/models/Service.js'; // Import compiled model
import logger from './dist/utils/logger.js';

// Load env
dotenv.config();

const services = [
    {
        name: 'BPO Services',
        slug: 'bpo',
        shortDescription: 'Comprehensive business process outsourcing solutions.',
        description: 'Comprehensive business process outsourcing solutions to streamline your operations and reduce costs and improve efficiency across all departments.',
        category: 'BPO Services',
        icon: 'Briefcase',
        isActive: true
    },
    {
        name: 'IT Services',
        slug: 'it',
        shortDescription: 'Modern web applications and digital solutions.',
        description: 'Full-stack development services for modern web applications and digital solutions using the latest technologies and best practices in the industry.',
        category: 'IT Services',
        icon: 'Code',
        isActive: true
    },
    {
        name: 'Recruitment',
        slug: 'recruitment',
        shortDescription: 'Talent acquisition and HR solutions.',
        description: 'Comprehensive talent acquisition and HR solutions to build high-performing teams and find the best fit for your organization culture and goals.',
        category: 'Recruitment',
        icon: 'UserPlus',
        isActive: true
    },
    {
        name: 'Legal Services',
        slug: 'legal',
        shortDescription: 'Expert legal support and documentation.',
        description: 'Professional legal support and documentation services for businesses of all sizes, ensuring compliance and peace of mind in all legal matters.',
        category: 'Legal Services',
        icon: 'Scale',
        isActive: true
    },
    {
        name: 'KPO Services',
        slug: 'kpo',
        shortDescription: 'Research, analysis, and intellectual property solutions.',
        description: 'Knowledge process outsourcing for research, analysis, and intellectual property solutions, providing deep insights and strategic value to your business.',
        category: 'KPO Services',
        icon: 'BarChart3',
        isActive: true
    },
    {
        name: 'Brand Promotion & Marketing',
        slug: 'brand-promotion',
        shortDescription: 'Build a strong professional identity.',
        description: 'Build a strong professional identity with comprehensive branding and marketing solutions designed to reach your target audience effectively.',
        category: 'Other',
        icon: 'Megaphone',
        isActive: true
    },
    {
        name: 'Customer Support',
        slug: 'support',
        shortDescription: '24/7 round-the-clock customer assistance.',
        description: 'Exceptional customer support that never sleeps, providing round-the-clock assistance across multiple channels to keep your customers happy.',
        category: 'Customer Support',
        icon: 'Headphones',
        isActive: true
    }
];

async function seed() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing from environment');
        }

        logger.info('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        logger.info('Connected!');

        // Clear existing? Maybe active check first?
        // Let's just upsert
        for (const service of services) {
            await Service.findOneAndUpdate(
                { slug: service.slug },
                service,
                { upsert: true, new: true }
            );
            logger.info(`Seeded: ${service.name}`);
        }
        logger.info('Seeding Complete!');
        process.exit(0);
    } catch (error) {
        logger.error(`Error seeding: ${error}`);
        process.exit(1);
    }
}

seed();
