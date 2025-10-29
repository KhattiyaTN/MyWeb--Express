import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

type SafeSchema = {
    safeParse: (data: unknown) => 
        | { success: true, data: any } 
        | { success: false, error: z.ZodError }
};

export const validateMiddleware = (schema: SafeSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
    })

    if (!result.success) {
        const errors = result.error.issues.map((i) => ({
            path: i.path,
            message: i.message,
        }));
        return res.status(400).json({ message: 'Validation error', errors });
    }

    const { body, query, params } = result.data;
    if (body) req.body = body;
    if (query) req.query = query;
    if (params) req.params = params;

    next();
};