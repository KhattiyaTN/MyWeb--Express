export function safeBody(body: any) {
    if (!body || typeof body !== 'object') return body;
    
    const json = JSON.stringify(body);
    if (json.length > 5000) return '[BODY_TOO_LARGE]';

    const clone: any = { ...body as any };

    for (const k of ['password', 'refreshToken', 'accessToken']) {
        if (k in clone) clone[k] = '[REDACTED]';
    }

    return clone;
}