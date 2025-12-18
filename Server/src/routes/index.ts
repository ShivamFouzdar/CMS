/**
 * Routes Index
 * Central export point for all route modules
 */

export { default as apiRoutes } from './api';
export { default as healthRoutes } from './health';
export { default as contactRoutes } from './contact';
export { default as reviewRoutes } from './reviews';
export { default as serviceRoutes } from './services';
export { default as userRoutes } from './users';
export { default as adminRoutes } from './admin';
export { default as authRoutes } from './auth';
export { default as twoFactorRoutes } from './twoFactor';

// Route configuration
export const routeConfig = {
  api: {
    path: '/api',
    description: 'Main API routes'
  },
  health: {
    path: '/health',
    description: 'Health check routes'
  },
  contact: {
    path: '/api/contact',
    description: 'Contact form and management routes'
  },
  reviews: {
    path: '/api/reviews',
    description: 'Reviews and testimonials routes'
  },
  services: {
    path: '/api/services',
    description: 'Business services management routes'
  },
  users: {
    path: '/api/users',
    description: 'User authentication and management routes'
  },
  admin: {
    path: '/api/admin',
    description: 'Admin dashboard and system management routes'
  },
  auth: {
    path: '/api/auth',
    description: 'Authentication and token management routes'
  }
};

// Route documentation
export const routeDocumentation = {
  contact: {
    public: [
      'POST / - Submit contact form'
    ],
    protected: [
      'GET /submissions - Get all contact submissions',
      'GET /submissions/:id - Get contact submission by ID',
      'PATCH /submissions/:id/status - Update contact status',
      'PATCH /submissions/:id/contacted - Mark as contacted',
      'DELETE /submissions/:id - Delete contact submission',
      'GET /stats - Get contact statistics',
      'GET /by-service/:service - Get contacts by service'
    ]
  },
  reviews: {
    public: [
      'GET / - Get all published reviews',
      'GET /stats - Get review statistics',
      'GET /featured - Get featured reviews',
      'GET /recent - Get recent reviews',
      'GET /category/:category - Get reviews by category',
      'GET /:id - Get review by ID',
      'POST / - Submit new review',
      'POST /:id/vote - Vote on review helpfulness'
    ],
    protected: [
      'PATCH /:id/status - Update review status',
      'PATCH /:id/response - Add admin response',
      'DELETE /:id - Delete review'
    ]
  },
  services: {
    public: [
      'GET / - Get all active services',
      'GET /categories - Get service categories',
      'GET /featured - Get featured services',
      'GET /category/:category - Get services by category',
      'GET /slug/:slug - Get service by slug',
      'GET /id/:id - Get service by ID'
    ],
    protected: [
      'POST / - Create new service',
      'PUT /:id - Update service',
      'DELETE /:id - Delete service',
      'PATCH /:id/activate - Activate service',
      'PATCH /:id/deactivate - Deactivate service',
      'PATCH /:id/feature - Feature service',
      'PATCH /:id/unfeature - Unfeature service',
      'GET /stats - Get service statistics'
    ]
  },
  users: {
    public: [
      'POST /register - Register new user',
      'POST /login - Login user',
      'POST /logout - Logout user',
      'POST /forgot-password - Request password reset',
      'POST /reset-password - Reset password',
      'POST /verify-email - Verify email address'
    ],
    protected: [
      'GET /me - Get current user profile',
      'PUT /me/profile - Update user profile',
      'PUT /me/preferences - Update user preferences',
      'PUT /me/password - Change password',
      'GET / - Get all users (admin only)',
      'GET /stats - Get user statistics (admin only)',
      'GET /:id - Get user by ID (admin only)',
      'PUT /:id - Update user (admin only)',
      'DELETE /:id - Delete user (admin only)',
      'PATCH /:id/activate - Activate user (admin only)',
      'PATCH /:id/deactivate - Deactivate user (admin only)'
    ]
  },
  admin: {
    protected: [
      'GET /dashboard - Get dashboard statistics',
      'GET /analytics - Get analytics data',
      'GET /activity - Get recent activity',
      'GET /health - Get system health',
      'GET /metrics - Get server metrics',
      'GET /logs - Get system logs',
      'GET /settings - Get system settings',
      'PUT /settings - Update system settings',
      'GET /database/stats - Get database statistics',
      'POST /database/backup - Backup database',
      'POST /database/restore - Restore database',
      'GET /export/contacts - Export contacts data',
      'GET /export/reviews - Export reviews data',
      'GET /export/services - Export services data',
      'GET /export/users - Export users data'
    ]
  },
  auth: {
    public: [
      'POST /refresh - Refresh access token',
      'POST /validate - Validate token'
    ],
    protected: [
      'POST /revoke - Revoke token',
      'GET /info - Get token information'
    ]
  }
};
