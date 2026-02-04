import { Router } from 'express';

// Import route modules
import contactRoutes from './contact.js';
import reviewRoutes from './reviews.js';
import serviceRoutes from './services.js';
import userRoutes from './users.js';
import adminRoutes from './admin.js';
import authRoutes from './auth.js';
import jobApplicationRoutes from './jobApplication.js';
import twoFactorRoutes from './twoFactor.js';
import publicRoutes from './public.js';
import mediaRoutes from './media.js';
import notificationRoutes from './notifications.js';
import teamRoutes from './team.js';

const router = Router();

// API information route
router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'CMS API is working',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      contact: '/api/contact',
      reviews: '/api/reviews',
      services: '/api/services',
      users: '/api/users',
      admin: '/api/admin',
      auth: '/api/auth',
      jobApplication: '/api/job-application',
      twoFactor: '/api/2fa',
      public: '/api/public',
      media: '/api/media',
      team: '/api/team',
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount route modules
router.use('/contact', contactRoutes);
router.use('/reviews', reviewRoutes);
router.use('/services', serviceRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/job-application', jobApplicationRoutes);
router.use('/2fa', twoFactorRoutes);
router.use('/public', publicRoutes);
router.use('/media', mediaRoutes);
router.use('/notifications', notificationRoutes);
router.use('/team', teamRoutes);

export default router;
