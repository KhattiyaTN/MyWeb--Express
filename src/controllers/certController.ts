import type { Request, Response, NextFunction } from "express";
import { uploadFileToS3 } from "../services/aws/images/uploadImageService";
import { getCertService, addCertService, updateCertService, deleteCertService } from "../services/certService";
import type { Expr } from "aws-sdk/clients/cloudsearchdomain";

// GET
export const getCerts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
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

        if (!certFiles.length && !(typeof req.body.imageUrl === 'string' && req.body.imageUrl.trim() !== '')) {
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