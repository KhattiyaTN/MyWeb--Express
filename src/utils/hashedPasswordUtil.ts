import bcrypt from 'bcrypt';
import { env } from '@config/env/env';

const SALT_ROUNDS = Number(env.BCRYPT_COST ?? 12);

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    
    return await bcrypt.hash(password, salt);
}