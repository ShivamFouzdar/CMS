import { Response } from 'express';
import { env } from '@/config/env.js';

/**
 * Standard API Response Interface
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T | undefined;
    error?: any | undefined;
    timestamp: string;
    meta?: any;
}

/**
 * Handle success responses
 * @param res Express Response object
 * @param message Success message
 * @param data Optional data to return
 * @param statusCode HTTP status code (default 200)
 */
export const sendSuccess = <T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200,
    meta?: any
): Response => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data,
        meta,
        timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
};

/**
 * Handle error responses
 * @param res Express Response object
 * @param message Error message
 * @param error Optional error details
 * @param statusCode HTTP status code (default 500)
 */
export const sendError = (
    res: Response,
    message: string,
    error?: any,
    statusCode: number = 500
): Response => {
    const response: ApiResponse = {
        success: false,
        message,
        error: env.NODE_ENV === 'development' ? error : undefined,
        timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
};

export default {
    sendSuccess,
    sendError,
};
