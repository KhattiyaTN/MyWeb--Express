import { prisma } from '@config/prismaClient';
import type { Badge } from '../types/schema_type';
import { deleteFileFromS3 } from '@awsServices/images/deleteImageService';
import { uploadFileToS3 } from '@awsServices/images/uploadImageService';

// GET badges by user ID
export const getAllBadgesService = async (userId: number) => {
    return await prisma.badge.findMany({
        where: { userId },
        include: { image: true },
        orderBy: { createdAt: 'desc' }
    })
}

// POST create a new badge
export const createBadgeService = async (badgeData: Badge, files: Express.Multer.File[]) => {
    let finalImageUrl = '';

    if (files.length > 0) {
        const uploadResults = await Promise.all(files.map(file => uploadFileToS3(file)));
        finalImageUrl = uploadResults[0] ?? '';
    }

    return await prisma.badge.create({
        data: {
            name: badgeData.name,
            userId: badgeData.userId,
            image: finalImageUrl 
                ? { create: 
                    { 
                        url: finalImageUrl, 
                        createdAt: new Date(), 
                        updatedAt: new Date() 
                    } 
                } : undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        include: { image: true },
    });
};

// PATCH update a badge by ID
export const updateBadgeService = async (badgeId: number, data: Partial<Badge>, files: Express.Multer.File[], imageUrl?: string) => {
    const existingBadge = await prisma.badge.findUnique({
        where: { id: badgeId },
        include: { image: true },
    });

    if (!existingBadge) {
        throw new Error('Badge not found');
    }

    let finalImageUrl = '';

    if (files.length > 0) {
        const uploadResults = await Promise.all(files.map(file => uploadFileToS3(file)));
        finalImageUrl = uploadResults[0] ?? '';
    } else if (imageUrl?.trim()) {
        finalImageUrl = imageUrl.trim();
    }

    if (finalImageUrl && existingBadge.image?.url && existingBadge.image.url !== finalImageUrl) {
        await deleteFileFromS3(existingBadge.image.url);
    }

    return await prisma.badge.update({
        where: { id: badgeId },
        data: {
            name: data.name?.toString(),
            image: finalImageUrl
                ? {
                    upsert: {
                        create: { 
                            url: finalImageUrl, 
                            createdAt: new Date(), 
                            updatedAt: new Date() 
                        },
                        update: { 
                            url: finalImageUrl, 
                            updatedAt: new Date() 
                        },
                    },
                } : undefined,
            updatedAt: new Date(),
        },
        include: { image: true },
    });
};

// DELETE a badge by ID
export const deleteBadgeService = async (badgeId: number) => {
    const existingBadge = await prisma.badge.findUnique({
        where: { id: badgeId },
        include: { image: true },
    })

    if (!existingBadge) {
        throw new Error('Badge not found');
    }

    if (existingBadge?.image?.url) {
        await deleteFileFromS3(existingBadge.image.url);
    }

    return await prisma.badge.delete({
        where: { id: badgeId },
        include: { image: true },
    })
}