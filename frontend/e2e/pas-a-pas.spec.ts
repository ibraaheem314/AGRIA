import { expect, test, type Page } from '@playwright/test'
import { createProject, register } from './helpers'

const stepHeading = (page: Page) => page.getByRole('heading', { level: 2 }).first()

test('débutant : pas à pas, report distinct de « Je ne sais pas », reprise sur les données enregistrées', async ({ page }) => {
  await register(page, 'Awa')
  const id = await createProject(page)
  await page.goto(`/d/${id}`)
  await expect(page.getByRole('heading', { name: 'Renseigner mon projet pas à pas' })).toBeVisible()
  await page.getByRole('link', { name: 'Commencer' }).click()

  // L'ordre commence par le lieu ; l'avancement parle de saisie, pas de faisabilité.
  await expect(stepHeading(page)).toHaveText('Localisation du terrain')
  await expect(page.getByText(/pas une mesure de la faisabilité/)).toBeVisible()
  await page.getByLabel('Déclaré').check()
  await page.getByLabel('Région').selectOption('Thiès')
  await page.getByRole('button', { name: 'Enregistrer et continuer' }).click()
  await expect(page.getByText('« Localisation du terrain » enregistré.')).toBeVisible()
  await expect(stepHeading(page)).toBeFocused()

  // Terrain en discussion : enregistré, mais le point reste ouvert.
  await expect(stepHeading(page)).toHaveText('Accès au terrain')
  await page.getByLabel('Déclaré').check()
  await page.getByLabel(/^Situation/).selectOption('en_discussion')
  await page.getByRole('button', { name: 'Enregistrer et continuer' }).click()
  await expect(page.getByText(/« Accès au terrain » enregistré\. Point encore ouvert : /)).toBeVisible()

  // Remettre à plus tard une saisie commencée : confirmation, puis rien n'est enregistré.
  await expect(stepHeading(page)).toHaveText("Accès à l'eau")
  await page.getByLabel('Déclaré').check()
  await page.getByRole('button', { name: 'Remettre à plus tard' }).click()
  await page.getByRole('button', { name: 'Quitter sans enregistrer' }).click()
  await expect(page.getByText(/remis à plus tard : rien n'a été enregistré/)).toBeVisible()

  await expect(stepHeading(page)).toHaveText('Culture envisagée')
  await page.getByLabel('Je ne sais pas').check()
  await page.getByRole('button', { name: 'Enregistrer et continuer' }).click()
  await expect(stepHeading(page)).toHaveText('Période envisagée')

  // Une saisie en cours reste protégée après un enregistrement réussi dans le pas-à-pas.
  await page.getByLabel('Déclaré').check()
  await page.getByRole('link', { name: 'Mon plan', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Rester sur la page' })).toBeVisible()
  await page.getByRole('button', { name: 'Quitter sans enregistrer' }).click()

  // Reprise : on repart de ce qui est enregistré, l'information remise à plus tard est sautée.
  await page.goto(`/d/${id}`)
  await expect(page.getByText('3 informations ont une réponse enregistrée sur 11.')).toBeVisible()
  await page.getByRole('link', { name: 'Continuer là où j’en étais' }).click()
  await expect(stepHeading(page)).toHaveText('Période envisagée')

  // Vue complète : reporté = non renseigné ; « Je ne sais pas » = réponse enregistrée.
  await page.getByRole('link', { name: '← Voir tout le projet' }).click()
  const card = (label: string) => page.getByRole('listitem').filter({ has: page.getByRole('heading', { name: label, exact: true }) })
  await expect(card("Accès à l'eau")).toContainText('Non renseigné')
  await expect(card('Culture envisagée')).toContainText('Je ne sais pas')
  await expect(card('Accès au terrain')).toContainText('Situation : point encore ouvert.')

  // Finir les autres, puis reprendre ce qui a été remis à plus tard.
  await page.getByRole('link', { name: /Renseigner pas à pas/ }).click()
  for (let i = 0; i < 7; i++) {
    const before = await stepHeading(page).textContent()
    await page.getByLabel('Je ne sais pas').check()
    await page.getByRole('button', { name: 'Enregistrer et continuer' }).click()
    await expect(stepHeading(page)).not.toHaveText(before ?? '')
  }
  await expect(stepHeading(page)).toHaveText('1 information remise à plus tard')
  await page.getByRole('button', { name: 'Les reprendre maintenant' }).click()
  await expect(stepHeading(page)).toHaveText("Accès à l'eau")
})

test('producteur : accès direct, pas de pas-à-pas imposé', async ({ page }) => {
  await register(page, 'Moussa')
  const id = await createProject(page, { situation: 'Je prépare ma prochaine campagne' })
  await page.goto(`/d/${id}`)
  await expect(page.getByRole('heading', { name: 'Renseigner mon projet pas à pas' })).toHaveCount(0)
  await page.goto(`/d/${id}/projet`)
  await expect(page.getByRole('link', { name: /Renseigner pas à pas/ })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /Compléter : Accès à l'eau/ })).toBeVisible()
})
