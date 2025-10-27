import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan = require('morgan');
import { limiter } from '@config/rateLimit';
import { errorHandler } from '@config/errorHandler';
import { helmetMiddlewares } from '@config/helmetOption';
import { corsOptions } from '@config/cors';
import { authenticate } from '@middleware/authMiddleware';

import authRoutes from '@routes/auth/authRoutes';
import certRoutes from '@routes/certRoutes';
import badgeRoutes from '@routes/badgeRoutes';
import profileRoutes from '@routes/profileRoutes';
import projectRoutes from '@routes/projectRoutes';
import contractRoutes from '@routes/contractRoutes';

dotenv.config();

const app = express();

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parser
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(limiter);

// CORS
app.use(cors(corsOptions));

// Security headers
helmetMiddlewares.forEach(mw => app.use(mw));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/certs', authenticate, certRoutes);
app.use('/api/badges', authenticate, badgeRoutes);
app.use('/api/profile', authenticate, profileRoutes);
app.use('/api/projects', authenticate, projectRoutes);
app.use('/api/contracts', authenticate, contractRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
});

// Centralized error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
