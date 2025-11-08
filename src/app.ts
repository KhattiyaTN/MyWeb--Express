import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';

import { env } from '@config/env/env';
import { limiter } from '@config/rateLimit';
import { corsOptions } from '@config/cors';
import { errorHandler } from '@config/errorHandler';
import { applyTrustProxy } from '@config/trustProxy';

import { httpLogger } from '@middleware/httpLogger';
import { helmetMiddlewares } from '@middleware/helmetMiddleware';
import { compressionMiddleware } from '@middleware/compressionMiddleware';

import v1Routes from '@routes/v1/index';
import systemRoutes from '@routes/v1/performance/systemRoutes';

export function createApp() {
    const app = express();
    const trust = env.TRUST_PROXY;
    const enableOps = env.NODE_ENV !== 'test';

    // Hide Express signature
    app.disable('x-powered-by');
    
    // Trust proxy
    applyTrustProxy(app, trust);

    // Body parser
    app.use(express.json({ limit: '2mb' }));
    app.use(express.urlencoded({ extended: true, limit: '2mb' }));
    
    // Pino Logger
    if (enableOps) app.use(httpLogger);
    
    // Health checks
    app.use(systemRoutes);

    // CORS
    app.use('/api/v1', cors(corsOptions));
    
    // Rate limiting
    if (enableOps) app.use('/api/v1', limiter);
    
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