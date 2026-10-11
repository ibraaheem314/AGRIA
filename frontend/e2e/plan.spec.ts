import { expect, test } from '@playwright/test'
import { createProject, openFact, register } from './helpers'

test('inconnue → point expliqué → démarche terminée avec résultat → contexte modifié sans perte', async ({ page }) => {
  await register(page, 'Khady')
  const id = await createProject(page)

  await openFact(page, id, "Accès à l'eau")
  await page.getByLabel('Je ne sais pas').check()
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText("« Accès à l'eau » enregistré.")).toBeVisible()

  // Accueil : prochaine action et point bloquant.
  await page.getByRole('link', { name: 'Aujourd’hui' }).click()
  await expect(page.getByText('Identifier une source d\'eau utilisable')).toBeVisible()
  await expect(page.getByRole('link', { name: "Source d'eau inconnue" })).toBeVisible()

  // Plan : justification et statut du contenu visibles.
  await page.getByRole('link', { name: 'Mon plan' }).click()
  await expect(page.getByText('Non relu par un spécialiste')).toBeVisible()
  await expect(page.getByText("Pourquoi ? La disponibilité de l'eau pendant toute la période envisagée")).toBeVisible()

  // Démarche : terminer sans résultat est refusé, la saisie reste.
  await page.getByRole('link', { name: "Identifier une source d'eau utilisable" }).first().click()
  await page.getByRole('button', { name: 'Terminer et indiquer le résultat' }).click()
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByRole('alert')).toContainText('Non enregistré')
  await page.getByLabel('Résultat réel de la démarche').fill('Un puits partagé à 300 m, accès à négocier avec le chef de village.')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText('Démarche terminée, résultat enregistré.')).toBeVisible()
  await expect(page.getByText('Un puits partagé à 300 m', { exact: false }).first()).toBeVisible()

  // Le contexte change : la démarche terminée reste, une nouvelle démarche s'ajoute.
  await openFact(page, id, "Accès à l'eau")
  await page.getByLabel('Déclaré').check()
  await page.getByLabel('Source principale').selectOption('puits')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText("« Accès à l'eau » enregistré.")).toBeVisible()
  await page.getByRole('link', { name: 'Mon plan' }).click()
  const done = page.getByRole('region', { name: /Démarches terminées/ })
  await expect(done.getByText("Identifier une source d'eau utilisable")).toBeVisible()
  await expect(page.getByRole('link', { name: "Confirmer la disponibilité de l'eau pendant la période envisagée" }).first()).toBeVisible()
})
