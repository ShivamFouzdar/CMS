import { Request, Response, NextFunction } from 'express';

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

  // silence error logs to keep terminal minimal

  res.status(statusCode).json({
    success: false,
    error: {
      message: process.env['NODE_ENV'] === 'production' 
        ? 'Something went wrong!' 
        : message,
      ...(process.env['NODE_ENV'] === 'development' && { stack: error.stack }),
    },
  });
};
