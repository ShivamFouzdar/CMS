
import mongoose from 'mongoose';
import { disconnectDatabase, checkDatabaseHealth } from '@/models/index.js';
import logger from '@/utils/logger.js';
import { env } from '@/config/env.js';

/**
 * Database Configuration
 * Handles MongoDB connection and configuration
 */

interface DatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

const getDatabaseConfig = (): DatabaseConfig => {
  const uri = env.MONGODB_URI;

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

  if (env.NODE_ENV === 'development') {
    mongoose.set('debug', (collectionName: string, method: string, query: any, doc: any) => {
      logger.debug(`Mongoose: ${collectionName}.${method}`, { query, doc });
    });
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
      logger.info('Database connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
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
    logger.error(`Failed to connect to database: ${error}`);
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
    const { Contact, Review, Service, User } = await import('@/models/index.js');

    const isDev = env.NODE_ENV === 'development';

    // Create indexes for modules
    await Contact.createIndexes();
    if (isDev) logger.info('Contact indexes created');

    await Review.createIndexes();
    if (isDev) logger.info('Review indexes created');

    await Service.createIndexes();
    if (isDev) logger.info('Service indexes created');

    await User.createIndexes();
    if (isDev) logger.info('User indexes created');

    logger.info('Database indexes verified successfully');
  } catch (error) {
    logger.error(`Index creation failed: ${error}`);
    throw error;
  }
};

export default {
  initializeDatabase,
  getDatabaseHealth,
  createIndexes
};
