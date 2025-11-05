import { env } from '@config/env/env';
import { startRefreshTokenCleanJob } from './refreshTokenCleanJob';

export function startCleanJob(): ReturnType<typeof setInterval> | undefined {
    let cleanUpTimer: ReturnType<typeof setInterval> | undefined;
    
    if (env.NODE_ENV !== 'test') {
        cleanUpTimer = startRefreshTokenCleanJob();
    }

    return cleanUpTimer;
}