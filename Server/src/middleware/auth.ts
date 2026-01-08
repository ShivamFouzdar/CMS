
import { Request, Response, NextFunction } from 'express';
import { User } from '@/models';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '@/utils/jwt.utils';

/**
 * Authentication Middleware
 * Handles JWT token validation and user authentication
 */

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        permissions: string[];
        sessionId?: string;
      };
    }
  }
}

/**
 * Authenticate JWT token
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Access token required',
          code: 'MISSING_TOKEN'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Verify token
    const decoded = verifyToken(token) as JWTPayload;

    // Get user from database
    // Optimization: Select only necessary fields and use lean() if available/needed
    // We check isActive here which requires a DB call. To optimize further, consider caching.
    const user = await User.findById(decoded.userId).select('email role permissions isActive').exec();

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid or inactive user',
          code: 'INVALID_USER'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Add user to request
    req.user = {
      id: (user._id as any).toString(),
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      ...(decoded.sessionId && { sessionId: decoded.sessionId }),
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Authentication failed',
        code: 'AUTH_ERROR'
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Require specific role(s)
 */
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (req.user.role !== 'super_admin' && !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    next();
  };
};

/**
 * Require specific permission(s)
 */
export const requirePermission = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Super admin and admin users have all permissions
    if (req.user.role === 'super_admin' || req.user.role === 'admin') {
      return next();
    }

    // Check if user has required permissions
    const hasPermission = permissions.some(permission =>
      req.user!.permissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS'
        },
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyToken(token) as JWTPayload;
      const user = await User.findById(decoded.userId).select('email role permissions isActive').exec();

      if (user && user.isActive) {
        req.user = {
          id: (user._id as any).toString(),
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          ...(decoded.sessionId && { sessionId: decoded.sessionId }),
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Rate limiting middleware
 * Warning: Uses in-memory storage. Not suitable for horizontal scaling.
 */
// Use a shared cleanup interval to avoid O(N) scan on every request
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
let cleanupInterval: NodeJS.Timeout | null = null;

const startCleanup = () => {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
    if (rateLimitMap.size === 0 && cleanupInterval) {
      clearInterval(cleanupInterval);
      cleanupInterval = null;
    }
  }, 60000); // Cleanup every minute
};

export const rateLimit = (maxRequests: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientId = req.ip || (req.connection.remoteAddress) || 'unknown';
    const now = Date.now();

    const clientRequests = rateLimitMap.get(clientId);

    // If no record or expired, reset
    if (!clientRequests || clientRequests.resetTime < now) {
      rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
      startCleanup(); // Ensure cleanup is running
      return next();
    }

    if (clientRequests.count >= maxRequests) {
      res.status(429).json({
        success: false,
        error: {
          message: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    clientRequests.count++;
    next();
  };
};
