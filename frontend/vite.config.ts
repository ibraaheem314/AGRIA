import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const API_TARGET = process.env.AGRIA_API_URL ?? 'http://127.0.0.1:8000'

// Le frontend n'a besoin d'aucune variable d'environnement ni d'aucun secret :
// en développement, /api et /admin sont relayés vers Django sur la même origine,
// ce qui permet les cookies de session et la protection CSRF sans CORS.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  envPrefix: 'AGRIA_PUBLIC_',
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: false },
      '/admin': { target: API_TARGET, changeOrigin: false },
      '/static': { target: API_TARGET, changeOrigin: false },
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: false },
    },
  },
})
