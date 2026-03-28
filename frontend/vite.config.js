import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      display: 'standalone',
      includeAssets: ['pawIcon.png', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Cat Messenger',
        short_name: 'KittyChat',
        description: 'Мессенджер с лапками',
        theme_color: '#1a1a1a', // Темная тема
        icons: [
          {
            src: '/pawIcon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/pawIcon192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    }),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
