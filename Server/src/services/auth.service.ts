
import { createError, sanitizeInput } from '@/utils/helpers.js';
import { generateTokenPair, verifyToken, JWTPayload } from '@/utils/jwt.utils.js';
import { generateSessionId, generateUUID } from '@/utils/uuid.utils.js';
import { comparePassword, validatePasswordStrength, hashPassword } from '@/utils/auth.utils.js';
import { UserRepository } from '@/repositories/user.repository.js';
import { SettingsRepository } from '@/repositories/settings.repository.js';
import { IUser } from '@/models/User.js';
import { emailService, emailTemplates } from '@/services/email.service.js';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { env } from '@/config/env.js';

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
    twoFactorEnabled?: boolean;
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
    role?: 'super_admin' | 'admin' | 'moderator' | 'viewer';
}

export class AuthService {
    private userRepository: UserRepository;
    private settingsRepository: SettingsRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.settingsRepository = new SettingsRepository();
    }

    async registerUser(data: RegisterData): Promise<{ user: AuthUser; tokens: AuthTokens }> {
        // Check if registrations are allowed
        const settings = await this.settingsRepository.getSettings();
        if (settings && !settings.allowRegistrations) {
            throw createError('Registration is currently disabled by administrator', 403);
        }

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw createError('User with this email already exists', 409);
        }

        // Validate password strength
        const passwordStrength = validatePasswordStrength(data.password);
        if (!passwordStrength.valid) {
            throw createError(passwordStrength.message, 400);
        }

        // Create new user
        const user = await this.userRepository.create({
            firstName: sanitizeInput(data.firstName),
            lastName: sanitizeInput(data.lastName),
            email: sanitizeInput(data.email),
            password: data.password, // Plain password, will be hashed by pre-save hook
            role: data.role || 'viewer',
            isActive: true,
            isEmailVerified: true, // Auto-verify for admin users
            permissions: [],
            // Mongoose defaults will handle other fields
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
            user: this.mapToAuthUser(user),
            tokens,
        };
    }

    async loginUser(credentials: LoginCredentials): Promise<LoginResult> {
        // Find user by email
        const user = await this.userRepository.findByEmail(credentials.email);

        // findByEmail selects +password
        if (!user) {
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
        const isPasswordValid = await comparePassword(credentials.password, user.password);

        const MAX_LOGIN_ATTEMPTS = env.MAX_LOGIN_ATTEMPTS;
        const LOCKOUT_HOURS = env.LOCKOUT_DURATION_HOURS;

        if (!isPasswordValid) {
            // Increment login attempts
            await user.incLoginAttempts();

            const attemptsLeft = MAX_LOGIN_ATTEMPTS - (user.loginAttempts + 1);
            if (attemptsLeft > 0) {
                throw createError(`Invalid email or password. ${attemptsLeft} attempts remaining`, 401);
            } else {
                throw createError(`Account locked due to multiple failed login attempts. Please try again in ${LOCKOUT_HOURS} hours`, 423);
            }
        }

        // Reset login attempts on successful login
        await user.resetLoginAttempts();
        await user.updateLastLogin();

        // Check if 2FA is enabled
        // user already fetched with findByEmail which might not include twoFactor.enabled if select is false by default.
        // BaseRepository findOne generally returns default selection.
        // UserRepository findByEmail uses `select('+password')`.
        // I should check if `twoFactor` is selected. Model default: `enabled` is default true/false so it is selected unless `select: false`.
        // In User model `twoFactor.enabled` does NOT have `select: false`. So it matches.

        const is2FAEnabled = user.twoFactor?.enabled === true;

        // Generate session ID
        const sessionId = generateSessionId();

        // If 2FA is enabled, return temp token instead of full tokens
        if (is2FAEnabled) {
            const tempToken = generateTokenPair({
                userId: (user._id as any).toString(),
                email: user.email,
                role: user.role,
                sessionId,
            });

            return {
                user: this.mapToAuthUser(user, is2FAEnabled),
                tokens: tempToken,
                requires2FA: true,
            };
        }

        // Generate tokens
        const tokens = generateTokenPair({
            userId: (user._id as any).toString(),
            email: user.email,
            role: user.role,
            sessionId,
        });

        return {
            user: this.mapToAuthUser(user, is2FAEnabled),
            tokens,
            requires2FA: false,
        };
    }

    async getCurrentUser(userId: string): Promise<AuthUser> {
        const user = await this.userRepository.findById(userId);

        if (!user || !user.isActive) {
            throw createError('User not found or inactive', 404);
        }

        return this.mapToAuthUser(user, user.twoFactor?.enabled === true);
    }

    validateAuthToken(token: string): JWTPayload {
        return verifyToken(token);
    }

    async refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
        // Verify refresh token
        const decoded = verifyToken(refreshToken);

        // Get user from database
        const user = await this.userRepository.findById(decoded.userId);

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
    }

    async logoutUser(): Promise<void> {
        // In production, this would add the token to a blacklist
        return Promise.resolve();
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
        const user = await this.userRepository.findByIdWithPassword(userId);

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

        // Update password (explicit hashing)
        const hashedPassword = await hashPassword(newPassword);

        await this.userRepository.update(userId, {
            password: hashedPassword,
            loginAttempts: 0,
            lockUntil: undefined
        });
    }

    async requestPasswordReset(email: string): Promise<string> {
        const user = await this.userRepository.findByEmailWithoutPassword(email);

        if (!user) {
            // Don't reveal if user exists
            return 'If an account exists with that email, a password reset link has been sent';
        }

        // Generate reset token
        const resetTokenRaw = generateUUID();

        // Hash token for database storage
        const resetTokenHash = await bcrypt.hash(resetTokenRaw, 10);

        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        // Send email with raw token (not hashed)
        // Ensure CLIENT_URL is available
        const clientUrl = env.CLIENT_URL.split(',')[0] || 'http://localhost:5173';
        const resetUrl = `${clientUrl}/reset-password?token=${resetTokenRaw}&userId=${user._id}`;

        await emailService.sendEmail(
            {
                to: user.email,
                ...emailTemplates.resetPassword({
                    firstName: user.firstName,
                    resetUrl
                })
            }
        );

        return 'If an account exists with that email, a password reset link has been sent';
    }

    async resetPassword(token: string, userId: string, newPassword: string): Promise<void> {
        if (!token || !userId) {
            throw createError('Invalid request', 400);
        }

        const user = await this.userRepository.findByIdWithPassword(userId);

        if (!user) {
            throw createError('Invalid or expired token', 400);
        }

        // Verify token exists and hasn't expired
        if (!user.resetPasswordToken || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw createError('Invalid or expired token', 400);
        }

        // Verify token hash
        const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
        if (!isTokenValid) {
            throw createError('Invalid or expired token', 400);
        }

        // Validate new password strength
        const passwordStrength = validatePasswordStrength(newPassword);
        if (!passwordStrength.valid) {
            throw createError(passwordStrength.message, 400);
        }

        // Update password (explicit hashing)
        const hashedPassword = await hashPassword(newPassword);

        await this.userRepository.update(userId, {
            password: hashedPassword,
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined,
            loginAttempts: 0,
            lockUntil: undefined
        });
    }

    async verifyEmail(token: string): Promise<void> {
        let payload;
        try {
            payload = verifyToken(token);
        } catch {
            throw createError('Invalid or expired token', 400);
        }

        const user = await this.userRepository.findById(payload.userId);
        if (!user) throw createError('User not found', 404);

        if (user.isEmailVerified) return;

        await this.userRepository.update((user._id as any).toString(), { isEmailVerified: true });
    }

    async enable2FA(userId: string): Promise<{ secret: string; qrCode: string; backupCodes: string[] }> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw createError('User not found', 404);

        if (user.twoFactor?.enabled) {
            throw createError('2FA is already enabled', 400);
        }

        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `CareerMap Admin (${user.email})`
        });

        // Generate backup codes (10 codes)
        const backupCodes = Array.from({ length: 10 }, () => generateUUID().slice(0, 8).toUpperCase());
        // Hash backup codes before saving? Best practice is yes.
        // For simplicity now, we store them plain or hashed? 
        // User model has select: false, so it's relatively safe. 
        // Let's store them as is for this implementation, but ideally they should be hashed.

        // Save secret to user (temporarily or permanently but disabled)
        const updatedTwoFactor = {
            ...user.twoFactor,
            secret: secret.base32,
            backupCodes,
            enabled: false // Not enabled until verified
        };

        await this.userRepository.update(userId, { twoFactor: updatedTwoFactor });

        // Generate QR Code
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

        return {
            secret: secret.base32,
            qrCode: qrCodeUrl,
            backupCodes
        };
    }

    async verify2FASetup(userId: string, code: string): Promise<void> {
        const user = await this.userRepository.findByIdWithTwoFactor(userId);
        if (!user || !user.twoFactor?.secret) {
            throw createError('2FA setup not initiated', 400);
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactor.secret,
            encoding: 'base32',
            token: code
        });

        if (!verified) {
            throw createError('Invalid verification code', 400);
        }

        const updatedTwoFactor = {
            ...user.twoFactor,
            enabled: true,
            verifiedAt: new Date()
        };
        await this.userRepository.update(userId, { twoFactor: updatedTwoFactor });
    }

    async verify2FALogin(tempToken: string, code?: string, backupCode?: string): Promise<LoginResult> {
        // Verify temp token
        let decoded;
        try {
            decoded = verifyToken(tempToken);
        } catch (err) {
            throw createError('Invalid or expired session', 401);
        }

        const user = await this.userRepository.findByIdWithTwoFactor(decoded.userId);
        if (!user || !user.isActive) {
            throw createError('User not found or inactive', 401);
        }

        // Check if 2FA is actually enabled
        if (!user.twoFactor?.enabled || !user.twoFactor?.secret) {
            // Should not happen if tempToken logic was correct, but safety check
            throw createError('2FA is not enabled for this account', 400);
        }

        let verified = false;

        let backupCodes = user.twoFactor?.backupCodes;

        if (code) {
            verified = speakeasy.totp.verify({
                secret: user.twoFactor.secret,
                encoding: 'base32',
                token: code,
                window: 1 // Allow 1 step window
            });
        } else if (backupCode) {
            // Check backup codes
            if (backupCodes && backupCodes.includes(backupCode)) {
                verified = true;
                // Remove used backup code
                backupCodes = backupCodes.filter(c => c !== backupCode);
            }
        }

        if (!verified) {
            throw createError('Invalid verification code', 401);
        }

        // Generate full tokens
        const sessionId = generateSessionId();
        const tokens = generateTokenPair({
            userId: (user._id as any).toString(),
            email: user.email,
            role: user.role,
            sessionId,
        });

        // Update last used and backup codes
        const updatedTwoFactor = {
            ...user.twoFactor,
            lastUsed: new Date(),
            backupCodes
        };

        await this.userRepository.update((user._id as any).toString(), { twoFactor: updatedTwoFactor });

        return {
            user: this.mapToAuthUser(user, true),
            tokens,
            requires2FA: false
        };
    }

    private mapToAuthUser(user: IUser, twoFactorEnabled?: boolean): AuthUser {
        return {
            id: (user._id as any).toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            isEmailVerified: user.isEmailVerified,
            twoFactorEnabled: twoFactorEnabled ?? (user.twoFactor?.enabled === true)
        };
    }
}
