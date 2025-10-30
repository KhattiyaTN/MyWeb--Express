import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { MulterError } from 'multer';
import jwt from 'jsonwebtoken';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {

    // Zod validation error
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: 'Validation Error',
            errors: err.errors.map(e => ({
                path: e.path.join('.'),
                message: e.message,
            }))
        })
    };

    // Invalid JSON error
    if (err instanceof SyntaxError && (err as any).body) {
        return res.status(400).json({ message: 'Invalid JSON payload' });
    };

    // Multer errors
    if (err instanceof MulterError) {
        const map: Record<string, string> = {
            LIMIT_FILE_SIZE: 'File too large',
            LIMIT_FILE_COUNT: 'File limit reached',
            LIMIT_UNEXPECTED_FILE: 'Unexpected file field',
        };
        return res.status(400).json({ message: map[err.code] || 'File upload error'  });
    };

    // JWT errors
    if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token expired' });
    };
    if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Invalid token' });
    };

    // Custom status error
    const maybeErr = err as { status?: number; message?: string };
    if (typeof maybeErr.status === 'number') {
        return res.status(maybeErr.status).json({ message: maybeErr.message || 'Error' });
    };

    // Fallback
    if (process.env.NODE_ENV === 'production') {
        console.error(err);
    };

    // Internal Server Error
    return res.status(500).json({ message: 'Internal Server Error' });
}