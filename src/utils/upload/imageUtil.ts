import sharp from 'sharp';

export const resizeImage = async (buffer: Buffer, maxWidth: number): Promise<Buffer> => {
    return await sharp(buffer)
        .rotate()
        .resize({ 
            width: maxWidth,
            fit: 'inside',
            withoutEnlargement: true,
        })
        .toFormat('webp')
        .webp({ quality: 80 })
        .toBuffer();
}