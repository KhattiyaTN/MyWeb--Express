import { prisma } from '../config/prismaClient';
import type { Contract } from '../types/types'
import { deleteFileFromS3 } from './aws/deleteImageService';

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
export const updateContractService = async (id: number, data: Partial<Contract>, imageUrl: string) => {
    const existingContract = await prisma.contract.findUnique({ 
        where: { id },
        include: { image: true },
    });

    if (!existingContract) {
        throw new Error('Contract not found');
    }

    if (imageUrl && existingContract?.image?.url && existingContract.image.url !== imageUrl) {
        await deleteFileFromS3(existingContract.image.url);
    }

    return await prisma.contract.update({
        where: { id },
        data: {
            name: data.name,
            image: imageUrl
                ? {
                    upsert: {
                        create: {
                            url: imageUrl,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                        update: {
                            url: imageUrl,
                            updatedAt: new Date(),
                        }
                    }
                } : undefined,
            updatedAt: new Date(),
        },
        include: { image: true },
    })
}

// DELETE contract service
export const deleteContractService = async (contractId: number) => {
    const existingContract = await prisma.contract.findUnique({
        where: { id: contractId },
        include: { image: true },
    });

    if (!existingContract) {
        throw new Error('Contract not found');
    }

    if (existingContract?.image?.url) {
        await deleteFileFromS3(existingContract.image.url);
    }

    return await prisma.contract.delete({
        where: { id: contractId },
        include: { image: true },
    });
}