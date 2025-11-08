export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code?: string;
    public readonly details?: unknown;

    constructor(statusCode: number, message: string, opts?: { code?: string; details?: unknown}) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.code = opts?.code;
        this.details = opts?.details;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace?.(this, this.constructor);
    }
}