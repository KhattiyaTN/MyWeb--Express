import { v2 as cloudinary } from 'cloudinary';
import { env } from '@config/env/env';

if (
    env.CLOUDINARY_CLOUD_NAME && 
    env.CLOUDINARY_API_KEY && 
    env.CLOUDINARY_API_SECRET
) {
    cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
        secure: true,
    });
} else {
    console.warn('Cloudinary is not fully configured.');
}

export { cloudinary };