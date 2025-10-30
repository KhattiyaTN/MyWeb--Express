import crypto from 'crypto';
import { prisma } from '@config/prismaClient';

// Logout
export const logoutService = async (refreshToken: string) => {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const token = await prisma.refreshToken.findUnique({
        where: { tokenHash },
    })

    if (!token) return;

    await prisma.refreshToken.update({
        where: { id: token.id },
        data: { revokedAt: new Date() }
    })
}