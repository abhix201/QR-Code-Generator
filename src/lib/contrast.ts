/** Colour checks that predict whether a styled QR code will still scan. */

function channel(value: number): number {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function parseHex(hex: string): [number, number, number] | null {
    const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
    if (!match) return null;
    let h = match[1];
    if (h.length === 3)
        h = h
            .split('')
            .map((c) => c + c)
            .join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function luminance(hex: string): number {
    const rgb = parseHex(hex);
    if (!rgb) return 0;
    const [r, g, b] = rgb.map(channel);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
    const la = luminance(a);
    const lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export type ColorIssue = { level: 'error' | 'warning'; message: string } | null;

export function checkColors(foreground: string, background: string): ColorIssue {
    const ratio = contrastRatio(foreground, background);
    if (ratio < 3) {
        return {
            level: 'error',
            message: 'The colours are too similar to scan reliably. Darken the code or lighten the background.'
        };
    }
    if (luminance(foreground) > luminance(background)) {
        return { level: 'warning', message: 'Light code on a dark background doesn’t scan in some camera apps.' };
    }
    if (ratio < 4.5) {
        return { level: 'warning', message: 'Low contrast. It may not scan in dim light or when printed.' };
    }
    return null;
}
