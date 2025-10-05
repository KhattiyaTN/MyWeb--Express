import { PrismaClient } from '@prisma/client';
import type { User } from "../types/types"

const prisma = new PrismaClient();

// GET user service
export const getUsersService = async (userId: number) => {
    return await prisma.user.findFirst({
        where: { id: userId },
        // include: Image,
    });
}

// POST user service
export const addUserService = async (user: User) => {
    return await prisma.user.create({ 
        data: {
            ...user,
            createdAt: new Date(),
        } 
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