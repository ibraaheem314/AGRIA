import { expect, test } from '@playwright/test'
import { createProject, openFact, register } from './helpers'

test('inconnue → point expliqué → démarche terminée avec résultat incertain → mise à jour explicite → recalcul expliqué', async ({ page }) => {
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
  // L'issue est obligatoire : sans elle, rien n'est enregistré et la saisie reste.
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText('Indiquez si le résultat est favorable, défavorable ou incertain.')).toBeVisible()
  await expect(page.getByLabel('Résultat réel de la démarche')).toHaveValue(/Un puits partagé/)
  await page.getByRole('radio', { name: /Incertain/ }).check()
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText('Démarche terminée, résultat enregistré.')).toBeVisible()
  await expect(page.getByText('Un puits partagé à 300 m', { exact: false }).first()).toBeVisible()

  // Terminer ne règle rien : l'information n'a pas changé et le point reste ouvert.
  const next = page.getByRole('heading', { name: 'Et maintenant : mettre le dossier à jour' })
  await expect(next).toBeVisible()
  await page.getByRole('link', { name: "Mettre à jour : Accès à l'eau" }).click()

  // Le résultat est consultable pendant la mise à jour, sans rien préremplir.
  const result = page.getByRole('region', { name: /Résultat de la démarche/ })
  await expect(result).toContainText('résultat incertain')
  await expect(result).toContainText('Un puits partagé à 300 m')
  await expect(page.getByLabel('Je ne sais pas')).toBeChecked()

  // Le contexte change explicitement : retour à la démarche, recalcul expliqué.
  await page.getByLabel('Déclaré').check()
  await page.getByLabel('Source principale').selectOption('puits')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText(/« Accès à l'eau » enregistré\. Point encore ouvert : /)).toBeVisible()
  await expect(page).toHaveURL(/\/plan\/\d+$/)

  // La démarche terminée reste, une nouvelle démarche s'ajoute.
  await page.getByRole('link', { name: 'Mon plan', exact: true }).click()
  const done = page.getByRole('region', { name: /Démarches terminées/ })
  await expect(done.getByText("Identifier une source d'eau utilisable")).toBeVisible()
  await expect(page.getByRole('link', { name: "Confirmer la disponibilité de l'eau pendant la période envisagée" }).first()).toBeVisible()
})
