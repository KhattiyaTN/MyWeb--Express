import { env } from '@config/env/env';
import { createApp } from '@app';
import { startCleanJob } from '@jobs/startCleanJob';
import { registerShutdown } from '@config/shutdown';

// Create Express app
const app = createApp();

// Start server
const server = app.listen(env.PORT, () => {
    console.log(`Server running in ${env.NODE_ENV || 'development'} mode on port ${env.PORT}`);
});

// Start the cleanup job
const cleanUpTimer = startCleanJob();

// Graceful shutdown
registerShutdown(server, { cleanUpTimer: cleanUpTimer });

// E2E testing export
export { app };