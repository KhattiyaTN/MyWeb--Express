import { PrismaClient } from '@prisma/client';
import type { Project } from '../types/types';

const prisma = new PrismaClient();

// GET All project by ID
export const getProjectsService = async (userId: number) => {
    const projects = await prisma.project.findMany({
        where: { userId: userId },
        include: { images: true },
        orderBy: { createdAt: 'desc' },
    })
}

// POST create project
export const createProjectService = async (projectData: Project, imageUrls: string[]) => {
    return await prisma.project.create({
        data: {
            name: projectData.name,
            description: projectData.description,
            userId: projectData.userId,
            images: imageUrls.length > 0 ? {
                create: imageUrls.map(url => ({
                    url,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }))
            }: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        include: { images: true },
    });
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