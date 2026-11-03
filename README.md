# QR Code Generator

Make QR codes for links, text, Wi-Fi, contacts, email, SMS, phone numbers, UPI payments and map locations. Everything runs in your browser: nothing you type is uploaded, and the app works offline once it has loaded.

[Live demo](https://abhijeet-gupta-portfolio.appwrite.network/) · [Report an issue](https://github.com/abhix201/QR-Code-Generator/issues)

## Features

- **Nine code types**, each with its own form: Link, Text, Wi-Fi, Contact (vCard), Email, SMS, Phone, UPI payment and Location.
- **Live preview** that redraws as you type.
- **Scan check.** Every code is decoded back in the browser and compared byte for byte with what you entered, so you know it works before you print it.
- **Design options:** code and background colours, dot and corner styles, quiet-zone border, error correction, and a centre logo (error correction switches to Maximum automatically).
- **Guard rails:** warnings for colours that won't scan, inverted colours, insecure `http` links, missing country codes and content that won't fit.
- **Export** as PNG (512, 1024 or 2048 px) or SVG, copy the image to the clipboard, or share it with the device share sheet.
- **Recent codes** kept on this device only. Wi-Fi passwords are never stored.
- **Installable PWA** with offline support and an update prompt.
- **Light and dark themes**, following the device by default.
- **Accessible:** native form controls, visible focus, screen-reader announcements and reduced-motion support.

## Getting started

Requires Node.js 20 or newer.

```bash
git clone https://github.com/abhix201/QR-Code-Generator.git
cd QR-Code-Generator
npm install
npm run dev
```

Then open http://localhost:5173.

## Scripts

| Command           | What it does                                        |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload                |
| `npm run build`   | Type-check and build the production site to `dist/` |
| `npm run preview` | Serve the production build locally                  |
| `npm test`        | Run the unit tests (Vitest)                         |
| `npm run lint`    | Lint with ESLint                                    |
| `npm run format`  | Format with Prettier                                |
| `npm run icons`   | Regenerate the app icons in `public/`               |

## Deploying

`npm run build` produces a static site in `dist/`. Upload that folder to any static host (Appwrite, Netlify, Vercel, Cloudflare Pages or GitHub Pages). The build uses relative paths, so it also works under a sub-path.

## Project structure

```
src/
  App.tsx              Page layout and app state
  components/          TypePicker, TypeForm, DesignPanel, Preview, History, UpdatePrompt, Icons
  hooks/               useDebounced, useTheme, useToast
  lib/
    payload.ts         Builds the string encoded for each code type (unit tested)
    encoding.ts        UTF-8 handling and capacity limits (unit tested)
    contrast.ts        Colour checks for scannability (unit tested)
    fields.ts          Form definitions for each code type
    design.ts          Design options and defaults
    qr.ts              Rendering, export and the scan check
public/                Icons
scripts/               Icon generator
```

## Tech

React 19, TypeScript and Vite, with [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) for rendering, [jsQR](https://github.com/cozmo/jsQR) for the scan check and [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) for offline support.

## License

MIT, see [LICENSE](LICENSE).
