import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '@config/env/env';
import { prisma } from '@config/prismaClient';
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY_DAYS } from '@config/auth/tokenExp';
import { AppError } from '@utils/appErrorUtil';

export const refreshAccessTokenService = async ( 
    refreshToken: string,
    ipAddress: string = 'unknown',
    userAgent: string = 'unknown',
) => {
    const tokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

    const storedToken = await prisma.refreshToken.findUnique({
        where: { tokenHash },
    })

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
        throw new AppError(401, 'Invalid or expired refresh token');
    }

    const ipMismatch = storedToken.ipAddress && storedToken.ipAddress !== ipAddress;
    const agentMismatch = storedToken.userAgent && storedToken.userAgent !== userAgent;

    if (ipMismatch || agentMismatch) {
        await prisma.refreshToken.updateMany({
            where: { 
                userId: storedToken.userId, 
                revokedAt: null 
            },
            data: { 
                revokedAt: new Date() 
            },
        });
        throw new AppError(401, 'Suspicious refresh attempt detected');
    }

    const user = await prisma.user.findUnique({
        where: { id: storedToken.userId },
    })

    if (!user) {
        throw new AppError(404, 'User not found');
    }

    const accessToken = jwt.sign(
        {
            sub: String(user.id),
            id: user.id,
            email: user.email,
        },
        env.JWT_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        }
    )

    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    const newHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
        await tx.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: newHash,
                expiresAt,
                ipAddress,
                userAgent,
            }
        })

        await tx.refreshToken.update({
            where: { id: storedToken.id },
            data: { 
                revokedAt: new Date(),
                replacedBy: newHash,
            },
        })
    });

    return { accessToken, refreshToken: newRefreshToken };
}