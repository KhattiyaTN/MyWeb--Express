import type { Request, Response, NextFunction } from "express";
import { getCertService, addCertService, updateCertService, deleteCertService } from "@services/certService";

// GET
export const getCerts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || typeof req.user.id !== 'number') {
            return res.status(400).json({ message: 'User not authenticated or ID missing' });
        }
        
        const id = req.user.id;
        const userId = Number(id);

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const certs = await getCertService(userId);
        res.status(200).json(certs);
    } catch (error) {
        next(error);
    }
};

// POST
export const createCert = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const certData = req.body;
        const certFiles = req.files as Express.Multer.File[] || [];

        if (!certFiles.length) {
            return res.status(400).json({ message: 'Image file or imageUrl is required' });
        }

        const newCert = await addCertService(certData, certFiles);
        res.status(201).json(newCert);
    } catch (error) {
        next(error);
    }
}

// PATCH
export const updateCert = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const certId = Number(id);
        const data = req.body;
        const certFiles = req.files as Express.Multer.File[] || [];


        if (isNaN(certId)) {
            return res.status(400).json({ message: 'Invalid certificate ID' });
        }

        const updatedCert = await updateCertService(certId, data, certFiles);

        res.status(200).json(updatedCert);
    } catch (error) {
        next(error);
    }
}

// DELETE
export const deleteCert = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const certId = Number(id);

        if (isNaN(certId)) {
            return res.status(400).json({ message: 'Invalid certificate ID' });
        }

        await deleteCertService(certId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}