import type { Request, Response, NextFunction } from 'express';
import { logoutService } from '../../services/auth/logoutService';

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        await logoutService(refreshToken);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}