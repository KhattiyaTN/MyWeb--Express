import { PrismaClient } from "../generated/prisma";
import type { Profile } from "../types/types";

const prisma = new PrismaClient();

//GET profile by ID
export const getProfileService = async (id: number) => {
    const profile = await prisma.profile.findUnique({
        where: { userId: id },
        include: { image: true }
    });

    return profile;
}

// POST create new profile
export const createProfileService = async (profileData: Profile) => {
    // Business logic about keeping profile data to profile table and image path of aws s3 to image table
}

// PATCH update profile by ID
export const updateProfileService = async (id: number, data: Partial<Profile>) => {
    const updateProfile = await prisma.profile.update({
        where: { userId: id },
        data: data
    })

    return updateProfile;
}

// DELETE profile by ID
export const deleteProfileService = async (id: number) => {
    await prisma.profile.delete({
        where: { userId: id }
    })
}

