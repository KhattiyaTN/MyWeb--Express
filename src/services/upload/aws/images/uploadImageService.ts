import { s3 } from '@config/upload/aws_s3';
import { resizeImage } from '@utils/upload/imageUtils';

export const uploadFileToS3 = async (file: Express.Multer.File): Promise<string> => {
    
    const resizeBuffer = await resizeImage(file.buffer);

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: `${Date.now()}-${file.originalname}`,
        Body: resizeBuffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
    };

    const uploadResult = await s3.upload(params).promise();
    
    return uploadResult.Location;
}

