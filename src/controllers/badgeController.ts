import type { Request, Response, NextFunction } from 'express';
import { getAllBadgesService, createBadgeService, updateBadgeService, deleteBadgeService } from '@services/badgeService';

// GET
export const getBadges = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || typeof req.user.id !== 'number') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const id = req.user.id;
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

        if (!badgeFiles.length) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        const newBadge = await createBadgeService(badgeData, badgeFiles);
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