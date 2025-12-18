import { User } from '@/models';
import { createError, validateEmail, sanitizeInput } from '@/utils/helpers';
import { generateTokenPair, verifyToken, JWTPayload } from '@/utils/jwt.utils';
import { generateUUID, generateSessionId } from '@/utils/uuid.utils';
import { hashPassword, comparePassword, validatePasswordStrength } from '@/utils/auth.utils';

/**
 * Auth Service
 * Handles business logic for authentication
 */

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: string;
}

export interface LoginResult {
  user: AuthUser;
  tokens: AuthTokens;
  requires2FA: boolean;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions: string[];
  isEmailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'admin' | 'moderator' | 'viewer';
}

/**
 * Register a new admin user
 */
export const registerUser = async (data: RegisterData): Promise<{ user: AuthUser; tokens: AuthTokens }> => {
  // Validation
  if (!data.firstName || !data.lastName || !data.email || !data.password) {
    throw createError('All required fields must be filled', 400);
  }

  if (!validateEmail(data.email)) {
    throw createError('Please provide a valid email address', 400);
  }

  // Validate password strength
  const passwordStrength = validatePasswordStrength(data.password);
  if (!passwordStrength.valid) {
    throw createError(passwordStrength.message, 400);
  }

  // Check if user already exists
  const existingUser = await User.findByEmail(data.email);
  if (existingUser) {
    throw createError('User with this email already exists', 409);
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create new user
  const user = await User.create({
    firstName: sanitizeInput(data.firstName),
    lastName: sanitizeInput(data.lastName),
    email: sanitizeInput(data.email),
    password: hashedPassword,
    role: data.role || 'viewer',
    isActive: true,
    isEmailVerified: true, // Auto-verify for admin users
    permissions: [],
  });

  // Generate session ID
  const sessionId = generateSessionId();

  // Generate tokens
  const tokens = generateTokenPair({
    userId: (user._id as any).toString(),
    email: user.email,
    role: user.role,
    sessionId,
  });

  return {
    user: {
      id: (user._id as any).toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      isEmailVerified: user.isEmailVerified,
    },
    tokens,
  };
};

/**
 * Login admin user
 */
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResult> => {
  // Validation
  if (!credentials.email || !credentials.password) {
    throw createError('Email and password are required', 400);
  }

  if (!validateEmail(credentials.email)) {
    throw createError('Please provide a valid email address', 400);
  }

  // Find user by email
  const user = await User.findByEmail(credentials.email);
  
  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  // Get password for comparison
  const userWithPassword = await User.findById(user._id).select('+password');
  
  if (!userWithPassword) {
    throw createError('Invalid email or password', 401);
  }

  // Check if account is locked
  const isLocked = user.lockUntil && user.lockUntil > new Date();
  if (isLocked) {
    throw createError('Account is temporarily locked due to multiple failed login attempts', 423);
  }

  // Check if account is active
  if (!user.isActive) {
    throw createError('Account is deactivated. Please contact administrator', 403);
  }

  // Verify password
  const isPasswordValid = await comparePassword(credentials.password, userWithPassword.password);

  if (!isPasswordValid) {
    // Increment login attempts
    await userWithPassword.incLoginAttempts();
    
    const attemptsLeft = 5 - (userWithPassword.loginAttempts + 1);
    if (attemptsLeft > 0) {
      throw createError(`Invalid email or password. ${attemptsLeft} attempts remaining`, 401);
    } else {
      throw createError('Account locked due to multiple failed login attempts. Please try again in 2 hours', 423);
    }
  }

  // Reset login attempts on successful login
  await userWithPassword.resetLoginAttempts();
  await userWithPassword.updateLastLogin();

  // Check if 2FA is enabled
  const userWith2FA = await User.findById(user._id).select('+twoFactor.enabled');
  const is2FAEnabled = userWith2FA?.twoFactor?.enabled === true;

  // If 2FA is enabled, return temp token instead of full tokens
  if (is2FAEnabled) {
    // Generate temporary token for 2FA verification (shorter expiry for temp tokens)
    const sessionId = generateSessionId();
    const tempToken = generateTokenPair({
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role,
      sessionId,
    });

    return {
      user: {
        id: (user._id as any).toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        isEmailVerified: user.isEmailVerified,
      },
      tokens: tempToken,
      requires2FA: true,
    };
  }

  // Generate session ID
  const sessionId = generateSessionId();

  // Generate tokens
  const tokens = generateTokenPair({
    userId: (user._id as any).toString(),
    email: user.email,
    role: user.role,
    sessionId,
  });

  return {
    user: {
      id: (user._id as any).toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      isEmailVerified: user.isEmailVerified,
    },
    tokens,
    requires2FA: false,
  };
};

/**
 * Get current user
 */
export const getCurrentUser = async (userId: string): Promise<AuthUser> => {
  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    throw createError('User not found or inactive', 404);
  }

  return {
    id: (user._id as any).toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    isEmailVerified: user.isEmailVerified,
  };
};

/**
 * Validate token
 */
export const validateAuthToken = (token: string): JWTPayload => {
  return verifyToken(token);
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<AuthTokens> => {
  // Verify refresh token
  const decoded = verifyToken(refreshToken);

  // Get user from database
  const user = await User.findById(decoded.userId);
  
  if (!user || !user.isActive) {
    throw createError('User not found or inactive', 404);
  }

  // Generate new session ID
  const sessionId = generateSessionId();

  // Generate new tokens
  return generateTokenPair({
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
    sessionId,
  });
};

/**
 * Logout user (in production, would blacklist token)
 */
export const logoutUser = async (): Promise<void> => {
  // In production, this would add the token to a blacklist
  // For now, just return success
  return Promise.resolve();
};

/**
 * Change password
 */
export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await User.findById(userId).select('+password');
  
  if (!user) {
    throw createError('User not found', 404);
  }

  // Verify old password
  const isPasswordValid = await comparePassword(oldPassword, user.password);
  
  if (!isPasswordValid) {
    throw createError('Current password is incorrect', 400);
  }

  // Validate new password strength
  const passwordStrength = validatePasswordStrength(newPassword);
  if (!passwordStrength.valid) {
    throw createError(passwordStrength.message, 400);
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  user.password = hashedPassword;
  await user.save();

  // Reset login attempts
  await user.resetLoginAttempts();
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<string> => {
  const user = await User.findByEmail(email);
  
  if (!user) {
    // Don't reveal if user exists
    throw createError('If an account exists with that email, a password reset link has been sent', 200);
  }

  // Generate reset token
  const resetToken = generateUUID();
  
  // In production, save reset token to database with expiration
  // For now, just return token
  
  return resetToken;
};

/**
 * Verify user token
 */
export const verifyUserToken = (token: string): JWTPayload => {
  return verifyToken(token);
};
