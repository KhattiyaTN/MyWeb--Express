import type { Request, Response } from "express";
import { getAllUsers, addUser, updateUser as updateUserService } from "../services/userService";

// GET
export const getUsers =  async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

// POST
export const createUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const newUser = await addUser({
            firstName,
            lastName,
            email,
            password,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

// PATCH
export const updateUser = async (req: Request, res: Response) => {
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
        res.status(500).json({ message: 'Server Error' })
    }
}