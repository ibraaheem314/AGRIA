import { defineConfig, devices } from '@playwright/test'

// Vérification du prototype UX1 : aucun backend, port distinct de l'application.
export default defineConfig({
  testDir: './prototype/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  timeout: 60_000,
  use: {
    baseURL: 'http://127.0.0.1:5176',
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
    command: 'npx vite --config vite.prototype.config.ts',
    url: 'http://127.0.0.1:5176',
    timeout: 60_000,
    reuseExistingServer: false,
  },
})
