/**
 * Models Index
 * Central export point for all database models
 */

export { Contact, type IContact } from './Contact.js';
export { Review, type IReview } from './Review.js';
export { Service, type IService, type IServiceProcess, type IServicePricing } from './Service.js';
export { User, type IUser } from './User.js';
export { Applicant, type IApplicant } from './Applicant.js';
export { Settings, type ISettings } from './Settings.js';

// Re-export all models as default exports for convenience
export { default as ContactModel } from './Contact.js';
export { default as ReviewModel } from './Review.js';
export { default as ServiceModel } from './Service.js';
export { default as UserModel } from './User.js';
export { default as ApplicantModel } from './Applicant.js';
export { default as SettingsModel } from './Settings.js';
// Settings doesn't have a default export

// Model registry for dynamic access
export const models = {
  Contact: () => import('./Contact.js'),
  Review: () => import('./Review.js'),
  Service: () => import('./Service.js'),
  User: () => import('./User.js'),
  Applicant: () => import('./Applicant.js'),
  Settings: () => import('./Settings.js')
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
