import type { Request, Response, NextFunction } from "express";
import { uploadFileToS3 } from "../../services/aws/uploadService";
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
        const userFiles = req.files as Express.Multer.File[] || [];

        let imageUrls: string[] = [];

        if (userFiles.length > 0) {
            imageUrls = await Promise.all(userFiles.map(file => uploadFileToS3(file)));
        } else if (typeof req.body.imageUrl === 'string' && req.body.imageUrl.trim() !== '') {
            imageUrls = [req.body.imageUrl];
        } else {
            return res.status(400).json({ message: 'Image file or imageUrl is required' });
        }

        const newUser = await addUserService( userData, imageUrls );
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