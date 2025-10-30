import helmet from 'helmet';
import { env } from '@config/env/env';

const isProduction = env.NODE_ENV === 'production';

export const helmetMiddlewares = [
    helmet.hidePoweredBy(),
    helmet.dnsPrefetchControl(),
    helmet.frameguard({ action: 'sameorigin' }),
    helmet.noSniff(),
    helmet.referrerPolicy({ policy: 'no-referrer' }),
    helmet.hsts({ maxAge: 31536000, includeSubDomains: true }),

    ...(isProduction 
        ? [
            helmet.contentSecurityPolicy({
                useDefaults: true,
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
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    connectSrc: ["'self'"],
                    fontSrc: ["'self'", 'data:'],
                    objectSrc: ["'none'"],
                    upgradeInsecureRequests: [],
                },
            }),
        ]
    : []),
];