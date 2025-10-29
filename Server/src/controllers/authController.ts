import { Request, Response } from 'express';
import { asyncHandler, createError } from '@/utils/helpers';
import { ApiResponse } from '@/types';
import * as authService from '@/services/authService';

/**
 * Auth Controller
 * Handles HTTP requests for authentication
 */

/**
 * Register new admin user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, role } = req.body;

  const result = await authService.registerUser({
    firstName,
    lastName,
    email,
    password,
    role,
  });

  const response: ApiResponse = {
    success: true,
    data: {
      user: result.user,
      tokens: result.tokens,
    },
    message: 'User registered successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(201).json(response);
});

/**
 * Login admin user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.loginUser({ email, password });

  const response: ApiResponse = {
    success: true,
    data: {
      user: result.user,
      tokens: result.tokens,
    },
    message: 'Login successful',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Logout admin user
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // In production, this would add the token to a blacklist
  const response: ApiResponse = {
    success: true,
    message: 'Logged out successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get current user
 * GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  if (!userId) {
    throw createError('User not authenticated', 401);
  }

  const user = await authService.getCurrentUser(userId);

  const response: ApiResponse = {
    success: true,
    data: {
      user: {
        ...user,
        profile: (req as any).user?.profile,
        preferences: (req as any).user?.preferences,
      },
    },
    message: 'User information retrieved successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Refresh token
 * POST /api/auth/refresh
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw createError('Refresh token is required', 400);
  }

  // In production, this would validate the refresh token and issue a new access token
  const response: ApiResponse = {
    success: true,
    data: {
      accessToken: 'new_jwt_token_placeholder',
      refreshToken: 'new_refresh_token_placeholder',
    },
    message: 'Token refreshed successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Validate token
 * POST /api/auth/validate
 */
export const validateToken = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw createError('Token is required', 400);
  }

  const decoded = authService.validateAuthToken(token);

  const response: ApiResponse = {
    success: true,
    data: {
      valid: true,
      decoded,
    },
    message: 'Token is valid',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Revoke token
 * POST /api/auth/revoke
 */
export const revokeToken = asyncHandler(async (_req: Request, res: Response) => {
  // In production, this would add the token to a blacklist
  const response: ApiResponse = {
    success: true,
    message: 'Token revoked successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

/**
 * Get token info
 * GET /api/auth/token-info
 */
export const getTokenInfo = asyncHandler(async (_req: Request, res: Response) => {
  // In production, this would decode the JWT token and return user info
  const response: ApiResponse = {
    success: true,
    data: {
      user: {
        id: 'user_123',
        email: 'admin@example.com',
        role: 'admin',
      },
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    message: 'Token information retrieved successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});
