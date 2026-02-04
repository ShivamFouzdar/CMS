import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { TeamMember } from './dist/models/TeamMember.js';

// Load env
dotenv.config();

const teamMembers = [
    {
        name: 'Shivam Fouzdar',
        role: 'CEO & Founder',
        image: '/Shivam.jpeg',
        bio: 'Shivam has over 7+ years of experience in business strategy and leadership, helping companies scale and achieve their goals.',
        social: {
            twitter: '#',
            linkedin: '#',
            email: 'mailto:shivam@careermapsolutions.com'
        },
        order: 0,
        isActive: true
    },
    {
        name: 'Ankush Yadav',
        role: 'Finance Manager',
        image: '/ankush.png',
        bio: 'Ankush specializes in finance strategy, accounting and ensuring our solutions meet real business needs.',
        social: {
            twitter: '#',
            linkedin: '#',
            email: 'mailto:Ankush@careermapsolutions.com'
        },
        order: 1,
        isActive: true
    },
    {
        name: 'Shushant Singh',
        role: 'Head of Customer Success',
        image: '/sushant.png',
        bio: 'Shushant ensures our clients achieve their desired outcomes through exceptional service and support.',
        social: {
            twitter: '#',
            linkedin: '#',
            email: 'mailto:shushant@careermapsolutions.com'
        },
        order: 2,
        isActive: true
    },
    {
        name: 'Nandita Shukla',
        role: 'CFO ',
        image: '/nandita.png',
        bio: 'Chief Financial Officer responsible for financial strategy, governance, and driving sustainable growth for the organization..',
        social: {
            twitter: '#',
            linkedin: '#',
            email: 'mailto:Nandita@careermapsolutions.com'
        },
        order: 3,
        isActive: true
    }
];

async function seed() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing from environment');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        console.log('Clearing existing team members...');
        await TeamMember.deleteMany({});

        console.log('Seeding team members...');
        for (const member of teamMembers) {
            await TeamMember.create(member);
            console.log(`✅ Seeded: ${member.name}`);
        }

        console.log('🎉 Team Seeding Complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding:', error);
        process.exit(1);
    }
}

seed();
