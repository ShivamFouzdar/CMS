import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '@/utils/response.utils.js';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            sendError(res, 'Validation failed', error.issues.map((e: any) => ({
                path: e.path.join('.'),
                message: e.message,
            })), 400);
            return;
        }
        sendError(res, 'Internal Server Error', null, 500);
        return;
    }
};
