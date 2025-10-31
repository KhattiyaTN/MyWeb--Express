import { prisma } from '@config/prismaClient';
import { env } from '@config/env/env';
import { comparePassword } from '@utils/comparePasswordUtil';
import { generateTokenService } from '@services/auth/token/generateTokenService';
import { AppError } from '@utils/appErrorUtil';

// Login
export const loginService = async (email: string, password: string, ip: string, userAgent: string) => {
    const user = await prisma.user.findUnique({ where: { email }});

    if (!user) {
        throw new AppError(401, 'Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new AppError(401, 'Invalid email or password');
    }

    const secret = env.JWT_SECRET!;
    
    if (!secret) {
        throw new AppError(500, 'Server misconfigured: JWT_SECRET is missing');
    }

    const { accessToken, refreshToken } = await generateTokenService(user, ip, userAgent);

    return { accessToken, refreshToken };
}