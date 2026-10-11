import { expect, test } from '@playwright/test'

test('le serveur et la base répondent à travers le proxy', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Serveur et base de données disponibles.')).toBeVisible()
})
