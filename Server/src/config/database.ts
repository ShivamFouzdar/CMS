
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
  const uri = process.env['MONGODB_URI'];

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

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

  if (process.env['NODE_ENV'] === 'development') {
    mongoose.set('debug', true);
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

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
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
    console.error('Failed to connect to database:', error);
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

    const isDev = process.env['NODE_ENV'] === 'development';

    // Create indexes for modules
    await Contact.createIndexes();
    if (isDev) console.log('✅ Contact indexes created');

    await Review.createIndexes();
    if (isDev) console.log('✅ Review indexes created');

    await Service.createIndexes();
    if (isDev) console.log('✅ Service indexes created');

    await User.createIndexes();
    if (isDev) console.log('✅ User indexes created');

    console.log('📊 Database indexes verified successfully');
  } catch (error) {
    console.error('Index creation failed:', error);
    throw error;
  }
};

export default {
  initializeDatabase,
  getDatabaseHealth,
  createIndexes
};
