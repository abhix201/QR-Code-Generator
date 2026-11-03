// Renders the app icons in public/ from one SVG source. Run with `npm run icons`.
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const ACCENT = '#2438c8';
const SIGNAL = '#ffd23f';

/** The mark: one QR finder pattern. `pad` shrinks it for maskable icons' safe zone. */
const mark = (pad = 0, rounded = true) => {
    const s = 100 - pad * 2;
    const at = (v) => pad + (v / 100) * s;
    const len = (v) => (v / 100) * s;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${rounded ? 22 : 0}" fill="${ACCENT}"/>
  <rect x="${at(20)}" y="${at(20)}" width="${len(60)}" height="${len(60)}" rx="${len(9)}" fill="none" stroke="#fff" stroke-width="${len(9.5)}"/>
  <rect x="${at(37)}" y="${at(37)}" width="${len(26)}" height="${len(26)}" rx="${len(4)}" fill="${SIGNAL}"/>
</svg>`;
};

await writeFile('public/favicon.svg', mark());
const png = (svg, size, file) => sharp(Buffer.from(svg)).resize(size, size).png().toFile(`public/${file}`);
await png(mark(), 192, 'pwa-192.png');
await png(mark(), 512, 'pwa-512.png');
await png(mark(14, false), 512, 'pwa-maskable-512.png');
await png(mark(8, false), 180, 'apple-touch-icon.png');
console.log('Icons written to public/');
