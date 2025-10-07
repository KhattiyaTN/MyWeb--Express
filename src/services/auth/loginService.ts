import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prismaClient';
import { comparePassword } from '../../utils/comparePassword';

// Login
export const loginService = async (email: string, password: string) => {
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

    const token = jwt.sign(
        {
            sub: String(user.id),
            email: user.email,
            iat: Date.now(),
        },
        secret,
        {
            expiresIn: '1h',
        }
    );

    return token;
}