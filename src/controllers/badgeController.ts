import type { Request, Response, NextFunction } from 'express';
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
        const newBadge = await createBadgeService(badgeData);
        res.status(201).json(newBadge);
    } catch (error) {
        next(error);
    }
}

// PATCH
export const updateBadge = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const badgeId = Number(id);
    
        if (isNaN(badgeId)) {
            return res.status(400).json({ message: 'Invalid badge ID' });
        }
    
        const updateBadge = await updateBadgeService(badgeId, data);
    
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