import { expect, test } from '@playwright/test'

test('le serveur et la base répondent à travers le proxy', async ({ page, request }) => {
  const health = await request.get('/api/health')
  expect(health.status()).toBe(200)
  expect(await health.json()).toEqual({ status: 'ok', database: 'ok', migrations: 'a_jour' })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible()
})

test('connexion envoyée avant l’arrivée du cookie CSRF : pas de refus', async ({ page, context }) => {
  const { register } = await import('./helpers')
  const email = await register(page, 'Rapide')
  await page.getByRole('button', { name: 'Se déconnecter' }).click()
  await page.goto('/connexion')
  await context.clearCookies() // simule un cookie CSRF pas encore reçu (réseau lent)
  await page.getByLabel('Adresse email').fill(email)
  await page.getByLabel('Mot de passe').fill('Mot-de-passe-e2e-2026')
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await expect(page.getByRole('heading', { name: 'Bienvenue' })).toBeVisible()
})
