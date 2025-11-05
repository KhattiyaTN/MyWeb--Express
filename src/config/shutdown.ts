import type { Server } from 'http';
import { prisma } from '@config/prismaClient';

type shutdownOptions = {
    cleanUpTimer?: ReturnType<typeof setInterval>;
    onCleanup?: () => Promise<void> | void;
}

let installed = false;

// Graceful shutdown
export function registerShutdown(server: Server, options: shutdownOptions = {}) {
    if (installed) {
        return;
    }

    installed = true;

    const shutdown = async (signal: string, err?: unknown) => {
        if (err) {
            console.error(`Received ${signal} with error:`, err);
        } else {
            console.log(`Received ${signal}, shutting down gracefully...`);
        }

        if (options.cleanUpTimer) {
            clearInterval(options.cleanUpTimer);
        }
    
        server.close(async () => {
            try {
                await options.onCleanup?.();
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

