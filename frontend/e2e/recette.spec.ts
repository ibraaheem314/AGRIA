import { expect, test } from '@playwright/test'
import { createAdvisor, createProject, loginWith, openFact, register, uniqueEmail } from './helpers'

test('exploitant : prochaine campagne préparée à partir de la précédente, sans recopier les résultats', async ({ page }) => {
  await register(page, 'Modou')
  const id = await createProject(page, { situation: 'Je prépare ma prochaine campagne', campaign: 'Contre-saison 2026' })

  // Le producteur voit les informations propres à son profil.
  await expect(page.getByRole('heading', { name: 'Vos campagnes précédentes' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Changements envisagés' })).toBeVisible()

  await openFact(page, id, "Accès à l'eau")
  await page.getByLabel('Vérifié').check()
  await page.getByLabel('Source principale').selectOption('forage')
  await page.getByLabel('Comment l’avez-vous vérifié ?').fill('Comité de gestion du forage, mars 2026')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText("« Accès à l'eau » enregistré.")).toBeVisible()

  await page.getByRole('button', { name: 'Nouvelle campagne' }).click()
  await page.getByLabel(/^Campagne préparée/).fill('Contre-saison 2027')
  await page.getByRole('button', { name: 'Créer la campagne' }).click()
  await expect(page.getByText('Campagne « Contre-saison 2027 » créée.')).toBeVisible()
  expect(Number(page.url().match(/\/d\/(\d+)/)?.[1])).not.toBe(id)

  // L'eau est reprise comme « déclarée », à revérifier ; rien n'est présenté comme vérifié.
  await expect(page.getByText('Vérifiées : 0')).toBeVisible()
  await expect(page.getByText(/Repris de la campagne « Contre-saison 2026 » .* à revérifier/)).toBeVisible()
  await page.getByRole('link', { name: 'Démarches', exact: true }).click()
  await expect(page.getByText("Disponibilité de l'eau déclarée mais non vérifiée")).toBeVisible()

  // La campagne précédente reste intacte.
  await page.goto(`/d/${id}/projet`)
  await expect(page.getByText('Vérifiées : 1')).toBeVisible()
})

test('conseiller non attribué : aucun dossier visible, accès direct refusé', async ({ page, browser }) => {
  await register(page, 'Ndeye')
  const id = await createProject(page)

  const email = uniqueEmail('conseil-libre')
  const password = createAdvisor(email, 'Conseiller sans dossier')
  const context = await browser.newContext()
  const advisor = await context.newPage()
  await loginWith(advisor, email, password)
  await expect(advisor.getByRole('heading', { name: 'Bienvenue' })).toBeVisible()
  await advisor.goto('/dossiers')
  await expect(advisor.getByText('Aucun dossier pour le moment.')).toBeVisible()
  await advisor.goto(`/d/${id}/relecture`)
  await expect(advisor.getByRole('heading', { name: 'Dossier introuvable' })).toBeVisible()
  const api = await advisor.request.get(`/api/dossiers/${id}`)
  expect(api.status()).toBe(404)
  await context.close()
})
