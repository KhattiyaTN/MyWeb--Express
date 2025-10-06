import type { Request, Response, NextFunction } from 'express';
import { uploadFileToS3 } from '../services/aws/uploadService';
import { getContractService, createContractService, updateContractService, deleteContractService } from '../services/contractService';

// GET
export const getContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contract = await getContractService();
        res.status(200).json(contract);
    } catch (error) {
        next(error);
    }
};

// POST
export const createContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contractData = req.body;
        const contractUrls = req.files as Express.Multer.File[] || [];

        let imageUrls: string[] = [];

        if (contractUrls.length > 0) { 
            imageUrls = await Promise.all(contractUrls.map(file => uploadFileToS3(file)));
        } else if (typeof req.body.imageUrl === 'string' && req.body.imageUrl.trim() !== '') {
            imageUrls = [req.body.imageUrl.trim()];
        } else {
            return res.status(400).json({ message: 'Image file or imageUrl is required' });
        }

        const newContract = await createContractService( contractData, imageUrls );
        res.status(201).json(newContract);
    } catch (error) {
        next(error);
    }
};

// PATCH
export const updateContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const contractId = Number(id);

        if (isNaN(contractId)) {
            return res.status(400).json({ message: 'Invalid contract ID' });
        }

        const updateContract = await updateContractService(contractId, data);

        res.status(200).json(updateContract);
    } catch (error) {
        next(error);
    }
}

// DELETE
export const deleteContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const contractId = Number(id);

        if (isNaN(contractId)) {
            return res.status(400).json({ message: 'Invalid contract ID' });
        }

        await deleteContractService(contractId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}