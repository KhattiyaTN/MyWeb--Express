import sharp from 'sharp';

export const resizeImage = async (buffer: Buffer, width = 800): Promise<Buffer> => {
    return await sharp(buffer)
        .resize({ width })
        .toFormat('webp')
        .webp({ quality: 80 })
        .toBuffer();
}