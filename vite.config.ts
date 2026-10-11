import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false, // Réduit les overlays d'erreur
    },
    watch: {
      usePolling: false, // Désactive le polling pour de meilleures performances
      ignored: ['**/node_modules/**', '**/.git/**'], // Ignore les dossiers non nécessaires
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  css: {
    devSourcemap: false, // Désactive les sourcemaps CSS en développement
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
