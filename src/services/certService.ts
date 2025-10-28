import { prisma } from '@config/prismaClient';
import type { Certificate } from "../types/schema_type"
import { uploadBufferToCloudinary } from '@services/upload/uploadService';
import { deleteCloudinaryByPublicId } from '@services/upload/deleteService';

// GET certs by user ID
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
    let finalPublicId = '';

    if (files.length > 0) {
        const uploadResults = await Promise.all(
            files.map(file => uploadBufferToCloudinary(file.buffer, 'certifications'))
        );
        const uploaded = uploadResults[0];
        finalImageUrl = uploaded?.secure_url ?? '';
        finalPublicId = uploaded?.public_id ?? '';
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
                        publicId: finalPublicId,
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
export const updateCertService = async (id: number, data: Partial<Certificate>, files: Express.Multer.File[], imageUrl?: string) => {
    const existingCert = await prisma.certification.findUnique({
        where: { id: id },
        include: { image: true },
    });

    if (!existingCert) {
        throw new Error('Certificate not found');
    }

    let finalImageUrl = '';
    let finalPublicId = '';

    if (files.length > 0) {
        const uploadResults = await Promise.all(
            files.map(file => uploadBufferToCloudinary(file.buffer, 'certifications'))
        );

        const uploaded = uploadResults[0];
        finalImageUrl = uploaded?.secure_url ?? '';
        finalPublicId = uploaded?.public_id ?? '';

        if (existingCert.image?.publicId && existingCert.image.publicId !== finalPublicId) {
            await deleteCloudinaryByPublicId(existingCert.image.publicId);
        }
    } else if (imageUrl?.trim()) {
        finalImageUrl = imageUrl.trim();
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
                            publicId: finalPublicId,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                        update: {
                            url: finalImageUrl,
                            publicId: finalPublicId,
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

    if (existingCert?.image?.publicId) {
        await deleteCloudinaryByPublicId(existingCert.image.publicId);
    }

    return await prisma.certification.delete({
        where: { id: certId },
        include: { image: true },
    });
}