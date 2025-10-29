import jwt from 'jsonwebtoken';
import { createError } from './helpers';

/**
 * JWT Utilities
 * Reusable functions for JWT token generation and validation
 */

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  sessionId?: string;
  iat?: number;
  exp?: number;
}

/**
 * JWT Configuration
 */
export class JWTConfig {
  private static secret: string;
  private static expiresIn: string;
  private static refreshExpiresIn: string;

  static initialize() {
    this.secret = process.env['JWT_SECRET'] || 'your-secret-key-change-in-production';
    this.expiresIn = process.env['JWT_EXPIRES_IN'] || '7d';
    this.refreshExpiresIn = process.env['JWT_REFRESH_EXPIRES_IN'] || '30d';
  }

  static getSecret(): string {
    if (!this.secret) this.initialize();
    return this.secret;
  }

  static getExpiresIn(): string {
    if (!this.expiresIn) this.initialize();
    return this.expiresIn;
  }

  static getRefreshExpiresIn(): string {
    if (!this.refreshExpiresIn) this.initialize();
    return this.refreshExpiresIn;
  }
}

// Initialize on load
JWTConfig.initialize();

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  try {
    const expiresIn = JWTConfig.getExpiresIn();
    const token = jwt.sign(payload, JWTConfig.getSecret(), { expiresIn } as any);
    return token;
  } catch (error) {
    throw createError('Failed to generate token', 500);
  }
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  try {
    const expiresIn = JWTConfig.getRefreshExpiresIn();
    const token = jwt.sign(payload, JWTConfig.getSecret(), { expiresIn } as any);
    return token;
  } catch (error) {
    throw createError('Failed to generate refresh token', 500);
  }
};

/**
 * Generate token pair (access + refresh)
 */
export const generateTokenPair = (payload: Omit<JWTPayload, 'iat' | 'exp'>): { accessToken: string; refreshToken: string; expiresIn: string } => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: JWTConfig.getExpiresIn(),
  };
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWTConfig.getSecret()) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw createError('Token expired', 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError('Invalid token', 401);
    }
    throw createError('Token verification failed', 500);
  }
};

/**
 * Decode token without verification (for logging/debugging)
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1] || null;
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (): Date => {
  const expiresIn = JWTConfig.getExpiresIn();
  const milliseconds = parseExpiresIn(expiresIn);
  return new Date(Date.now() + milliseconds);
};

/**
 * Parse expiresIn string to milliseconds
 */
const parseExpiresIn = (expiresIn: string): number => {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // Default 7 days

  const value = parseInt(match[1]!);
  const unit = match[2]!;

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * (multipliers[unit] ?? 1);
};

