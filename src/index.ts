import { env } from '@config/env/env';
import { registerShutdown } from '@config/shutdown';
import { createApp } from './app';

// Create Express app
const app = createApp();

// Start server
const server = app.listen(env.PORT, () => {
    console.log(`Server running in ${env.NODE_ENV || 'development'} mode on port ${env.PORT}`);
});

// Graceful shutdown
registerShutdown(server);

// E2E testing export
export { app };