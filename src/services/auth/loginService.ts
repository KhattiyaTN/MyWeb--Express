import { prisma } from '@config/prismaClient';
import { comparePassword } from '@utils/comparePassword';
import { generateTokenService } from '@tokenServices/geneteTokenService';

// Login
export const loginService = async (email: string, password: string, ip: string, userAgent: string) => {
    const user = await prisma.user.findUnique({ where: { email }});

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const secret = process.env.JWT_SECRET!;
    
    if (!secret) {
        throw new Error('Server misconfigured: JWT_SECRET is missing');
    }

    const { accessToken, refreshToken } = await generateTokenService(user, ip, userAgent);

    return { accessToken, refreshToken };
}