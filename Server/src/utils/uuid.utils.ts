import { v4 as uuidv4, v1 as uuidv1, validate as validateUUID } from 'uuid';

/**
 * UUID Utilities
 * Reusable functions for UUID generation and validation
 */

/**
 * Generate UUID v4 (random)
 */
export const generateUUID = (): string => {
  return uuidv4();
};

/**
 * Generate UUID v1 (time-based)
 */
export const generateTimeBasedUUID = (): string => {
  return uuidv1();
};

/**
 * Validate UUID format
 */
export const isValidUUID = (uuid: string): boolean => {
  return validateUUID(uuid);
};

/**
 * Generate short ID (8 characters)
 * Useful for shorter identifiers in URLs
 */
export const generateShortId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Generate nano ID (10 characters)
 * For session IDs, temporary tokens, etc.
 */
export const generateNanoId = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate session ID
 */
export const generateSessionId = (): string => {
  return `sess_${generateUUID()}`;
};

/**
 * Generate API key
 */
export const generateApiKey = (prefix: string = 'cms'): string => {
  return `${prefix}_${generateUUID().replace(/-/g, '')}`;
};

/**
 * Generate token ID (for refresh tokens, etc.)
 */
export const generateTokenId = (): string => {
  return `tok_${generateUUID()}`;
};

/**
 * Generate user-friendly ID (removes hyphens)
 */
export const generateFriendlyId = (): string => {
  return uuidv4().replace(/-/g, '').toUpperCase();
};

