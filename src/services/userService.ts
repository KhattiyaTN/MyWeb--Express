import { PrismaClient } from '@prisma/client';
import type { User } from "../types/types"

const prisma = new PrismaClient();

// GET user service
export const getUsersService = async (userId: number) => {
    return await prisma.user.findFirst({
        where: { id: userId },
        include: { 
            image: true 
        }
    });
}

// POST user service
export const addUserService = async (userData: User, imageUrls: string[]) => {
    return await prisma.user.create({ 
        data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            introduction: userData.introduction,
            email: userData.email,
            password: "hashed",
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
        include: { image: true } 
    });
}

// PATCH user service
export const updateUserService = async (id: number, data: Partial<User>) => {
    return await prisma.user.update({
        where: { id: id },
        data: {
            ...data,
            updatedAt: new Date(),
        }
    })
}