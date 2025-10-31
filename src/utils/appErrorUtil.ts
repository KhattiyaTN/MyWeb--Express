export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code?: string;

    constructor(statusCode: number, message: string, opts?: { code?: string; cause?: unknown}) {
        super(message, { cause: opts?.cause });
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.code = opts?.code;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace?.(this, this.constructor);
    }
}