import rateLimit from 'express-rate-limit';

// General rate limiter
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(429).json({ message: 'Too many requests, please try again after 15 minutes' });
    },
})

// Login rate limiter
export const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator: (req, _res) => {
        const ip = req.ip || '';
        const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        return `${ip}-${email}`;
    },
    handler: (_req, res) => {
        res.status(429).json({ message: 'Too many login attempts, please try again after 10 minutes' });
    },
})

// Refresh token rate limiter
export const refreshLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, _res) => {
        return req.ip || 'unknown';
    },
    handler: (_req, res) => {
        res.status(429).json({ message: 'Too many token refresh attempts, please try again after 5 minutes' });
    },
})