import { expect, test, type Page } from '@playwright/test'
import { createAdvisor, createProject, loginWith, manage, openFact, register, uniqueEmail } from './helpers'

/** Aucun lien de la page ne promet une modification des informations. */
async function expectNoEditLinks(page: Page) {
  await expect(page.getByRole('link', { name: /^(Compléter|Mettre à jour|Renseigner)/ })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /^(Enregistrer|Ajouter|Terminer|Commencer)/ })).toHaveCount(0)
}

test('conseiller et dossier archivé : titres de consultation, aucun lien promettant une modification', async ({ page, browser }) => {
  await register(page, 'Rokhaya')
  const id = await createProject(page, { name: 'Projet de Rokhaya', campaign: 'Saison test' })
  await openFact(page, id, "Accès à l'eau")
  await page.getByLabel('Je ne sais pas').check()
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText("« Accès à l'eau » enregistré.")).toBeVisible()

  const advisorEmail = uniqueEmail('conseil-roles')
  const password = createAdvisor(advisorEmail, 'M. Sy')
  manage('assign_advisor', '--dossier', String(id), '--email', advisorEmail)
  const ctx = await browser.newContext()
  const advisor = await ctx.newPage()
  await loginWith(advisor, advisorEmail, password)

  // Propriétaire et campagne identifiables, actions propres au conseiller annoncées.
  await advisor.goto(`/d/${id}`)
  await expect(advisor.getByText(/Vous consultez le dossier de Rokhaya \(« Projet de Rokhaya », campagne « Saison test »\)/)).toBeVisible()
  await expect(advisor.getByRole('link', { name: 'Plan', exact: true })).toBeVisible()

  await advisor.goto(`/d/${id}/plan`)
  await expect(advisor.getByRole('heading', { level: 1, name: 'Plan du projet' })).toBeVisible()
  await expect(advisor.getByRole('link', { name: "Consulter l’information : Accès à l'eau" })).toBeVisible()
  await expectNoEditLinks(advisor)

  await advisor.goto(`/d/${id}/projet`)
  await expect(advisor.getByText(/porteur : Rokhaya/)).toBeVisible()
  await expectNoEditLinks(advisor)

  await advisor.getByRole('link', { name: "Consulter l’information : Accès à l'eau" }).click()
  await expect(advisor.getByRole('link', { name: '← Projet' })).toBeVisible()
  await expectNoEditLinks(advisor)
  await expect(advisor.getByRole('link', { name: 'Poser une question sur cette information' })).toBeVisible()

  await advisor.goto(`/d/${id}/plan`)
  await advisor.getByRole('link', { name: /^Démarche : / }).first().click()
  await expect(advisor.getByRole('link', { name: '← Plan du projet' })).toBeVisible()
  await expectNoEditLinks(advisor)

  // Le serveur refuse toujours l'écriture du conseiller.
  const csrf = (await ctx.cookies()).find((c) => c.name === 'csrftoken')?.value ?? ''
  const refused = await advisor.request.put(`/api/dossiers/${id}/informations/eau`, {
    data: { status: 'declare', value: { source: 'puits' }, source: '', expected_version: 1 },
    headers: { 'X-CSRFToken': csrf },
  })
  expect(refused.status()).toBe(403)
  await ctx.close()

  // Dossier archivé : même le porteur ne voit que des liens de consultation.
  await page.goto(`/d/${id}/synthese`)
  await page.getByRole('button', { name: 'Archiver…' }).click()
  await page.getByRole('button', { name: "Confirmer l'archivage" }).click()
  for (const path of ['', '/plan', '/projet/eau']) {
    await page.goto(`/d/${id}${path}`)
    await expect(page.locator('h1')).toBeVisible()
    await expectNoEditLinks(page)
  }
  await page.goto(`/d/${id}/plan`)
  await expect(page.getByRole('link', { name: "Consulter l’information : Accès à l'eau" })).toBeVisible()
})
