import QRCodeStyling, { type Options } from 'qr-code-styling';
import { type Design, effectiveErrorCorrection } from './design';
import { toUtf8BinaryString } from './encoding';

export const PREVIEW_SIZE = 320;

export function buildOptions(data: string, design: Design, size: number, type: 'svg' | 'canvas'): Options {
    const scale = size / PREVIEW_SIZE;
    return {
        type,
        width: size,
        height: size,
        margin: Math.round(design.margin * scale),
        data: toUtf8BinaryString(data),
        image: design.logo ?? undefined,
        qrOptions: { errorCorrectionLevel: effectiveErrorCorrection(design), typeNumber: 0 },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.32,
            margin: Math.round(4 * scale),
            crossOrigin: 'anonymous'
        },
        dotsOptions: { color: design.foreground, type: design.dotStyle },
        cornersSquareOptions: { color: design.foreground, type: design.cornerStyle },
        cornersDotOptions: {
            color: design.foreground,
            type: design.cornerStyle === 'dot' ? 'dot' : design.cornerStyle === 'extra-rounded' ? 'dot' : 'square'
        },
        backgroundOptions: { color: design.background }
    };
}

export type ExportFormat = 'png' | 'svg';

export async function renderBlob(data: string, design: Design, format: ExportFormat, size: number): Promise<Blob> {
    const qr = new QRCodeStyling(buildOptions(data, design, size, format === 'svg' ? 'svg' : 'canvas'));
    const blob = await qr.getRawData(format);
    if (!(blob instanceof Blob)) throw new Error('The image couldn’t be created.');
    return blob;
}

export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Renders the code as a camera would see it and decodes it with jsQR.
 * Returns true only if the decoded bytes match exactly what we encoded.
 */
export async function verifyScan(data: string, design: Design): Promise<boolean> {
    const [{ default: jsQR }, blob] = await Promise.all([import('jsqr'), renderBlob(data, design, 'png', 480)]);
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.drawImage(bitmap, 0, 0);
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const result = jsQR(image.data, image.width, image.height, { inversionAttempts: 'attemptBoth' });
    if (!result) return false;
    const expected = new TextEncoder().encode(data);
    const actual = result.binaryData;
    return actual.length === expected.length && actual.every((byte, i) => byte === expected[i]);
}
