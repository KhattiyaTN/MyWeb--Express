import { describe, test, expect } from 'bun:test';
import request from 'supertest';  
import { createApp } from '@app';

const app = createApp();
const email = 'test.user@example.com';
const password = 'MySecureP@ssworD123';
const isJWT = (t: unknown): t is string => typeof t === 'string' && t.split('.').length === 3;

const decodeJwtPayload = (token: string) => {
    const parts = token.split('.');
    expect(parts.length).toBe(3); 
    const payloadSeg = parts[1]!;
    const base64 = payloadSeg.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json);
};

// Login Validation Tests
describe('Login validation', () => {
    test('should return 200 when login successfully', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email, password });
        expect(res.status).toBe(200);
        expect(typeof res.body.accessToken).toBe('string');
        expect(typeof res.body.refreshToken).toBe('string');
    });

    test('should return 401 when non-existent email is used', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'non.existent@example.com', password });
        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Invalid email or password');
    });

    test('should return 401 when wrong password is used', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email, password: 'wrong_password' });
        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Invalid email or password');
    });
});

// Login Tokens Tests
describe('Login tokens', () => {
    test('should return JWT-like tokens with claims', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email, password });
        expect(res.status).toBe(200);

        const { accessToken, refreshToken } = res.body;
        expect(isJWT(accessToken)).toBe(true);
        expect(typeof refreshToken).toBe('string');
        expect(refreshToken.length).toBeGreaterThan(20);

        const payload = decodeJwtPayload(accessToken);
        expect(typeof payload.exp).toBe('number');
        expect(typeof payload.iat).toBe('number');
        expect(payload.exp).toBeGreaterThan(payload.iat);
        if (payload.sub) expect(String(payload.sub).length).toBeGreaterThan(0);
    });

    test('should not leak sensitive fields', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email, password });
        expect(res.status).toBe(200);
        expect(res.body).not.toHaveProperty('password');
        expect(res.body).not.toHaveProperty('hashedPassword');
        expect(res.body.user).toBeUndefined();
    });
})