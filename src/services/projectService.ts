import { getAllProject } from './../controllers/projectController';
import { PrismaClient } from '../generated/prisma';
import type { Project } from '../types/types';

const prisma = new PrismaClient();

// GET all project by ID
export const getAllProjectService = async (id: number) => {
    const projects = await prisma.project.findMany({
        where: { userId: id }
    })
}

// POST create project
export const createProjectService = async (data: Project) => {
    // Business logic about keeping project data to project table and image path of aws s3 to image table
}

// PATCH edit project
export const updateProjectService = async (id: number, data: Partial<Project>) => {
    const project = await prisma.project.update({
        where: { id: id },
        data: {
            ...(data.name !== undefined ? { name: data.name.toString() } : {}),
            ...(data.description !== undefined ? { description: data.description.toString() } : {}),
            updatedAt: new Date(),
        }
    })
}

// DELETE project
export const deleteProjectService = async (id: number) => {
    return await prisma.project.delete({
        where: { id }
    })
}