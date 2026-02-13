import 'dotenv/config';
import app from './app.js';
import logger from '@/utils/logger.js';
import { env } from '@/config/env.js';
// Note: dotenv is already configured in app.ts, but standard practice is to configure it at the very top of the entry point too implicitly.
// However, since we import 'app' which configures it, we are safe. 
// Ideally, we move dotenv.config() here or to a separate config loader.

import { initializeDatabase, createIndexes } from '@/config/database.js';

import { seedDatabase } from '@/seeds/index.js'; // We will create this next

const PORT = env.PORT;

// Initialize database and start server
// Trigger restart
const startServer = async () => {
    try {
        // Try to initialize database connection
        try {
            await initializeDatabase();
            await createIndexes();

            // Seed database with initial data (only in development)
            if (env.NODE_ENV === 'development') {
                // We will move the seeding logic to a dedicated file in the next step
                await seedDatabase();
            }
            logger.info('Database initialized successfully');
        } catch (dbError) {
            logger.warn(`Database initialization failed, continuing without database: ${dbError}`);
        }

        // Initialize email service
        // Initialize email service (auto-initialized in constructor)
        // emailService is imported to trigger instantiation if needed, but imported instance is already created.

        // Start server
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(`Health check: http://localhost:${PORT}/health`);
            logger.info(`API: http://localhost:${PORT}/api`);
        });

    } catch (error) {
        logger.error(`Failed to start server: ${error}`);
        process.exit(1);
    }
};

// Start the server
startServer();
