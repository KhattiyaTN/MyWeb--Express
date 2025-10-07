import { prisma } from '../../config/prismaClient';
import { hashPassword } from '../../utils/hashedPassword';
import type { User } from "../../types/schema_type"

// Register
export const registerService = async (userData: User) => {
    const hashedPassword = await hashPassword(userData.password);

    return await prisma.user.create({
        data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            introduction: userData.introduction,
            email: userData.email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    });
};