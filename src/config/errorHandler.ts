import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@utils/appErrorUtil';
import { logger } from '@config/log/pinoLogger';
import { ZodError } from 'zod';
import { MulterError } from 'multer';
import jwt from 'jsonwebtoken';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const log = (req as any)?.log || logger;

    // AppError
    if (err instanceof AppError) {
        log.warn({ err, requestId: (req as any)?.id }, 'AppError')
        return res.status(err.statusCode).json({ 
            error: err.message, 
            code: err.code,
        });
    }

    // Zod validation error
    if (err instanceof ZodError) {
        log.warn({ err, issue: err.errors, requestId: (req as any)?.id }, 'Validation Error')
        return res.status(400).json({
            error: 'Validation Error',
            details: err.errors.map(e => ({
                path: e.path.join('.'),
                message: e.message,
            })),
        });
    };

    // Invalid JSON error
    if (err instanceof SyntaxError && 'status' in (err as any) && (err as any).status === 400 && 'body' in (err as any)) {
        log.warn({ err, requestId: (req as any)?.id }, 'Invalid JSON payload');
        return res.status(400).json({ error: 'Invalid JSON payload' });
    };

    // Multer errors
    if (err instanceof MulterError) {
        const map: Record<string, string> = {
            LIMIT_FILE_SIZE: 'File too large',
            LIMIT_FILE_COUNT: 'File limit reached',
            LIMIT_UNEXPECTED_FILE: 'Unexpected file field',
        };
        const msg = map[err.code] || 'File upload error';
        log.warn({ err, code: err.code, requestId: (req as any)?.id }, 'MulterError');
        return res.status(400).json({ error: msg });
    };

    // JWT errors
    if (err instanceof jwt.TokenExpiredError) {
        log.warn({ err, requestId: (req as any)?.id }, 'JWT expired');
        return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    };
    if (err instanceof jwt.JsonWebTokenError) {
        log.warn({ err, requestId: (req as any)?.id }, 'JWT invalid');
        return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
    };

    // Generic status error (custom thrown with status)
    if (typeof (err as any)?.status === 'number') {
        const status = (err as any).status;
        const message = (err as any).message || 'Error';
        log.warn({ err, status, requestId: (req as any)?.id }, 'GenericStatusError');
        return res.status(status).json({ error: message });
    }

    // Fallback
    log.error({ err, requestId: (req as any)?.id }, 'UnhandledError');
    return res.status(500).json({ error: 'Internal Server Error' });
}