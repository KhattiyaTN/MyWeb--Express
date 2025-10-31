import { prisma } from '@config/prismaClient';
import type { Badge } from '@prisma/client';
import { uploadBufferToCloudinary } from '@services/upload/uploadService';
import { deleteCloudinaryByPublicId } from '@services/upload/deleteService';
import { AppError } from '@utils/appErrorUtil';

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
    let finalImageUrl: string | undefined;
    let finalPublicId: string | undefined;

    const file = files?.[0];

    if (file?.buffer) {
        const uploadResult = await uploadBufferToCloudinary(file.buffer, 'badges');
        finalImageUrl = uploadResult?.secure_url ?? '';
        finalPublicId = uploadResult?.public_id ?? '';
    }

    return await prisma.badge.create({
        data: {
            name: badgeData.name,
            userId: badgeData.userId,
            image: finalImageUrl 
                ? { create: 
                    { 
                        url: finalImageUrl,
                        publicId: finalPublicId,
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
        throw new AppError(404, 'Badge not found');
    }

    let finalImageUrl: string | undefined;
    let finalPublicId: string | undefined;

    const file = files?.[0]
    
    if (file?.buffer) {
        const uploadResult = await uploadBufferToCloudinary(file.buffer, 'badges');
        finalImageUrl = uploadResult?.secure_url ?? '';
        finalPublicId = uploadResult?.public_id ?? '';

        if (existingBadge.image?.publicId && existingBadge.image.publicId !== finalPublicId) {
            await deleteCloudinaryByPublicId(existingBadge.image.publicId);
        }
    } else if (imageUrl?.trim()) {
        finalImageUrl = imageUrl.trim();
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
                            publicId: finalPublicId,
                        },
                        update: { 
                            url: finalImageUrl, 
                            publicId: finalPublicId,
                        },
                    },
                } : undefined,
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
        throw new AppError(404,'Badge not found');
    }

    if (existingBadge?.image?.publicId) {
        await deleteCloudinaryByPublicId(existingBadge.image.publicId);
    }

    return await prisma.badge.delete({
        where: { id: badgeId },
        include: { image: true },
    })
}