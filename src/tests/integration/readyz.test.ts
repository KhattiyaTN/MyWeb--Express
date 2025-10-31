import { describe, it, expect, spyOn, afterEach } from 'bun:test';
import { createApp } from '@app'
import request from 'supertest';
import * as systemService from '@services/performance/systemService';

const app = createApp();
let spy: ReturnType<typeof spyOn> | undefined;

// Performance ready check tests
afterEach(() => {
    spy?.mockRestore();
    spy = undefined;
})

describe('Performance GET /readyz', () => {
    it('should return 200 when system is ready', async () => {
        spy = spyOn(systemService, 'systemReady').mockResolvedValue(true);
        const res = await request(app).get('/readyz');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ready');
    });

    it('should return 503 when system is not ready', async () => {
        spy = spyOn(systemService, 'systemReady').mockResolvedValue(false);
        const res = await request(app).get('/readyz');
        expect(res.status).toBe(503);
        expect(res.body.status).toBe('not-ready');
    });

    it('should return 503 when systemReady throws an error', async () => {
        spy = spyOn(systemService, 'systemReady').mockRejectedValue(new Error('DB down'));
        const res = await request(app).get('/readyz');
        expect(res.status).toBe(503);
        expect(res.body.status).toBe('not-ready');
    });
});