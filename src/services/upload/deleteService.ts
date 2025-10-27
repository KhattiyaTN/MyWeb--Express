import { cloudinary } from '@config/upload/cloudinary';

export const deleteCloudinaryByPublicId = async (publicId: string) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.deleted) {
            console.log('Cloudinary Deletion Result:', result);
        } else {
            console.warn('Cloudinary Deletion Warning:', result);
        }

    } catch (error) {
        console.error('Cloudinary Deletion Error:', error);
    }
}