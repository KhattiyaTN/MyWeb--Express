import type { Request, Response, NextFunction } from 'express';
import { uploadFileToS3 } from '../services/aws/images/uploadImageService';
import { getAllBadgesService, createBadgeService, updateBadgeService, deleteBadgeService } from '../services/badgeService';

// GET
export const getBadges = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = Number(id);
    
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
    
        const badges = await getAllBadgesService(userId);
    
        res.status(200).json(badges);
    } catch (error) {
        next(error);
    }
}

// POST
export const createBadge = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const badgeData = req.body;
        const badgeFiles = req.files as Express.Multer.File[] || [];

        if (!badgeFiles.length && !(typeof req.body.imageUrl === 'string' && req.body.imageUrl.trim() !== '')) {
            return res.status(400).json({ message: 'Image file or imageUrl is required' });
        }

        const newBadge = await createBadgeService(badgeData, badgeFiles, req.body.imageUrl);
        res.status(201).json(newBadge);
    } catch (error) {
        next(error);
    }
};

// PATCH
export const updateBadge = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const badgeId = Number(req.params.id);
        const data = req.body;
        const badgeFiles = req.files as Express.Multer.File[] || [];

        if (isNaN(badgeId)) {
            return res.status(400).json({ message: 'Invalid badge ID' });
        }

        const updatedBadge = await updateBadgeService(badgeId, data, badgeFiles);
        res.status(200).json(updatedBadge);
    } catch (error) {
        next(error);
    }
};

// DELETE
export const deleteBadge = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const badgeId = Number(id);
    
        if (isNaN(badgeId)) {
            return res.status(400).json({ message: 'Invalid badge ID' });
        }
    
        await deleteBadgeService(badgeId);
    
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}