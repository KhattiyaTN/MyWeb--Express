import { prisma } from '../src/config/prismaClient';
import { hashPassword } from '../src/utils/hashedPasswordUtil';

async function main() {
    const email = 'test.user@example.com';
    const password = await hashPassword('MySecureP@ssworD123');

    try {
        await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS=0');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE `Contract`');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE `Certification`');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE `Badge`');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE `Project`');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE `Profile`');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE `User`');
    } finally {
        await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS=1');
    }

    const user = await prisma.user.create({
        data: {
            email,
            password,
            firstName: 'Test',
            lastName: 'User',
        },
    });

    await prisma.contract.createMany({
        data: [{
            name: 'Standard Test Contract',
            userId: user.id,
        }],
    });

    await prisma.certification.createMany({
        data: [{
            name: 'Standard Test Certification',
            authority: 'Test Authority',
            licenseNo: 'CERT-123456',
            userId: user.id,
        }],
    });

    await prisma.badge.createMany({
        data: [{
            name: 'Standard Test Badge',
            userId: user.id,
        }],
    });

    await prisma.project.createMany({
        data: [{
            name: 'Standard Test Project',
            description: 'This is a standard test project.',
            userId: user.id,
        }],
    });

    await prisma.profile.createMany({
        data: [{
            bio: 'This is a standard test profile.',
            userId: user.id,
        }],
    });

    console.log('✓ Seeded test user and related data:', email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });