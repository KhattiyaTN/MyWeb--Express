import crypto from 'crypto';

export function genRequestId(existing?: string | string[]) {
    const raw = Array.isArray(existing) ? existing[0] : existing;
    return raw || crypto.randomUUID();
}