import rateLimit, { ipKeyGenerator as erlIpKeyGen } from 'express-rate-limit';
import type { Request } from 'express';

const safeIpKey = (req: Request) => (erlIpKeyGen as unknown as (r: Request) => string)(req);

// General rate limiter
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
    keyGenerator: (req) => safeIpKey(req),
    handler: (_req, res) => {
        res.status(429).json({ error: 'Too many requests, please try again after 15 minutes' });
    },
})

// Login rate limiter
export const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    skip: (req) => req.method === 'OPTIONS',
    keyGenerator: (req, _res) => {
        const ip = safeIpKey(req);
        const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        return `${ip}-${email}`;
    },
    handler: (_req, res) => {
        res.status(429).json({ error: 'Too many login attempts, please try again after 10 minutes' });
    },
})

// Refresh token rate limiter
export const refreshLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
    keyGenerator: (req) => safeIpKey(req),
    handler: (_req, res) => {
        res.status(429).json({ error: 'Too many token refresh attempts, please try again after 5 minutes' });
    },
})