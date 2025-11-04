import { prisma } from '@config/prismaClient';
import { env } from '@config/env/env';

export function startRefreshTokenCleanJob() {
    const DAY = 24 * 60 * 60 * 1000;

    const run = async () => {
        try {
            const now = new Date();

            // Delete expired refresh tokens
            const expired = await prisma.refreshToken.deleteMany({
                where: { expiresAt: { lt: now }},
            });

            // Delete revoked tokens older than 30 days
            const oldRevoked = await prisma.refreshToken.deleteMany({
                where: {
                    revokedAt: { not: null, lt: new Date(now.getTime() - 30 * DAY) }
                },
            });
            if (env.NODE_ENV !== 'test') {
                console.log(`RefreshTokenCleanJob: Deleted ${expired.count} expired and ${oldRevoked.count} old revoked tokens.`);
            }
        } catch (error) {
            if (env.NODE_ENV !== 'test') {
                console.error('Error cleaning up expired refresh tokens:', error);
            }
        }
    };

    run();
    return setInterval(run, DAY);
}