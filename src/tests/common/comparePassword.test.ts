import { describe, it, expect } from 'bun:test';
import { comparePassword } from '@utils/comparePasswordUtil';
import { hashPassword } from '@utils/hashedPasswordUtil';

// Comparing password tests
describe('Password comparison', () => {
    it('should compare password correctly', async () => {
        const password = 'mySecurePassword';
        const hashedPassword = await hashPassword(password);
        const isMatch = await comparePassword(password, hashedPassword);
        expect(isMatch).toBe(true);
    });
    
    it('should return false for wrong password', async () => {
        const password = 'mySecurePassword';
        const hashedPassword = await hashPassword(password);
        const isMatch = await comparePassword('wrongPassword', hashedPassword);
        expect(isMatch).toBe(false);
    });
});