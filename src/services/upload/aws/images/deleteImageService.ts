import { s3 } from '@config/upload/aws_s3'

export const deleteFileFromS3 = async (fileUrl: string): Promise<void> => {

    const bucketName = process.env.AWS_S3_BUCKET_NAME!;
    const key = fileUrl.split('/').pop();

    if (!key) {
        throw new Error('Invalid file URL');
    }

    const params = {
        Bucket: bucketName,
        Key: key,
    };

    await s3.deleteObject(params).promise();
}