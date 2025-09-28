import type { Request, Response, NextFunction } from "express";
import { getAllCertService, addCertService, updateCertService, deleteCertService } from "../services/certService";

// GET all certs
export const getCerts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const certs = await getAllCertService();
        res.status(200).json(certs);
    } catch (error) {
        next(error);
    }
};

// POST create a new certificate
export const createCert = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const certData = req.body;
        const newCert = await addCertService(certData);
        res.status(201).json(newCert);
    } catch (error) {
        next(error);
    }
}

// PATCH update a certificate
export const updateCert = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const certId = Number(id);

        if (isNaN(certId)) {
            return res.status(400).json({ message: 'Invalid certificate ID' });
        }

        const updatedCert = await updateCertService(certId, data);

        res.status(200).json(updatedCert);
    } catch (error) {
        next(error);
    }
}

// DELETE a certificate
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