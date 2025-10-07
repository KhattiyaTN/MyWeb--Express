import type { CorsOptions } from 'cors';

const parseOrigins = (val?: string): string[] =>
    val ? val.split(',').map((s) => s.trim()).filter(Boolean) : ['http://localhost:5173'];

export const allowedOrigins: string[] = parseOrigins(process.env.FRONTEND_URL);

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
