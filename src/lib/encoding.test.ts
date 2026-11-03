import { describe, expect, it } from 'vitest';
import { checkCapacity, toUtf8BinaryString, utf8ByteLength } from './encoding';
import { checkColors, contrastRatio } from './contrast';

describe('UTF-8 handling', () => {
    it('counts bytes, not characters', () => {
        expect(utf8ByteLength('abc')).toBe(3);
        expect(utf8ByteLength('₹')).toBe(3);
        expect(utf8ByteLength('नमस्ते')).toBe(18);
    });

    it('produces one char per byte so the encoder keeps every byte', () => {
        const binary = toUtf8BinaryString('₹1');
        expect([...binary].map((c) => c.charCodeAt(0))).toEqual([0xe2, 0x82, 0xb9, 0x31]);
    });
});

describe('checkCapacity', () => {
    it('depends on the error correction level', () => {
        const text = 'x'.repeat(1500);
        expect(checkCapacity(text, 'L').fits).toBe(true);
        expect(checkCapacity(text, 'H').fits).toBe(false);
    });
});

describe('colour checks', () => {
    it('computes WCAG contrast', () => {
        expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
    });

    it('flags similar colours as an error and inverted colours as a warning', () => {
        expect(checkColors('#cccccc', '#ffffff')?.level).toBe('error');
        expect(checkColors('#ffffff', '#000000')?.level).toBe('warning');
        expect(checkColors('#111318', '#ffffff')).toBeNull();
    });
});
