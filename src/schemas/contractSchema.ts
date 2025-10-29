import { z } from 'zod';

// Contract Params ID Schema
export const contractIdParamSchema = z.object({
    params: z.object({
        id: z
            .coerce
            .number()
            .int('Contract ID must be an integer')
            .positive('Contract ID must be a positive number'),
    }).strict()
})

// Create Contract Schema
export const createContractSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, 'Contract name must be at least 1 characters long')
            .max(20, 'Contract name must be at most 20 characters long'),
    }).strict()
})

// Update Contract Schema
export const updateContractSchema = z.object({
    params: z.object({
        id: z
            .coerce
            .number()
            .int('Contract ID must be an integer')
            .positive('Contract ID must be a positive number'),
    }).strict(),
    body: z.object({
        name: z 
            .string()
            .min(1, 'Contract name must be at least 1 characters long')
            .max(20, 'Contract name must be at most 20 characters long'),
    }).strict()
})

// Types
export type CreateContractInput = z.infer<typeof createContractSchema>;
export type UpdateContractInput = z.infer<typeof updateContractSchema>;
export type ContractIdParamInput = z.infer<typeof contractIdParamSchema>;