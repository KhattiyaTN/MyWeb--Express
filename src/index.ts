import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/auth/authRoutes';
import certRoutes from './routes/certRoutes';
import badgeRoutes from './routes/badgeRoutes';
import profileRoutes from './routes/profileRoutes';
import projectRoutes from './routes/projectRoutes';
import contractRoutes from './routes/contactRoutes';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

// Initialize Express app
const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
})

app.use(limiter);
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(helmet({
    hsts: { maxAge: 31536000, includeSubDomains: true },
    referrerPolicy: { policy: 'no-referrer' },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", process.env.CLOUD_STORAGE_URL ?? ""].filter(Boolean),
            scriptSrc: ["'self'"],
        },
    },
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/certs', certRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contracts', contractRoutes);

// Error handling middleware
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
});
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    if (err instanceof Error) {
        res.status(500).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`)});
