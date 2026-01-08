import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/helpers';
import { sendSuccess } from '@/utils/response.utils';
import { adminService } from '@/services/admin.service';
import { Settings } from '@/models/Settings';
import { emailService } from '@/services/email.service';
import { updateSystemSettings as updateSettings } from '@/services/settings.service';
import { models } from '@/models';

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
  const health = await adminService.getSystemHealth();
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
  const logs = await adminService.getSystemLogs();
  return sendSuccess(res, 'System logs retrieved successfully', logs);
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
