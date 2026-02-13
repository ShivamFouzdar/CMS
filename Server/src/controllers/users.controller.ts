import { Request, Response } from 'express';
import logger from '@/utils/logger.js';
import { asyncHandler, createError } from '@/utils/helpers.js';
import { sendSuccess } from '@/utils/response.utils.js';
import { UserService } from '@/services/user.service.js';
import { AuthService } from '@/services/auth.service.js';
import { AuthenticatedRequest } from '@/types/index.js';
import { auditService } from '@/services/audit.service.js';

/**
 * Users Controller
 * Handles user management and profile operations
 */

const userService = new UserService();
const authService = new AuthService();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and management
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user (admin/moderator/viewer)
 *     tags: [Users]
 *     responses:
 *       201:
 *         description: User registered successfully
 */
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, role } = req.body;

  const result = await authService.registerUser({
    firstName,
    lastName,
    email,
    password,
    role
  });

  return sendSuccess(res, 'User registered successfully', result, 201);
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Login successful
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });

  if (result.requires2FA) {
    return sendSuccess(res, '2FA verification required', {
      user: result.user,
      tempToken: result.tokens.accessToken,
      requires2FA: true
    });
  }

  return sendSuccess(res, 'Login successful', result);
});

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
export const logoutUser = asyncHandler(async (_req: Request, res: Response) => {
  await authService.logoutUser();
  return sendSuccess(res, 'Logged out successfully');
});

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user?.id;
  if (!userId) throw createError('User not authenticated', 401);

  const user = await userService.getUserById(userId);
  return sendSuccess(res, 'User profile retrieved successfully', user);
});

/**
 * @swagger
 * /api/users/me/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */
export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user?.id;
  if (!userId) throw createError('User not authenticated', 401);

  const user = await userService.updateProfile(userId, req.body);
  return sendSuccess(res, 'Profile updated successfully', user);
});

/**
 * @swagger
 * /api/users/me/preferences:
 *   put:
 *     summary: Update user preferences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Preferences updated
 */
export const updateUserPreferences = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user?.id;
  if (!userId) throw createError('User not authenticated', 401);

  const user = await userService.updatePreferences(userId, req.body);
  return sendSuccess(res, 'Preferences updated successfully', user);
});

/**
 * @swagger
 * /api/users/me/password:
 *   put:
 *     summary: Change password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password changed
 */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user?.id;
  if (!userId) throw createError('User not authenticated', 401);

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw createError('Current and new password are required', 400);
  }

  await authService.changePassword(userId, currentPassword, newPassword);

  await auditService.logAction(req, 'CHANGE_PASSWORD', 'User', userId);

  return sendSuccess(res, 'Password changed successfully');
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query['page'] as string || '1') || 1;
  const limit = parseInt(req.query['limit'] as string || '20') || 20;
  const { role, isActive } = req.query;

  const filters: any = {};
  if (role) filters.role = role as string;
  if (isActive !== undefined) filters.isActive = isActive === 'true';

  const result = await userService.getAllUsers(filters, page, limit);

  return sendSuccess(res, `Retrieved ${result.users.length} users`, result.users);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw createError('ID is required', 400);
  const user = await userService.getUserById(id);
  return sendSuccess(res, 'User retrieved successfully', user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User updated
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  logger.debug(`updateUser called for ID: ${id}, Body keys: ${Object.keys(req.body).join(', ')}`);
  if (!id) throw createError('ID is required', 400);
  const user = await userService.updateUser(id, req.body);

  await auditService.logAction(req, 'UPDATE', 'User', id, { updates: req.body });

  return sendSuccess(res, 'User updated successfully', user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw createError('ID is required', 400);
  await userService.deleteUser(id);

  await auditService.logAction(req, 'DELETE', 'User', id);

  return sendSuccess(res, 'User deleted successfully');
});

/**
 * @swagger
 * /api/users/{id}/activate:
 *   patch:
 *     summary: Activate user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User activated
 */
export const activateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw createError('ID is required', 400);
  const user = await userService.activateUser(id);

  await auditService.logAction(req, 'ACTIVATE', 'User', id);

  return sendSuccess(res, 'User activated successfully', user);
});

/**
 * @swagger
 * /api/users/{id}/deactivate:
 *   patch:
 *     summary: Deactivate user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deactivated
 */
export const deactivateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw createError('ID is required', 400);
  const user = await userService.deactivateUser(id);

  await auditService.logAction(req, 'DEACTIVATE', 'User', id);

  return sendSuccess(res, 'User deactivated successfully', user);
});

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Get user statistics (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats retrieved
 */
export const getUserStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await userService.getUserStats();
  return sendSuccess(res, 'User statistics retrieved successfully', stats);
});

