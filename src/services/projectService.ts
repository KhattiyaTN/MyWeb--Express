import { prisma } from '@config/prismaClient';
import type { Project } from '../types/schema_type';
import { uploadBufferToCloudinary } from '@services/upload/uploadService';
import { deleteCloudinaryByPublicId } from '@services/upload/deleteService';

// GET All project by ID
export const getProjectsService = async (userId: number) => {
    return await prisma.project.findMany({
        where: { userId: userId },
        include: { images: true },
        orderBy: { createdAt: 'desc' },
    });
}

// POST create new project
export const createProjectService = async (projectData: Project, files: Express.Multer.File[]) => {
    let finalImageUrls: {url: string, publicId: string} [] = [];

    if (files.length > 0) {
        const uploadResults = await Promise.allSettled(
            files.map( async (file) => {
                const result = await uploadBufferToCloudinary(file.buffer, 'projects');
                return {
                    url: result?.secure_url ?? '',
                    publicId: result?.public_id ?? ''
                };
            })
        );

        const successfulUploads = uploadResults
            .filter((r): r is PromiseFulfilledResult<{url: string, publicId: string}> => r.status === 'fulfilled')
            .map((r) => r.value);

        const failedUploads = uploadResults
            .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
            .map((r) => r.reason?.message || 'Unknown error');

        if (successfulUploads.length === 0) {
            console.log(`Failed to upload any images: ${failedUploads.join(', ')}`);
            throw new Error(`All image uploads failed: ${failedUploads.join(', ')}`);
        }

        if (failedUploads.length > 0) {
            console.log(`Some image uploads failed: ${failedUploads.join(', ')}`);
        } else {
            console.log('All images uploaded successfully');
        }

        finalImageUrls = successfulUploads;
    };

    return await prisma.project.create({
        data: {
            name: projectData.name,
            description: projectData.description,
            userId: projectData.userId,
            images: 
                finalImageUrls.length > 0 ? 
                { 
                    create: finalImageUrls.map(img => (
                        { 
                            url: img.url, 
                            publicId: img.publicId,
                            createdAt: new Date(), 
                            updatedAt: new Date() 
                        })),
                }: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        include: { images: true },
    });
};

// PATCH edit project
export const updateProjectService = async (id: number, data: Partial<Project>, imageFiles: Express.Multer.File[], imageUrl: string) => {
    const existingProject = await prisma.project.findUnique({
        where: { id: id },
        include: { images: true },
    });

    if (!existingProject) {
        throw new Error('Project not found');
    }

    if (imageFiles.length === 0 && !imageUrl) {
        throw new Error('At least one image file is required');
    }

    if (imageFiles.length + existingProject.images.length > 10) {
        throw new Error('Cannot upload more than 10 images');
    }

    const uploadResults = await Promise.allSettled(
        imageFiles.map( async (file) => {
            const result = await uploadBufferToCloudinary(file.buffer, 'projects');
            return {
                url: result?.secure_url ?? '',
                publicId: result?.public_id ?? ''
            };
        })
    );

    const successfulUploads = uploadResults
        .filter((r): r is PromiseFulfilledResult<{url: string, publicId: string}> => r.status === 'fulfilled')
        .map((r) => r.value);
    
    const failedUploads = uploadResults
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r) => r.reason?.message || 'Unknown error');

    if (successfulUploads.length === 0) {
        console.log(`Failed to upload any images: ${failedUploads.join(', ')}`);
        throw new Error(`All image uploads failed: ${failedUploads.join(', ')}`);
    }

    if (failedUploads.length > 0) {
        console.log(`Some image uploads failed: ${failedUploads.join(', ')}`);
    } else {
        console.log('All images uploaded successfully');
    }

    return await prisma.project.update({
        where: { id: id },
        data: {
            name: data.name,
            description: data.description,
            images: 
                successfulUploads.length > 0 ? 
                {
                    create: successfulUploads.map(img => ({
                        url: img.url,
                        publicId: img.publicId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }))
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

    await Promise.all(existingProject.images?.map(async (img) => {
        if (img.publicId) {
            await deleteCloudinaryByPublicId(img.publicId);
        }
    }));

    return await prisma.project.delete({
        where: { id: projectId },
        include: { images: true }
    });
}