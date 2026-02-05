

import dotenv from 'dotenv';
import { Review } from '../models/Review.js';

// Load env
dotenv.config();

const genuineReviews = [
    {
        name: "Karthik Reddy",
        role: "CTO, CloudCore Technologies",
        content: "We partnered with CareerMap Solutions for IT and technical support services. Their team demonstrated strong technical expertise and quick turnaround time. Whether it was system support or technical consulting, CMS handled everything professionally and efficiently.",
        rating: 5,
        category: "IT Services",
        date: new Date("2026-02-03"),
        isPublished: true,
        isVerified: true
    },
    {
        name: "Aman Joshi",
        role: "Marketing Manager / BrandSpark Digital",
        content: "CareerMap Solutions supported us with branding strategy and digital marketing initiatives. Their creative approach, combined with a strong understanding of business goals, delivered excellent results. We saw noticeable improvements in brand visibility and engagement. CMS delivers more than just designs—they deliver impact.",
        rating: 5,
        category: "Brand Promotion",
        date: new Date("2026-02-03"),
        isPublished: true,
        isVerified: true
    },
    {
        name: "Rahul Mehta",
        role: "Operations Head / Infinity Support Services",
        content: "CareerMap Solutions has been instrumental in helping us scale our BPO operations. From manpower deployment to process support, everything was handled professionally. Their ability to deliver quality resources on time helped us meet tight client deadlines. CMS is dependable and efficient.",
        rating: 5,
        category: "BPO Services",
        date: new Date("2026-02-03"),
        isPublished: true,
        isVerified: true
    },
    {
        name: "Neha Agarwal",
        role: "Founder & CEO / ScaleUp Ventures",
        content: "We engaged CareerMap Solutions for business consulting during our early growth phase. Their insights into process optimization, hiring strategy, and cost management were extremely valuable. CMS understands startups as well as established businesses, which makes their guidance practical and results-oriented.",
        rating: 5,
        category: "KPO Services",
        date: new Date("2026-02-03"),
        isPublished: true,
        isVerified: true
    },
    {
        name: "Riya Sharma",
        role: "Software Engineer",
        content: "I approached CareerMap Solutions while struggling to find the right job opportunity. Their career guidance, resume optimization, and interview preparation made a huge difference. Within a few weeks, I received multiple interview calls and finally landed a role that matched my skills. CMS genuinely cares about candidates and guides them at every step.",
        rating: 5,
        category: "Recruitment",
        date: new Date("2026-02-03"),
        isPublished: true,
        isVerified: true
    },
    {
        name: "Ankit Verma",
        role: "HR Manager / NexaTech Solutions Pvt. Ltd.",
        content: "CareerMap Solutions has been an extremely reliable recruitment partner for us. Their understanding of our technical requirements and cultural fit was spot on. We were able to close multiple IT and non-IT positions in record time with high-quality candidates. What truly sets CMS apart is their follow-up, transparency, and commitment to results. Highly recommended for companies looking for serious hiring support.",
        rating: 5,
        category: "Recruitment",
        date: new Date("2026-02-03"),
        isPublished: true,
        isVerified: true
    }
];

export const seedReviews = async () => {
    try {
        console.log('Syncing genuine reviews...');

        for (const review of genuineReviews) {
            // Generate a consistent pseudo-email
            const email = review.name.toLowerCase().replace(/[^a-z]/g, '.') + '@example.com';

            await Review.findOneAndUpdate(
                {
                    name: review.name,
                    // Match by first 40 chars of content to be safe against minor typos
                    content: { $regex: new RegExp(review.content.substring(0, 40), 'i') }
                },
                {
                    ...review,
                    email: email,
                    image: '/images/default-avatar.jpg',
                },
                { upsert: true, new: true }
            );
            console.log(`✅ Synced review from: ${review.name} [${review.category}]`);
        }

        console.log('🎉 Reviews Seeded Successfully');
    } catch (error) {
        console.error('❌ Error seeding reviews:', error);
    }
};
