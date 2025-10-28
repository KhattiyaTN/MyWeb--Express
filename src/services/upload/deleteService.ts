import { cloudinary } from '@config/upload/cloudinary';

export const deleteCloudinaryByPublicId = async (publicId: string) => {
    if (!publicId || typeof publicId !== 'string') {
        console.warn('Invalid publicId provided for deletion:', publicId);
        return;
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok' && result.result !== 'not found') {
        console.warn(`Unexpected Cloudinary delete result for ${publicId}:`, result);
    }
}