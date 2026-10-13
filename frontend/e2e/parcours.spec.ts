import { expect, test, type Page } from '@playwright/test'
import { createProject, openFact, PASSWORD, register } from './helpers'

/** Appuie sur Tab jusqu'à atteindre l'élément dont le nom accessible correspond. */
async function tabTo(page: Page, name: RegExp, max = 40) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null
      if (!el) return ''
      const label = el.id ? document.querySelector(`label[for="${el.id}"]`)?.textContent : ''
      return `${el.getAttribute('aria-label') ?? ''} ${label ?? ''} ${el.closest('label')?.textContent ?? ''} ${el.textContent ?? ''}`
    })
    if (name.test(focused)) return
  }
  throw new Error(`Élément ${name} non atteint au clavier`)
}

test.describe('parcours au clavier', () => {
  test.skip(({ isMobile }) => isMobile, 'Le clavier physique concerne l’ordinateur')

  test('connexion, saisie d’une information et enregistrement sans souris', async ({ page }) => {
    const email = await register(page, 'Clavier')
    const id = await createProject(page)
    await page.getByRole('button', { name: 'Se déconnecter' }).click()
    await expect(page).toHaveTitle('Connexion — AGRIA')

    // Sur une page fraîchement chargée, le premier arrêt de tabulation est le lien d'évitement.
    await page.goto('/connexion')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused()
    await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeVisible()

    await tabTo(page, /Adresse email/)
    await page.keyboard.type(email)
    await page.keyboard.press('Tab')
    await page.keyboard.type(PASSWORD)
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'Les sujets du dossier' })).toBeVisible()

    await page.goto(`/d/${id}/projet/eau`)
    // On tabule une fois la page affichée, comme une personne au clavier.
    await expect(page.getByRole('heading', { level: 1, name: "Accès à l'eau" })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Historique' })).toBeVisible()
    await expect(page.getByText('Chargement', { exact: false })).toHaveCount(0)
    await tabTo(page, /Je ne sais pas/)
    await page.keyboard.press('Space')
    await expect(page.getByLabel('Je ne sais pas')).toBeChecked()
    await tabTo(page, /^\s*Enregistrer\s*$/)
    await page.keyboard.press('Enter')
    await expect(page.getByText("« Accès à l'eau » enregistré.")).toBeVisible()
    // Après la navigation, le focus est placé sur le contenu principal.
    await expect(page.locator('main#contenu')).toBeFocused()
  })
})

test('hors connexion : bandeau, échec explicite, saisie conservée, reprise au retour du réseau', async ({ page, context }) => {
  await register(page, 'Reseau')
  const id = await createProject(page)
  await openFact(page, id, 'Culture envisagée')
  await page.getByLabel('Estimé').check()
  await page.getByLabel('Culture').fill('Gombo')

  await context.setOffline(true)
  await expect(page.getByText('Vous semblez hors connexion')).toBeVisible()
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByRole('alert')).toContainText('Connexion au serveur impossible')
  await expect(page.getByText('enregistré.')).toHaveCount(0)
  await expect(page.getByLabel('Culture')).toHaveValue('Gombo')

  await context.setOffline(false)
  await expect(page.getByText('Vous semblez hors connexion')).toHaveCount(0)
  await page.getByRole('button', { name: 'Réessayer l’enregistrement' }).click()
  await expect(page.getByText('« Culture envisagée » enregistré.')).toBeVisible()
})

test('session expirée pendant la saisie : message clair, reconnexion ailleurs, reprise sans perte', async ({ page, context }) => {
  const email = await register(page, 'Session')
  const id = await createProject(page)
  await openFact(page, id, 'Débouchés envisagés')
  await page.getByLabel('Déclaré').check()
  await page.getByLabel('À qui pensez-vous vendre, où et comment ?').fill('Marché de Thiaroye, le samedi')

  // La session disparaît (expiration, déconnexion depuis un autre onglet…).
  await context.clearCookies({ name: 'sessionid' })
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByRole('alert')).toContainText('Votre session a expiré')
  await expect(page.getByLabel('À qui pensez-vous vendre, où et comment ?')).toHaveValue('Marché de Thiaroye, le samedi')

  // Reconnexion dans un autre onglet du même navigateur, puis reprise dans le premier.
  const other = await context.newPage()
  await other.goto('/connexion')
  await other.getByLabel('Adresse email').fill(email)
  await other.getByLabel('Mot de passe').fill(PASSWORD)
  await other.getByRole('button', { name: 'Se connecter' }).click()
  await expect(other.getByRole('heading', { name: 'Les sujets du dossier' })).toBeVisible()
  await other.close()

  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText('« Débouchés envisagés » enregistré.')).toBeVisible()
})

test('mot de passe erroné : message exact, champ conservé', async ({ page }) => {
  const email = await register(page, 'Erreur')
  await page.getByRole('button', { name: 'Se déconnecter' }).click()
  await page.getByLabel('Adresse email').fill(email)
  await page.getByLabel('Mot de passe').fill('pas-le-bon-mot')
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await expect(page.getByRole('alert')).toHaveText('Email ou mot de passe incorrect.')
  await expect(page.getByLabel('Adresse email')).toHaveValue(email)
})
