import { PrismaClient } from "../generated/prisma";
import type { User } from "../types/types"

const prisma = new PrismaClient();

// GET users service
export const getAllUsers = async () => {
    return await prisma.user.findMany();
}

// POST user service
export const addUser = async (user: User) => {
    return await prisma.user.create({ data: user });
}

// PATCH user service
export const updateUser = async (id: number, data: Partial<User>) => {
    return await prisma.user.update({
        where: { id: id },
        data
    })
}