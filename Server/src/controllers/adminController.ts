import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/helpers';
import { sendSuccess } from '@/utils/response.utils';
import mongoose from 'mongoose';
import os from 'os';

/**
 * Admin Controller
 * Handles admin dashboard and system management
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: System administration and monitoring
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved
 */
export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const { adminService } = await import('@/services/admin.service');
  const stats = await adminService.getDashboardStats();

  return sendSuccess(res, 'Dashboard statistics retrieved successfully', stats);
});

/**
 * @swagger
 * /api/admin/health:
 *   get:
 *     summary: Get system health (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System health info
 */
export const getSystemHealth = asyncHandler(async (_req: Request, res: Response) => {
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

  const health = {
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
    const { emailService } = await import('@/services/email.service');
    const smtpStatus = await emailService.checkHealth();
    (health as any).smtp = {
      connected: smtpStatus,
      status: smtpStatus ? 'connected' : 'disconnected'
    };
  } catch (error) {
    (health as any).smtp = {
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

  return sendSuccess(res, 'System health retrieved successfully', health);
});

/**
 * @swagger
 * /api/admin/activity:
 *   get:
 *     summary: Get recent system activity
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity history retrieved
 */
export const getRecentActivity = asyncHandler(async (_req: Request, res: Response) => {
  const { adminService } = await import('@/services/admin.service');
  const activity = await adminService.getRecentActivity();

  return sendSuccess(res, 'Recent activity retrieved successfully', activity);
});

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     summary: Get system analytics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics retrieved
 */
export const getAnalytics = asyncHandler(async (_req: Request, res: Response) => {
  const analytics = {
    pageViews: 0,
    uniqueVisitors: 0,
    contactSubmissions: 0,
    reviewSubmissions: 0
  };

  return sendSuccess(res, 'Analytics retrieved successfully', analytics);
});

/**
 * @swagger
 * /api/admin/export/{dataType}:
 *   get:
 *     summary: Export system data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dataType
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Data exported
 */
export const exportData = (dataType: string) => {
  return asyncHandler(async (_req: Request, res: Response) => {
    return sendSuccess(res, `${dataType} data exported successfully`);
  });
};

/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: Get system logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs retrieved
 */
export const getSystemLogs = asyncHandler(async (_req: Request, res: Response) => {
  const { promises: fs } = await import('fs');
  const path = await import('path');
  const logPath = path.join(__dirname, '../../logs/access.log');

  try {
    // Check if file exists
    try {
      await fs.access(logPath);
    } catch {
      return sendSuccess(res, 'No logs available yet', []);
    }

    const data = await fs.readFile(logPath, 'utf8');
    const lines = data.trim().split('\n').reverse().slice(0, 100);

    const logs = lines.map(line => {
      // Basic parsing of Combined Log Format
      // 127.0.0.1 - - [07/Jan/2026:16:50:00 +0530] "GET /api/health HTTP/1.1" 200 15 "-" "PostmanRuntime/7.26.8"
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

    return sendSuccess(res, 'System logs retrieved successfully', logs);
  } catch (error) {
    console.error('Error reading logs:', error);
    return sendSuccess(res, 'Failed to read logs', []);
  }
});

/**
 * @swagger
 * /api/admin/settings:
 *   put:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Settings'
 *     responses:
 *       200:
 *         description: Settings updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Settings'
 */
export const updateSystemSettings = asyncHandler(async (req: Request, res: Response) => {
  const { updateSystemSettings: updateSettings } = await import('@/services/settings.service');

  const settingsData = req.body;
  const updatedSettings = await updateSettings(settingsData);

  return sendSuccess(res, 'System settings updated successfully', updatedSettings);
});

/**
 * @swagger
 * /api/admin/settings/test-smtp:
 *   post:
 *     summary: Test SMTP connection
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Connection successful
 *       500:
 *         description: Connection failed
 */
export const testSmtpConnection = asyncHandler(async (req: Request, res: Response) => {
  const { emailService } = await import('@/services/email.service');
  const config = req.body;

  try {
    await emailService.verifyConfig(config);
    return sendSuccess(res, 'SMTP Connection established successfully');
  } catch (error: any) {
    res.status(500);
    throw new Error(`SMTP Connection failed: ${error.message}`);
  }
});

/**
 * @swagger
 * /api/admin/settings:
 *   get:
 *     summary: Get system settings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Settings'
 */
export const getSystemSettings = asyncHandler(async (_req: Request, res: Response) => {
  const { Settings } = await import('@/models/Settings');

  const settings = await Settings.findOne().select('+smtp.password');
  return sendSuccess(res, 'System settings retrieved successfully', settings);
});

/**
 * @swagger
 * /api/admin/backup:
 *   post:
 *     summary: Initiate database backup
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Backup initiated
 */
export const backupDatabase = asyncHandler(async (_req: Request, res: Response) => {
  const { models } = await import('@/models');
  const backupData: any = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    data: {}
  };

  // Iterate over all registered models
  for (const [name, loadModel] of Object.entries(models)) {
    const { default: Model } = (await loadModel()) as any;
    backupData.data[name] = await Model.find({}).lean();
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=cms-backup-${new Date().toISOString().split('T')[0]}.json`);

  return res.send(JSON.stringify(backupData, null, 2));
});

/**
 * @swagger
 * /api/admin/restore:
 *   post:
 *     summary: Initiate database restore
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Restore initiated
 */
export const restoreDatabase = asyncHandler(async (req: Request, res: Response) => {
  const { models } = await import('@/models');
  const payload = req.body;

  if (!payload || !payload.data) {
    res.status(400);
    throw new Error('Invalid backup file format or missing data');
  }

  const results: any = {};

  // Iterate over all registered models and restore if data exists
  for (const [name, loadModel] of Object.entries(models)) {
    if (payload.data[name] && Array.isArray(payload.data[name])) {
      const { default: Model } = (await loadModel()) as any;
      const docs = payload.data[name];

      if (docs.length > 0) {
        const ops = docs.map((doc: any) => ({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: doc },
            upsert: true
          }
        }));
        await Model.bulkWrite(ops);
        results[name] = docs.length;
      }
    }
  }

  return sendSuccess(res, 'Database restored successfully', results);
});

/**
 * @swagger
 * /api/admin/db-stats:
 *   get:
 *     summary: Get database statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: DB stats retrieved
 */
export const getDatabaseStats = asyncHandler(async (_req: Request, res: Response) => {
  const { models } = await import('@/models');
  let totalCollections = 0;
  let totalDocuments = 0;
  let estimatedSize = 0;

  for (const [name, loadModel] of Object.entries(models)) {
    try {
      const modelModule = (await loadModel()) as any;
      const Model = modelModule.default || modelModule[name] || Object.values(modelModule)[0];

      if (Model && typeof Model.countDocuments === 'function') {
        const count = await Model.countDocuments();
        totalCollections++;
        totalDocuments += count;
        // High-level estimate: average document size in MongoDB is often cited around 1-2KB
        estimatedSize += count * 1024;
      }
    } catch (error) {
      console.error(`Failed to get stats for model ${name}:`, error);
      // Continue to next model instead of failing entire request
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = {
    collections: totalCollections,
    documents: totalDocuments,
    size: formatSize(estimatedSize)
  };

  return sendSuccess(res, 'Database statistics retrieved successfully', stats);
});

/**
 * @swagger
 * /api/admin/metrics:
 *   get:
 *     summary: Get live server metrics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Metrics retrieved
 */
export const getServerMetrics = asyncHandler(async (_req: Request, res: Response) => {
  const metrics = {
    cpu: 0,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  };

  return sendSuccess(res, 'Server metrics retrieved successfully', metrics);
});
