import { prisma } from '../config/prismaClient';
import type { Profile } from '../types/schema_type'
import { deleteFileFromS3 } from './aws/deleteImageService';
import { uploadFileToS3 } from './aws/images/uploadImageService';

// GET profile by user ID
export const getProfileService = async (userId: number) => {
    return prisma.profile.findUnique({
        where: { userId: userId },
        include: { image: true },
    });
};

// POST create a new profile
export const createProfileService = async (profileData: Profile, files: Express.Multer.File[]) => {
    let finalImageUrl = '';

    if (files.length > 0) {
        const uploadResults = await Promise.all(files.map(file => uploadFileToS3(file)));
        finalImageUrl = uploadResults[0] ?? '';
    }
    
    return prisma.profile.create({
        data: { 
            bio: profileData.bio,
            userId: profileData.userId,
            image: finalImageUrl
                ? { create:
                    {
                        url: finalImageUrl,
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
export const updateProfileService = async (userId: number, data: Partial<Profile>, files: Express.Multer.File[]) => {
    const existingProfile = await prisma.profile.findUnique({
        where: { userId: userId },
        include: { image: true },
    });

    if (!existingProfile) {
        throw new Error('Profile not found');
    }

    let finalImageUrl = '';

    if (files.length > 0) {
        const uploadResults = await Promise.all(files.map(file => uploadFileToS3(file)));
        finalImageUrl = uploadResults[0] ?? '';
    }

    if (finalImageUrl && existingProfile?.image?.url && existingProfile.image.url !== finalImageUrl) {
        await deleteFileFromS3(existingProfile.image.url);
    }
        
    return prisma.profile.update({
        where: { userId: userId },
        data: {
            bio: data.bio,
            image: finalImageUrl
                ? {
                    upsert: {
                        create: {
                            url: finalImageUrl,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                        update: {
                            url: finalImageUrl,
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
export const deleteProfileService = async (profileId: number) => {  
    const existingProfile = await prisma.profile.findUnique({
        where: { id: profileId },
        include: { image: true },
    });

    if (!existingProfile) {
        throw new Error('Profile not found');
    }

    if (existingProfile?.image?.url) {
        await deleteFileFromS3(existingProfile.image.url);
    }

    return await prisma.profile.delete({
        where: { id: profileId },
        include: { image: true },
    });
};