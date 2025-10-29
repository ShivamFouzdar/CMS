import { User } from '@/models';

/**
 * Seed admin user
 * Creates a default admin user if none exists
 */
export const seedAdminUser = async () => {
  try {
    const adminExists = await User.findByEmail('admin@careermapsolutions.com');
    
    if (adminExists) {
      console.log('✅ Admin user already exists');
      return;
    }

    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@careermapsolutions.com',
      password: 'Admin@123', // Change this in production!
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

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@careermapsolutions.com');
    console.log('🔑 Password: Admin@123');
    console.log('⚠️  Please change the password after first login!');
    
    return admin;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
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
        console.log(`✅ Created ${userData.role} user: ${userData.email}`);
      }
    }

    console.log('✅ Test users created successfully!');
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    throw error;
  }
};

