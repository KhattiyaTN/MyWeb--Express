import { PrismaClient } from '@prisma/client';
import type { Contract } from '../types/types'

const prisma = new PrismaClient();

// GET contract service
export const getContractService = async () => {
    return await prisma.contract.findMany();
}

// POST create contract service
export const createContractService = async (contract: Contract & { userId: number }) => {
    // Business logic about keeping contract data to contract table and image path of aws s3 to image table
}

// PATCH update contract service
export const updateContractService = async (id: number, data: Partial<Contract>) => {
    return await prisma.contract.update({
        where: { id },
        data: {
            ...(data.name !== undefined ? { name: data.name.toString() } : {}),
            updatedAt: new Date(),
        }
    })
}

// DELETE contract service
export const deleteContractService = async (id: number) => {
    return await prisma.contract.delete({
        where: { id: id },
    })
}