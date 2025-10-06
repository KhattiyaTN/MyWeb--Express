import { prisma } from '../config/prismaClient';
import type { Certificate } from "../types/types"
import { deleteFileFromS3 } from './aws/deleteImageService';

// GET certs service
export const getCertService = async (userId: number) => {
    return await prisma.certification.findMany({
        where: { userId: userId },
        include: { image: true },
        orderBy: { createdAt: 'desc' }
    });
}

// POST add cert service
export const addCertService = async (certData: Certificate, imageUrls: string[]) => {
    return await prisma.certification.create({
        data: {
            name: certData.name,
            authority: certData.authority,
            licenseNo: certData.licenseNo,
            userId: certData.userId,
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
        include: { image: true },
    });
};

// PATCH update cert service
export const updateCertService = async (id: number, data: Partial<Certificate>, imageUrl: string) => {
    const existingCert = await prisma.certification.findUnique({
        where: { id: id },
        include: { image: true },
    });

    if (!existingCert) {
        throw new Error('Certificate not found');
    }
    
    if (imageUrl && existingCert?.image?.url && existingCert.image.url !== imageUrl) {
        await deleteFileFromS3(existingCert.image.url);
    }
    
    return await prisma.certification.update({
        where: { id: id },
        data: {
            name: data.name,
            authority: data.authority,
            licenseNo: data.licenseNo,
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

// DELETE cert service
export const deleteCertService = async (id: number) => {
    return await prisma.certification.delete({
        where: { id: id }
    })
}