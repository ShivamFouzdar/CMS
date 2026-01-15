/**
 * Concept: Process Management (PM2)
 * Used for running Node.js apps in production on a standard VPS (non-Docker).
 * Features:
 * - Cluster Mode: Instances = Max CPU Cores (Load Balancing).
 * - Watch Mode: Auto-restart on file changes (optional).
 * - Env Injection: Easy environment variable management.
 */

module.exports = {
    apps: [{
        name: "cms-api",
        script: "./dist/app.js", // Points to the compiled JS entry
        instances: "max",        // Use all CPU cores
        exec_mode: "cluster",    // Cluster mode for load balancing
        watch: false,            // Don't watch files in production (prevents restart loops)
        max_memory_restart: '1G',// Auto-restart if leak detected
        env_production: {
            NODE_ENV: "production",
            PORT: 5000
        },
        env_development: {
            NODE_ENV: "development",
            PORT: 5000
        }
    }]
};
