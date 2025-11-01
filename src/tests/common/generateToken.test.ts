import { describe, test, expect, spyOn, afterEach } from 'bun:test';
import { generateTokenService } from '@services/auth/token/generateTokenService';
import { env } from '@config/env/env';
import type { User } from '@prisma/client';
import crypto from 'crypto';

const fakeUser = { id: 1234, email: 'u@example.com' } as unknown as User;

let restores: Array<() => void> = [];
afterEach(() => {
    for (const r of restores) r();
    restores = [];
});

// Generate token tests
describe('Generate token', () => {
    test('throws when JWT_SECRET missing (and does not hit DB)', async () => {
        const original = env.JWT_SECRET;
        (env as any).JWT_SECRET = '';

        const fakePrisma = { refreshToken: { create: async (_: any) => ({}) } } as any;
        const spyCreate = spyOn(fakePrisma.refreshToken, 'create').mockResolvedValue({} as any);
        restores.push(() => {
            spyCreate.mockRestore();
            (env as any).JWT_SECRET = original;
        });

        await expect(generateTokenService(fakeUser, 'ip', 'ua', { prisma: fakePrisma }))
            .rejects
            .toThrow(/JWT_SECRET/i);

        expect(spyCreate).not.toHaveBeenCalled();
    });

    test('persists refresh with future expiresAt', async () => {
        const buf = Buffer.alloc(40, 0xcd);
        const spyRand = spyOn(crypto, 'randomBytes').mockImplementation((_size: number) => buf);
        restores.push(() => spyRand.mockRestore());

        const original = env.JWT_SECRET;
        (env as any).JWT_SECRET = 'this_is_a_very_long_test_secret_string_at_least_32_chars';
        restores.push(() => { (env as any).JWT_SECRET = original; });

        const fakePrisma = { refreshToken: { create: async (_: any) => ({}) } } as any;
        
        const captured: any[] = [];
        const spyCreate = spyOn(fakePrisma.refreshToken, 'create').mockImplementation(async (data: any) => {
            captured.push(data);
            return {} as any;
        });
        restores.push(() => spyCreate.mockRestore());
        
        const now = Date.now();
        const nowSpy = spyOn(Date, 'now').mockReturnValue(now);
        restores.push(() => nowSpy.mockRestore());
    
        await generateTokenService(fakeUser, '1.1.1.1', 'ua', { prisma: fakePrisma });

        expect(spyCreate).toHaveBeenCalledTimes(1);
        const expiresAt: Date = captured[0].data.expiresAt;
        expect(expiresAt instanceof Date).toBe(true);
        expect(expiresAt.getTime()).toBeGreaterThan(now);
    });

    test('should generate a JWT accessToken and an opaque refreshToken', async () => {
        const buf = Buffer.alloc(40, 0xab);
        const spyRand = spyOn(crypto, 'randomBytes').mockImplementation((_size: number) => buf);
        restores.push(() => spyRand.mockRestore());

        const fakePrisma = {refreshToken: { create: async (_data: any) => ({}) } } as any;
        const spyCreate = spyOn(fakePrisma.refreshToken, 'create').mockResolvedValue({} as any);
        restores.push(() => spyCreate.mockRestore());

        const original = env.JWT_SECRET;
        (env as any).JWT_SECRET = 'this_is_a_very_long_test_secret_string_at_least_32_chars';
        restores.push(() => { (env as any).JWT_SECRET = original; });

        const { accessToken, refreshToken } = await generateTokenService(
            fakeUser,
            '1.2.3.4',
            'UnitTestAgent',
            { prisma: fakePrisma }
        );

        expect(typeof accessToken).toBe('string');
        expect(accessToken.split('.').length).toBe(3);

        const expectedRefreshToken = buf.toString('hex');
        expect(refreshToken).toBe(expectedRefreshToken);

        const expectedHashed = crypto.createHash('sha256').update(expectedRefreshToken).digest('hex');
        expect(spyCreate).toHaveBeenCalledWith({
            data: expect.objectContaining({
                userId: fakeUser.id,
                tokenHash: expectedHashed,
                ipAddress: '1.2.3.4',
                userAgent: 'UnitTestAgent',
                expiresAt: expect.any(Date),
            }),
        });
    });
});

