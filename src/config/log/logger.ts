import morgan from 'morgan';
import { env } from '@config/env/env';

const format = env.NODE_ENV === 'production' ? 'combined' : 'dev';
const skipPaths = new Set(['/healthz', '/readyz']);

export const logger = env.NODE_ENV === 'test'
    ? (_req: any, _res: any, next: any) => next()
    : morgan(format, {
        skip: (req: any) => req.method === 'OPTIONS' || skipPaths.has(req.path),
    });