import { PrismaClient } from "../generated/prisma";
import type { Certificate } from "../types/types"

const prisma = new PrismaClient();

// GET certs service
export const getAllCertService = async () => {
    return await prisma.certification.findMany();
}

// POST add cert service
export const addCertService = async (cert: Certificate & { userId: number }) => {
    return await prisma.certification.create({ 
        data: { 
            name: cert.name.toString(),
            authority: cert.authority.toString(),
            licenseNo: cert.licenseNo.toString(),
            createdAt: new Date(),
            user: { connect: { id: cert.userId } }
        }
    })
}

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