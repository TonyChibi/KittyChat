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
      manifest: {
        name: 'Cat Messenger',
        short_name: 'CatChat',
        description: 'Мессенджер с лапками и мяуканьем',
        theme_color: '#1a1a1a', // Темная тема
        icons: [
          {
            src: './src/assets/pawIcon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    }),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
