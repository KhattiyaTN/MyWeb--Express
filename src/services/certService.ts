import { PrismaClient } from '@prisma/client';
import type { Certificate } from "../types/types"

const prisma = new PrismaClient();

// GET certs service
export const getAllCertService = async () => {
    return await prisma.certification.findMany();
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
export const updateCertService = async (id: number, data: Partial<Certificate>) => {
    return await prisma.certification.update({
        where: { id },
        data: {
            ...(data.name !== undefined ? { name: data.name.toString() } : {}),
            ...(data.authority !== undefined ? { authority: data.authority.toString() } : {}),
            ...(data.licenseNo !== undefined ? { licenseNo: data.licenseNo.toString() } : {}),
            updatedAt: new Date()
        }
    })
}

// DELETE cert service
export const deleteCertService = async (id: number) => {
    return await prisma.certification.delete({
        where: { id: id }
    })
}