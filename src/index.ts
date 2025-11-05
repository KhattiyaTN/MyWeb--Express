import { env } from '@config/env/env';
import { registerShutdown } from '@config/shutdown';
import { startRefreshTokenCleanJob } from '@jobs/refreshTokenCleanJob'
import { createApp } from '@app';

// Create Express app
const app = createApp();

// Start server
const server = app.listen(env.PORT, () => {
    console.log(`Server running in ${env.NODE_ENV || 'development'} mode on port ${env.PORT}`);
});

// Start the cleanup job
let cleanUpTimer: ReturnType<typeof setInterval> | undefined;
if (env.NODE_ENV !== 'test') {
    cleanUpTimer = startRefreshTokenCleanJob();
}

// Graceful shutdown
registerShutdown(server, { cleanUpTimer: cleanUpTimer });

// E2E testing export
export { app };