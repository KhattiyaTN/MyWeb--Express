import { env } from '@config/env/env';
import { registerShutdown } from '@config/shutdown';
import { startRefreshTokenCleanJob } from '@jobs/refreshTokenCleanJob'
import { createApp } from '@app';

// Start the cleanup job
let cleanUpTimer: NodeJS.Timeout | undefined;

// Create Express app
const app = createApp();

// Start server
const server = app.listen(env.PORT, () => {
    console.log(`Server running in ${env.NODE_ENV || 'development'} mode on port ${env.PORT}`);
    if (env.NODE_ENV !== 'test') {
        cleanUpTimer = startRefreshTokenCleanJob();
    }
});

// Graceful shutdown
registerShutdown(server);

// E2E testing export
export { app };