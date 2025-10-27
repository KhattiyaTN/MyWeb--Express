import crypto from 'crypto';
import { prisma } from '@config/prismaClient';
import { generateTokenService } from '@tokenServices/geneteTokenService';

export const refreshAccessTokenService = async (refreshToken: string) => {
    const tokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

    const storedToken = await prisma.refreshToken.findUnique({
        where: { tokenHash },
    })

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
        throw new Error('Invalid or expired refresh token');
    }

    const user = await prisma.user.findUnique({
        where: { id: storedToken.userId },
    })

    if (!user) {
        throw new Error('User not found');
    }

    const { 
        accessToken, 
        refreshToken: newRefreshToken, 
        tokenHash: newHash 
    } = await generateTokenService(
        user,
        storedToken.ipAddress ?? undefined,
        storedToken.userAgent ?? undefined
    );

    await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: {
            revokedAt: new Date(),
            replacedBy: newHash,
        }
    })

    return { accessToken, refreshToken: newRefreshToken };
}