import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan = require('morgan');
import { limiter } from './config/rateLimit';
import { errorHandler } from './config/errorHandler';
import { helmetMiddlewares } from './config/helmetOption';

import authRoutes from './routes/auth/authRoutes';
import certRoutes from './routes/certRoutes';
import badgeRoutes from './routes/badgeRoutes';
import profileRoutes from './routes/profileRoutes';
import projectRoutes from './routes/projectRoutes';
import contractRoutes from './routes/contactRoutes';

dotenv.config();

const app = express();

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
app.use(limiter);

// CORS
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));

// Security headers
helmetMiddlewares.forEach(mw => app.use(mw));

// Routes
app.use('/api/auth', authRoutes);
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
