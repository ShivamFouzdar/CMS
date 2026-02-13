import { CorsOptions } from 'cors';
import { env } from '@/config/env.js';

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5173',
  'http://localhost:8000',
  'http://localhost:8001',
  'https://0dt1r7wk-8001.inc1.devtunnels.ms/',
];

const productionOrigins = [
  'https://careermapsolution.com',
  'https://www.careermapsolution.com',
];

const envOrigins = env.CLIENT_URL.split(',').map(o => o.trim()).filter(Boolean);

const allowedOrigins = Array.from(new Set([
  ...defaultAllowedOrigins,
  ...(env.NODE_ENV === 'production' ? productionOrigins : []),
  ...envOrigins,
])).filter(Boolean);

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204,
};
