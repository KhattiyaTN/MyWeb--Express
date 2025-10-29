import { z } from 'zod';

// Certificate Param ID Schema
export const certIdParamSchema = z.object({
    params: z.object({
        id: z
            .coerce
            .number()
            .int('Certificate ID must be an integer')
            .positive('Certificate ID must be a positive number'),
    }).strict(),
})

// Create Certificate Schema
export const createCertSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, 'Certificate name must be at least 1 characters long')
            .max(50, 'Certificate name must be at most 50 characters long'),
        authority: z
            .string()
            .min(1, 'Certificate authority must be at least 1 characters long')
            .max(100, 'Certificate authority must be at most 100 characters long'),
        licenseNo: z
            .string()
            .min(1, 'Certificate license number must be at least 1 characters long')
            .max(30, 'Certificate license number must be at most 30 characters long'),
    }).strict(),
})

// Update Certificate Schema
export const updateCertSchema = z.object({
    params: z.object({
        id: z
            .coerce
            .number()
            .int('Certificate ID must be an integer')
            .positive('Certificate ID must be a positive number'),
    }).strict(),
    body: z.object({
        name: z
            .string()
            .min(1, 'Certificate name must be at least 1 characters long')
            .max(50, 'Certificate name must be at most 50 characters long')
            .optional(),
        authority: z
            .string()
            .min(1, 'Certificate authority must be at least 1 characters long')
            .max(100, 'Certificate authority must be at most 100 characters long')
            .optional(),
        licenseNo: z
            .string()
            .min(1, 'Certificate license number must be at least 1 characters long')
            .max(30, 'Certificate license number must be at most 30 characters long')
            .optional(),
    }).strict()
})

// Types
export type CertIdParamInput = z.infer<typeof certIdParamSchema>;
export type CreateCertInput = z.infer<typeof createCertSchema>;
export type UpdateCertInput = z.infer<typeof updateCertSchema>;