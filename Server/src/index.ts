// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import compression from 'compression';

// Import configurations
import { helmetConfig } from '@/config/helmet';
import { initializeDatabase, createIndexes, seedDatabase } from '@/config/database';
import { initializeEmailService } from '@/services/emailService';

// Import middleware
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { checkMaintenanceMode } from '@/middleware/maintenanceMode';

// Import routes
import healthRoutes from '@/routes/health';
import apiRoutes from '@/routes/api';

const app = express();
const PORT = process.env['PORT'] || 8000;

// Security middleware
app.use(helmet(helmetConfig));

// CORS configuration handled manually below
// Ensure correct CORS headers and handle preflight inline (highest priority)
app.use((req, res, next): void => {
  const origin = req.headers['origin'] as string | undefined;
  // Hardcoded allowed origins (no .env)
  const allowedOrigins = new Set<string>([
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8001',
    'http://localhost:5174',
    'https://careermapsolution.com',
    'https://www.careermapsolution.com',
  ]);

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
});

// Compression middleware
app.use(compression());


// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (for future file uploads)
app.use('/uploads', express.static('uploads'));

// Maintenance mode check (before routes)
app.use(checkMaintenanceMode);

// Routes
app.use('/health', healthRoutes);
app.use('/api', apiRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Try to initialize database connection (optional)
    try {
      await initializeDatabase();
      await createIndexes();

      // Seed database with initial data (only in development)
      if (process.env['NODE_ENV'] === 'development') {
        await seedDatabase();
      }
      console.log('✅ Database initialized successfully');
    } catch (dbError) {
      console.warn('⚠️  Database initialization failed, continuing without database:', dbError);
    }

    // Initialize email service
    initializeEmailService();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
