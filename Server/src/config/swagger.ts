import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CareerMap Solutions API Documentation',
            version,
            description: 'Comprehensive API documentation for the CareerMap Solutions CMS Backend. Includes Authentication, User Management, Service Offerings, and Contact leads.',
            contact: {
                name: 'API Support',
                url: 'https://careermapsolutions.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Whether the request was successful' },
                        message: { type: 'string', description: 'Success or error message' },
                        data: { type: 'object', description: 'Optional response data' },
                        error: { type: 'object', description: 'Optional error details (dev mode only)' },
                        timestamp: { type: 'string', format: 'date-time', description: 'ISO timestamp of the response' },
                    },
                },
                Tokens: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        user: { $ref: '#/components/schemas/User' },
                        tokens: { $ref: '#/components/schemas/Tokens' },
                        requires2FA: { type: 'boolean' },
                    },
                },
                PaginatedResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: {
                            type: 'array',
                            items: { type: 'object' },
                        },
                        pagination: {
                            type: 'object',
                            properties: {
                                total: { type: 'integer' },
                                page: { type: 'integer' },
                                limit: { type: 'integer' },
                                pages: { type: 'integer' },
                            },
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/models/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
