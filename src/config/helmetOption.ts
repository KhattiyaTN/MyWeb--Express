import helmet from 'helmet';
import { env } from './env/env';

export const helmetMiddlewares = [
    helmet.hsts({ maxAge: 31536000, includeSubDomains: true }),
    helmet.referrerPolicy({ policy: 'no-referrer' }),
    helmet.contentSecurityPolicy({
        directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
            "'self'",
            'data:',
            'blob:',
            'https://res.cloudinary.com',
            ...(env.CLOUD_STORAGE_URL ? [env.CLOUD_STORAGE_URL] : []),
        ],
        scriptSrc: ["'self'"],
        },
    }),
];