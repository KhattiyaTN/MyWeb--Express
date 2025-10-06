import type { Request, Response, NextFunction } from "express";
import { getUsersService, addUserService, updateUserService } from "../../services/auth/authService";

// GET
export const getUser =  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = Number(id);

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invelid user ID' });
        }

        const users = await getUsersService(userId);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// POST
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;

        const newUser = await addUserService( userData );
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

// PATCH
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const data = req.body
        const userId = Number(id);

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const updatedUser = await updateUserService(userId, data);

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};