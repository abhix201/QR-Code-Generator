import { describe, expect, it } from 'vitest';
import {
    buildContact,
    buildEmail,
    buildLocation,
    buildPhone,
    buildSms,
    buildText,
    buildUpi,
    buildUrl,
    buildWifi,
    escapeWifi
} from './payload';

describe('buildUrl', () => {
    it('adds https:// when the scheme is missing', () => {
        expect(buildUrl({ url: 'example.com/path?q=1' }).data).toBe('https://example.com/path?q=1');
    });

    it('keeps an existing scheme untouched', () => {
        expect(buildUrl({ url: 'https://example.com/a' }).data).toBe('https://example.com/a');
    });

    it('rejects text that only looks like a URL', () => {
        expect(buildUrl({ url: 'note: buy milk' }).error).toBeTruthy();
        expect(buildUrl({ url: 'hello' }).error).toBeTruthy();
    });

    it('warns about plain http', () => {
        expect(buildUrl({ url: 'http://example.com' }).warning).toMatch(/secure/);
    });

    it('returns nothing for empty input', () => {
        expect(buildUrl({ url: '  ' })).toEqual({ data: null });
    });
});

describe('buildText', () => {
    it('encodes text exactly as typed, without percent-encoding', () => {
        // Regression: v2 double-encoded this into "Hello%20World%20%26%20caf%C3%A9".
        expect(buildText({ text: 'Hello World & café ₹' }).data).toBe('Hello World & café ₹');
    });

    it('does not turn dotted words into links', () => {
        expect(buildText({ text: 'Dr.Strange' }).data).toBe('Dr.Strange');
        expect(buildText({ text: '3.14' }).data).toBe('3.14');
    });
});

describe('buildWifi', () => {
    it('builds a WPA network string', () => {
        expect(buildWifi({ ssid: 'Home', password: 'secret123', security: 'WPA' }).data).toBe(
            'WIFI:T:WPA;S:Home;P:secret123;;'
        );
    });

    it('escapes special characters in SSID and password', () => {
        expect(escapeWifi('a;b,c:d"e\\f')).toBe('a\\;b\\,c\\:d\\"e\\\\f');
    });

    it('supports open and hidden networks', () => {
        expect(buildWifi({ ssid: 'Cafe', security: 'nopass', hidden: 'true' }).data).toBe(
            'WIFI:T:nopass;S:Cafe;H:true;;'
        );
    });

    it('asks for a password on secured networks', () => {
        expect(buildWifi({ ssid: 'Home', security: 'WPA' }).error).toBeTruthy();
    });
});

describe('buildContact', () => {
    it('builds a vCard 3.0 with CRLF line endings', () => {
        const { data } = buildContact({
            firstName: 'Asha',
            lastName: 'Rao',
            phone: '+919800000000',
            org: 'Acme, Inc.'
        });
        expect(data).toBe(
            [
                'BEGIN:VCARD',
                'VERSION:3.0',
                'N:Rao;Asha;;;',
                'FN:Asha Rao',
                'ORG:Acme\\, Inc.',
                'TEL;TYPE=CELL:+919800000000',
                'END:VCARD'
            ].join('\r\n')
        );
    });
});

describe('buildEmail', () => {
    it('encodes subject and body with %20, not +', () => {
        expect(buildEmail({ to: 'a@b.co', subject: 'Hi there', body: 'Line 1\nLine 2' }).data).toBe(
            'mailto:a@b.co?subject=Hi%20there&body=Line%201%0ALine%202'
        );
    });

    it('rejects invalid addresses', () => {
        expect(buildEmail({ to: 'not-an-email' }).error).toBeTruthy();
    });
});

describe('phone and SMS', () => {
    it('normalises formatting characters', () => {
        expect(buildPhone({ phone: '+91 98765-43210' }).data).toBe('tel:+919876543210');
    });

    it('nudges for a country code', () => {
        expect(buildPhone({ phone: '98765 43210' }).warning).toMatch(/country code/);
    });

    it('builds SMSTO strings', () => {
        expect(buildSms({ phone: '+1 555 0100', message: 'Hello' }).data).toBe('SMSTO:+15550100:Hello');
    });
});

describe('buildUpi', () => {
    it('builds a UPI intent with name, amount and note', () => {
        expect(buildUpi({ vpa: 'shop@okicici', name: 'Chai Point', amount: '50', note: 'Order 12' }).data).toBe(
            'upi://pay?pa=shop@okicici&pn=Chai%20Point&am=50.00&cu=INR&tn=Order%2012'
        );
    });

    it('validates the UPI ID and amount', () => {
        expect(buildUpi({ vpa: 'shop' }).error).toBeTruthy();
        expect(buildUpi({ vpa: 'shop@ybl', amount: '10.999' }).error).toBeTruthy();
        expect(buildUpi({ vpa: 'shop@ybl', amount: '0' }).error).toBeTruthy();
    });
});

describe('buildLocation', () => {
    it('builds a geo URI and validates ranges', () => {
        expect(buildLocation({ lat: '18.52', lng: '73.85' }).data).toBe('geo:18.52,73.85');
        expect(buildLocation({ lat: '91', lng: '0' }).error).toBeTruthy();
    });
});
