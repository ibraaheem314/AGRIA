import { expect, test, type Page } from '@playwright/test'
import { createProject, openFact, register } from './helpers'

async function save(page: Page, id: number, label: string, fill: (page: Page) => Promise<void>) {
  await openFact(page, id, label)
  await fill(page)
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText(`« ${label} » enregistré.`, { exact: false })).toBeVisible()
}

const primary = (page: Page) => page.getByText(/^À faire maintenant · /)

test('débutant : une seule priorité, la démarche reste accessible sans consigne contradictoire', async ({ page }) => {
  await register(page, 'Prio')
  const id = await createProject(page)
  await save(page, id, "Accès à l'eau", (p) => p.getByLabel('Je ne sais pas').check())
  await page.goto(`/d/${id}`)

  await expect(primary(page)).toHaveCount(1)
  await expect(primary(page)).toHaveText('À faire maintenant · Renseigner le dossier')
  await expect(page.getByRole('link', { name: 'Continuer pas à pas' })).toBeVisible()
  // La démarche est proposée en secondaire, explicitement indépendante de la saisie.
  const also = page.getByRole('region', { name: 'Aussi possible' })
  await expect(also.getByRole('link', { name: "Identifier une source d'eau utilisable" })).toBeVisible()
  await expect(also.getByText(/Elle peut avancer en parallèle de la saisie\./)).toBeVisible()
  await expect(page.getByText(/d'abord/)).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Ma prochaine action' })).toHaveCount(0)

  // Destination vérifiée : le pas-à-pas s'ouvre sur l'information attendue.
  await page.getByRole('link', { name: 'Continuer pas à pas' }).click()
  await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText('Localisation du terrain')
})

test('producteur : terrain non renseigné et eau à vérifier, aucune consigne contradictoire', async ({ page }) => {
  await register(page, 'Prod')
  const id = await createProject(page, { situation: 'Je prépare ma prochaine campagne' })
  await save(page, id, 'Localisation du terrain', async (p) => {
    await p.getByLabel('Déclaré').check()
    await p.getByLabel('Région').selectOption('Louga')
  })
  await save(page, id, "Accès à l'eau", async (p) => {
    await p.getByLabel('Déclaré').check()
    await p.getByLabel('Source principale').selectOption('forage')
  })
  await page.goto(`/d/${id}`)

  await expect(primary(page)).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 2, name: 'Compléter : Accès au terrain' })).toBeVisible()
  await expect(page.getByText(/Signalée comme bloquante par les règles : Accès au terrain/)).toBeVisible()
  await expect(page.getByText(/d'abord/)).toHaveCount(0)
  await expect(page.getByRole('link', { name: "Confirmer la disponibilité de l'eau pendant la période envisagée" })).toBeVisible()

  // Accès direct : le bouton ouvre l'information annoncée.
  await page.getByRole('link', { name: 'Compléter cette information' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Accès au terrain' })).toBeVisible()
})

test('erreur de chargement : aucun faux « rien à faire » ni « aucun retour »', async ({ page }) => {
  await register(page, 'Panne')
  const id = await createProject(page)
  await page.route(`**/api/dossiers/${id}/preparation`, (route) => route.fulfill({ status: 500, body: '{}' }))
  await page.route(`**/api/dossiers/${id}/relecture`, (route) => route.fulfill({ status: 500, body: '{}' }))
  await page.goto(`/d/${id}`)
  await expect(page.getByText('Plan indisponible')).toBeVisible()
  await expect(page.getByText(/Retours indisponibles|Échanges indisponibles/)).toBeVisible()
  await expect(primary(page)).toHaveCount(0)
  await expect(page.getByText(/Aucune démarche ouverte|Aucun retour|Aucun point bloquant|Aucune intervention/)).toHaveCount(0)
})
