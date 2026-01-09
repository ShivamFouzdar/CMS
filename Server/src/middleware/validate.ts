import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

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
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: error.issues.map((e: any) => ({
                    path: e.path.join('.'),
                    message: e.message,
                })),
            });
            return;
        }
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        return;
    }
};
