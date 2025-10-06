import { prisma } from '../config/prismaClient';
import type { Contract } from '../types/types'

// GET contract service
export const getContractService = async (userId: number) => {
    return await prisma.contract.findMany({
        where: { userId: userId },
        include: { image: true },
        orderBy: { createdAt: 'desc' }
    });
}

// POST create contract service
export const createContractService = async (contract: Contract, imageUrls: string[]) => {
    return await prisma.contract.create({
        data: {
            name: contract.name,
            userId: contract.userId,
            image: imageUrls[0]
                ? { create: 
                    {
                        url: imageUrls[0],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                } : undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        include: { image: true }
    });
};

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