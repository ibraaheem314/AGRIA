import { expect, test } from '@playwright/test'
import { createAdvisor, createProject, loginWith, manage, openFact, register, uniqueEmail } from './helpers'

test('conseiller attribué : avis traçable, avis à réexaminer après modification, question, synthèse', async ({
  page,
  browser,
}) => {
  test.setTimeout(60_000)
  // Porteur : dossier avec une inconnue.
  await register(page, 'Mariama')
  const id = await createProject(page)
  await openFact(page, id, "Accès à l'eau")
  await page.getByLabel('Je ne sais pas').check()
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText("« Accès à l'eau » enregistré.")).toBeVisible()

  // Sans conseiller : absence explicite, aucun avis inventé.
  await page.goto(`/d/${id}`)
  await expect(page.getByText(/Aucun conseiller n'est attribué à ce dossier pour le moment : aucune réponse ni aucun avis ne peut être promis./)).toBeVisible()
  await page.goto(`/d/${id}/relecture`)
  await expect(page.getByText('Aucun avis pour le moment.')).toBeVisible()
  await page.getByRole('button', { name: 'Demander une relecture' }).click()
  await page.getByRole('button', { name: 'Envoyer la demande' }).click()
  await expect(page.getByText(/Relecture demandée le .*, en attente d'avis\./)).toBeVisible()

  // Exploitation : création et attribution du conseiller par les commandes réelles.
  const advisorEmail = uniqueEmail('conseil')
  const password = createAdvisor(advisorEmail, 'M. Diouf')
  manage('assign_advisor', '--dossier', String(id), '--email', advisorEmail)

  const advisorContext = await browser.newContext()
  const advisor = await advisorContext.newPage()
  await loginWith(advisor, advisorEmail, password)
  await advisor.goto('/dossiers')
  await expect(advisor.getByText('Relecture demandée')).toBeVisible()
  await advisor.goto(`/d/${id}/relecture`)
  await advisor.getByRole('button', { name: 'Rédiger un avis' }).click()
  await advisor.getByRole('checkbox', { name: 'Contexte du projet' }).check()
  await advisor.getByRole('radio', { name: 'Revu avec réserves' }).check()
  await advisor.getByRole('textbox', { name: /^Avis/ }).fill('Projet cohérent sur le contexte décrit.')
  await advisor.getByRole('button', { name: 'Enregistrer l’avis' }).click()
  await expect(advisor.getByRole('alert')).toContainText('Avis non enregistré')
  await expect(advisor.getByText('Précisez vos réserves.')).toBeVisible()
  await advisor.getByRole('textbox', { name: /^Réserves/ }).fill("Source d'eau à identifier avant tout engagement.")
  await advisor.getByRole('button', { name: 'Enregistrer l’avis' }).click()
  await expect(advisor.getByText('Avis enregistré.')).toBeVisible()

  // Porteur : l'avis est visible et à jour, puis à réexaminer après une modification du contexte.
  await page.goto(`/d/${id}/relecture`)
  await expect(page.getByText('Revu avec réserves').first()).toBeVisible()
  await expect(page.getByText('À jour')).toBeVisible()
  await openFact(page, id, "Accès à l'eau")
  await page.getByLabel('Déclaré').check()
  await page.getByLabel('Source principale').selectOption('puits')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText("« Accès à l'eau » enregistré.")).toBeVisible()
  await page.goto(`/d/${id}/relecture`)
  await expect(page.getByText('À réexaminer')).toBeVisible()
  await expect(page.getByText(/Modifié depuis cet avis : Contexte du projet\./)).toBeVisible()

  // Question liée à une démarche ; réponse du conseiller.
  await page.goto(`/d/${id}/plan`)
  await page.getByRole('link', { name: "Identifier une source d'eau utilisable" }).first().click()
  await page.getByRole('link', { name: 'Poser une question sur cette démarche' }).click()
  await page.getByRole('textbox', { name: 'Message' }).fill('Qui gère le puits du village ?')
  await page.getByRole('button', { name: 'Envoyer', exact: true }).click()
  await expect(page.getByText('Message envoyé.')).toBeVisible()
  await advisor.goto(`/d/${id}/relecture`)
  await expect(advisor.getByText("Démarche : « Identifier une source d'eau utilisable »")).toBeVisible()
  await advisor.getByRole('textbox', { name: 'Répondre' }).fill('Le comité de gestion, voir avec le chef de village.')
  await advisor.getByRole('button', { name: 'Envoyer la réponse' }).click()
  await expect(advisor.getByText('Le comité de gestion, voir avec le chef de village.')).toBeVisible()

  // Synthèse fidèle et export à accès contrôlé.
  await page.goto(`/d/${id}/synthese`)
  await expect(page.getByRole('heading', { name: 'Synthèse du dossier' })).toBeVisible()
  await expect(page.getByText('Non renseigné').first()).toBeVisible()
  await expect(page.getByText("Source d'eau à identifier avant tout engagement.")).toBeVisible()
  await expect(page.getByText('À réexaminer')).toBeVisible()
  await expect(page.getByText('Qui gère le puits du village ?')).toBeVisible()
  const own = await page.request.get(`/api/dossiers/${id}/synthese?telecharger=1`)
  expect(own.status()).toBe(200)
  expect(own.headers()['content-disposition']).toContain('attachment')

  const strangerContext = await browser.newContext()
  const stranger = await strangerContext.newPage()
  await register(stranger, 'Inconnu')
  const refused = await stranger.request.get(`/api/dossiers/${id}/synthese?telecharger=1`)
  expect(refused.status()).toBe(404)
  await stranger.goto(`/d/${id}/synthese`)
  await expect(stranger.getByRole('heading', { name: 'Dossier introuvable' })).toBeVisible()

  await advisorContext.close()
  await strangerContext.close()
})

test('question ciblée du conseiller : visible à l’accueil du porteur jusqu’à sa réponse', async ({ page, browser }) => {
  await register(page, 'Binta')
  const id = await createProject(page)
  const advisorEmail = uniqueEmail('conseil-question')
  const password = createAdvisor(advisorEmail, 'M. Ba')
  manage('assign_advisor', '--dossier', String(id), '--email', advisorEmail)
  const advisorContext = await browser.newContext()
  const advisor = await advisorContext.newPage()
  await loginWith(advisor, advisorEmail, password)

  // Le conseiller lit l'information (libellés de son rôle) et pose une question à son sujet.
  await advisor.goto(`/d/${id}/projet/acces_terrain`)
  await expect(advisor.getByRole('link', { name: '← Projet' })).toBeVisible()
  await advisor.getByRole('link', { name: 'Poser une question sur cette information' }).click()
  await expect(advisor.getByText('À propos de : Information « Accès au terrain ».')).toBeVisible()
  await advisor.getByRole('textbox', { name: 'Message' }).fill('Le terrain est-il loué ou prêté ?')
  await advisor.getByRole('button', { name: 'Envoyer', exact: true }).click()
  await expect(advisor.getByText('Message envoyé.')).toBeVisible()

  // Le porteur voit à l'accueil qu'une réponse est attendue, puis répond.
  await page.goto(`/d/${id}`)
  await expect(page.getByText('Une question du conseiller attend votre réponse : « Accès au terrain ».')).toBeVisible()
  await page.getByRole('link', { name: 'Répondre au conseiller' }).click()
  await page.getByRole('textbox', { name: 'Répondre' }).fill('Prêté par un oncle, sans écrit.')
  await page.getByRole('button', { name: 'Envoyer la réponse' }).click()
  await expect(page.getByText('Prêté par un oncle, sans écrit.')).toBeVisible()
  await page.goto(`/d/${id}`)
  await expect(page.getByText(/attend votre réponse/)).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Ouvrir la relecture et les échanges' })).toBeVisible()
  await advisorContext.close()
})
