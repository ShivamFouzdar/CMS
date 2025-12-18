import mongoose from 'mongoose';
import { disconnectDatabase, checkDatabaseHealth } from '@/models';

/**
 * Database Configuration
 * Handles MongoDB connection and configuration
 */

interface DatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

const getDatabaseConfig = (): DatabaseConfig => {
  const uri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/cms';
  
  const options: mongoose.ConnectOptions = {
    // Connection options
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 20000, // Allow more time for Atlas cluster discovery
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferCommands: false, // Disable mongoose buffering
    
    // Additional options
    retryWrites: true,
    retryReads: true,
  };

  // Enable TLS explicitly for Atlas clusters; omit for localhost
  if (uri.startsWith('mongodb+srv://') || uri.includes('mongodb.net')) {
    options.tls = true;
  }

  return { uri, options };
};

/**
 * Initialize database connection
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    const { uri, options } = getDatabaseConfig();
    
    // Set mongoose options
    mongoose.set('strictQuery', false);
    
    // Connect to database with options
    await mongoose.connect(uri, options);
    
    // Set up connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('database connected successfully');
    });
    
    mongoose.connection.on('error', () => {
      // silence startup errors in console output
    });
    
    mongoose.connection.on('disconnected', () => {
      // silence disconnect logs in console output
    });
    
    // Handle application termination
    process.on('SIGINT', async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    
  } catch (error) {
    // keep errors quiet per minimal startup logs requirement
    throw error;
  }
};

/**
 * Get database health status
 */
export const getDatabaseHealth = async () => {
  return await checkDatabaseHealth();
};

/**
 * Create database indexes for better performance
 */
export const createIndexes = async (): Promise<void> => {
  try {
    const { Contact, Review, Service, User } = await import('@/models');
    
    // Create indexes for Contact model
    await Contact.createIndexes();
    console.log('✅ Contact indexes created');
    
    // Create indexes for Review model
    await Review.createIndexes();
    console.log('✅ Review indexes created');
    
    // Create indexes for Service model
    await Service.createIndexes();
    console.log('✅ Service indexes created');
    
    // Create indexes for User model
    await User.createIndexes();
    console.log('✅ User indexes created');
    
    console.log('📊 All database indexes created successfully');
  } catch (error) {
    // silence index creation errors in console output
    throw error;
  }
};

/**
 * Seed database with initial data
 */
export const seedDatabase = async (): Promise<void> => {
  try {
    const { Service, Review, Settings } = await import('@/models');
    const { seedAdminUser, seedTestUsers } = await import('@/utils/seedAdmin');
    
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
      // silence seeding logs
      
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
        }
      ];
      
      await Service.insertMany(services);
      // silence seeding logs
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
    
    // silence seeding completion logs
  } catch (error) {
    // silence seeding errors per minimal output
    throw error;
  }
};

export default {
  initializeDatabase,
  getDatabaseHealth,
  createIndexes,
  seedDatabase
};
