import { s3 } from '../../config/s3Client';
import { resizeImage } from '../../utils/imageUtils'

export const uploadFileToS3 = async (files: Express.Multer.File[]) => {
    const uploadedUrls: string[] = [];

    for (const file of files) {

        const resizeBuffer = await resizeImage(file.buffer);
        
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: `${Date.now()}-${file.originalname}`,
            Body: resizeBuffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        }

        const uploadResult = await s3.upload(params).promise();
        uploadedUrls.push(uploadResult.Location);
    }

    return uploadedUrls;
}

