import pinoHttp from 'pino-http';
import { logger } from '@config/log/createLogger';
import { env } from '@config/env/env';
import { safeBody } from '@utils/log/safeBody';
import { genRequestId } from '@utils/request/genRequestId';
import { shouldIgnoreLog } from '@config/log/autoLoggingIgnore';

export const httpLogger = pinoHttp({
    logger,
    genReqId: (req, res) => {
        const id = genRequestId(req.headers['x-request-id']);
        res.setHeader('X-Request-Id', id);
        return id;
    },
    customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    },
    autoLogging: {
        ignore: (req) => shouldIgnoreLog(req.url || ''),
    },
    serializers: {
        req(req) {
            const includeBody = 
                env.NODE_ENV === 'development' &&
                req.method !== 'GET' &&
                req.method !== 'OPTIONS';
            return {
                id: req.id,
                method: req.method,
                url: req.url,
                body: includeBody ? safeBody(req.body) : undefined,
                headers: {
                    'user-agent': req.headers['user-agent'],
                    'x-request-id': req.headers['x-request-id'],
                },
            };
        },
        res(res) { return { statusCode: res.statusCode }; },
        err(err) { return { type: err.name, message: err.message, stack: err.stack }; },
    },
});