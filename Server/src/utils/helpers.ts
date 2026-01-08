import { Request, Response, NextFunction } from 'express';
import { AsyncHandler } from '@/types';

export const asyncHandler = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const createError = (message: string, statusCode: number = 500) => {
  const error: any = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  // Remove script tags and html entity encode special chars
  return input
    .trim()
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0] || '';
};

export const formatDateTime = (date: Date): string => {
  return date.toISOString();
};
