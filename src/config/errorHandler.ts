import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@utils/appErrorUtil';
import { logger } from '@config/log/createLogger';
import { ZodError } from 'zod';
import { MulterError } from 'multer';
import jwt from 'jsonwebtoken';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const log = (req as any)?.log || logger;

    // AppError
    if (err instanceof AppError) {
        log.warn({ err, requestId: (req as any)?.id, statusCode: err.statusCode, code: err.code }, 'AppError')
        return res.status(err.statusCode).json({ 
            error: err.message, 
            code: err.code,
            details: (err as any).details
        });
    };

    // Zod validation error
    if (err instanceof ZodError) {
        const details = err.errors.map(e => ({
            path: e.path.length ? e.path.join('.') : '(root)',
            message: e.message,
        }))
        log.warn({ issues: details, requestId: (req as any)?.id, statusCode: 400 }, 'ValidationError')
        return res.status(400).json({
            error: 'Validation Error',
            details,
        });
    };

    // Invalid JSON error
    if (err instanceof SyntaxError && 'status' in (err as any) && (err as any).status === 400 && 'body' in (err as any)) {
        log.warn({ err, requestId: (req as any)?.id, statusCode: 400 }, 'InvalidJSONpayload');
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
        log.warn({ err, code: err.code, requestId: (req as any)?.id, statusCode: 400 }, 'MulterError');
        return res.status(400).json({ error: msg, code: err.code });
    };

    // JWT errors
    if (err instanceof jwt.TokenExpiredError) {
        log.warn({ requestId: (req as any)?.id, statusCode: 401 }, 'JwtExpired');
        return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    };
    if (err instanceof jwt.JsonWebTokenError) {
        log.warn({ requestId: (req as any)?.id, statusCode: 401 }, 'JwtInvalid');
        return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
    };

    // Generic status error (custom thrown with status)
    if (typeof (err as any)?.status === 'number') {
        const status = (err as any).status;
        const message = (err as any).message || 'Error';
        const level = status >= 500 ? 'error' : 'warn';
        log[level]({ err, requestId: (req as any)?.id, statusCode: status }, 'GenericStatusError');
        return res.status(status).json({ error: message });
    };

    // Fallback
    log.error({ err, requestId: (req as any)?.id, statusCode: 500 }, 'UnhandledError');
    return res.status(500).json({ error: 'Internal Server Error' });
}