import type { Request, Response } from 'express';
import { systemReady } from '@services/performance/systemService';

// Health check controller
export const healthz = (_req: Request, res: Response) => {
    res.set('Cache-Control', 'no-store');
    res.status(200).json({ 
        status: 'ok',
        uptime: Math.round(process.uptime()),
        timestamp: new Date().toISOString()
    });
};

// Ready check controller
export const readyz = async (_req: Request, res: Response) => {
    try {
        const ok = await systemReady();
        res.status(ok ? 200 : 503).json({ status: ok ? 'ready' : 'not-ready' });
    } catch {
        res.status(503).json({ status: 'not-ready' });
    }
};