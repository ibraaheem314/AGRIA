import { defineConfig, devices } from '@playwright/test'

// Vérification du prototype : aucun backend. Serveur de test isolé sur un port distinct
// (5177 par défaut) : la démonstration du fondateur sur 5176 n'est jamais reprise ni arrêtée.
// Chaque test ouvre un contexte navigateur neuf : le stockage du navigateur du fondateur n'est pas touché.
const port = Number(process.env.PROTOTYPE_TEST_PORT ?? 5177)

export default defineConfig({
  testDir: './prototype/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  timeout: 60_000,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    channel: process.env.CI ? undefined : 'chrome',
    locale: 'fr-FR',
    timezoneId: 'Africa/Dakar',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'ordinateur', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'telephone', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `npx vite --config vite.prototype.config.ts --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    timeout: 60_000,
    reuseExistingServer: false,
  },
})
