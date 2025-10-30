import compression from 'compression';

const SKIP_PATHS = new Set(['/healthz']);

export const compressionMiddleware = compression({
    threshold: 1024,
    level: 6,
    filter: (req, res) => {
        if (SKIP_PATHS.has(req.path)) {
            return false;
        }

        const type = String(res.getHeader('Content-Type') || '');
        if (/(image|audio|video|pdf)/i.test(type)) {
            return false;
        }

        return compression.filter(req, res);
    }
});