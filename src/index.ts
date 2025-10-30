import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import userRoutes from '@routes/userRoutes';
import certRoutes from '@routes/certRoutes';
import badgeRoutes from '@routes/badgeRoutes';
import profileRoutes from '@routes/profileRoutes';
import projectRoutes from '@routes/projectRoutes';
import contractRoutes from '@routes/contractRoutes';
import authRoutes from '@routes/auth/authRoutes';
import systemRoutes from '@routes/performance/systemRoutes';

import cors from 'cors';
import { env } from '@config/env/env';
import { logger } from '@config/log/logger';
import { limiter } from '@config/rateLimit';
import { corsOptions } from '@config/cors';
import { errorHandler } from '@config/errorHandler';
import { applyTrustProxy } from '@config/trustProxy';
import { registerShutdown } from '@config/shutdown';
import { helmetMiddlewares } from '@config/helmetOption';


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

// CORS
app.use(cors(corsOptions));

// Security headers
helmetMiddlewares.forEach(mw => app.use(mw));

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

// Start server
const server = app.listen(env.PORT, () => {
    console.log(`Server running in ${env.NODE_ENV || 'development'} mode on port ${env.PORT}`);
});


// Graceful shutdown
registerShutdown(server);