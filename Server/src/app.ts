
import dotenv from 'dotenv';
// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import compression from 'compression';

import cors from 'cors';
import morgan from 'morgan';

// Import configurations
import { helmetConfig } from '@/config/helmet.js';
import { corsConfig } from '@/config/cors.js';
import { checkMaintenanceMode } from '@/middleware/maintenanceMode.js';
import { errorHandler } from '@/middleware/errorHandler.js';
import { notFoundHandler } from '@/middleware/notFoundHandler.js';
import { apiLimiter } from '@/middleware/rateLimiter.js';

// Import routes
import healthRoutes from '@/routes/health.js';
import apiRoutes from '@/routes/api.js';

// Swagger documentation
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@/config/swagger.js';

import { env } from '@/config/env.js';

const app = express();
const isDev = env.NODE_ENV === 'development';

// Setup for later manual logging if needed, or other static paths.
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Logger stream import
import { stream } from '@/utils/logger.js';

// Logging middleware
// Console logging for dev only, skip health checks to keep console clean
if (isDev) {
    app.use(morgan('dev', {
        skip: (req) => req.url === '/health' || req.originalUrl === '/health'
    }));
}

// File logging for all environments, skip health checks to avoid bloating logs
app.use(morgan('combined', {
    stream,
    skip: (req) => req.url === '/health' || req.originalUrl === '/health'
}));

// Security middleware
app.use(helmet(helmetConfig));

// CORS configuration (highest priority)
app.use(cors(corsConfig));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (for future file uploads)
app.use('/uploads', express.static('uploads'));

// Maintenance mode check (before routes)
app.use(checkMaintenanceMode);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/health', healthRoutes);
app.use('/api', apiLimiter, apiRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
