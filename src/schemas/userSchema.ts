import { z } from 'zod';

// User Param ID Schema
export const userParamIdSchema = z.object({
    params: z.object({
        id: z
            .coerce
            .number()
            .int({ message: 'User ID must be an integer' })
            .positive({ message: 'User ID must be a positive number' }),
    }).strict(),
});

// Create User Schema
export const createUserSchema = z.object({
    body: z.object({
        firstName: z
            .string()
            .min(3, { message: 'First name must be at least 3 characters long' })
            .max(30, { message: 'First name must be at most 30 characters long' }),
        lastName: z
            .string()
            .min(3, { message: 'Last name must be at least 3 characters long' })
            .max(30, { message: 'Last name must be at most 30 characters long' }),
        introduction: z
            .string()
            .max(160, { message: 'Introduction must be at most 160 characters long' })
            .optional(),
        email: z
            .string()
            .email({ message: 'Invalid email address' }),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long' })
            .max(100, { message: 'Password must be at most 100 characters long' }),
    }).strict(),
});

// Update User Schema
export const updateUserSchema = z.object({
    params: z.object({
        id: z
            .coerce
            .number()
            .int({ message: 'User ID must be an integer' })
            .positive({ message: 'User ID must be a positive number' }),
    }).strict(),
    body: z.object({
        firstName: z
            .string()
            .min(3, { message: 'First name must be at least 3 characters long' })
            .max(30, { message: 'First name must be at most 30 characters long' })
            .optional(),
        lastName: z
            .string()
            .min(3, { message: 'Last name must be at least 3 characters long' })
            .max(30, { message: 'Last name must be at most 30 characters long' })
            .optional(),
        introduction: z
            .string()
            .max(160, { message: 'Introduction must be at most 160 characters long' })
            .optional(),
        email: z
            .string()
            .email({ message: 'Invalid email address' })
            .optional(),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long' })
            .max(100, { message: 'Password must be at most 100 characters long' })
            .optional(),
    }).strict(),
});

// Type
export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserParamIdInput = z.infer<typeof userParamIdSchema>['params'];