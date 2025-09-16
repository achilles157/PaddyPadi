// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), tailwindcss(), // <-- 2. Tambahkan plugin ke array plugins
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PaddyPadi',
        short_name: 'PaddyPadi',
        description: 'Deteksi Penyakit Tanaman Padi dengan AI',
        theme_color: '#8A9A5B', // Warna sage kita
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})