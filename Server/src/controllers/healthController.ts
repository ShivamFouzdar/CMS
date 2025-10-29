import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/helpers';
import { ApiResponse } from '@/types';

/**
 * Health Controller
 * Handles system health checks and monitoring
 */

/**
 * Basic health check
 * GET /health
 */
export const healthCheck = asyncHandler(async (_req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'Server is running',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env['NODE_ENV'] || 'development',
      version: process.env['npm_package_version'] || '1.0.0',
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Detailed health check
 * GET /health/detailed
 */
export const detailedHealthCheck = asyncHandler(async (_req: Request, res: Response) => {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();

  const response: ApiResponse = {
    success: true,
    message: 'Detailed health information',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: uptime,
        formatted: formatUptime(uptime),
      },
      environment: process.env['NODE_ENV'] || 'development',
      version: process.env['npm_package_version'] || '1.0.0',
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
      },
      platform: {
        os: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
      },
      system: {
        cpuUsage: process.cpuUsage(),
        pid: process.pid,
        title: process.title,
      },
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Database health check (for future use)
 * GET /health/database
 */
export const databaseHealthCheck = asyncHandler(async (_req: Request, res: Response) => {
  // This would check database connectivity in a real application
  // For now, we'll return a mock response
  
  const response: ApiResponse = {
    success: true,
    message: 'Database health check',
    data: {
      status: 'healthy',
      connected: true,
      responseTime: '< 1ms',
      timestamp: new Date().toISOString(),
      note: 'Database integration not yet implemented',
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * API endpoints health check
 * GET /health/endpoints
 */
export const endpointsHealthCheck = asyncHandler(async (_req: Request, res: Response) => {
  const endpoints = [
    { path: '/health', method: 'GET', status: 'active' },
    { path: '/health/detailed', method: 'GET', status: 'active' },
    { path: '/api', method: 'GET', status: 'active' },
    { path: '/api/contact', method: 'POST', status: 'active' },
    { path: '/api/reviews', method: 'GET', status: 'active' },
    { path: '/api/services', method: 'GET', status: 'active' },
  ];

  const response: ApiResponse = {
    success: true,
    message: 'API endpoints health check',
    data: {
      totalEndpoints: endpoints.length,
      activeEndpoints: endpoints.filter(ep => ep.status === 'active').length,
      endpoints,
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * System metrics
 * GET /health/metrics
 */
export const systemMetrics = asyncHandler(async (_req: Request, res: Response) => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  const uptime = process.uptime();

  const response: ApiResponse = {
    success: true,
    message: 'System metrics',
    data: {
      uptime: {
        seconds: uptime,
        formatted: formatUptime(uptime),
      },
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
        arrayBuffers: memoryUsage.arrayBuffers,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Utility function to format uptime
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.join(' ') || '0s';
}
