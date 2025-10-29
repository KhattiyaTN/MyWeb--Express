import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: z
        .coerce
        .number()
        .int()
        .positive()
        .default(4000),
    TRUST_PROXY: z
        .string()
        .optional(),
    FRONTEND_URL: z
        .string()
        .url()
        .optional(),
    DATABASE_URL: z
        .string()
        .min(1, 'DATABASE_URL is required'),
    JWT_SECRET: z
        .string()
        .min(32, 'JWT_SECRET must be at least 32 characters long'),
    CLOUDINARY_CLOUD_NAME: z
        .string()
        .min(1, 'CLOUDINARY_CLOUD_NAME is required'),
    CLOUDINARY_API_KEY: z
        .string()
        .min(1, 'CLOUDINARY_API_KEY is required'),
    CLOUDINARY_API_SECRET: z
        .string()
        .min(1, 'CLOUDINARY_API_SECRET is required'),
    CLOUDINARY_FOLDER: z
        .string()
        .optional(),
    CLOUD_STORAGE_URL: z
        .string()
        .url()
        .optional(),
}).superRefine((envVars, ctx) => {
    const keys = [
        envVars.CLOUDINARY_API_KEY,
        envVars.CLOUDINARY_API_SECRET,
        envVars.CLOUDINARY_CLOUD_NAME
    ];

    const provide = keys.filter(Boolean).length;

    if (provide > 0 && provide < 3) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'All Cloudinary keys must be provided together',
            path: ['CLOUDINARY_CLOUD_NAME']
        });
    }
});

export type Env = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);