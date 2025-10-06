import { prisma } from '../config/prismaClient';
import type { Profile } from '../types/types'
import { deleteFileFromS3 } from './aws/deleteImageService';

// GET profile by user ID
export const getProfileService = async (userId: number) => {
    return prisma.profile.findUnique({
        where: { userId: userId },
        include: { image: true },
    });
};

// POST create a new profile
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

// PATCH update a profile by user ID
export const updateProfileService = async (userId: number, data: Partial<Profile>, imageUrl: string) => {
    const existingProfile = await prisma.profile.findUnique({
        where: { userId: userId },
        include: { image: true },
    });

    if (!existingProfile) {
        throw new Error('Profile not found');
    }

    if (imageUrl && existingProfile?.image?.url && existingProfile.image.url !== imageUrl) {
        await deleteFileFromS3(existingProfile.image.url);
    }
        
    return prisma.profile.update({
        where: { userId: userId },
        data: {
            bio: data.bio,
            image: imageUrl
                ? {
                    upsert: {
                        create: {
                            url: imageUrl,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                        update: {
                            url: imageUrl,
                            updatedAt: new Date(),
                        }
                    }
                } : undefined,
            updatedAt: new Date(),
        },
        include: { image: true },
    });
};

// DELETE profile by ID
export const deleteProfileService = async (id: number): Promise<void> => {  
    await prisma.profile.delete({
        where: { id },
    });
};