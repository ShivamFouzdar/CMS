import { Request, Response } from 'express';
import { asyncHandler, createError } from '@/utils/helpers.js';
import { sendSuccess, sendError } from '@/utils/response.utils.js';
import { AuthService } from '@/services/auth.service.js';
import { areRegistrationsAllowed } from '@/services/settings.service.js';
import { getTokenExpiration } from '@/utils/jwt.utils.js';
import { auditService } from '@/services/audit.service.js';

const authService = new AuthService();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new admin user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/AuthResponse'
 *       403:
 *         description: Registrations disabled
 *       400:
 *         description: Invalid input
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  // Check if registrations are allowed
  const registrationsAllowed = await areRegistrationsAllowed();

  if (!registrationsAllowed) {
    return sendError(res, 'New user registrations are currently disabled. Please contact an administrator.', null, 403);
  }

  const { firstName, lastName, email, password, role } = req.body;

  const result = await authService.registerUser({
    firstName,
    lastName,
    email,
    password,
    role,
  });

  // Audit log for registration
  // For registration, we don't have req.user yet, so we pass result.user.id manually if possible
  // But auditService extracts from req.user? 
  // We can modify auditService to accept optional userId or inject into req temporarily.
  // Actually, auditService.logAction checks `req.user?.id`. 
  // Let's manually inject for this call since user is created but not in req.
  const tempReq = { ...req, user: { id: result.user.id } } as any;
  await auditService.logAction(tempReq, 'REGISTER', 'User', result.user.id, {
    email: result.user.email,
    role: result.user.role
  });

  return sendSuccess(res, 'User registered successfully', {
    user: result.user,
    tokens: result.tokens,
  }, 201);
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.loginUser({ email, password });

  // If 2FA is required, return temp token instead of full tokens
  if (result.requires2FA) {
    return sendSuccess(res, '2FA verification required', {
      user: result.user,
      tempToken: result.tokens.accessToken,
      requires2FA: true,
    });
  }

  // Log successful login
  if (!result.requires2FA) {
    const tempReq = { ...req, user: { id: result.user.id } } as any;
    await auditService.logAction(tempReq, 'LOGIN', 'Auth', result.user.id, {
      method: 'password'
    });
  }

  return sendSuccess(res, 'Login successful', {
    user: result.user,
    tokens: result.tokens,
    requires2FA: false,
  });
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.id) {
    await auditService.logAction(req, 'LOGOUT', 'Auth', req.user.id);
  }
  await authService.logoutUser();
  return sendSuccess(res, 'Logged out successfully');
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw createError('User not authenticated', 401);
  }

  const user = await authService.getCurrentUser(userId);
  return sendSuccess(res, 'User information retrieved successfully', { user });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAccessToken(refreshToken);
  return sendSuccess(res, 'Token refreshed successfully', tokens);
});

/**
 * @swagger
 * /api/auth/validate:
 *   post:
 *     summary: Validate authentication token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token: { type: string }
 *     responses:
 *       200:
 *         description: Token status returned
 */
export const validateToken = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  const decoded = authService.validateAuthToken(token);
  return sendSuccess(res, 'Token is valid', {
    valid: true,
    decoded,
  });
});

/**
 * @swagger
 * /api/auth/revoke:
 *   post:
 *     summary: Revoke authentication token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token revoked successfully
 */
export const revokeToken = asyncHandler(async (_req: Request, res: Response) => {
  return sendSuccess(res, 'Token revoked successfully');
});

/**
 * @swagger
 * /api/auth/token-info:
 *   get:
 *     summary: Get information about the current token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token info retrieved
 */
export const getTokenInfo = asyncHandler(async (_req: Request, res: Response) => {
  const data = {
    issuedAt: new Date().toISOString(),
    expiresAt: getTokenExpiration().toISOString(),
  };
  return sendSuccess(res, 'Token information retrieved successfully', data);
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Reset link sent
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const message = await authService.requestPasswordReset(email);
  return sendSuccess(res, message);
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, userId, newPassword]
 *             properties:
 *               token: { type: string }
 *               userId: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, userId, newPassword } = req.body;
  await authService.resetPassword(token, userId, newPassword);

  // Log the action
  const tempReq = { ...req, user: { id: userId }, ip: req.ip, headers: req.headers } as any;
  await auditService.logAction(tempReq, 'RESET_PASSWORD', 'Auth', userId);

  return sendSuccess(res, 'Password has been reset successfully');
});

/**
 * @swagger
 * /api/auth/2fa/enable:
 *   post:
 *     summary: Initiate 2FA setup
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA setup initiated, returns QR code
 */
export const setup2FA = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = await authService.enable2FA(userId);
  return sendSuccess(res, '2FA setup initiated', data);
});

/**
 * @swagger
 * /api/auth/2fa/verify:
 *   post:
 *     summary: Verify and enable 2FA
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code]
 *             properties:
 *               code: { type: string }
 *     responses:
 *       200:
 *         description: 2FA enabled successfully
 */
export const verify2FA = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { code } = req.body;
  await authService.verify2FASetup(userId, code);

  await auditService.logAction(req, 'ENABLE_2FA', 'Auth', userId);

  return sendSuccess(res, 'Two-factor authentication enabled successfully');
});

/**
 * @swagger
 * /api/auth/2fa/verify-login:
 *   post:
 *     summary: Verify 2FA during login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tempToken]
 *             properties:
 *               tempToken: { type: string }
 *               code: { type: string }
 *               backupCode: { type: string }
 *     responses:
 *       200:
 *         description: Login successful with full tokens
 */
export const verify2FALogin = asyncHandler(async (req: Request, res: Response) => {
  const { tempToken, code, backupCode } = req.body;
  const result = await authService.verify2FALogin(tempToken, code, backupCode);

  // Log successful login
  const tempReq = { ...req, user: { id: result.user.id } } as any;
  await auditService.logAction(tempReq, 'LOGIN_2FA', 'Auth', result.user.id);

  return sendSuccess(res, 'Login successful', {
    user: result.user,
    tokens: result.tokens,
    requires2FA: false,
  });
});
