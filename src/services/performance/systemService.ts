import { prisma } from '@config/prismaClient';

// Prisma system ready check
export const systemReady = async () => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch {
        return false;
    }
};
