import { Request, Response } from 'express';
import { asyncHandler, createError } from '@/utils/helpers';
import { User } from '@/models';
import {
  setupTwoFactor,
  verifyToken,
  verifyBackupCode,
  hashBackupCodes,
} from '@/services/twoFactorService';
import { comparePassword } from '@/utils/auth.utils';
import { ApiResponse } from '@/types';
import { verifyToken as verifyJWT } from '@/utils/jwt.utils';
import { generateTokenPair } from '@/utils/jwt.utils';

/**
 * Enable 2FA - Generate secret and QR code
 */
export const enableTwoFactor = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    throw createError('User not authenticated', 401);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw createError('User not found', 404);
  }

  // Check if 2FA is already enabled
  if (user.twoFactor?.enabled) {
    throw createError('Two-factor authentication is already enabled', 400);
  }

  // Setup 2FA
  const setup = await setupTwoFactor(user.email, 'CareerMap Solutions');

  // Hash backup codes before storing
  const hashedBackupCodes = await hashBackupCodes(setup.backupCodes);

  // Store secret and backup codes (but don't enable yet - user needs to verify first)
  user.twoFactor = {
    enabled: false,
    secret: setup.secret, // Store plain secret temporarily (will be encrypted in production)
    backupCodes: hashedBackupCodes,
  };
  await user.save();

  const response: ApiResponse = {
    success: true,
    data: {
      secret: setup.secret,
      qrCode: setup.qrCode,
      backupCodes: setup.backupCodes, // Return plain codes for user to save
    },
    message: '2FA setup initiated. Please verify with a code from your authenticator app.',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Verify 2FA setup - Verify code and enable 2FA
 */
export const verifyTwoFactor = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { code } = req.body;

  if (!userId) {
    throw createError('User not authenticated', 401);
  }

  if (!code) {
    throw createError('Verification code is required', 400);
  }

  const user = await User.findById(userId).select('+twoFactor.secret');
  if (!user || !user.twoFactor?.secret) {
    throw createError('2FA setup not found. Please enable 2FA first.', 404);
  }

  // Verify the code
  const isValid = verifyToken(code, user.twoFactor.secret);

  if (!isValid) {
    throw createError('Invalid verification code', 400);
  }

  // Enable 2FA
  user.twoFactor.enabled = true;
  user.twoFactor.verifiedAt = new Date();
  await user.save();

  const response: ApiResponse = {
    success: true,
    message: 'Two-factor authentication enabled successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Disable 2FA
 */
export const disableTwoFactor = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { password } = req.body;

  if (!userId) {
    throw createError('User not authenticated', 401);
  }

  if (!password) {
    throw createError('Password is required to disable 2FA', 400);
  }

  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw createError('User not found', 404);
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw createError('Invalid password', 400);
  }

  // Disable 2FA - clear all 2FA data
  user.twoFactor.enabled = false;
  if (user.twoFactor.secret) {
    (user.twoFactor as any).secret = undefined;
  }
  user.twoFactor.backupCodes = [];
  if (user.twoFactor.verifiedAt) {
    (user.twoFactor as any).verifiedAt = undefined;
  }
  if (user.twoFactor.lastUsed) {
    (user.twoFactor as any).lastUsed = undefined;
  }
  await user.save();

  const response: ApiResponse = {
    success: true,
    message: 'Two-factor authentication disabled successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Verify 2FA code during login
 */
export const verifyTwoFactorLogin = asyncHandler(async (req: Request, res: Response) => {
  const { tempToken, code, backupCode } = req.body;

  if (!tempToken) {
    throw createError('Temporary token is required', 400);
  }

  if (!code && !backupCode) {
    throw createError('Verification code or backup code is required', 400);
  }

  // Verify temp token to get user info
  let decoded: any;
  try {
    decoded = verifyJWT(tempToken);
  } catch (error) {
    throw createError('Invalid or expired temporary token', 401);
  }

  const decodedUserId = decoded.userId;
  if (!decodedUserId) {
    throw createError('Invalid token', 401);
  }

  const user = await User.findById(decodedUserId).select('+twoFactor.secret +twoFactor.backupCodes');
  if (!user || !user.twoFactor?.enabled) {
    throw createError('2FA is not enabled for this account', 400);
  }

  let isValid = false;

  if (code) {
    // Verify TOTP code
    if (!user.twoFactor.secret) {
      throw createError('2FA secret not found', 500);
    }
    isValid = verifyToken(code, user.twoFactor.secret);
  } else if (backupCode) {
    // Verify backup code
    if (!user.twoFactor.backupCodes || user.twoFactor.backupCodes.length === 0) {
      throw createError('No backup codes available', 400);
    }
    isValid = await verifyBackupCode(backupCode, user.twoFactor.backupCodes);
    
    if (isValid) {
      // Remove used backup code
      if (user.twoFactor.backupCodes) {
        for (let i = 0; i < user.twoFactor.backupCodes.length; i++) {
          const hashedCode = user.twoFactor.backupCodes[i];
          if (hashedCode) {
            const isMatch = await verifyBackupCode(backupCode, [hashedCode]);
            if (isMatch) {
              user.twoFactor.backupCodes.splice(i, 1);
              break;
            }
          }
        }
      }
      await user.save();
    }
  }

  if (!isValid) {
    throw createError('Invalid verification code', 400);
  }

  // Update last used timestamp
  user.twoFactor.lastUsed = new Date();
  await user.save();

  // Generate full access tokens
  const { generateSessionId } = await import('@/utils/uuid.utils');
  const sessionId = generateSessionId();
  const userId = (user._id as any).toString();
  const tokens = generateTokenPair({
    userId: userId,
    email: user.email,
    role: user.role,
    sessionId,
  });

  const response: ApiResponse = {
    success: true,
    message: '2FA verification successful',
    data: {
      user: {
        id: userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        isEmailVerified: user.isEmailVerified,
      },
      tokens,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Regenerate backup codes
 */
export const regenerateBackupCodes = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { password } = req.body;

  if (!userId) {
    throw createError('User not authenticated', 401);
  }

  if (!password) {
    throw createError('Password is required', 400);
  }

  const user = await User.findById(userId).select('+password +twoFactor.secret');
  if (!user) {
    throw createError('User not found', 404);
  }

  if (!user.twoFactor?.enabled) {
    throw createError('2FA is not enabled', 400);
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw createError('Invalid password', 400);
  }

  // Generate new backup codes
  const { generateBackupCodes, hashBackupCodes } = await import('@/services/twoFactorService');
  const newBackupCodes = generateBackupCodes(10);
  const hashedBackupCodes = await hashBackupCodes(newBackupCodes);

  // Update user
  user.twoFactor.backupCodes = hashedBackupCodes;
  await user.save();

  const response: ApiResponse = {
    success: true,
    data: {
      backupCodes: newBackupCodes, // Return plain codes for user to save
    },
    message: 'Backup codes regenerated successfully. Old codes are no longer valid.',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

