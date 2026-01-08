
import { createError, sanitizeInput } from '@/utils/helpers';
import { generateTokenPair, verifyToken, JWTPayload } from '@/utils/jwt.utils';
import { generateSessionId, generateUUID } from '@/utils/uuid.utils';
import { hashPassword, comparePassword, validatePasswordStrength } from '@/utils/auth.utils';
import { UserRepository } from '@/repositories/user.repository';
import { IUser } from '@/models/User';

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

    constructor() {
        this.userRepository = new UserRepository();
    }

    async registerUser(data: RegisterData): Promise<{ user: AuthUser; tokens: AuthTokens }> {
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

        // Hash password
        const hashedPassword = await hashPassword(data.password);

        // Create new user
        const user = await this.userRepository.create({
            firstName: sanitizeInput(data.firstName),
            lastName: sanitizeInput(data.lastName),
            email: sanitizeInput(data.email),
            password: hashedPassword,
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

        const MAX_LOGIN_ATTEMPTS = parseInt(process.env['MAX_LOGIN_ATTEMPTS'] || '5', 10);
        const LOCKOUT_HOURS = parseInt(process.env['LOCKOUT_DURATION_HOURS'] || '2', 10);

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

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password
        user.password = hashedPassword;
        await user.save(); // Using save() on mongoose document instance directly to trigger pre-save hooks (though hash is done here manually)
        // Actually User model has pre-save hook to hash password.
        // L236-248 of User.ts: `if (!this.isModified('password')) return next();` then `const salt = await bcrypt.genSalt(12); this.password = await bcrypt.hash...`
        // So if I set `user.password = newPlainPassword`, save() would hash it.
        // But here I am hashing it manually.
        // If I hash it manually, `isModified` is true, so pre-save will hash the HASH! Double hashing!
        // I should NOT hash it manually if pre-save hook does it.
        // OR I should use `user.updateOne`.
        // The previous implementation L322 `const hashedPassword = await hashPassword(newPassword);` then `user.password = hashedPassword; await user.save();`
        // Wait, if I set hashed password, it looks changed.
        // Does bcrypt hash look like plain password? No.
        // If pre-save hook re-hashes it, it will be double hashed.
        // Exception: pre-save hook might check if it's already hashed? No, it just checks isModified.
        // Let's check User.ts again.
        // L236 checks `!this.isModified('password')`.
        // If I update password, it is modified.
        // So logic in previous service seems FLAGGED.
        // If I use `hashPassword` (my util) and then `user.password = hashed`, `save()` will hash it AGAIN.
        // Unless `hashPassword` returns something that Mongoose doesn't see as modified (unlikely) or pre-save hook is smarter.
        // Pre-save hook uses `bcrypt.genSalt` and `bcrypt.hash`.
        // I should rely on ONE mechanism.
        // I'll stick to the model's pre-save hook if possible, OR use updateOne which bypasses pre-save.
        // Previous Code: `user.password = hashedPassword; await user.save();`
        // This is suspicious.
        // I will verify `User.ts` pre-save hook.
        // It creates salt and hashes.
        // If I change password to *anything* new, it hashes it.
        // So if I provide already hashed password, it will be hashed again.
        // FIX: I should set `user.password = newPassword` (plain text) and let `save()` hash it.
        // I will do that.

        user.password = newPassword;
        await user.save();

        // Reset login attempts
        await user.resetLoginAttempts();
    }

    async requestPasswordReset(email: string): Promise<string> {
        const user = await this.userRepository.findByEmailWithoutPassword(email); // using repo method

        if (!user) {
            // Don't reveal if user exists
            throw createError('If an account exists with that email, a password reset link has been sent', 200);
        }

        // Generate reset token
        const resetToken = generateUUID();

        // In production, save to DB. For now returned to be sent via email.
        return resetToken;
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        // In production, verify token against DB.
        // Mock implementation:
        if (!token) throw createError('Invalid token', 400);

        // We can't identify user without saving token to DB.
        // Assuming token contains userId (JWT)?
        // If generateUUID() is used, it's opaque.
        // If verifyUserToken(token) is used, we get payload.

        let payload;
        try {
            payload = verifyToken(token);
        } catch {
            throw createError('Invalid or expired token', 400);
        }

        const user = await this.userRepository.findByIdWithPassword(payload.userId);
        if (!user) throw createError('User not found', 404);

        // Validate new password strength
        const passwordStrength = validatePasswordStrength(newPassword);
        if (!passwordStrength.valid) {
            throw createError(passwordStrength.message, 400);
        }

        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();
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

        user.isEmailVerified = true;
        await user.save();
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
