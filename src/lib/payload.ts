/**
 * Turns form fields into the exact string encoded in the QR code.
 * Each builder is a pure function so it can be unit tested in isolation.
 */

export type QrType = 'url' | 'text' | 'wifi' | 'contact' | 'email' | 'sms' | 'phone' | 'upi' | 'location';

export type Fields = Record<string, string>;

export interface PayloadResult {
    /** The string to encode, or null when there's nothing to encode yet. */
    data: string | null;
    /** Blocking problem: the code shouldn't be generated as-is. */
    error?: string;
    /** Non-blocking advice shown under the form. */
    warning?: string;
}

const EMPTY: PayloadResult = { data: null };

const get = (fields: Fields, key: string) => (fields[key] ?? '').trim();

// ---------------------------------------------------------------- URL

const SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i;

export function buildUrl(fields: Fields): PayloadResult {
    const raw = get(fields, 'url');
    if (!raw) return EMPTY;
    if (/\s/.test(raw)) {
        return { data: null, error: 'Web addresses can’t contain spaces. For plain text, use the Text tab.' };
    }
    const candidate = SCHEME.test(raw) ? raw : `https://${raw}`;
    let parsed: URL;
    try {
        parsed = new URL(candidate);
    } catch {
        return { data: null, error: 'This doesn’t look like a web address. Check it, or use the Text tab.' };
    }
    const isWeb = parsed.protocol === 'http:' || parsed.protocol === 'https:';
    if (isWeb && !parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
        return { data: null, error: 'Add a domain ending such as .com or .in.' };
    }
    return {
        data: candidate,
        warning:
            parsed.protocol === 'http:'
                ? 'This link isn’t secure (http). Use https if the site supports it.'
                : undefined
    };
}

// ---------------------------------------------------------------- Text

export function buildText(fields: Fields): PayloadResult {
    const text = fields.text ?? '';
    return text.trim() ? { data: text } : EMPTY;
}

// ---------------------------------------------------------------- Wi-Fi

/** Escapes the characters that have meaning in the WIFI: format. */
export const escapeWifi = (value: string) => value.replace(/([\\;,:"])/g, '\\$1');

export function buildWifi(fields: Fields): PayloadResult {
    const ssid = fields.ssid ?? '';
    const password = fields.password ?? '';
    const security = fields.security || 'WPA';
    const hidden = fields.hidden === 'true';
    if (!ssid.trim()) return EMPTY;

    if (security === 'nopass') {
        return { data: `WIFI:T:nopass;S:${escapeWifi(ssid)};${hidden ? 'H:true;' : ''};` };
    }
    if (!password) return { data: null, error: 'Enter the network password, or choose “No password”.' };

    const data = `WIFI:T:${security};S:${escapeWifi(ssid)};P:${escapeWifi(password)};${hidden ? 'H:true;' : ''};`;
    const warning =
        security === 'WPA' && password.length < 8
            ? 'WPA passwords are at least 8 characters. Double-check it.'
            : undefined;
    return { data, warning };
}

// ---------------------------------------------------------------- Contact (vCard 3.0)

export const escapeVcard = (value: string) =>
    value
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/([,;])/g, '\\$1');

export function buildContact(fields: Fields): PayloadResult {
    const first = get(fields, 'firstName');
    const last = get(fields, 'lastName');
    const phone = get(fields, 'phone');
    const email = get(fields, 'email');
    const org = get(fields, 'org');
    const title = get(fields, 'title');
    const website = get(fields, 'website');
    const address = get(fields, 'address');

    if (!first && !last && !phone && !email) return EMPTY;
    if (email && !isEmail(email)) return { data: null, error: 'Check the email address.' };

    const fullName = [first, last].filter(Boolean).join(' ') || org || email || phone;
    const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${escapeVcard(last)};${escapeVcard(first)};;;`,
        `FN:${escapeVcard(fullName)}`
    ];
    if (org) lines.push(`ORG:${escapeVcard(org)}`);
    if (title) lines.push(`TITLE:${escapeVcard(title)}`);
    if (phone) lines.push(`TEL;TYPE=CELL:${phone}`);
    if (email) lines.push(`EMAIL:${email}`);
    if (website) lines.push(`URL:${website}`);
    if (address) lines.push(`ADR;TYPE=WORK:;;${escapeVcard(address)};;;;`);
    lines.push('END:VCARD');
    return { data: lines.join('\r\n') };
}

// ---------------------------------------------------------------- Email

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

export function buildEmail(fields: Fields): PayloadResult {
    const to = get(fields, 'to');
    const subject = get(fields, 'subject');
    const body = fields.body ?? '';
    if (!to) return EMPTY;
    if (!isEmail(to)) return { data: null, error: 'Check the email address.' };
    const params: string[] = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body.trim()) params.push(`body=${encodeURIComponent(body)}`);
    return { data: `mailto:${to}${params.length ? `?${params.join('&')}` : ''}` };
}

// ---------------------------------------------------------------- Phone & SMS

/** Keeps a leading + and digits; returns null if it isn't a plausible number. */
export function normalizePhone(value: string): string | null {
    const trimmed = value.trim();
    if (!/^\+?[\d\s\-().]+$/.test(trimmed)) return null;
    const digits = trimmed.replace(/[^\d]/g, '');
    if (digits.length < 3 || digits.length > 15) return null;
    return (trimmed.startsWith('+') ? '+' : '') + digits;
}

export function buildPhone(fields: Fields): PayloadResult {
    const raw = get(fields, 'phone');
    if (!raw) return EMPTY;
    const phone = normalizePhone(raw);
    if (!phone) return { data: null, error: 'Use digits only, with an optional + and country code.' };
    return {
        data: `tel:${phone}`,
        warning: phone.startsWith('+') ? undefined : 'Add the country code (for example +91) so it works from anywhere.'
    };
}

export function buildSms(fields: Fields): PayloadResult {
    const raw = get(fields, 'phone');
    const message = fields.message ?? '';
    if (!raw) return EMPTY;
    const phone = normalizePhone(raw);
    if (!phone) return { data: null, error: 'Use digits only, with an optional + and country code.' };
    return { data: `SMSTO:${phone}:${message}` };
}

// ---------------------------------------------------------------- UPI payment

export const isUpiId = (value: string) => /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z][a-zA-Z0-9.]{1,63}$/.test(value);

export function buildUpi(fields: Fields): PayloadResult {
    const vpa = get(fields, 'vpa');
    const name = get(fields, 'name');
    const amount = get(fields, 'amount');
    const note = get(fields, 'note');
    if (!vpa) return EMPTY;
    if (!isUpiId(vpa)) return { data: null, error: 'A UPI ID looks like name@bank, for example shop@okicici.' };

    const params = [`pa=${vpa}`];
    if (name) params.push(`pn=${encodeURIComponent(name)}`);
    if (amount) {
        if (!/^\d+(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0) {
            return { data: null, error: 'Enter the amount in rupees, with up to 2 decimals.' };
        }
        params.push(`am=${Number(amount).toFixed(2)}`);
    }
    params.push('cu=INR');
    if (note) params.push(`tn=${encodeURIComponent(note)}`);
    return {
        data: `upi://pay?${params.join('&')}`,
        warning: name ? undefined : 'Add the payee name so people can confirm who they’re paying.'
    };
}

// ---------------------------------------------------------------- Location

export function buildLocation(fields: Fields): PayloadResult {
    const latRaw = get(fields, 'lat');
    const lngRaw = get(fields, 'lng');
    if (!latRaw && !lngRaw) return EMPTY;
    const lat = Number(latRaw);
    const lng = Number(lngRaw);
    if (!latRaw || !lngRaw || Number.isNaN(lat) || Number.isNaN(lng)) {
        return { data: null, error: 'Enter both latitude and longitude as numbers.' };
    }
    if (lat < -90 || lat > 90) return { data: null, error: 'Latitude must be between -90 and 90.' };
    if (lng < -180 || lng > 180) return { data: null, error: 'Longitude must be between -180 and 180.' };
    return { data: `geo:${lat},${lng}` };
}

// ---------------------------------------------------------------- Dispatcher

const BUILDERS: Record<QrType, (fields: Fields) => PayloadResult> = {
    url: buildUrl,
    text: buildText,
    wifi: buildWifi,
    contact: buildContact,
    email: buildEmail,
    sms: buildSms,
    phone: buildPhone,
    upi: buildUpi,
    location: buildLocation
};

export function buildPayload(type: QrType, fields: Fields): PayloadResult {
    return BUILDERS[type](fields);
}
