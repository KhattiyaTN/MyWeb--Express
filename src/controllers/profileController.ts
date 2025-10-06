import type { Request, Response, NextFunction } from 'express';
import { uploadFileToS3 } from '../services/aws/images/uploadImageService';
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

        let imageUrls: string[] = [];

        if (profileUrls.length > 0) { 
            imageUrls = await Promise.all(profileUrls.map(file => uploadFileToS3(file)));
        } else if (typeof req.body.imageUrl === 'string' && req.body.imageUrl.trim() !== '') {
            imageUrls = [req.body.imageUrl.trim()];
        } else {
            return res.status(400).json({ message: 'Image file or imageUrl is required' });
        }

        const newProfile = await createProfileService( profileData, imageUrls );
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
        const profileFiles = [];

        let imageUrl: string = '';
    
        if (isNaN(profileId)) {
            return res.status(400).json({ message: 'Invalid profile ID' });
        }

        if (req.files) {
            profileFiles.push(...(req.files as Express.Multer.File[]));
    
            if (profileFiles.length > 0) {
                const imageUrls = await Promise.all(profileFiles.map(file => uploadFileToS3(file)));
    
                if (imageUrls[0]) {
                    imageUrl = imageUrls[0];
                }
            }
        }

        const updateProfile = await updateProfileService(profileId, data, imageUrl);

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