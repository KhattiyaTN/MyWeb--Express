import type { Request, Response, NextFunction } from "express";
import { loginService } from "../../services/auth/loginService";

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const token = await loginService(email, password);
        res.status(200).json({ token });

    } catch (error) {
        next(error);
    }
}