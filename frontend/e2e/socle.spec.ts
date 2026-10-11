import { expect, test } from '@playwright/test'

test('le serveur et la base répondent à travers le proxy', async ({ page, request }) => {
  const health = await request.get('/api/health')
  expect(health.status()).toBe(200)
  expect(await health.json()).toEqual({ status: 'ok', database: 'ok', migrations: 'a_jour' })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible()
})
