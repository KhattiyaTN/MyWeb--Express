import { PrismaClient } from '@prisma/client';
import type { Profile } from '../types/types'
import { create } from 'domain';

const prisma = new PrismaClient();

export const getProfileService = async (userId: number) => {
    return prisma.profile.findUnique({
        where: { userId: userId },
        include: { image: true },
    });
};

export const createProfileService = async (profileData: Profile, imageUrls: string[]) => {
    return prisma.profile.create({
        data: { 
            bio: profileData.bio,
            userId: profileData.userId,
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

export const updateProfileService = async (userId: number, data: Partial<Profile>): Promise<Profile | null> => {
    return prisma.profile.update({
        where: { userId: userId },
        data,
    });
};

export const deleteProfileService = async (id: number): Promise<void> => {
    await prisma.profile.delete({
        where: { id },
    });
};