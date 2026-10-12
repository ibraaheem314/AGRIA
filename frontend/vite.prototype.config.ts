import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

// Prototype UX1 (D-051) : application séparée de l'application livrée.
// Aucun proxy : le prototype n'appelle aucune API et n'écrit dans aucune base.
// Seul fichier lu hors du frontend : le contenu de préparation (lecture, au moment du build).
const here = import.meta.dirname
const content = path.resolve(here, '../backend/preparation/content')

export default defineConfig({
  root: path.resolve(here, 'prototype'),
  plugins: [react(), tailwindcss()],
  envPrefix: 'AGRIA_PROTOTYPE_',
  server: {
    host: '127.0.0.1',
    port: 5176,
    strictPort: true,
    fs: { allow: [here, content] },
  },
  preview: { host: '127.0.0.1', port: 4176, strictPort: true },
  build: { outDir: path.resolve(here, 'dist-prototype'), emptyOutDir: true },
})
