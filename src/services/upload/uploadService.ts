import { cloudinary } from '@config/upload/cloudinary';
import { resizeImage } from '@utils/upload/imageUtils';
import type { UploadApiOptions, UploadApiResponse } from 'cloudinary';

const cloudinaryFolder = process.env.CLOUDINARY_FOLDER;

export const uploadBufferToCloudinary = async (
    buffer: Buffer, 
    subFolder?: string, 
    options: UploadApiOptions = {}
) => {
    return new Promise<UploadApiResponse>(async (resolve, reject) => {
        
        const resizeImg = await resizeImage(buffer, 800);

        const stream = cloudinary.uploader.upload_stream(
            { 
                folder: subFolder ? `${cloudinaryFolder}/${subFolder}` : cloudinaryFolder,
                resource_type: options.resource_type || 'image',
                fetch_format: 'auto', 
                quality: 'auto', 
                ...options 
            },
            (err, result) => {
                if (err || !result) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
        
        stream.end(resizeImg);
    });
}