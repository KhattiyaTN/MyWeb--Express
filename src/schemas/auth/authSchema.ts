import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
    body: z.object({
        email: z
            .string()
            .trim()
            .toLowerCase()
            .email('Invalid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters long'),
    }).strict()
})

// Register Schema
export const registerSchema = z.object({
    body: z.object({
        firstName: z
            .string()
            .trim()
            .min(1, 'First name is required')
            .max(50, 'First name is too long'),
        lastName: z
            .string()
            .trim()
            .min(1, 'Last name is required')
            .max(50, 'Last name is too long'),
        introduction: z
            .string()
            .trim()
            .max(200, 'Introduction is too long')
            .optional(),
        email: z
            .string()
            .trim()
            .toLowerCase()
            .email('Invalid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters long'),
    }).strict()
})

// Refresh Schema
export const refreshSchema = z.object({
    body: z.object({
        refreshToken: z
            .string()
            .min(20),
    }).strict()
})

// Logout Schema
export const logoutSchema = z.object({
    body: z.object({
        refreshToken: z
            .string()
            .min(20),
    }).strict()
})

// Types
export type LoginBody = z.infer<typeof loginSchema>['body'];
export type RegisterBody = z.infer<typeof registerSchema>['body'];
export type RefreshBody = z.infer<typeof refreshSchema>['body'];
export type LogoutBody = z.infer<typeof logoutSchema>['body'];