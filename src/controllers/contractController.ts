import type { Request, Response, NextFunction } from 'express';
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
        const createContract = req.body;
        const newContract = await createContractService(createContract);
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