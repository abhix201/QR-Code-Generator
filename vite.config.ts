/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    // Relative base so the build works at a domain root or under a sub-path (e.g. GitHub Pages).
    base: './',
    plugins: [
        react(),
        VitePWA({
            registerType: 'prompt',
            includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
            manifest: {
                name: 'QR Code Generator',
                short_name: 'QR Generator',
                description:
                    'Make QR codes for links, Wi-Fi, contacts, UPI payments and more. Works offline; nothing leaves your device.',
                theme_color: '#2438c8',
                background_color: '#eef1f6',
                display: 'standalone',
                start_url: '.',
                scope: '.',
                categories: ['productivity', 'utilities'],
                icons: [
                    { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
                    { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
                navigateFallback: 'index.html'
            }
        })
    ],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['src/test/setup.ts'],
        css: false
    }
});
