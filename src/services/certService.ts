import { prisma } from '@config/prismaClient';
import type { Certificate } from "../types/schema_type"
import { deleteFileFromS3 } from '@awsServices/images/deleteImageService';
import { uploadFileToS3 } from '@awsServices/images/uploadImageService';

// GET certs service
export const getCertService = async (userId: number) => {
    return await prisma.certification.findMany({
        where: { userId: userId },
        include: { image: true },
        orderBy: { createdAt: 'desc' }
    });
}

// POST add cert service
export const addCertService = async (certData: Certificate, files: Express.Multer.File[]) => {
    let finalImageUrl = '';

    if (files.length > 0) {
        const uploadResults = await Promise.all(files.map(file => uploadFileToS3(file)));
        finalImageUrl = uploadResults[0] ?? '';
    }

    return await prisma.certification.create({
        data: {
            name: certData.name,
            authority: certData.authority,
            licenseNo: certData.licenseNo,
            userId: certData.userId,
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
        include: { image: true },
    });
};

// PATCH update cert service
export const updateCertService = async (id: number, data: Partial<Certificate>, files: Express.Multer.File[]) => {
    const existingCert = await prisma.certification.findUnique({
        where: { id: id },
        include: { image: true },
    });

    if (!existingCert) {
        throw new Error('Certificate not found');
    }

    let finalImageUrl = '';
    
    if (files.length > 0) {
        const uploadResults = await Promise.all(files.map(file => uploadFileToS3(file)));
        finalImageUrl = uploadResults[0] ?? '';
    }

    if (finalImageUrl && existingCert?.image?.url && existingCert.image.url !== finalImageUrl) {
        await deleteFileFromS3(existingCert.image.url);
    }
    
    return await prisma.certification.update({
        where: { id: id },
        data: {
            name: data.name,
            authority: data.authority,
            licenseNo: data.licenseNo,
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

// DELETE cert service
export const deleteCertService = async (certId: number) => {
    const existingCert = await prisma.certification.findUnique({
        where: { id: certId },
        include: { image: true },
    })

    if (!existingCert) {
        throw new Error('Certificate not found');
    }

    if (existingCert?.image?.url) {
        await deleteFileFromS3(existingCert.image.url);
    }

    return await prisma.certification.delete({
        where: { id: certId },
        include: { image: true },
    });
}