
import dotenv from 'dotenv';
// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import compression from 'compression';

import cors from 'cors';
import morgan from 'morgan';

// Import configurations
import { helmetConfig } from '@/config/helmet';
import { corsConfig } from '@/config/cors';
import { checkMaintenanceMode } from '@/middleware/maintenanceMode';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { apiLimiter } from '@/middleware/rateLimiter';

// Import routes
import healthRoutes from '@/routes/health';
import apiRoutes from '@/routes/api';

// Swagger documentation
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@/config/swagger';

const app = express();
const isDev = process.env['NODE_ENV'] === 'development';

import fs from 'fs';
import path from 'path';

// Ensure logs directory exists
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });

// Logging middleware (log to console in dev, log to file in all environments)
app.use(morgan(isDev ? 'dev' : 'combined'));
app.use(morgan('combined', { stream: accessLogStream }));

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
