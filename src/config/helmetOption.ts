import helmet from 'helmet';

export const helmetMiddlewares = [
    helmet.hsts({ maxAge: 31536000, includeSubDomains: true }),
    helmet.referrerPolicy({ policy: 'no-referrer' }),
    helmet.contentSecurityPolicy({
            directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", ...(process.env.CLOUD_STORAGE_URL ? [process.env.CLOUD_STORAGE_URL] : [])],
            scriptSrc: ["'self'"],
        },
    }),
];