import type { Express } from 'express';

export function applyTrustProxy(app: Express, trust?: string) {
    if (!trust) return;
    app.set('trust proxy', /^\d+$/.test(trust)
        ? Number(trust) : trust === 'true' 
        ? true : trust);
}