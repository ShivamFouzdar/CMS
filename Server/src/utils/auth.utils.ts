import bcrypt from 'bcryptjs';
import { createError } from './helpers';
import { generateUUID } from './uuid.utils';

/**
 * Authentication Utilities
 * Reusable functions for password hashing, verification, etc.
 */

/**
 * Hash password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = parseInt(process.env['BCRYPT_SALT_ROUNDS'] || '12');
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw createError('Failed to hash password', 500);
  }
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw createError('Failed to compare password', 500);
  }
};

/**
 * Generate secure random string
 */
export const generateSecureRandom = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const cryptoObj = (global as any).crypto;
  
  if (cryptoObj && cryptoObj.getRandomValues) {
    // Use Web Crypto API if available
    const randomValues = new Uint8Array(length);
    cryptoObj.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      const value = randomValues[i];
      if (value !== undefined) {
        result += chars[value % chars.length];
      }
    }
  } else {
    // Fallback to Math.random
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return result;
};

/**
 * Generate session ID
 */
export const generateSessionToken = (): string => {
  return generateSecureRandom(64);
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): { valid: boolean; message: string } => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (password.length < minLength) {
    return { valid: false, message: `Password must be at least ${minLength} characters long` };
  }

  if (!hasUppercase) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!hasLowercase) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!hasNumber) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  if (!hasSpecial) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }

  return { valid: true, message: 'Password is strong' };
};

/**
 * Generate password reset token
 */
export const generatePasswordResetToken = (): string => {
  return generateUUID();
};

/**
 * Generate email verification token
 */
export const generateEmailVerificationToken = (): string => {
  return generateUUID();
};

/**
 * Calculate password strength score
 */
export const calculatePasswordStrength = (password: string): number => {
  let score = 0;

  // Length score
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character variety score
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Complexity score
  if (password.length >= 10 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    score += 1;
  }

  return Math.min(score, 10);
};

/**
 * Mask email for display
 */
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;

  const maskedLocal = local.length > 2 
    ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
    : '*'.repeat(local.length);

  const domainFirstPart = domain.split('.')[0];
  const maskedDomain = domainFirstPart && domainFirstPart.length > 2
    ? domainFirstPart[0] + '*'.repeat(domainFirstPart.length - 2) + domainFirstPart[domainFirstPart.length - 1] + '.' + domain.split('.').slice(1).join('.')
    : '*' + '.' + domain.split('.').slice(1).join('.');

  return `${maskedLocal}@${maskedDomain}`;
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (expirationTime: number): boolean => {
  return Date.now() >= expirationTime * 1000;
};

/**
 * Generate random bytes
 */
export const generateRandomBytes = (length: number): Buffer => {
  const cryptoObj = (global as any).crypto;
  
  if (cryptoObj && cryptoObj.getRandomValues) {
    const randomValues = new Uint8Array(length);
    cryptoObj.getRandomValues(randomValues);
    return Buffer.from(randomValues);
  } else {
    // Fallback
    return Buffer.from(Array.from({ length }, () => Math.floor(Math.random() * 256)));
  }
};

