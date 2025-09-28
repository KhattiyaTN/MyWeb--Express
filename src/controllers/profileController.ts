import type { Request, Response } from 'express';
import { getProfileService, createProfileService, updateProfileService, deleteProfileService } from '../services/profileService';

// GET
export const getProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const profileId = Number(id);

    if (isNaN(profileId)) {
        return res.status(400).json({ message: 'Invalid profile ID' });
    }
    const profilePath = await getProfileService(profileId);
    res.status(200).json(profilePath);
};

// POST
export const createProfile = async (req: Request, res: Response) => {
    const profilePath = req.body;
    const newProfile = await createProfileService(profilePath);
    return res.status(201).json(newProfile);
};

// PATCH
export const updateProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const profileId = Number(id);

    if (isNaN(profileId)) {
        return res.status(400).json({ message: 'Invalid profile ID' });
    }

    const updateProfile = await updateProfileService(profileId, data);
    res.status(200).json(updateProfile);
}

// DELETE
export const deleteProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const profile = Number(id);

    if (isNaN(profile)) {
        return res.status(400).json({ message: 'Invalid profile ID' });
    }

    await deleteProfileService(profile);
    res.status(204).send();
}