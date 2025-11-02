import { describe, test, expect } from 'bun:test';
import request from 'supertest';
import { createApp } from '@app';

const app = createApp();
const email = 'test.user@example.com';
const password = 'MySecureP@ssworD123';

// Logout Integration Test
describe('Logout Integration Test', () => {
    test('should return 200 and revoke token', async () => {
        const loginRes = await request(app)
            .post('/api/v1/auth/login')
            .send({ email, password });
        expect(loginRes.status).toBe(200);

        const { refreshToken } = loginRes.body;
        expect(typeof refreshToken).toBe('string');

        const logoutRes = await request(app)
            .post('/api/v1/auth/logout')
            .send({ refreshToken });
        expect(logoutRes.status).toBe(200);
        expect(logoutRes.body.message).toBeDefined();
    });

    test('should return 400-401 and reject using revoked token', async () => {
        const loginRes = await request(app)
            .post('/api/v1/auth/login')
            .send({ email, password });
        expect(loginRes.status).toBe(200);

        const { refreshToken } = loginRes.body;

        await request(app)
            .post('/api/v1/auth/logout')
            .send({ refreshToken });

        const refreshRes = await request(app)
            .post('/api/v1/auth/refresh')
            .send({ refreshToken });

        expect([400, 401]).toContain(refreshRes.status);
    });

    test('should return 400 when refreshToken is missing', async () => {
        const res = await request(app)
            .post('/api/v1/auth/logout')
            .send({});
        expect(res.status).toBe(400);

        expect(res.body.error ?? res.body.message).toMatch(/validation/i);

        const detail = JSON.stringify(res.body.details ?? res.body.errors ?? res.body);
        expect(detail).toMatch(/refreshToken/i);
    });
});