import { describe, it, expect } from 'bun:test';
import { createApp } from '@app'
import request from 'supertest';

const app = createApp();

// Performance health check tests
describe('Performance GET /healthz', () => {
    it('should return 200 with status ok', async () => {
        const res = await request(app).get('/healthz');
        const timestamp = Date.parse(res.body.timestamp);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(typeof res.body.uptime).toBe('number');
        expect(res.body.uptime).toBeGreaterThanOrEqual(0);
        expect(Number.isNaN(timestamp)).toBe(false);
        expect(Math.abs(Date.now() - timestamp)).toBeLessThan(5000);
    });

    it('uptime should be non-decreasing across calls', async () => {
        const res1 = await request(app).get('/healthz');
        await new Promise(r => setTimeout(r, 50));
        const res2 = await request(app).get('/healthz');
        expect(res2.body.uptime).toBeGreaterThanOrEqual(res1.body.uptime);
    });

    it('HEAD should return 200', async () => {
        const res = await request(app).head('/healthz');
        expect(res.status).toBe(200);
    });

    it('should set no-store to avoid caching', async () => {
        const res = await request(app).get('/healthz');
        expect(res.headers['cache-control']).toBe('no-store');
    });
});