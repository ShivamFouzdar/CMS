import { Request, Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  message?: string;
  timestamp: string;
  meta?: any;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export type AsyncHandler = (
  req: Request,
  res: Response,
  next: any
) => Promise<void>;

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  status?: string;
  notes?: string;
  updatedAt?: string;
}

export interface ServiceData {
  id: string;
  name: string;
  description: string;
  features: string[];
  benefits: string[];
  pricing?: {
    basic: number;
    premium: number;
    enterprise: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewData {
  id: string;
  name: string;
  email: string;
  rating: number;
  title: string;
  content: string;
  service?: string;
  isVerified: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
