import { CorsOptions } from 'cors';

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5005',
];

const envOrigins = (process.env['ALLOWED_ORIGINS'] || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const clientUrl = process.env['CLIENT_URL'] || '';

const allowedOrigins = Array.from(new Set([
  ...defaultAllowedOrigins,
  ...envOrigins,
  clientUrl,
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
