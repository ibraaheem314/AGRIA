import { expect, test, type Page } from '@playwright/test'
import { createAdvisor, createProject, loginWith, manage, openFact, register, uniqueEmail } from './helpers'

test('inconnue → point expliqué → démarche terminée avec résultat incertain → mise à jour explicite → recalcul expliqué', async ({ page }) => {
  await register(page, 'Khady')
  const id = await createProject(page)

  await openFact(page, id, "Accès à l'eau")
  await page.getByLabel('Je ne sais pas').check()
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText("« Accès à l'eau » enregistré.")).toBeVisible()

  // Synthèse : prochaine action et point signalé sur le sujet.
  await page.getByRole('link', { name: 'Projet', exact: true }).click()
  await expect(page.getByText('Identifier une source d\'eau utilisable')).toBeVisible()
  await expect(page.getByRole('link', { name: "Source d'eau inconnue" })).toBeVisible()

  // Plan : justification et statut du contenu visibles.
  await page.getByRole('link', { name: 'Démarches', exact: true }).click()
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
  await page.getByRole('link', { name: 'Démarches', exact: true }).click()
  const done = page.getByRole('region', { name: /Démarches terminées/ })
  await expect(done.getByText("Identifier une source d'eau utilisable")).toBeVisible()
  await expect(page.getByRole('link', { name: "Confirmer la disponibilité de l'eau pendant la période envisagée" }).first()).toBeVisible()
})

async function setUnknown(page: Page, id: number, label: string) {
  await openFact(page, id, label)
  await page.getByLabel('Je ne sais pas').check()
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText(`« ${label} » enregistré.`)).toBeVisible()
}

async function finish(page: Page, text: string, outcome: RegExp) {
  await page.getByRole('button', { name: 'Terminer et indiquer le résultat' }).click()
  await page.getByLabel('Résultat réel de la démarche').fill(text)
  await page.getByRole('radio', { name: outcome }).check()
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText('Démarche terminée, résultat enregistré.')).toBeVisible()
}

test('résultat favorable : rien n’est vérifié automatiquement ; après mise à jour, le point n’est plus signalé', async ({ page }) => {
  await register(page, 'Ndeye')
  const id = await createProject(page)
  await setUnknown(page, id, "Accès à l'eau")
  await page.goto(`/d/${id}/plan`)
  await page.getByRole('link', { name: "Identifier une source d'eau utilisable" }).first().click()
  await finish(page, 'Forage du village, utilisable sur accord du comité (attestation remise).', /Favorable/)

  // Terminé ne veut pas dire résolu : le point reste ouvert, l'information n'a pas bougé.
  await expect(page.getByText(/reste ouvert tant que l'information « Accès à l'eau » n'est pas mise à jour/)).toBeVisible()
  await page.getByRole('link', { name: "Mettre à jour : Accès à l'eau" }).click()
  await expect(page.getByRole('region', { name: /Résultat de la démarche/ })).toContainText('résultat favorable')
  await expect(page.getByLabel('Je ne sais pas')).toBeChecked()
  await expect(page.getByLabel(/^Vérifié/)).not.toBeChecked()

  await page.getByLabel(/^Vérifié/).check()
  await page.getByLabel('Source principale').selectOption('forage')
  await page.getByLabel('Comment l’avez-vous vérifié ?').fill('Attestation du comité de gestion du forage.')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText(/Plus aucun point n'est signalé sur cette information par les règles disponibles \(ce n'est pas une validation du projet\)/)).toBeVisible()
  await expect(page.getByText(/Le point qui avait motivé cette démarche n'est plus signalé/)).toBeVisible()
})

test('résultat défavorable, démarche personnelle, dossier archivé et vue conseiller : aucune mise à jour proposée à tort', async ({ page, browser }) => {
  await register(page, 'Mamadou')
  const id = await createProject(page)
  await setUnknown(page, id, "Accès à l'eau")

  // Démarche personnelle : rien à mettre à jour automatiquement.
  await page.goto(`/d/${id}/plan`)
  await page.getByRole('button', { name: 'Ajouter une démarche personnelle' }).click()
  await page.getByLabel(/^Intitulé/).fill('Rencontrer un maraîcher voisin')
  await page.getByRole('button', { name: 'Ajouter' }).click()
  await page.getByRole('link', { name: 'Rencontrer un maraîcher voisin' }).first().click()
  await finish(page, 'Rencontre faite, conseils notés.', /Défavorable/)
  await expect(page.getByText(/Cette démarche personnelle n'est liée à aucune information du dossier/)).toBeVisible()
  await expect(page.getByRole('link', { name: /^Mettre à jour :/ })).toHaveCount(0)

  // Défavorable sur l'eau : le point reste ouvert, la mise à jour est proposée.
  await page.goto(`/d/${id}/plan`)
  await page.getByRole('link', { name: "Identifier une source d'eau utilisable" }).first().click()
  const actionUrl = page.url()
  await finish(page, 'Aucune source disponible en saison sèche.', /Défavorable/)
  await expect(page.getByText(/Décrivez la situation réelle, même défavorable/)).toBeVisible()
  await expect(page.getByRole('link', { name: "Mettre à jour : Accès à l'eau" })).toBeVisible()

  // Conseiller : lecture seule, la mise à jour revient au porteur.
  const advisorEmail = uniqueEmail('conseil-demarche')
  const password = createAdvisor(advisorEmail, 'Mme Sarr')
  manage('assign_advisor', '--dossier', String(id), '--email', advisorEmail)
  const ctx = await browser.newContext()
  const advisor = await ctx.newPage()
  await loginWith(advisor, advisorEmail, password)
  await advisor.goto(new URL(actionUrl).pathname)
  await expect(advisor.getByText(/— défavorable$/)).toBeVisible()
  await expect(advisor.getByText('La mise à jour revient au porteur du projet.')).toBeVisible()
  await expect(advisor.getByRole('link', { name: /^Mettre à jour :/ })).toHaveCount(0)
  await ctx.close()

  // Archivé : plus de mise à jour possible.
  await page.goto(`/d/${id}/synthese`)
  await page.getByRole('button', { name: 'Archiver…' }).click()
  await page.getByRole('button', { name: "Confirmer l'archivage" }).click()
  await page.goto(new URL(actionUrl).pathname)
  await expect(page.getByText('Dossier archivé : plus de mise à jour possible.')).toBeVisible()
  await expect(page.getByRole('link', { name: /^Mettre à jour :/ })).toHaveCount(0)
})
