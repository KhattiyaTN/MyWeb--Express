import { describe, test, expect } from 'bun:test';
import { hashPassword } from '@utils/hashedPasswordUtil';

// Hashing password tests
describe('Password hashing', () => {
    test('should hash password correctly', async () => {
        const password = 'mySecurePassword';
        const hashedPassword = await hashPassword(password);
        expect(hashedPassword).not.toBe(password);
        expect(hashedPassword.length).toBeGreaterThan(0);
        expect(hashedPassword.startsWith('$2')).toBe(true);
    });

    test('same password hashes should differ (random salt) both verify true', async () => {
        const password = 'mySecurePassword';
        const hash1 = await hashPassword(password);
        const hash2 = await hashPassword(password);
        expect(hash1).not.toBe(hash2);
    })
});