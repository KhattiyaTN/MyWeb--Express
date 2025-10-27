import crypto from 'crypto';
import { prisma } from '@config/prismaClient';

// Logout
export const logoutService = async (refreshToken: string) => {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const stored = await prisma.refreshToken.findUnique({
        where: { tokenHash },
    })

    if (!stored) {
        return { success: true };
    }
    
    if (!stored.revokedAt) {
        await prisma.refreshToken.update({
            where: { tokenHash },
            data: { revokedAt: new Date() }
        })
    }

    return { success: true };
}