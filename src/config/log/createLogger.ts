import pino from 'pino';
import { env } from '@config/env/env';
import { REDACT_PATHS } from './redactPaths';

export const logger = pino({
    level: env.LOG_LEVEL || (env.NODE_ENV === 'production' ? 'info' : 'debug'),
    base: { pid: process.pid, service: 'backend-api', env: env.NODE_ENV },
    redact: { paths: REDACT_PATHS, remove: true },
    transport: env.NODE_ENV === 'production'
        ? undefined
        : { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } },
});