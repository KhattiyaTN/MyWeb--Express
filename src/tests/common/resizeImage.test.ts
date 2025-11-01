import { describe, test, expect } from 'bun:test';
import { resizeImage } from '@utils/upload/imageUtil';
import sharp from 'sharp';

// Image resizing tests
describe('Image resizing', () => {
    test('should resize a large image down to max width', async () => {
        const src = await sharp({
            create: { width: 2000, height: 600, channels: 3, background: { r: 0, g: 0, b: 0 } },
        }).png().toBuffer();
        const resized = await resizeImage(src, 800);
        const metaData = await sharp(resized).metadata();
        expect(resized).toBeInstanceOf(Buffer);
        expect(metaData.width).toBe(800);
        expect(metaData.height).toBeDefined();
    });

    test('should leave small images as-is (width <= max)', async () => {
        const small = await sharp({
            create: { width: 200, height: 100, channels: 3, background: { r: 0, g: 0, b: 0 } },
        }).png().toBuffer();
        const resized = await resizeImage(small, 800);
        const metaData = await sharp(resized).metadata();
        expect(metaData.width).toBe(200);
        expect(metaData.height).toBe(100);
    });

    test('should preserve aspect ratio when resizing', async () => {
        const src = await sharp({
            create: { width: 2000, height: 600, channels: 3, background: { r: 0, g: 0, b: 0 } },
        }).png().toBuffer();
        const resized = await resizeImage(src, 800);
        const metaData = await sharp(resized).metadata();
        expect(metaData.width).toBe(800);
        expect(metaData.height).toBe(240);
    });
});