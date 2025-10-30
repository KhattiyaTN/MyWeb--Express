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

import userRoutes from '@routes/userRoutes';
import certRoutes from '@routes/certRoutes';
import badgeRoutes from '@routes/badgeRoutes';
import authRoutes from '@routes/auth/authRoutes';
import profileRoutes from '@routes/profileRoutes';
import projectRoutes from '@routes/projectRoutes';
import contractRoutes from '@routes/contractRoutes';
import systemRoutes from '@routes/performance/systemRoutes';

export function createApp() {
    const app = express();
    const trust = env.TRUST_PROXY;
    
    // Trust proxy
    applyTrustProxy(app, trust);
    
    // Logging
    app.use(logger);
    
    // Body parser
    app.use(express.json({ limit: '2mb' }));
    app.use(express.urlencoded({ extended: true }));
    
    // Health checks
    app.use(systemRoutes);
    
    // Rate limiting
    app.use(limiter);
    
    // Security headers
    helmetMiddlewares.forEach(mw => app.use(mw));
    
    // Compression
    app.use(compressionMiddleware);
    
    // CORS
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));
    
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/certs', certRoutes);
    app.use('/api/badges', badgeRoutes);
    app.use('/api/profile', profileRoutes);
    app.use('/api/projects', projectRoutes);
    app.use('/api/contracts', contractRoutes);
    
    // 404 handler
    app.use((req: Request, res: Response) => {
        res.status(404).json({ message: 'Route not found' });
    });
    
    // Centralized error handler
    app.use(errorHandler);

    return app;
}