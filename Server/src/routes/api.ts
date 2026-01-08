import { Router } from 'express';

// Import route modules
import contactRoutes from './contact';
import reviewRoutes from './reviews';
import serviceRoutes from './services';
import userRoutes from './users';
import adminRoutes from './admin';
import authRoutes from './auth';
import jobApplicationRoutes from './jobApplication';
import twoFactorRoutes from './twoFactor';
import publicRoutes from './public';

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

export default router;
