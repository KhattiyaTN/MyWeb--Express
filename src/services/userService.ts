import { prisma } from '@config/prismaClient';
import type { User } from "@prisma/client"
import { hashPassword } from '@utils/hashedPasswordUtil';

// GET user service
export const getUsersService = async (userId: number) => {
    return await prisma.user.findFirst({
        where: { id: userId },
    });
}

// POST user service
export const addUserService = async (userData: User) => {

    const hashedPassword = await hashPassword(userData.password);

    return await prisma.user.create({ 
        data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            introduction: userData.introduction,
            email: userData.email,
            password: hashedPassword,
        }
    });
}

// PATCH user service
export const updateUserService = async (id: number, data: Partial<User>) => {
    return await prisma.user.update({
        where: { id: id },
        data: {
            ...data,
        }
    })
}