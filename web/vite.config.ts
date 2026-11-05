import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// TARGET=desktop → plain files for the Electron installer (no service worker on file://).
// default       → website + installable offline PWA (works from any sub-path, e.g. GitHub Pages).
const desktop = process.env.TARGET === 'desktop';

export default defineConfig({
  base: './',
  plugins: [
    react(), tailwindcss(),
    ...(desktop ? [] : [VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['mascot.png', 'icons/*.png'],
      workbox: { globPatterns: ['**/*.{js,css,html,json,png,svg}'], maximumFileSizeToCacheInBytes: 6_000_000, navigateFallback: 'index.html' },
      manifest: {
        name: 'Mirae Flow', short_name: 'Mirae Flow', description: 'Learn programming with Flowgorithm flowcharts — works offline.',
        theme_color: '#5B21B6', background_color: '#0F0A1A', display: 'standalone', start_url: './', scope: './',
        icons: [{ src: 'icons/mirae-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icons/mirae-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }],
      },
    })]),
  ],
  build: { target: 'es2022', chunkSizeWarningLimit: 1500 },
});
