import { prisma } from '@config/prismaClient';
import type { Contract } from '@prisma/client'
import { uploadBufferToCloudinary } from '@services/upload/uploadService';
import { deleteCloudinaryByPublicId } from '@services/upload/deleteService';
import { AppError } from '@utils/appErrorUtil';

// GET contract by user ID
export const getContractService = async (userId: number) => {
    return await prisma.contract.findMany({
        where: { userId: userId },
        include: { image: true },
        orderBy: { createdAt: 'desc' }
    });
}

// POST create contract service
export const createContractService = async (contract: Contract,  files: Express.Multer.File[]) => {
    let finalImageUrl: string | undefined;
    let finalPublicId: string | undefined;

    const file = files?.[0];

    if (file?.buffer) {
        const uploadResult = await uploadBufferToCloudinary(file.buffer, 'contracts');
        finalImageUrl = uploadResult?.secure_url ?? '';
        finalPublicId = uploadResult?.public_id ?? '';
    }
    
    return await prisma.contract.create({
        data: {
            name: contract.name,
            userId: contract.userId,
            image: finalImageUrl
                ? { create: 
                    {
                        url: finalImageUrl,
                        publicId: finalPublicId,
                    }
                } : undefined,
        },
        include: { image: true }
    });
};

// PATCH update contract service
export const updateContractService = async (id: number, data: Partial<Contract>, files: Express.Multer.File[], imageUrl?: string) => {
    const existingContract = await prisma.contract.findUnique({ 
        where: { id },
        include: { image: true },
    });

    if (!existingContract) {
        throw new AppError(404, 'Contract not found');
    }

    let finalImageUrl: string | undefined;
    let finalPublicId: string | undefined;

    const file = files?.[0];

    if (file?.buffer) {
        const uploadResult = await uploadBufferToCloudinary(file.buffer, 'contracts');
        finalImageUrl = uploadResult?.secure_url ?? '';
        finalPublicId = uploadResult?.public_id ?? '';

        if (finalPublicId && existingContract?.image?.publicId && existingContract.image.publicId !== finalPublicId) {
            await deleteCloudinaryByPublicId(existingContract.image.publicId);
        }
    } else if (imageUrl?.trim()) {
        finalImageUrl = imageUrl.trim();
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
                            publicId: finalPublicId,
                        },
                        update: {
                            url: finalImageUrl,
                            publicId: finalPublicId,
                        }
                    }
                } : undefined,
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
        throw new AppError(404, 'Contract not found');
    }

    if (existingContract?.image?.publicId) {
        await deleteCloudinaryByPublicId(existingContract.image.publicId);
    }

    return await prisma.contract.delete({
        where: { id: contractId },
        include: { image: true },
    });
}