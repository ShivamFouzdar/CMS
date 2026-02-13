import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import { env } from '@/config/env.js';

const logDirectory = path.join(process.cwd(), 'logs');

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }), // Log the full stack
    winston.format.json()
);

// Define transports
const transports = [
    // Console transport for development
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, stack }) => {
                return `${timestamp} [${level}]: ${stack || message}`;
            })
        ),
    }),

    // Daily Rotate File for errors
    new DailyRotateFile({
        filename: path.join(logDirectory, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: logFormat,
    }),

    // Daily Rotate File for all logs (combined)
    new DailyRotateFile({
        filename: path.join(logDirectory, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: logFormat,
    }),
];

const logger = winston.createLogger({
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: logFormat,
    transports,
});

// Stream for Morgan
export const stream = {
    write: (message: string) => {
        logger.http(message.trim());
    },
};

export default logger;
