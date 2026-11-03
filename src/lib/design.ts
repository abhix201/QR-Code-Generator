import type { CornerSquareType, DotType } from 'qr-code-styling';
import type { ErrorCorrection } from './encoding';
import type { Fields, QrType } from './payload';

export interface Design {
    foreground: string;
    background: string;
    dotStyle: DotType;
    cornerStyle: CornerSquareType;
    /** Quiet zone around the code, in modules-ish pixels at 320px. */
    margin: number;
    errorCorrection: ErrorCorrection;
    /** Data URL of an uploaded logo, or null. Not saved in history. */
    logo: string | null;
}

export const DEFAULT_DESIGN: Design = {
    foreground: '#111318',
    background: '#ffffff',
    dotStyle: 'square',
    cornerStyle: 'square',
    margin: 16,
    errorCorrection: 'M',
    logo: null
};

export const DOT_STYLES: { value: DotType; label: string }[] = [
    { value: 'square', label: 'Square' },
    { value: 'rounded', label: 'Rounded' },
    { value: 'dots', label: 'Dots' },
    { value: 'classy', label: 'Classy' },
    { value: 'extra-rounded', label: 'Soft' }
];

export const CORNER_STYLES: { value: CornerSquareType; label: string }[] = [
    { value: 'square', label: 'Square' },
    { value: 'extra-rounded', label: 'Rounded' },
    { value: 'dot', label: 'Circle' }
];

export const ERROR_LEVELS: { value: ErrorCorrection; label: string; hint: string }[] = [
    { value: 'L', label: 'Low', hint: 'Smallest code, recovers ~7% damage' },
    { value: 'M', label: 'Medium', hint: 'Good default, recovers ~15%' },
    { value: 'Q', label: 'High', hint: 'For print and stickers, ~25%' },
    { value: 'H', label: 'Maximum', hint: 'Needed with a logo, ~30%' }
];

/** A logo covers part of the code, so it needs the strongest error correction. */
export const effectiveErrorCorrection = (design: Design): ErrorCorrection =>
    design.logo ? 'H' : design.errorCorrection;

export interface HistoryEntry {
    id: string;
    type: QrType;
    fields: Fields;
    design: Omit<Design, 'logo'>;
    label: string;
    createdAt: number;
}

export const HISTORY_KEY = 'qr:history:v1';
export const HISTORY_LIMIT = 12;
