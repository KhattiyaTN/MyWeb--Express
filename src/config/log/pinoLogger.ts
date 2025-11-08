import pino from 'pino';
import pinoHttp from 'pino-http';
import crypto from 'crypto';
import { env } from '@config/env/env';

// Pino Logger
export const logger = pino({
    level: env.LOG_LEVEL || (env.NODE_ENV === 'production' ? 'info' : 'debug'),
    base: {
        pid: process.pid,
        service: 'backend-api',
        env: env.NODE_ENV,
    },
    redact: {
        paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.body.password',
            'req.body.refreshToken',
            'req.body.accessToken',
        ],
        remove: true,
    },
    transport: env.NODE_ENV === 'production'
        ? undefined
        : { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } },
});

// HTTP Logger Middleware
export const httpLogger = pinoHttp({
    logger,
    genReqId: (req, res) => {
        const header = req.headers['x-request-id'];
        const id = (Array.isArray(header) ? header[0] : header) || crypto.randomUUID();
        res.setHeader('X-Request-Id', id);
        return id;
    },
    customLogLevel: (req, res, err) => {
        if (err || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    },
    autoLogging: {
        ignore: (req) => {
            const url = req.url || '';
            return url.startsWith('/healthz') 
                || url.startsWith('/metrics')
                || url.startsWith('/favicon.ico');
        }
    },
    serializers: {
        req(req) {
            return {
                id: req.id,
                method: req.method,
                url: req.url,
                body: env.NODE_ENV === 'development' ? safeBody(req.body) : undefined,
                headers: {
                    'user-agent': req.headers['user-agent'],
                    'x-request-id': req.headers['x-request-id'],
                },
            };
        },
        res(res) {
            return { statusCode: res.statusCode };
        },
        err(err) {
            return { type: err.name, message: err.message, stack: err.stack };
        }
    },
});

// Helper to safely log request body
function safeBody(body: any) {
    if (!body || typeof body !== 'object') return body;
    const clone: any = { ...body };

    for (const key of ['password', 'refreshToken', 'accessToken']) {
        if (key in clone) clone[key] = '[REDACTED]';
    }

    return clone;
}