import { Request, Response, NextFunction } from 'express';
import { getSystemSettings } from '@/services/settings.service';

/**
 * Maintenance Mode Middleware
 * Blocks all requests except admin routes when maintenance mode is enabled
 */
export const checkMaintenanceMode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getSystemSettings();

    if (!settings.maintenanceMode) {
      // Maintenance mode is off, proceed normally
      return next();
    }

    // Maintenance mode is on
    // Allow access to admin routes and health checks
    const isAdminRoute = req.path.startsWith('/api/admin') ||
      req.path.startsWith('/admin') ||
      req.path.startsWith('/health') ||
      req.path.startsWith('/api/auth/login');

    if (isAdminRoute) {
      // Admins can still access
      return next();
    }

    // Block all other requests
    res.status(503).json({
      success: false,
      message: 'The website is currently under maintenance. Please check back later.',
      maintenance: true,
      contact: {
        email: settings.contactEmail,
        phone: settings.contactPhone,
        siteName: settings.siteName
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    // On error, allow request to proceed (fail open)
    next();
  }
};

