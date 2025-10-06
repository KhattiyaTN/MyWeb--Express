import { PrismaClient } from '@prisma/client';
import type { Badge } from '../types/types';

const prisma = new PrismaClient();

// GET badges by user ID
export const getAllBadgesService = async (userId: number) => {
    return await prisma.badge.findMany({
        where: { userId }
    })
}

// POST create a new badge
export const createBadgeService = async (badgeData: Badge, imageUrls: string[]) => {
    return await prisma.badge.create({
        data: {
            name: badgeData.name,
            userId: badgeData.userId,
            image: imageUrls[0]
                ? { create: 
                    { 
                        url: imageUrls[0],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                } : undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        include: { image: true },
    });
};

// PATCH update a badge by ID
export const updateBadgeService = async (badgeId: number, data: Partial<Badge>) => {
    return await prisma.badge.update({
        where: { id: badgeId },
        data: {
            name: data.name?.toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    })
}

// DELETE a badge by ID
export const deleteBadgeService = async (badgeId: number) => {
    await prisma.badge.delete({
        where: { id: badgeId }
    })
}