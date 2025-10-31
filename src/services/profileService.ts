import { prisma } from '@config/prismaClient';
import type { Profile } from '@prisma/client';
import { uploadBufferToCloudinary } from '@services/upload/uploadService';
import { deleteCloudinaryByPublicId } from '@services/upload/deleteService';
import { upload } from '@middleware/uploadMiddleware';
import { AppError } from '@utils/appErrorUtil';

// GET profile by user ID
export const getProfileService = async (userId: number) => {
    return prisma.profile.findUnique({
        where: { userId: userId },
        include: { image: true },
    });
};

// POST create a new profile
export const createProfileService = async (profileData: Profile, files: Express.Multer.File[]) => {
    let finalImageUrl: string | undefined;
    let finalPublicId: string | undefined;

    const file = files?.[0];

    if (file?.buffer) {
        const uploadResult = await uploadBufferToCloudinary(file.buffer, 'profiles');
        finalImageUrl = uploadResult?.secure_url ?? '';
        finalPublicId = uploadResult?.public_id ?? '';
    }
    
    return prisma.profile.create({
        data: { 
            bio: profileData.bio,
            userId: profileData.userId,
            image: finalImageUrl
                ? { create:
                    {
                        url: finalImageUrl,
                        publicId: finalPublicId,
                    }
                } : undefined,
        },
        include: { image: true },
    });
};

// PATCH update a profile by user ID
export const updateProfileService = async (userId: number, data: Partial<Profile>, files: Express.Multer.File[], imageUrl?: string) => {
    const existingProfile = await prisma.profile.findUnique({
        where: { userId: userId },
        include: { image: true },
    });

    if (!existingProfile) {
        throw new AppError(404, 'Profile not found');
    }

    let finalImageUrl: string | undefined;
    let finalPublicId: string | undefined;

    const file = files?.[0];

    if (file?.buffer) {
        const uploadResult = await uploadBufferToCloudinary(file.buffer, 'profiles');
        finalImageUrl = uploadResult?.secure_url ?? '';
        finalPublicId = uploadResult?.public_id ?? '';

        if (finalPublicId && existingProfile?.image?.publicId && existingProfile.image.publicId !== finalPublicId) {
            await deleteCloudinaryByPublicId(existingProfile.image.publicId);
        }
    } else if (imageUrl?.trim()) {
        finalImageUrl = imageUrl.trim();
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
                            publicId: finalPublicId,
                        },
                        update: {
                            url: finalImageUrl,
                            publicId: finalPublicId,
                        }
                    }
                } : undefined,
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
        throw new AppError(404, 'Profile not found');
    }

    if (existingProfile?.image?.publicId) {
        await deleteCloudinaryByPublicId(existingProfile.image.publicId);
    }

    return await prisma.profile.delete({
        where: { id: profileId },
        include: { image: true },
    });
};