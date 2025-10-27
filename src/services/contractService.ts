import { prisma } from '@config/prismaClient';
import type { Contract } from '../types/schema_type'
import { deleteFileFromS3 } from '@awsServices/images/deleteImageService';
import { uploadFileToS3 } from '@awsServices/images/uploadImageService';

// GET contract service
export const getContractService = async (userId: number) => {
    return await prisma.contract.findMany({
        where: { userId: userId },
        include: { image: true },
        orderBy: { createdAt: 'desc' }
    });
}

// POST create contract service
export const createContractService = async (contract: Contract,  files: Express.Multer.File[]) => {
    let finalImageUrl = '';

    if (files.length > 0) {
        const uploadResults = await Promise.all(files.map(file => uploadFileToS3(file)));
        finalImageUrl = uploadResults[0] ?? '';
    }
    
    return await prisma.contract.create({
        data: {
            name: contract.name,
            userId: contract.userId,
            image: finalImageUrl
                ? { create: 
                    {
                        url: finalImageUrl,
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
export const updateContractService = async (id: number, data: Partial<Contract>, files: Express.Multer.File[]) => {
    const existingContract = await prisma.contract.findUnique({ 
        where: { id },
        include: { image: true },
    });

    if (!existingContract) {
        throw new Error('Contract not found');
    }

    let finalImageUrl = '';

    if (files.length > 0) {
        const uploadResults = await Promise.all(files.map(file => uploadFileToS3(file)));
        finalImageUrl = uploadResults[0] ?? '';
    }

    if (finalImageUrl && existingContract?.image?.url && existingContract.image.url !== finalImageUrl) {
        await deleteFileFromS3(existingContract.image.url);
    }

    return await prisma.contract.update({
        where: { id },
        data: {
            name: data.name,
            image: finalImageUrl
                ? {
                    upsert: {
                        create: {
                            url: finalImageUrl,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                        update: {
                            url: finalImageUrl,
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