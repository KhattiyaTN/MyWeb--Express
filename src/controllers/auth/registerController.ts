import type { Request, Response, NextFunction } from "express";
import { registerService } from "../../services/auth/registerService";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;

        const newUser = await registerService(userData);
        res.status(201).json(newUser);

    } catch (error) {
        next(error);
    }
};