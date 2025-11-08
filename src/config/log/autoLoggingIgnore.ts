export const shouldIgnoreLog = (url: string) =>
    url === '/favicon.ico' ||
    url === '/robots.txt' ||
    url.startsWith('/health') ||
    url.startsWith('/healthz') ||
    url.startsWith('/metrics') ||
    url === '/ping';