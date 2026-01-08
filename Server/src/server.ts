import app from './app';
// Note: dotenv is already configured in app.ts, but standard practice is to configure it at the very top of the entry point too implicitly.
// However, since we import 'app' which configures it, we are safe. 
// Ideally, we move dotenv.config() here or to a separate config loader.

import { initializeDatabase, createIndexes } from '@/config/database';

import { seedDatabase } from '@/seeds/index'; // We will create this next

const PORT = process.env['PORT'] || 5000;

// Initialize database and start server
const startServer = async () => {
    try {
        // Try to initialize database connection
        try {
            await initializeDatabase();
            await createIndexes();

            // Seed database with initial data (only in development)
            if (process.env['NODE_ENV'] === 'development') {
                // We will move the seeding logic to a dedicated file in the next step
                await seedDatabase();
            }
            console.log('✅ Database initialized successfully');
        } catch (dbError) {
            console.warn('⚠️  Database initialization failed, continuing without database:', dbError);
        }

        // Initialize email service
        // Initialize email service (auto-initialized in constructor)
        // emailService is imported to trigger instantiation if needed, but imported instance is already created.

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
