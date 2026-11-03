import type { Fields, QrType } from './payload';

export type FieldKind = 'text' | 'textarea' | 'select' | 'checkbox' | 'password';

export interface FieldConfig {
    name: string;
    label: string;
    kind?: FieldKind;
    placeholder?: string;
    hint?: string;
    inputMode?: 'text' | 'url' | 'email' | 'tel' | 'decimal' | 'numeric';
    autoComplete?: string;
    options?: { value: string; label: string }[];
    /** Show a Clear button inside the input. */
    clearable?: boolean;
    /** Render two fields side by side on wide screens. */
    half?: boolean;
    /** Hide this field unless the predicate passes. */
    showIf?: (fields: Fields) => boolean;
}

export interface TypeConfig {
    type: QrType;
    label: string;
    /** One line shown under the type picker. */
    description: string;
    fields: FieldConfig[];
}

export const TYPES: TypeConfig[] = [
    {
        type: 'url',
        label: 'Link',
        description: 'Opens a website when scanned.',
        fields: [
            {
                name: 'url',
                label: 'Web address',
                placeholder: 'example.com/menu',
                inputMode: 'url',
                autoComplete: 'url',
                clearable: true,
                hint: 'https:// is added for you if you leave it out.'
            }
        ]
    },
    {
        type: 'text',
        label: 'Text',
        description: 'Shows a message exactly as you type it.',
        fields: [{ name: 'text', label: 'Message', kind: 'textarea', placeholder: 'Anything you want people to read' }]
    },
    {
        type: 'wifi',
        label: 'Wi-Fi',
        description: 'Joins a Wi-Fi network without typing the password.',
        fields: [
            { name: 'ssid', label: 'Network name', placeholder: 'Home-5G', autoComplete: 'off' },
            {
                name: 'security',
                label: 'Security',
                kind: 'select',
                options: [
                    { value: 'WPA', label: 'WPA / WPA2 / WPA3' },
                    { value: 'WEP', label: 'WEP (older routers)' },
                    { value: 'nopass', label: 'No password' }
                ]
            },
            {
                name: 'password',
                label: 'Password',
                kind: 'password',
                autoComplete: 'off',
                showIf: (f) => f.security !== 'nopass'
            },
            { name: 'hidden', label: 'This network is hidden', kind: 'checkbox' }
        ]
    },
    {
        type: 'contact',
        label: 'Contact',
        description: 'Saves a contact card to the phone’s address book.',
        fields: [
            { name: 'firstName', label: 'First name', autoComplete: 'given-name', half: true },
            { name: 'lastName', label: 'Last name', autoComplete: 'family-name', half: true },
            {
                name: 'phone',
                label: 'Phone',
                inputMode: 'tel',
                autoComplete: 'tel',
                placeholder: '+91 98765 43210',
                half: true
            },
            { name: 'email', label: 'Email', inputMode: 'email', autoComplete: 'email', half: true },
            { name: 'org', label: 'Company', autoComplete: 'organization', half: true },
            { name: 'title', label: 'Job title', autoComplete: 'organization-title', half: true },
            { name: 'website', label: 'Website', inputMode: 'url', autoComplete: 'url' },
            { name: 'address', label: 'Address', kind: 'textarea', autoComplete: 'street-address' }
        ]
    },
    {
        type: 'email',
        label: 'Email',
        description: 'Opens a new email with the address and subject filled in.',
        fields: [
            { name: 'to', label: 'To', inputMode: 'email', placeholder: 'hello@example.com' },
            { name: 'subject', label: 'Subject' },
            { name: 'body', label: 'Message', kind: 'textarea' }
        ]
    },
    {
        type: 'sms',
        label: 'SMS',
        description: 'Opens a text message with the number and message filled in.',
        fields: [
            { name: 'phone', label: 'Phone number', inputMode: 'tel', placeholder: '+91 98765 43210' },
            { name: 'message', label: 'Message', kind: 'textarea' }
        ]
    },
    {
        type: 'phone',
        label: 'Phone',
        description: 'Starts a call to this number.',
        fields: [{ name: 'phone', label: 'Phone number', inputMode: 'tel', placeholder: '+91 98765 43210' }]
    },
    {
        type: 'upi',
        label: 'UPI',
        description: 'Opens any UPI app ready to pay you.',
        fields: [
            { name: 'vpa', label: 'UPI ID', placeholder: 'yourname@okhdfcbank', autoComplete: 'off' },
            { name: 'name', label: 'Payee name', placeholder: 'Shown to the person paying' },
            {
                name: 'amount',
                label: 'Amount (₹)',
                inputMode: 'decimal',
                placeholder: 'Leave empty to let them choose',
                half: true
            },
            { name: 'note', label: 'Note', placeholder: 'Order 42', half: true }
        ]
    },
    {
        type: 'location',
        label: 'Location',
        description: 'Opens a map at these coordinates.',
        fields: [
            { name: 'lat', label: 'Latitude', inputMode: 'decimal', placeholder: '18.5204', half: true },
            { name: 'lng', label: 'Longitude', inputMode: 'decimal', placeholder: '73.8567', half: true }
        ]
    }
];

export const TYPE_BY_ID = Object.fromEntries(TYPES.map((t) => [t.type, t])) as Record<QrType, TypeConfig>;

/** A short human label for history entries and file names. */
export function summarize(type: QrType, fields: Fields): string {
    const pick = (...keys: string[]) =>
        keys
            .map((k) => (fields[k] ?? '').trim())
            .filter(Boolean)
            .join(' ');
    const text = (() => {
        switch (type) {
            case 'url':
                return pick('url').replace(/^https?:\/\//, '');
            case 'text':
                return pick('text');
            case 'wifi':
                return pick('ssid');
            case 'contact':
                return pick('firstName', 'lastName') || pick('org', 'email', 'phone');
            case 'email':
                return pick('to');
            case 'sms':
            case 'phone':
                return pick('phone');
            case 'upi':
                return pick('name') || pick('vpa');
            case 'location':
                return `${pick('lat')}, ${pick('lng')}`;
        }
    })();
    return text.replace(/\s+/g, ' ').slice(0, 60) || TYPE_BY_ID[type].label;
}

export function slugify(text: string): string {
    return (
        text
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 40) || 'code'
    );
}
