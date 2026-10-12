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

test('dernière décision rappelée, attribuée, distincte de l’avis ; invitation à relire les précisions', async ({ page }) => {
  await register(page, 'Decide')
  const id = await createProject(page)
  await save(page, id, 'Accès au terrain', async (p) => {
    await p.getByLabel('Déclaré').check()
    await p.getByLabel(/^Situation/).selectOption('en_discussion')
    await p.getByLabel(/^Précisions/).fill('Accord oral du propriétaire.')
  })
  await page.goto(`/d/${id}/relecture`)
  await page.getByRole('radio', { name: 'Poursuivre' }).check()
  await page.getByRole('textbox', { name: /^Motifs/ }).fill('Terrain en bonne voie.')
  await page.getByRole('button', { name: 'Enregistrer la décision' }).click()
  await expect(page.getByText('Décision enregistrée.')).toBeVisible()

  await page.goto(`/d/${id}`)
  const decision = page.locator('section', { has: page.getByRole('heading', { name: 'Dernière décision du porteur' }) })
  await expect(decision).toContainText('Poursuivre')
  await expect(decision).toContainText('décision de Decide')
  await expect(decision).toContainText('Motif : Terrain en bonne voie.')
  await expect(decision).toContainText('« Poursuivre » n’est pas une approbation d’AGRIA')
  await expect(decision).not.toContainText('modifié depuis')

  // Changement de situation : invitation à relire, rien n'est effacé ; puis le fait est signalé.
  await openFact(page, id, 'Accès au terrain')
  await page.getByLabel(/^Situation/).selectOption('accord')
  await expect(page.getByText(/La situation a changé : relisez les précisions et la source/)).toBeVisible()
  await expect(page.getByLabel(/^Précisions/)).toHaveValue('Accord oral du propriétaire.')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText(/« Accès au terrain » enregistré/)).toBeVisible()
  await page.goto(`/d/${id}`)
  await expect(decision).toContainText('Le dossier a été modifié depuis cette décision.')
})

test('démarche en cours puis bloquée : l’action principale suit l’état de la démarche', async ({ page }) => {
  await register(page, 'Suivi')
  const id = await createProject(page, { situation: 'Je prépare ma prochaine campagne' })
  await save(page, id, "Accès à l'eau", (p) => p.getByLabel('Je ne sais pas').check())
  await page.goto(`/d/${id}/plan`)
  await page.getByRole('link', { name: "Identifier une source d'eau utilisable" }).first().click()
  await page.getByRole('button', { name: 'Commencer' }).click()
  await expect(page.getByText('Démarche commencée.')).toBeVisible()
  await page.goto(`/d/${id}`)
  await expect(primary(page)).toHaveText('À faire maintenant · Démarche en cours')
  await expect(page.getByRole('link', { name: 'Continuer la démarche' })).toBeVisible()

  await page.getByRole('link', { name: 'Continuer la démarche' }).click()
  await page.getByRole('button', { name: 'Signaler un blocage' }).click()
  await page.getByLabel(/^Qu'est-ce qui bloque/).fill('Le gestionnaire du forage est absent.')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText('Blocage enregistré.')).toBeVisible()
  await page.goto(`/d/${id}`)
  // L'information bloquante non renseignée passe en principal.
  await expect(primary(page)).toHaveText('À faire maintenant · Renseigner le dossier')
  // La démarche bloquée n'est listée qu'une fois, dans les points bloquants, avec son motif.
  await expect(page.getByRole('link', { name: "Identifier une source d'eau utilisable" })).toHaveCount(1)
  await expect(page.getByText('Le gestionnaire du forage est absent.')).toHaveCount(1)
})
