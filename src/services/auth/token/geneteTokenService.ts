import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '@config/prismaClient';
import type { User } from '@prisma/client';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

export const generateTokenService = async (user: User, ipAddress?: string, userAgent?: string) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('Server configuration error: JWT_SECRET is not defined');
    }
    
    const accessToken = jwt.sign(
        {
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

    return { accessToken, refreshToken, tokenHash };
}