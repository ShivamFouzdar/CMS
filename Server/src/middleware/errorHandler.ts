import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/logger.js';
import { env } from '@/config/env.js';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const { statusCode = 500, message } = error;

  // Handle Mongoose Validation Errors
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: {
        message: 'Validation Error',
        details: Object.values((error as any).errors || {}).map((err: any) => err.message),
      },
    });
    return;
  }

  // Handle Mongoose Duplicate Key Errors
  if ((error as any).code === 11000) {
    res.status(409).json({
      success: false,
      error: { message: 'Duplicate field value entered' },
    });
    return;
  }

  // Logger
  logger.error(error);

  res.status(statusCode).json({
    success: false,
    error: {
      message: env.NODE_ENV === 'production'
        ? 'Something went wrong!'
        : message,
      ...(env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  });
};
