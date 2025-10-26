import type { Request, Response, NextFunction } from 'express';
import { refreshAccessTokenService } from '../../services/auth/token/refreshAccessTokenService';

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        const { accessToken, refreshToken: newRefreshToken } = await refreshAccessTokenService(refreshToken);

        res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    } catch (error: any) {
        const msg = (error?.message || '').toLowerCase();

        if (msg.includes('invalid') || msg.includes('expired') || msg.includes('not found')) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        next(error);
    }
}