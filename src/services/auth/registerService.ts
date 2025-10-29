import { prisma } from '@config/prismaClient';
import { hashPassword } from '@utils/hashedPassword';
import type { User } from "@prisma/client";

// Register
export const registerService = async (userData: User) => {
    const hashedPassword = await hashPassword(userData.password);

    const created = await prisma.user.create({
        data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            introduction: userData.introduction,
            email: userData.email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            introduction: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    return created;
};