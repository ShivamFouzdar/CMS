import { User } from '@/models/index.js';
import logger from '@/utils/logger.js';
import { env } from '@/config/env.js';

/**
 * Seed admin user
 * Creates a default admin user if none exists
 */
export const seedAdminUser = async () => {
  try {
    const adminEmail = env.ADMIN_INITIAL_EMAIL;
    const adminExists = await User.findByEmail(adminEmail);

    if (adminExists) {
      logger.info('Admin user already exists');
      return;
    }

    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail,
      password: env.ADMIN_INITIAL_PASSWORD,
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
      permissions: [
        'manage.users',
        'manage.job-applications',
        'manage.content',
        'view.analytics',
        'manage.settings',
      ],
      profile: {
        department: 'Administration',
      },
      preferences: {
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        theme: 'auto',
        language: 'en',
      },
    });

    logger.info('Admin user created successfully!');
    logger.info(`Email: ${adminEmail}`);
    logger.info('Please change the password after first login!');

    return admin;
  } catch (error) {
    logger.error(`Error creating admin user: ${error}`);
    throw error;
  }
};

/**
 * Create test users for development
 */
export const seedTestUsers = async () => {
  try {
    const users = [
      {
        firstName: 'John',
        lastName: 'Moderator',
        email: 'moderator@careermapsolutions.com',
        password: 'Moderator@123',
        role: 'moderator' as const,
      },
      {
        firstName: 'Jane',
        lastName: 'Viewer',
        email: 'viewer@careermapsolutions.com',
        password: 'Viewer@123',
        role: 'viewer' as const,
      },
    ];

    for (const userData of users) {
      const existingUser = await User.findByEmail(userData.email);

      if (!existingUser) {
        await User.create({
          ...userData,
          isActive: true,
          isEmailVerified: true,
          permissions: [],
          profile: {
            department: userData.role === 'moderator' ? 'HR' : 'Content',
          },
        });
        logger.info(`Created ${userData.role} user: ${userData.email}`);
      }
    }

    logger.info('Test users created successfully!');
  } catch (error) {
    logger.error(`Error creating test users: ${error}`);
    throw error;
  }
};

