import { z } from 'zod';

// Profile Param ID Schema
export const profileIdParamSchema = z.object({
    params: z.object({
        id: z
            .coerce
            .number()
            .int('Profile ID must be an integer')
            .positive('Profile ID must be a positive number'),
    }).strict()
})

// Create Profile Schema
export const createProfileSchema = z.object({
    body: z.object({
        bio: z
            .string()
            .min(1, 'Bio must be at least 1 characters long')
            .max(500, 'Bio must be at most 500 characters long'),
    }).strict()
})

// Update Profile Schema
export const updateProfileSchema = z.object({
    params: z.object({
        id: z
            .coerce
            .number()
            .int('Profile ID must be an integer')
            .positive('Profile ID must be a positive number'),
    }).strict(),
    body: z.object({
        bio: z
            .string()
            .min(1, 'Bio must be at least 1 characters long')
            .max(500, 'Bio must be at most 500 characters long')
            .optional(),
    }).strict()
})

// Types
export type ProfileIdParamInput = z.infer<typeof profileIdParamSchema>;
export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;