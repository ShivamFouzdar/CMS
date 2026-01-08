import { ContactRepository } from '@/repositories/contact.repository';
import { ReviewRepository } from '@/repositories/review.repository';
import { ServiceRepository } from '@/repositories/service.repository';
import { UserRepository } from '@/repositories/user.repository';
import { JobApplicationRepository } from '@/repositories/jobApplication.repository';
import * as os from 'os';
import mongoose from 'mongoose';
import { emailService } from '@/services/email.service';

interface SystemHealth {
    status: string;
    uptime: number;
    serverLoad: number;
    memoryUsage: number;
    timestamp: string;
    system: {
        platform: string;
        release: string;
        arch: string;
        nodeVersion: string;
        cpuModel: string;
    };
    database: {
        status: string;
        latency: number;
    };
    smtp?: {
        connected: boolean;
        status: string;
    };
    disk: {
        total: number;
        free: number;
        used: number;
        percentage: number;
    };
}

export class AdminService {
    private contactRepo: ContactRepository;
    private reviewRepo: ReviewRepository;
    private serviceRepo: ServiceRepository;
    private userRepo: UserRepository;
    private jobRepo: JobApplicationRepository;

    constructor() {
        this.contactRepo = new ContactRepository();
        this.reviewRepo = new ReviewRepository();
        this.serviceRepo = new ServiceRepository();
        this.userRepo = new UserRepository();
        this.jobRepo = new JobApplicationRepository();
    }

    /**
     * Get comprehensive dashboard statistics
     */
    async getDashboardStats() {
        const [
            contactStats,
            reviewStats,
            serviceCount,
            userStats,
            jobCount
        ] = await Promise.all([
            this.contactRepo.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        new: {
                            $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] }
                        },
                        inProgress: {
                            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
                        },
                        completed: {
                            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                        }
                    }
                }
            ]),
            this.reviewRepo.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        published: {
                            $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
                        },
                        pending: {
                            $sum: { $cond: [{ $eq: ['$isPublished', false] }, 1, 0] }
                        },
                        averageRating: { $avg: '$rating' }
                    }
                }
            ]),
            this.serviceRepo.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: {
                            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                        },
                        featured: {
                            $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] }
                        }
                    }
                }
            ]),
            this.userRepo.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: { $sum: 1 }
                    }
                }
            ]),
            this.jobRepo.count({})
        ]);

        const contactStatsObj = contactStats[0] || { total: 0, new: 0, inProgress: 0, completed: 0 };
        const reviewStatsObj = reviewStats[0] || { total: 0, published: 0, pending: 0, averageRating: 0 };
        const userStatsObj = userStats[0] || { total: 0, active: 0 };

        const serviceStatsObj = serviceCount[0] || { total: 0, active: 0, featured: 0 };

        return {
            contacts: {
                total: contactStatsObj.total,
                new: contactStatsObj.new,
                inProgress: contactStatsObj.inProgress,
                completed: contactStatsObj.completed
            },
            reviews: {
                total: reviewStatsObj.total,
                published: reviewStatsObj.published,
                pending: reviewStatsObj.pending,
                averageRating: Math.round((reviewStatsObj.averageRating || 0) * 10) / 10
            },
            services: {
                total: serviceStatsObj.total,
                active: serviceStatsObj.active,
                featured: serviceStatsObj.featured
            },
            users: {
                total: userStatsObj.total,
                active: userStatsObj.active,
                byRole: {}
            },
            jobs: {
                total: jobCount
            }
        };
    }

    /**
     * Get recent system activity
     */
    async getRecentActivity(limit: number = 10) {
        const [contacts, reviews] = await Promise.all([
            this.contactRepo.findAll({}, { createdAt: -1 }, limit),
            this.reviewRepo.findAll({}, { createdAt: -1 }, limit)
        ]);

        const activity = [
            ...contacts.map((c: any) => ({
                id: c._id,
                type: 'contact',
                action: 'submitted',
                user: c.name || 'Anonymous',
                timestamp: c.createdAt
            })),
            ...reviews.map((r: any) => ({
                id: r._id,
                type: 'review',
                action: 'posted',
                user: r.name || 'Anonymous',
                timestamp: r.createdAt
            }))
        ];

        return activity
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
    }
    /**
     * Get system health status
     */
    async getSystemHealth() {
        const cpus = os.cpus();
        const cpuCount = cpus.length;
        // Load average for the last 1 minute
        const loadAvg = os.loadavg()[0] || 0;
        // Calculate load percentage (approximate) - capped at 100%
        const loadPercentage = Math.min(Math.round((loadAvg / cpuCount) * 100), 100);

        // Memory usage
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memoryPercentage = Math.round((usedMem / totalMem) * 100);

        const health: SystemHealth = {
            status: 'healthy',
            uptime: process.uptime(), // Application uptime in seconds
            serverLoad: loadPercentage,
            memoryUsage: memoryPercentage,
            timestamp: new Date().toISOString(),
            system: {
                platform: os.platform(),
                release: os.release(),
                arch: os.arch(),
                nodeVersion: process.version,
                cpuModel: cpus[0]?.model || 'Unknown'
            },
            database: {
                status: 'connected',
                latency: 0 // Placeholder
            },
            disk: {
                total: 0,
                free: 0,
                used: 0,
                percentage: 0
            }
        };

        // Check Database Status
        try {
            health.database.status = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        } catch (e) {
            health.database.status = 'unknown';
        }

        // Check SMTP Status
        try {
            const smtpStatus = await emailService.checkHealth();
            health.smtp = {
                connected: smtpStatus,
                status: smtpStatus ? 'connected' : 'disconnected'
            };
        } catch (error) {
            health.smtp = {
                connected: false,
                status: 'error'
            };
        }

        // Check Disk Usage (Linux/Mac)
        try {
            const { exec } = await import('child_process');
            const util = await import('util');
            const execAsync = util.promisify(exec);

            // Get disk usage for root directory
            const { stdout } = await execAsync('df -k /');
            const lines = stdout.trim().split('\n');
            const line = lines[1];

            if (line) {
                const parts = line.replace(/\s+/g, ' ').split(' ');

                if (parts.length >= 4) {
                    const total = parseInt(parts[1] || '0') * 1024; // Bytes
                    const used = parseInt(parts[2] || '0') * 1024;
                    const free = parseInt(parts[3] || '0') * 1024;

                    health.disk = {
                        total,
                        free,
                        used,
                        percentage: total > 0 ? Math.round((used / total) * 100) : 0
                    };
                }
            }
        } catch (error) {
            console.error('Disk usage check failed:', error);
        }

        return health;
    }

    /**
     * Get system logs
     */
    async getSystemLogs() {
        const { promises: fs } = await import('fs');
        const path = await import('path');
        const logPath = path.join(__dirname, '../../logs/access.log');

        try {
            // Check if file exists
            try {
                await fs.access(logPath);
            } catch {
                return [];
            }

            // Optimization: Read only last 100KB instead of full file if possible
            // For now, we'll keep the simple read but handle potential crashes gracefully
            // In a real optimized scenario, we'd use fs.open and read from end

            const stats = await fs.stat(logPath);
            const fileSize = stats.size;
            // Limit read size to 500KB to prevent memory issues
            const readSize = Math.min(fileSize, 500 * 1024);
            const buffer = Buffer.alloc(readSize);

            const fileHandle = await fs.open(logPath, 'r');
            await fileHandle.read(buffer, 0, readSize, fileSize - readSize);
            await fileHandle.close();

            const data = buffer.toString('utf8');
            const lines = data.trim().split('\n').reverse().slice(0, 100);

            return lines.map(line => {
                // Basic parsing of Combined Log Format
                const match = line.match(/^(\S+) \S+ \S+ \[(.*?)\] "(.*?)" (\d+) (\d+|-) "(.*?)" "(.*?)"/);

                if (match) {
                    return {
                        ip: match[1],
                        timestamp: match[2],
                        request: match[3],
                        status: parseInt(match[4] || '0', 10),
                        size: match[5],
                        userAgent: match[7],
                        raw: line
                    };
                }
                return { raw: line, timestamp: new Date().toISOString() };
            });
        } catch (error) {
            console.error('Error reading logs:', error);
            return [];
        }
    }
}

export const adminService = new AdminService();
