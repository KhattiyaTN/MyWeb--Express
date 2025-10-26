import type { JwtPayload as LibJwtPayload } from 'jsonwebtoken';

export interface JwtPayload extends LibJwtPayload {
    id: number;
    email: string;
}

export interface RefreshTokenPayload {
    token: string;
}