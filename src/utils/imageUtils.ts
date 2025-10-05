import sharp from 'sharp';

export const resizeImage = async (buffer: Buffer, width = 800): Promise<Buffer> => {
    return await sharp(buffer)
        .resize({ width })
        .toFormat('jpeg')
        .jpeg({ quality: 80 })
        .toBuffer();
}