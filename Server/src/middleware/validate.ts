
import { Request, Response, NextFunction } from 'express';
import { createError } from '@/utils/helpers';

export interface ValidationRule {
    field: string;
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email';
    required?: boolean;
    min?: number;
    max?: number;
    message?: string;
    pattern?: RegExp;
}

export const validate = (rules: ValidationRule[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const errors: string[] = [];

        for (const rule of rules) {
            const value = req.body[rule.field];

            // Check required
            if (rule.required && (value === undefined || value === null || value === '')) {
                errors.push(rule.message || `${rule.field} is required`);
                continue;
            }

            // Skip validation if optional and missing
            if (value === undefined || value === null) {
                continue;
            }

            // Type checking
            if (rule.type) {
                if (rule.type === 'array') {
                    if (!Array.isArray(value)) {
                        errors.push(`${rule.field} must be an array`);
                    }
                } else if (rule.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        errors.push(`${rule.field} must be a valid email`);
                    }
                } else if (typeof value !== rule.type) {
                    errors.push(`${rule.field} must be a ${rule.type}`);
                }
            }

            // Min/Max length (string or array) or value (number)
            if (typeof value === 'string' || Array.isArray(value)) {
                if (rule.min !== undefined && value.length < rule.min) {
                    errors.push(`${rule.field} must have at least ${rule.min} characters/items`);
                }
                if (rule.max !== undefined && value.length > rule.max) {
                    errors.push(`${rule.field} cannot exceed ${rule.max} characters/items`);
                }
            } else if (typeof value === 'number') {
                if (rule.min !== undefined && value < rule.min) {
                    errors.push(`${rule.field} must be at least ${rule.min}`);
                }
                if (rule.max !== undefined && value > rule.max) {
                    errors.push(`${rule.field} cannot exceed ${rule.max}`);
                }
            }

            // Pattern check
            if (rule.pattern && typeof value === 'string') {
                if (!rule.pattern.test(value)) {
                    errors.push(rule.message || `${rule.field} is invalid format`);
                }
            }
        }

        if (errors.length > 0) {
            // 400 Bad Request
            next(createError(errors.join(', '), 400));
        } else {
            next();
        }
    };
};
