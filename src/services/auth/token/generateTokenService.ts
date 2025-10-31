import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '@config/env/env';
import { prisma } from '@config/prismaClient';
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY_DAYS } from '@config/auth/tokenExp';
import type { User } from '@prisma/client';
import { AppError } from '@utils/appErrorUtil';

export const generateTokenService = async (user: User, ipAddress?: string, userAgent?: string) => {
    const secret = env.JWT_SECRET;

    if (!secret) {
        throw new AppError(500, 'Server configuration error: JWT_SECRET is not defined');
    }
    
    const accessToken = jwt.sign(
        {
            sub: String(user.id),
            id: user.id,
            email: user.email,
        },
        secret,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        }
    );

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            tokenHash,
            expiresAt,
            ipAddress: ipAddress,
            userAgent: userAgent,
        }
    });

    return { accessToken, refreshToken };
}