import type { Server } from 'http';
import { prisma } from '@config/prismaClient';

// Graceful shutdown
export function registerShutdown(server: Server) {
    const shutdown = async (signal: string, err?: unknown) => {
        if (err) {
            console.error(`Received ${signal} with error:`, err);
        } else {
            console.log(`Received ${signal}, shutting down gracefully...`);
        }
    
        server.close(async () => {
            try {
                await prisma.$disconnect();
                console.log('Prisma disconnection. Bye!');
            } catch (e) {
                console.error('Error during Prisma disconnection:', e);
            } finally {
                process.exit(err ? 1 : 0);
            }
        });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('uncaughtException', (err) => shutdown('uncaughtException', err));
    process.on('unhandledRejection', (reason) => shutdown('unhandledRejection', reason));
}

