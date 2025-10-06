import type { Request, Response, NextFunction } from 'express';
import { uploadFileToS3 } from '../services/aws/uploadService';
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

        let imageUrls: string[] = [];

        if (badgeFiles.length > 0) {
            imageUrls = await Promise.all(badgeFiles.map(file => uploadFileToS3(file)));
        } else if (typeof req.body.imageUrl === 'string' && req.body.imageUrl.trim() !== '') {
            imageUrls = [req.body.imageUrl.trim()];
        } else {
            return res.status(400).json({ message: 'Image file or imageUrl is required' });
        }

        const newBadge = await createBadgeService(badgeData, imageUrls);
        res.status(201).json(newBadge);
    } catch (error) {
        next(error);
    }
};

// PATCH
export const updateBadge = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const badgeId = Number(id);
        const data = req.body;
        const badgeFiles = [];

        let imageUrl: string = '';

        if (req.files) {
            badgeFiles.push(...(req.files as Express.Multer.File[]));

            if (badgeFiles.length > 0) {
                const imageUrls = await Promise.all(badgeFiles.map(file => uploadFileToS3(file)));

                if (imageUrls[0]) {
                    imageUrl = imageUrls[0];
                }
            }
        }
    
        if (isNaN(badgeId)) {
            return res.status(400).json({ message: 'Invalid badge ID' });
        }
    
        const updateBadge = await updateBadgeService(badgeId, data, imageUrl);
    
        res.status(200).json(updateBadge);
    } catch (error) {
        next(error);
    }
}

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