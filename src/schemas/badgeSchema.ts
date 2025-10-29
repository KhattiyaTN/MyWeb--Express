import { z } from 'zod';

// Params ID Schema
export const badgeIdParamSchema = z.object({
    params: z.object({
        id: z
            .coerce
            .number()
            .int('Badge ID must be an integer')
            .positive('Badge ID must be a positive number'),
    }).strict()
})

// Create Badge Schema
export const createBadgeSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, 'Badge name must be at least 1 characters long')
            .max(20, 'Badge name must be at most 20 characters long'),
        description: z
            .string()
            .max(100, 'Badge description must be at most 100 characters long')
            .optional(),
    }).strict()
})

// Update Badge Schema
export const updateBadgeSchema = z.object({
    params: z.object({
        id: z
            .coerce
            .number()
            .int('Badge ID must be an integer')
            .positive('Badge ID must be a positive number'),
    }).strict(),
    body: z.object({
        name: z
            .string()
            .min(1, 'Badge name must be at least 1 characters long')
            .max(20, 'Badge name must be at most 20 characters long')
            .optional(),
        description: z
            .string()
            .max(100, 'Badge description must be at most 100 characters long')
            .optional(),
    }).strict()
})

// Types
export type CreateBadgeInput = z.infer<typeof createBadgeSchema>;
export type UpdateBadgeInput = z.infer<typeof updateBadgeSchema>;
export type BadgeIdParams = z.infer<typeof badgeIdParamSchema>;