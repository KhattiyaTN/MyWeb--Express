import { prisma } from '../config/prismaClient';
import type { Project } from '../types/schema_type';
import { deleteFileFromS3 } from './aws/deleteImageService';
import { uploadFileToS3 } from './aws/images/uploadImageService';

// GET All project by ID
export const getProjectsService = async (userId: number) => {
    const projects = await prisma.project.findMany({
        where: { userId: userId },
        include: { images: true },
        orderBy: { createdAt: 'desc' },
    })
}

// POST create new project
export const createProjectService = async (projectData: Project, files: Express.Multer.File[]) => {
    let finalImageUrls: string[] = [];

    if (files.length > 0) {
        const uploadResults = await Promise.all(files.map(file => uploadFileToS3(file)));
        finalImageUrls = uploadResults;
    }

    return await prisma.project.create({
        data: {
            name: projectData.name,
            description: projectData.description,
            userId: projectData.userId,
            images: finalImageUrls.length > 0
                ? { create: 
                    finalImageUrls.map(url => ({ 
                        url, 
                        createdAt: new Date(), 
                        updatedAt: new Date() 
                    })) 
                }: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        include: { images: true },
    });
};

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
export const deleteProjectService = async (projectId: number) => {
    const existingProject = await prisma.project.findUnique({
        where: { id: projectId },
        include: { images: true }
    });

    if (!existingProject) {
        throw new Error('Project not found');
    }

    await Promise.all(existingProject.images.map(image => deleteFileFromS3(image.url)));

    return await prisma.project.delete({
        where: { id: projectId },
        include: { images: true }
    });
}