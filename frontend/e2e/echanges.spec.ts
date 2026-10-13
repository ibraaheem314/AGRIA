import { expect, test, type Page } from '@playwright/test'
import { createAdvisor, createProject, loginWith, manage, openFact, register, uniqueEmail } from './helpers'

const exchanges = (page: Page) => page.getByRole('region', { name: 'Échanges et relecture' })
const primary = (page: Page) => page.getByText(/^À faire maintenant · /)

async function reply(page: Page, text: string) {
  await page.getByRole('textbox', { name: 'Répondre' }).first().fill(text)
  await page.getByRole('button', { name: 'Envoyer la réponse' }).first().click()
  await expect(page.getByText(text)).toBeVisible()
}

test('qui doit agir : questions dans les deux sens, relances, relecture demandée, avis à réexaminer', async ({ page, browser }) => {
  test.setTimeout(120_000)
  await register(page, 'Ndiaye')
  const id = await createProject(page, { name: 'Projet échanges', campaign: 'Saison échanges' })

  // Sans conseiller : rien n'est promis.
  await page.goto(`/d/${id}`)
  await expect(exchanges(page)).toContainText("Aucun conseiller n'est attribué à ce dossier pour le moment : aucune réponse ni aucun avis ne peut être promis.")

  // Relecture demandée, sans avis.
  await page.goto(`/d/${id}/relecture`)
  await page.getByRole('button', { name: 'Demander une relecture' }).click()
  await page.getByRole('button', { name: 'Envoyer la demande' }).click()
  await expect(page.getByText(/Relecture demandée le .*, en attente d'avis\./)).toBeVisible()

  const advisorEmail = uniqueEmail('conseil-echanges')
  const password = createAdvisor(advisorEmail, 'Mme Diallo')
  manage('assign_advisor', '--dossier', String(id), '--email', advisorEmail)
  const ctx = await browser.newContext()
  const advisor = await ctx.newPage()
  await loginWith(advisor, advisorEmail, password)

  await page.goto(`/d/${id}`)
  await expect(exchanges(page)).toContainText(/Relecture demandée le .* — aucun avis reçu depuis\./)

  // Conseiller : son intervention utile, pas l'accueil du porteur.
  await advisor.goto(`/d/${id}`)
  await expect(primary(advisor)).toHaveText('À faire maintenant · Relecture demandée')
  await expect(advisor.getByRole('heading', { name: 'Examiner le dossier et rédiger un avis' })).toBeVisible()
  await expect(advisor.getByRole('link', { name: /pas à pas|Compléter/ })).toHaveCount(0)

  // Question du conseiller : le porteur doit répondre ; les sujets et leurs points restent visibles.
  await advisor.goto(`/d/${id}/projet/acces_terrain`)
  await advisor.getByRole('link', { name: 'Poser une question sur cette information' }).click()
  await advisor.getByRole('textbox', { name: 'Message' }).fill('Le terrain est-il loué ?')
  await advisor.getByRole('button', { name: 'Envoyer', exact: true }).click()
  await expect(advisor.getByText('Message envoyé.')).toBeVisible()
  await expect(advisor.getByText('En attente d’une réponse')).toBeVisible()

  await page.goto(`/d/${id}`)
  await expect(primary(page)).toHaveText('À faire maintenant · Une réponse est attendue de vous')
  await expect(page.getByRole('heading', { name: 'Les sujets du dossier' })).toBeVisible()
  await page.getByRole('link', { name: 'Répondre au conseiller' }).click()
  await expect(page.locator('#messages')).toBeFocused()
  await expect(page.getByText('Attend votre réponse')).toBeVisible()
  await reply(page, 'Prêté, sans écrit.')

  // Réponse donnée : l'échange reste ouvert, aucune tâche fictive de part et d'autre.
  await page.goto(`/d/${id}`)
  await expect(primary(page)).not.toHaveText(/Une réponse est attendue/)
  await expect(exchanges(page)).toContainText('Vous avez répondu à une question ; elle reste ouverte')
  await advisor.goto(`/d/${id}`)
  await expect(exchanges(advisor)).toContainText("Réponse reçue à une de vos questions ; l'échange reste ouvert")
  await advisor.goto('/dossiers')
  await expect(advisor.getByText(/attend votre réponse/)).toHaveCount(0)

  // Relance du conseiller : la réponse est de nouveau attendue du porteur.
  await advisor.goto(`/d/${id}/relecture`)
  await reply(advisor, 'Pour combien de temps ?')
  await page.goto('/dossiers')
  await expect(page.getByText('1 question attend votre réponse')).toBeVisible()

  // Question du porteur : c'est au conseiller de répondre.
  await page.goto(`/d/${id}/relecture`)
  await page.getByRole('textbox', { name: 'Message' }).fill('Qui contacter pour l’eau ?')
  await page.getByRole('button', { name: 'Envoyer', exact: true }).click()
  await expect(page.getByText('Message envoyé.')).toBeVisible()
  await advisor.goto(`/d/${id}`)
  await expect(primary(advisor)).toHaveText('À faire maintenant · Une réponse est attendue de vous')
  await expect(advisor.getByRole('link', { name: 'Répondre', exact: true })).toBeVisible()

  // Avis, puis modification : à réexaminer des deux côtés.
  await advisor.goto(`/d/${id}/relecture`)
  await advisor.getByRole('button', { name: 'Rédiger un avis' }).click()
  await advisor.getByRole('checkbox', { name: 'Contexte du projet' }).check()
  await advisor.getByRole('radio', { name: 'Revu avec réserves' }).check()
  await advisor.getByRole('textbox', { name: /^Avis/ }).fill('Contexte lisible.')
  await advisor.getByRole('textbox', { name: /^Réserves/ }).fill('Accord écrit à obtenir.')
  await advisor.getByRole('button', { name: 'Enregistrer l’avis' }).click()
  await expect(advisor.getByText('Avis enregistré.')).toBeVisible()
  await page.goto(`/d/${id}`)
  await expect(exchanges(page)).toContainText('Dernier avis du conseiller : Revu avec réserves')
  await expect(exchanges(page).getByText('À jour')).toBeVisible()
  await expect(exchanges(page)).not.toContainText('aucun avis reçu')

  await openFact(page, id, "Accès à l'eau")
  await page.getByLabel('Je ne sais pas').check()
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText(/« Accès à l'eau » enregistré/)).toBeVisible()
  await page.goto(`/d/${id}`)
  await expect(exchanges(page).getByText('À réexaminer')).toBeVisible()
  await advisor.goto('/dossiers')
  await expect(advisor.getByText('Avis à réexaminer')).toBeVisible()
  await advisor.goto(`/d/${id}`)
  await expect(advisor.getByRole('region', { name: 'Aussi possible' }).getByText('Le dossier a changé depuis le dernier avis')).toBeVisible()
  await ctx.close()
})
