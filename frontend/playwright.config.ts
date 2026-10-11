import { defineConfig, devices } from '@playwright/test'
import path from 'node:path'

// Parcours exécutés contre une base dédiée (agria_e2e, recréée à chaque lancement)
// et des ports distincts du développement : 8001 (Django) et 5174 (Vite).
// Le Python de backend/.venv lance aussi les scripts : jamais celui du PATH.
const python = path.resolve(
  import.meta.dirname,
  '../backend/.venv',
  process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python',
)

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:5174',
    // En local, le Chrome installé évite un téléchargement ; en CI, le Chromium de Playwright.
    channel: process.env.CI ? undefined : 'chrome',
    locale: 'fr-FR',
    timezoneId: 'Africa/Dakar',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'ordinateur', use: { ...devices['Desktop Chrome'] } },
    { name: 'telephone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    {
      command: `"${python}" ../scripts/dev.py e2e-server --port 8001`,
      url: 'http://127.0.0.1:8001/api/health',
      timeout: 120_000,
      reuseExistingServer: false,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      command: 'npx vite --host 127.0.0.1 --port 5174 --strictPort',
      url: 'http://127.0.0.1:5174',
      timeout: 60_000,
      reuseExistingServer: false,
      env: { AGRIA_API_URL: 'http://127.0.0.1:8001' },
    },
  ],
})
