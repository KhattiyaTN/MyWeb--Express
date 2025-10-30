import type { JwtPayload as LibJwtPayload } from 'jsonwebtoken';

export interface JwtPayload extends LibJwtPayload {
    sub?: string;
    id?: number;
    email?: string;
}

export interface RefreshTokenPayload {
    token: string;
}