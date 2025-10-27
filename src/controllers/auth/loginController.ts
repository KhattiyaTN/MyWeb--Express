import type { Request, Response, NextFunction } from "express";
import { loginService } from "@services/auth/loginService";

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip || '';
        const userAgent = String(req.headers['user-agent'] || '');

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const { accessToken, refreshToken } = await loginService(email, password, ipAddress, userAgent);

        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
}