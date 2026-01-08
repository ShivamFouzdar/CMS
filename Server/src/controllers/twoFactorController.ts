import { Request, Response } from 'express';
import { asyncHandler, createError } from '@/utils/helpers';
import { sendSuccess } from '@/utils/response.utils';
import { User } from '@/models';
import {
  setupTwoFactor,
  verifyToken,
  verifyBackupCode,
  hashBackupCodes,
  generateBackupCodes,
} from '@/services/twoFactor.service';
import { comparePassword } from '@/utils/auth.utils';
import { verifyToken as verifyJWT } from '@/utils/jwt.utils';
import { generateTokenPair } from '@/utils/jwt.utils';

/**
 * Two Factor Controller
 * Handles 2FA setup, verification, and management
 */

/**
 * @swagger
 * tags:
 *   name: TwoFactor
 *   description: Two-Factor Authentication Management
 */

/**
 * @swagger
 * /api/auth/2fa/enable:
 *   post:
 *     summary: Enable 2FA - Generate secret and QR code
 *     tags: [TwoFactor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA setup data generated
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

  if (!user.email) {
    throw createError('User email is required for 2FA setup', 400);
  }

  if (user.twoFactor?.enabled === true) {
    throw createError('Two-factor authentication is already enabled.', 400);
  }

  try {
    const setup = await setupTwoFactor(user.email, 'CareerMap Solutions');

    if (!setup.secret || !setup.qrCode) {
      throw createError('Failed to generate 2FA setup data', 500);
    }

    const hashedBackupCodes = await hashBackupCodes(setup.backupCodes);

    if (!user.twoFactor) {
      user.twoFactor = {
        enabled: false,
        secret: setup.secret,
        backupCodes: hashedBackupCodes,
      };
    } else {
      user.twoFactor.enabled = false;
      user.twoFactor.secret = setup.secret;
      user.twoFactor.backupCodes = hashedBackupCodes;
      if (user.twoFactor.verifiedAt) {
        (user.twoFactor as any).verifiedAt = undefined;
      }
    }

    await user.save();

    return sendSuccess(res, '2FA setup initiated. Please verify with a code from your authenticator app.', {
      secret: setup.secret,
      qrCode: setup.qrCode,
      backupCodes: setup.backupCodes,
    });
  } catch (error) {
    console.error('Error in enableTwoFactor:', error);
    throw createError(error instanceof Error ? error.message : 'Failed to enable 2FA', 500);
  }
});

/**
 * @swagger
 * /api/auth/2fa/verify:
 *   post:
 *     summary: Verify 2FA setup - Verify code and enable 2FA
 *     tags: [TwoFactor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA enabled successfully
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

  const isValid = verifyToken(code, user.twoFactor.secret);

  if (!isValid) {
    throw createError('Invalid verification code', 400);
  }

  user.twoFactor.enabled = true;
  user.twoFactor.verifiedAt = new Date();
  await user.save();

  return sendSuccess(res, 'Two-factor authentication enabled successfully');
});

/**
 * @swagger
 * /api/auth/2fa/disable:
 *   post:
 *     summary: Disable 2FA
 *     tags: [TwoFactor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA disabled successfully
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

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw createError('Invalid password', 400);
  }

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

  return sendSuccess(res, 'Two-factor authentication disabled successfully');
});

/**
 * @swagger
 * /api/auth/2fa/login-verify:
 *   post:
 *     summary: Verify 2FA code during login
 *     tags: [TwoFactor]
 *     responses:
 *       200:
 *         description: 2FA verification successful
 */
export const verifyTwoFactorLogin = asyncHandler(async (req: Request, res: Response) => {
  const { tempToken, code, backupCode } = req.body;

  if (!tempToken) {
    throw createError('Temporary token is required', 400);
  }

  if (!code && !backupCode) {
    throw createError('Verification code or backup code is required', 400);
  }

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
    if (!user.twoFactor.secret) {
      throw createError('2FA secret not found', 500);
    }
    isValid = verifyToken(code, user.twoFactor.secret);
  } else if (backupCode) {
    if (!user.twoFactor.backupCodes || user.twoFactor.backupCodes.length === 0) {
      throw createError('No backup codes available', 400);
    }
    isValid = await verifyBackupCode(backupCode, user.twoFactor.backupCodes);

    if (isValid) {
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

  user.twoFactor.lastUsed = new Date();
  await user.save();

  const { generateSessionId } = await import('@/utils/uuid.utils');
  const sessionId = generateSessionId();
  const userId = (user._id as any).toString();
  const tokens = generateTokenPair({
    userId: userId,
    email: user.email!,
    role: user.role,
    sessionId,
  });

  return sendSuccess(res, '2FA verification successful', {
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
  });
});

/**
 * @swagger
 * /api/auth/2fa/backup-codes/regenerate:
 *   post:
 *     summary: Regenerate backup codes
 *     tags: [TwoFactor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Backup codes regenerated
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

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw createError('Invalid password', 400);
  }

  const newBackupCodes = generateBackupCodes(10);
  const hashedBackupCodes = await hashBackupCodes(newBackupCodes);

  user.twoFactor.backupCodes = hashedBackupCodes;
  await user.save();

  return sendSuccess(res, 'Backup codes regenerated successfully. Old codes are no longer valid.', {
    backupCodes: newBackupCodes,
  });
});
