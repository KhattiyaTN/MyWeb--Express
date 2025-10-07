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

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            password: user.password,
        },
        process.env.JWT_SECRET || 'default_secret',
        {
            expiresIn: '1h',
        }
    );

    return { token, user }
}