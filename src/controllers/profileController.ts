import type { Request, Response, NextFunction } from 'express';
import { getProfileService, createProfileService, updateProfileService, deleteProfileService } from '../services/profileService';

// GET
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = Number(id);
    
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
    
        const profile = await getProfileService(userId);
        res.status(200).json(profile);
    } catch (error) {
        next(error);
    }
}

// POST
export const createProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profileData = req.body;
        const profileUrls = req.files as Express.Multer.File[] || [];

        if (!profileUrls.length) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        const newProfile = await createProfileService( profileData, profileUrls );
        res.status(201).json(newProfile);
    } catch (error) {
        next(error);
    }
}

// PATCH
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const profileId = Number(id);
        const data = req.body;
        const profileFiles = req.files as Express.Multer.File[] || [];
    
        if (isNaN(profileId)) {
            return res.status(400).json({ message: 'Invalid profile ID' });
        }

        const updateProfile = await updateProfileService(profileId, data, profileFiles);

        res.status(200).json(updateProfile);
    } catch (error) {
        next(error);
    }
}

// DELETE
export const deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const profileId = Number(id);
    
        if (isNaN(profileId)) {
            return res.status(400).json({ message: 'Invalid profile ID' });
        }
    
        await deleteProfileService(profileId);
    
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}