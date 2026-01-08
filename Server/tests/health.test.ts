import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Server Health Check', () => {
    it('should return 200 OK', async () => {
        // The health route is mounted at /health
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        // Expecting a JSON response usually
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toBe(true);
    });

    it('should handle 404 for unknown routes', async () => {
        const res = await request(app).get('/api/unknown/route/123');
        expect(res.status).toBe(404);
    });
});
