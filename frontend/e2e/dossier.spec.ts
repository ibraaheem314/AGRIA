import { expect, test } from '@playwright/test'
import { createProject, login, openFact, register } from './helpers'

test('débutant : connexion, projet, information inconnue, sauvegarde et réouverture', async ({ page }) => {
  const email = await register(page, 'Awa')
  const id = await createProject(page)

  // Aucune information n'est préremplie.
  await page.goto(`/d/${id}/projet`)
  await expect(page.getByText('Non renseignées : 11')).toBeVisible()

  // « Je ne sais pas » est une réponse acceptée et enregistrée sans valeur.
  await openFact(page, id, 'Accès à l’eau'.replace('’', "'"))
  await page.getByLabel('Je ne sais pas').check()
  await page.getByLabel('Source ou précision').fill('Demander au chef de village')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText("« Accès à l'eau » enregistré.")).toBeVisible()

  // Une information vérifiée exige sa source ; la saisie est conservée après le refus.
  await openFact(page, id, 'Localisation du terrain')
  await page.getByLabel('Vérifié').check()
  await page.getByLabel('Région').selectOption('Thiès')
  await page.getByLabel('Commune, village ou quartier').fill('Pout')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByRole('alert')).toContainText('Non enregistré')
  await expect(page.getByLabel('Commune, village ou quartier')).toHaveValue('Pout')
  await page.getByLabel('Comment l’avez-vous vérifié ?').fill('Visite du terrain le 2 octobre')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText('« Localisation du terrain » enregistré.')).toBeVisible()

  // Déconnexion, reconnexion : le dossier est rouvert tel qu'enregistré.
  await page.getByRole('button', { name: 'Se déconnecter' }).click()
  await login(page, email)
  await expect(page.getByRole('heading', { level: 1, name: 'Parcelle de test' })).toBeVisible()
  await page.getByRole('link', { name: 'Toutes les informations' }).click()
  await expect(page.getByText('Région : Thiès')).toBeVisible()
  await expect(page.getByText('Vérifiées : 1')).toBeVisible()
  await expect(page.getByText('« Je ne sais pas » : 1')).toBeVisible()
})

test('coupure réseau à l’enregistrement : saisie conservée, reprise sans doublon', async ({ page }) => {
  await register(page, 'Ousmane')
  const id = await createProject(page, { situation: 'Je prépare ma prochaine campagne' })
  await openFact(page, id, 'Culture envisagée')
  await page.getByLabel('Déclaré').check()
  await page.getByLabel('Culture').fill('Oignon')

  // La requête atteint le serveur mais la réponse est perdue.
  let first = true
  await page.route('**/api/dossiers/*/informations/culture', async (route) => {
    if (first) {
      first = false
      await route.fetch() // enregistrée côté serveur
      await route.abort('connectionreset') // réponse jamais reçue
    } else {
      await route.continue()
    }
  })
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByRole('alert')).toContainText('Connexion au serveur impossible')
  await expect(page.getByText('enregistré.')).toHaveCount(0)
  await expect(page.getByLabel('Culture')).toHaveValue('Oignon')

  await page.getByRole('button', { name: 'Réessayer l’enregistrement' }).click()
  await expect(page.getByText('Aucun changement à enregistrer.')).toBeVisible()
  await openFact(page, id, 'Culture envisagée')
  await expect(page.locator('section[aria-labelledby="historique"] li')).toHaveCount(1)
})

test('un autre compte ne peut pas ouvrir le dossier', async ({ page, browser }) => {
  await register(page, 'Fatou')
  const id = await createProject(page)

  const other = await browser.newContext()
  const intruder = await other.newPage()
  await register(intruder, 'Moussa')
  await intruder.goto(`/d/${id}`)
  await expect(intruder.getByRole('heading', { name: 'Dossier introuvable' })).toBeVisible()
  await other.close()
})
