import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['mockmaster-icon.svg'],
      manifest: {
        name: 'MockMaster',
        short_name: 'MockMaster',
        description: 'AI-Powered Mock Tests from your PDFs',
        theme_color: '#FCEB7B',
        background_color: '#FCF5E5',
        display: 'standalone',
        icons: [
          {
            src: '/mockmaster-icon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
