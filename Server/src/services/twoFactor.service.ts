
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';
import { createError } from '@/utils/helpers';

export interface TwoFactorSetup {
    secret: string;
    qrCode: string;
    backupCodes: string[];
}

export class TwoFactorService {
    /**
     * Setup 2FA for a user
     */
    async setupTwoFactor(email: string, serviceName: string = 'CareerMap Solutions'): Promise<TwoFactorSetup> {
        const secret = this.generateSecret(email, serviceName);

        if (!secret.base32) {
            throw createError('Failed to generate 2FA secret', 500);
        }

        const qrCode = await this.generateQRCode(secret);
        const backupCodes = this.generateBackupCodes(10);

        return {
            secret: secret.base32,
            qrCode,
            backupCodes,
        };
    }

    generateSecret(email: string, serviceName: string): speakeasy.GeneratedSecret {
        return speakeasy.generateSecret({
            name: `${serviceName} (${email})`,
            issuer: serviceName,
            length: 32,
        });
    }

    async generateQRCode(secret: speakeasy.GeneratedSecret): Promise<string> {
        try {
            const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url || '');
            return qrCodeDataURL;
        } catch (error) {
            throw createError('Failed to generate QR code', 500);
        }
    }

    verifyToken(token: string, secret: string): boolean {
        try {
            const cleanToken = token.replace(/\s|-/g, '');
            return speakeasy.totp.verify({
                secret: secret,
                encoding: 'base32',
                token: cleanToken,
                window: 1,
            });
        } catch (error) {
            return false;
        }
    }

    generateBackupCodes(count: number = 10): string[] {
        const codes: string[] = [];
        for (let i = 0; i < count; i++) {
            const code = Math.random().toString(36).substring(2, 10).toUpperCase() +
                Math.random().toString(36).substring(2, 10).toUpperCase();
            codes.push(code.match(/.{1,4}/g)?.join('-') || code);
        }
        return codes;
    }

    async hashBackupCodes(codes: string[]): Promise<string[]> {
        return Promise.all(codes.map(async (code) => {
            const salt = await bcrypt.genSalt(10);
            return bcrypt.hash(code, salt);
        }));
    }

    async verifyBackupCode(code: string, hashedCodes: string[]): Promise<boolean> {
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
    }
}

export const twoFactorService = new TwoFactorService();

export const setupTwoFactor = twoFactorService.setupTwoFactor.bind(twoFactorService);
export const verifyToken = twoFactorService.verifyToken.bind(twoFactorService);
export const verifyBackupCode = twoFactorService.verifyBackupCode.bind(twoFactorService);
export const hashBackupCodes = twoFactorService.hashBackupCodes.bind(twoFactorService);
export const generateBackupCodes = twoFactorService.generateBackupCodes.bind(twoFactorService);
