/**
 * Byte-level helpers for QR encoding.
 *
 * QR "byte mode" stores raw bytes. The bundled encoder in qr-code-styling
 * converts strings with `charCode & 0xff`, which silently corrupts anything
 * outside Latin-1 (₹, emoji, Devanagari, …). We therefore hand it a string
 * whose characters are already the UTF-8 bytes, so every byte survives.
 */

const encoder = new TextEncoder();

export function utf8ByteLength(text: string): number {
    return encoder.encode(text).length;
}

/** Converts text to a "binary string": one char per UTF-8 byte. */
export function toUtf8BinaryString(text: string): string {
    const bytes = encoder.encode(text);
    let out = '';
    for (const byte of bytes) out += String.fromCharCode(byte);
    return out;
}

export type ErrorCorrection = 'L' | 'M' | 'Q' | 'H';

/** Maximum byte-mode capacity of a version 40 QR code for each level. */
export const MAX_BYTES: Record<ErrorCorrection, number> = {
    L: 2953,
    M: 2331,
    Q: 1663,
    H: 1273
};

export interface CapacityInfo {
    bytes: number;
    max: number;
    fits: boolean;
    /** Above ~60% of capacity the code gets very dense and hard to scan from print. */
    dense: boolean;
}

export function checkCapacity(text: string, level: ErrorCorrection): CapacityInfo {
    const bytes = utf8ByteLength(text);
    const max = MAX_BYTES[level];
    return { bytes, max, fits: bytes <= max, dense: bytes > max * 0.6 };
}
