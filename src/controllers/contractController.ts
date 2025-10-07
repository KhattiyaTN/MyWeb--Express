import type { Request, Response, NextFunction } from 'express';
import { uploadFileToS3 } from '../services/aws/images/uploadImageService';
import { getContractService, createContractService, updateContractService, deleteContractService } from '../services/contractService';

// GET
export const getContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = Number(id);

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const contract = await getContractService(userId);
        res.status(200).json(contract);
    } catch (error) {
        next(error);
    }
};

// POST
export const createContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contractData = req.body;
        const contractFiles = req.files as Express.Multer.File[] || [];

        if (!contractFiles.length) {
            return res.status(400).json({ message: 'Image file or imageUrl is required' });
        }

        const newContract = await createContractService(contractData, contractFiles);
        res.status(201).json(newContract);
    } catch (error) {
        next(error);
    }
};

// PATCH
export const updateContract = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const contractId = Number(id);
        const data = req.body;
        const contractFiles = req.files as Express.Multer.File[] || [];

        if (isNaN(contractId)) {
            return res.status(400).json({ message: 'Invalid contract ID' });
        }

        const updateContract = await updateContractService(contractId, data, contractFiles);

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