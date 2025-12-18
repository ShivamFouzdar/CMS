import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';
import { createError } from '@/utils/helpers';

/**
 * Two-Factor Authentication Service
 * Handles TOTP (Time-based One-Time Password) generation and verification
 */

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

/**
 * Generate a new 2FA secret for a user
 */
export const generateSecret = (email: string, serviceName: string = 'CareerMap Solutions'): speakeasy.GeneratedSecret => {
  return speakeasy.generateSecret({
    name: `${serviceName} (${email})`,
    issuer: serviceName,
    length: 32,
  });
};

/**
 * Generate QR code data URL from secret
 */
export const generateQRCode = async (secret: speakeasy.GeneratedSecret): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url || '');
    return qrCodeDataURL;
  } catch (error) {
    throw createError('Failed to generate QR code', 500);
  }
};

/**
 * Verify TOTP token
 */
export const verifyToken = (token: string, secret: string): boolean => {
  try {
    // Remove any spaces or dashes from token
    const cleanToken = token.replace(/\s|-/g, '');
    
    // Verify token with a window of 1 (current and previous time step)
    // This accounts for clock drift
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: cleanToken,
      window: 1, // Accept tokens from current and previous 30-second window
    });
  } catch (error) {
    return false;
  }
};

/**
 * Generate backup codes
 * Returns array of plain text codes that should be hashed before storage
 */
export const generateBackupCodes = (count: number = 10): string[] => {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase() + 
                 Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code.match(/.{1,4}/g)?.join('-') || code); // Format as XXXX-XXXX
  }
  return codes;
};

/**
 * Hash backup codes for storage
 */
export const hashBackupCodes = async (codes: string[]): Promise<string[]> => {
  return Promise.all(codes.map(async (code) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(code, salt);
  }));
};

/**
 * Verify backup code
 */
export const verifyBackupCode = async (code: string, hashedCodes: string[]): Promise<boolean> => {
  // Remove dashes from code
  const cleanCode = code.replace(/-/g, '').toUpperCase();
  
  for (const hashedCode of hashedCodes) {
    try {
      const isValid = await bcrypt.compare(cleanCode, hashedCode);
      if (isValid) {
        return true;
      }
    } catch (error) {
      continue;
    }
  }
  return false;
};

/**
 * Setup 2FA for a user
 * Returns secret, QR code, and backup codes
 */
export const setupTwoFactor = async (
  email: string,
  serviceName: string = 'CareerMap Solutions'
): Promise<TwoFactorSetup> => {
  // Generate secret
  const secret = generateSecret(email, serviceName);
  
  if (!secret.base32) {
    throw createError('Failed to generate 2FA secret', 500);
  }

  // Generate QR code
  const qrCode = await generateQRCode(secret);

  // Generate backup codes
  const backupCodes = generateBackupCodes(10);

  return {
    secret: secret.base32,
    qrCode,
    backupCodes,
  };
};


