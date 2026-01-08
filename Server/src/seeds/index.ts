
import { Service, Review, Settings } from '@/models';
import { seedAdminUser, seedTestUsers } from '@/seeds/seedAdmin';

/**
 * Seed database with initial data
 */
export const seedDatabase = async (): Promise<void> => {
    try {
        // Check if reviews already exist
        const existingReviews = await Review.countDocuments();
        if (existingReviews === 0) {
            const reviews = [
                {
                    name: 'Sarah Johnson',
                    email: 'sarah@techstart.com',
                    role: 'CEO, TechStart Inc.',
                    content: 'CareerMap Solutions transformed our customer support operations. Their BPO services helped us scale efficiently while maintaining excellent service quality. The team was professional, responsive, and delivered results beyond our expectations.',
                    rating: 5,
                    image: '/images/avatar-1.jpg',
                    category: 'BPO Services',
                    isVerified: true,
                    isPublished: true,
                    isFeatured: true
                },
                {
                    name: 'Michael Chen',
                    email: 'michael@globalretail.com',
                    role: 'Director of Operations, Global Retail',
                    content: 'The IT solutions provided by CareerMap have been game-changing for our e-commerce platform. Their team delivered beyond our expectations and helped us achieve a 40% increase in operational efficiency.',
                    rating: 5,
                    image: '/images/avatar-2.jpg',
                    category: 'IT Services',
                    isVerified: true,
                    isPublished: true,
                    isFeatured: true
                },
                // ... (truncated additional reviews for brevity, but in real scenario would copy all)
                // For the purpose of this refactor, I will include the full list to ensure no data loss
                {
                    name: 'Emily Rodriguez',
                    email: 'emily@healthplus.com',
                    role: 'HR Manager, HealthPlus',
                    content: 'Their recruitment team understood our needs perfectly. We found exceptional talent in record time. Highly recommended! The quality of candidates was outstanding.',
                    rating: 4,
                    image: '/images/avatar-3.jpg',
                    category: 'Recruitment',
                    isVerified: true,
                    isPublished: true,
                    isFeatured: false
                },
                {
                    name: 'David Kim',
                    email: 'david@legalease.com',
                    role: 'Founder, LegalEase',
                    content: 'The legal advisory services saved us countless hours and potential compliance issues. Professional and knowledgeable team that provided excellent guidance.',
                    rating: 5,
                    image: '/images/avatar-4.jpg',
                    category: 'Legal Services',
                    isVerified: true,
                    isPublished: true,
                    isFeatured: false
                },
                {
                    name: 'Lisa Thompson',
                    email: 'lisa@financecorp.com',
                    role: 'Operations Director, FinanceCorp',
                    content: 'Their KPO services provided us with valuable market insights that shaped our business strategy. Exceptional analytical capabilities and detailed reporting.',
                    rating: 4,
                    image: '/images/avatar-5.jpg',
                    category: 'KPO Services',
                    isVerified: true,
                    isPublished: true,
                    isFeatured: false
                },
                {
                    name: 'Robert Wilson',
                    email: 'robert@financeflow.com',
                    role: 'CTO, FinanceFlow',
                    content: 'Outstanding technical support and implementation. Their team helped us modernize our infrastructure with minimal downtime. Excellent project management.',
                    rating: 5,
                    image: '/images/avatar-6.jpg',
                    category: 'IT Services',
                    isVerified: true,
                    isPublished: true,
                    isFeatured: true
                },
                {
                    name: 'Maria Garcia',
                    email: 'maria@retailmax.com',
                    role: 'VP Marketing, RetailMax',
                    content: 'The market research insights provided by CareerMap were invaluable for our expansion strategy. Data-driven and actionable recommendations.',
                    rating: 5,
                    image: '/images/avatar-7.jpg',
                    category: 'KPO Services',
                    isVerified: true,
                    isPublished: true,
                    isFeatured: false
                },
                {
                    name: 'James Anderson',
                    email: 'james@datacorp.com',
                    role: 'CEO, DataCorp',
                    content: 'Exceptional data analytics services. They helped us uncover hidden patterns in our customer data that led to significant revenue growth.',
                    rating: 5,
                    image: '/images/avatar-8.jpg',
                    category: 'KPO Services',
                    isVerified: true,
                    isPublished: true,
                    isFeatured: false
                },
                {
                    name: 'Jennifer Lee',
                    email: 'jennifer@techflow.com',
                    role: 'Operations Manager, TechFlow',
                    content: 'Their process optimization services streamlined our workflows and reduced costs by 30%. Highly professional team with great attention to detail.',
                    rating: 4,
                    image: '/images/avatar-9.jpg',
                    category: 'BPO Services',
                    isVerified: true,
                    isPublished: true,
                    isFeatured: false
                },
                {
                    name: 'Mark Thompson',
                    email: 'mark@starthub.com',
                    role: 'Founder, StartupHub',
                    content: 'CareerMap provided comprehensive business consulting that helped us scale from startup to mid-size company. Their strategic guidance was invaluable.',
                    rating: 5,
                    image: '/images/avatar-10.jpg',
                    category: 'General',
                    isVerified: true,
                    isPublished: true,
                    isFeatured: true
                }
            ];

            // Add date field to each review
            const reviewsWithDates = reviews.map(review => ({
                ...review,
                date: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            }));

            await Review.insertMany(reviewsWithDates);
            console.log('✅ Reviews seeded successfully');
        }

        // Check if services already exist
        const existingServices = await Service.countDocuments();
        if (existingServices === 0) {

            const services = [
                {
                    name: 'BPO Services',
                    slug: 'bpo',
                    description: 'Comprehensive Business Process Outsourcing solutions to streamline your operations and reduce costs while maintaining high quality standards.',
                    shortDescription: 'Streamline operations with our comprehensive BPO solutions',
                    icon: 'Briefcase',
                    features: [
                        'Customer Support',
                        'Data Entry & Processing',
                        'Back Office Operations',
                        'Call Center Services',
                        'Document Management',
                        'Quality Assurance'
                    ],
                    benefits: [
                        'Cost Reduction',
                        'Improved Efficiency',
                        '24/7 Support',
                        'Scalable Solutions',
                        'Expert Team',
                        'Advanced Technology'
                    ],
                    process: [
                        {
                            step: 1,
                            title: 'Consultation',
                            description: 'We analyze your business needs and requirements'
                        },
                        {
                            step: 2,
                            title: 'Customization',
                            description: 'Tailored solutions designed for your specific processes'
                        },
                        {
                            step: 3,
                            title: 'Implementation',
                            description: 'Seamless integration with your existing systems'
                        },
                        {
                            step: 4,
                            title: 'Monitoring',
                            description: 'Continuous monitoring and optimization for best results'
                        }
                    ],
                    category: 'BPO Services',
                    isActive: true,
                    isFeatured: true,
                    order: 1
                },
                {
                    name: 'IT Services',
                    slug: 'it',
                    description: 'Full-stack MERN development and comprehensive IT solutions to modernize your business with cutting-edge technology.',
                    shortDescription: 'Modernize your business with our MERN stack development',
                    icon: 'Code',
                    features: [
                        'React Frontend Development',
                        'Express.js Backend',
                        'MongoDB Database Design',
                        'Node.js Server Development',
                        'Full-Stack Integration',
                        'Deployment & DevOps'
                    ],
                    benefits: [
                        'Modern Technology Stack',
                        'Scalable Architecture',
                        'Fast Development',
                        'Cross-Platform Compatibility',
                        'Real-time Applications',
                        'Cloud Integration'
                    ],
                    process: [
                        {
                            step: 1,
                            title: 'Planning',
                            description: 'Technical architecture and project planning'
                        },
                        {
                            step: 2,
                            title: 'Development',
                            description: 'Agile development using MERN stack'
                        },
                        {
                            step: 3,
                            title: 'Testing',
                            description: 'Comprehensive testing and quality assurance'
                        },
                        {
                            step: 4,
                            title: 'Deployment',
                            description: 'Production deployment and ongoing support'
                        }
                    ],
                    category: 'IT Services',
                    isActive: true,
                    isFeatured: true,
                    order: 2
                },
                {
                    name: 'Recruitment',
                    slug: 'recruitment',
                    description: 'Expert talent acquisition services to help you find the right candidates for your organization.',
                    shortDescription: 'Find the right talent for your organization',
                    icon: 'Users',
                    features: [
                        'Executive Search',
                        'Technical Recruitment',
                        'Temporary Staffing',
                        'Background Verification',
                        'Interview Coordination',
                        'Onboarding Support'
                    ],
                    benefits: [
                        'Access to Top Talent',
                        'Reduced Time-to-Hire',
                        'Cost-Effective Solutions',
                        'Industry Expertise',
                        'Quality Assurance',
                        'Long-term Partnership'
                    ],
                    process: [
                        {
                            step: 1,
                            title: 'Requirement Analysis',
                            description: 'Understanding your hiring needs and culture'
                        },
                        {
                            step: 2,
                            title: 'Sourcing',
                            description: 'Active sourcing from multiple channels'
                        },
                        {
                            step: 3,
                            title: 'Screening',
                            description: 'Comprehensive candidate screening and assessment'
                        },
                        {
                            step: 4,
                            title: 'Placement',
                            description: 'Final selection and successful placement'
                        }
                    ],
                    category: 'Recruitment',
                    isActive: true,
                    isFeatured: false,
                    order: 3
                },
                {
                    name: 'Legal Services',
                    slug: 'legal',
                    description: 'Professional legal process outsourcing to support your legal operations with expert knowledge and efficiency.',
                    shortDescription: 'Professional legal process outsourcing solutions',
                    icon: 'Scale',
                    features: [
                        'Contract Review',
                        'Legal Research',
                        'Document Drafting',
                        'Compliance Management',
                        'Litigation Support',
                        'Intellectual Property'
                    ],
                    benefits: [
                        'Expert Legal Knowledge',
                        'Cost Reduction',
                        'Faster Turnaround',
                        'Quality Assurance',
                        'Confidentiality',
                        'Scalable Services'
                    ],
                    process: [
                        {
                            step: 1,
                            title: 'Case Analysis',
                            description: 'Thorough analysis of legal requirements'
                        },
                        {
                            step: 2,
                            title: 'Research',
                            description: 'Comprehensive legal research and documentation'
                        },
                        {
                            step: 3,
                            title: 'Drafting',
                            description: 'Professional document drafting and review'
                        },
                        {
                            step: 4,
                            title: 'Delivery',
                            description: 'Timely delivery with quality assurance'
                        }
                    ],
                    category: 'Legal Services',
                    isActive: true,
                    isFeatured: false,
                    order: 4
                },
                {
                    name: 'KPO Services',
                    slug: 'kpo',
                    description: 'Knowledge Process Outsourcing solutions leveraging domain expertise to deliver high-value analytical and research services.',
                    shortDescription: 'High-value analytical and research services',
                    icon: 'Brain',
                    features: [
                        'Market Research',
                        'Data Analytics',
                        'Financial Analysis',
                        'Business Intelligence',
                        'Risk Assessment',
                        'Strategic Planning'
                    ],
                    benefits: [
                        'Domain Expertise',
                        'Advanced Analytics',
                        'Strategic Insights',
                        'Cost Efficiency',
                        'Quality Deliverables',
                        'Competitive Advantage'
                    ],
                    process: [
                        {
                            step: 1,
                            title: 'Requirement Gathering',
                            description: 'Understanding your analytical needs'
                        },
                        {
                            step: 2,
                            title: 'Data Collection',
                            description: 'Comprehensive data gathering and validation'
                        },
                        {
                            step: 3,
                            title: 'Analysis',
                            description: 'Advanced analytical processing and insights'
                        },
                        {
                            step: 4,
                            title: 'Reporting',
                            description: 'Detailed reports and actionable recommendations'
                        }
                    ],
                    category: 'KPO Services',
                    isActive: true,
                    isFeatured: true,
                    order: 5
                },
                {
                    name: 'Customer Support',
                    slug: 'support',
                    description: '24/7 customer support services to enhance customer satisfaction and build lasting relationships.',
                    shortDescription: '24/7 customer support for enhanced satisfaction',
                    icon: 'Headphones',
                    features: [
                        '24/7 Support',
                        'Multi-channel Support',
                        'Technical Support',
                        'Customer Onboarding',
                        'Issue Resolution',
                        'Customer Feedback'
                    ],
                    benefits: [
                        'Round-the-Clock Support',
                        'Improved Satisfaction',
                        'Reduced Response Time',
                        'Expert Support Team',
                        'Cost-Effective',
                        'Scalable Solutions'
                    ],
                    process: [
                        {
                            step: 1,
                            title: 'Setup',
                            description: 'Support infrastructure and team setup'
                        },
                        {
                            step: 2,
                            title: 'Training',
                            description: 'Comprehensive training on your products/services'
                        },
                        {
                            step: 3,
                            title: 'Launch',
                            description: 'Go-live with full support coverage'
                        },
                        {
                            step: 4,
                            title: 'Optimization',
                            description: 'Continuous improvement and optimization'
                        }
                    ],
                    category: 'Customer Support',
                    isActive: true,
                    isFeatured: false,
                    order: 6
                },
            ];

            await Service.insertMany(services);
            console.log('✅ Services seeded successfully');
        }

        // Seed admin users
        await seedAdminUser();

        // Seed test users in development
        if (process.env['NODE_ENV'] === 'development') {
            await seedTestUsers();
        }

        // Initialize default settings if they don't exist
        const existingSettings = await Settings.countDocuments();
        if (existingSettings === 0) {
            await Settings.create({});
            console.log('✅ Default settings initialized');
        }

        console.log('✅ Database seeding process completed');
    } catch (error) {
        console.error('❌ Database seeding failed:', error);
        throw error;
    }
};
