import { PrismaClient } from "../generated/prisma";
import type { User } from "../types/types"

const prisma = new PrismaClient();

// GET users service
export const getAllUsersService = async () => {
    return await prisma.user.findMany();
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