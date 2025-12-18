/**
 * Models Index
 * Central export point for all database models
 */

export { Contact, IContact } from './Contact';
export { Review, IReview } from './Review';
export { Service, IService, IServiceProcess, IServicePricing } from './Service';
export { User, IUser } from './User';
export { Applicant, IApplicant } from './Applicant';
export { Settings, ISettings } from './Settings';

// Re-export all models as default exports for convenience
export { default as ContactModel } from './Contact';
export { default as ReviewModel } from './Review';
export { default as ServiceModel } from './Service';
export { default as UserModel } from './User';
export { default as ApplicantModel } from './Applicant';
// Settings doesn't have a default export

// Model registry for dynamic access
export const models = {
  Contact: () => import('./Contact'),
  Review: () => import('./Review'),
  Service: () => import('./Service'),
  User: () => import('./User'),
  Applicant: () => import('./Applicant'),
  Settings: () => import('./Settings')
};

// Database connection helper
export const connectDatabase = async (uri: string) => {
  const mongoose = await import('mongoose');
  
  try {
    await mongoose.connect(uri);
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Database disconnection helper
export const disconnectDatabase = async () => {
  const mongoose = await import('mongoose');
  
  try {
    await mongoose.disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
    throw error;
  }
};

// Health check for database
export const checkDatabaseHealth = async () => {
  const mongoose = await import('mongoose');
  
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    return {
      status: state === 1 ? 'healthy' : 'unhealthy',
      state: states[state as keyof typeof states],
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
