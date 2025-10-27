import { cloudinary } from '@config/upload/cloudinary';
import type { UploadApiOptions, UploadApiResponse } from 'cloudinary';

export const deleteCloudinaryByPublicId = async (publicId: string) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Cloudinary Deletion Result:', result);
    } catch (error) {
        console.error('Cloudinary Deletion Error:', error);
    }
}