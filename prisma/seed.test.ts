import { prisma } from '../src/config/prismaClient';
import { hashPassword } from '../src/utils/hashedPasswordUtil';

async function main() {
    const email = 'test.user@example.com';
    const password = 'MySecureP@ssworD123';
    const existing = await prisma.user.findUnique({ where: { email: email } });

    if (!existing) {
        await prisma.user.create({
            data: {
                email: email,
                password: await hashPassword(password),
                firstName: 'Test User',
                lastName: 'Automated',
            },
        });
        console.log('Test user created', email);
    } else {
        console.log('Test user already exists', email);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });