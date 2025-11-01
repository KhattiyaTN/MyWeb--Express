import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';

import { env } from '@config/env/env';
import { logger } from '@config/log/logger';
import { limiter } from '@config/rateLimit';
import { corsOptions } from '@config/cors';
import { errorHandler } from '@config/errorHandler';
import { applyTrustProxy } from '@config/trustProxy';
import { helmetMiddlewares } from '@middleware/helmetMiddleware';
import { compressionMiddleware } from '@middleware/compressionMiddleware';

import v1Routes from '@routes/v1/index';
import systemRoutes from '@routes/v1/performance/systemRoutes';

export function createApp() {
    const app = express();
    const trust = env.TRUST_PROXY;

    // Hide Express signature
    app.disable('x-powered-by');
    
    // Trust proxy
    applyTrustProxy(app, trust);
    
    // Logging
    app.use(logger);
    
    // Body parser
    app.use(express.json({ limit: '2mb' }));
    app.use(express.urlencoded({ extended: true, limit: '2mb' }));
    
    // Health checks
    app.use(systemRoutes);

    // CORS
    app.use(cors(corsOptions));

    // CORS Preflight
    app.options(/.*/, cors(corsOptions));
    
    // Rate limiting
    if (env.NODE_ENV !== 'test') {
        app.use('/api/v1', limiter);
    }
    
    // Security headers
    helmetMiddlewares.forEach(mw => app.use(mw));
    
    // Compression
    app.use(compressionMiddleware);
    
    // Routes
    app.use('/api/v1', v1Routes);

    // 404 handler
    app.use((_req: Request, res: Response) => {
        res.status(404).json({ error: 'Route not found' });
    });
    
    // Centralized error handler
    app.use(errorHandler);

    return app;
}