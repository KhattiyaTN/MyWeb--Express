import { z } from 'zod';

// Project Param ID Schema
export const projectIdParamSchema = z.object({
    params: z.object({
        id: z
            .coerce
            .number()
            .int('Project ID must be an integer')
            .positive('Project ID must be a positive number'),
    }).strict(),
})

// Create Project Schema
export const createProjectSchema = z.object({
    body: z.object({
        title: z
            .string()
            .min(1, 'Project title must be at least 1 characters long')
            .max(100, 'Project title must be at most 100 characters long'),
        description: z
            .string()
            .min(10, 'Project description must be at least 10 characters long')
            .max(1000, 'Project description must be at most 1000 characters long'),
    }).strict(),
})

// Update Project Schema
export const updateProjectSchema = z.object({
    params: z.object({
        id: z
            .coerce
            .number()
            .int('Project ID must be an integer')
            .positive('Project ID must be a positive number'),
    }).strict(),
    body: z.object({
        title: z
            .string()
            .min(1, 'Project title must be at least 1 characters long')
            .max(100, 'Project title must be at most 100 characters long')
            .optional(),
        description: z
            .string()
            .min(10, 'Project description must be at least 10 characters long')
            .max(1000, 'Project description must be at most 1000 characters long')
            .optional(),
    }).strict(),
})

// Types
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectIdParamInput = z.infer<typeof projectIdParamSchema>;