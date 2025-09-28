import type { Request, Response } from "express";
import { getAllCertService, addCertService, updateCertService, deleteCertService } from "../services/certService";

// GET all certs
export const getCerts = async (req: Request, res: Response) => {
    const certs = await getAllCertService();

    res.status(200).json(certs);
}

// POST create a new certificate
export const createCert = async (req: Request, res: Response) => {
    const certData = req.body;
    const newCert = await addCertService(certData);

    res.status(201).json(newCert);
}

// PATCH update a certificate
export const updateCert = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const certId = Number(id);

    if (isNaN(certId)) {
        return res.status(400).json({ message: 'Invalid certificate ID' });
    }

    const updatedCert = await updateCertService(certId, data);

    res.status(200).json(updatedCert);
}

// DELETE a certificate
export const deleteCert = async (req: Request, res: Response) => {
    const { id } = req.params;
    const certId = Number(id);

    if (isNaN(certId)) {
        return res.status(400).json({ message: 'Invalid certificate ID' });
    }

    await deleteCertService(certId);
}