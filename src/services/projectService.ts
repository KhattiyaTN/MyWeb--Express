import { prisma } from '../config/prismaClient';
import type { Project } from '../types/types';
import { uploadFileToS3 } from './aws/images/uploadImageService';

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
export const updateProjectService = async (id: number, data: Partial<Project>, imageFiles: Express.Multer.File[]) => {
    const existingProject = await prisma.project.findUnique({
        where: { id: id },
        include: { images: true },
    });

    if (!existingProject) {
        throw new Error('Project not found');
    }

    if (imageFiles.length === 0) {
        throw new Error('At least one image file is required');
    }

    if (imageFiles.length + existingProject.images.length > 10) {
        throw new Error('Cannot upload more than 10 images');
    }

    const imagesToCreate = await Promise.all(
        imageFiles.map(async (file) => ({
            url: await uploadFileToS3(file),
            createdAt: new Date(),
            updatedAt: new Date(),
        }))
    );

    return await prisma.project.update({
        where: { id: id },
        data: {
            name: data.name,
            description: data.description,
            images: imagesToCreate && imagesToCreate.length > 0 ? {
                create: imagesToCreate
            } : undefined,
            updatedAt: new Date(),
        },
        include: { images: true }
    });
}

// DELETE project
export const deleteProjectService = async (id: number) => {
    return await prisma.project.delete({
        where: { id }
    })
}