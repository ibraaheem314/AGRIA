import { expect, test, type Page } from '@playwright/test'
import { createProject, openFact, register } from './helpers'

/** Commence une saisie non enregistrée sur « Culture envisagée ». */
async function startUnsavedCulture(page: Page, id: number) {
  await openFact(page, id, 'Culture envisagée')
  await page.getByLabel('Déclaré').check()
  await page.getByLabel('Culture').fill('Oignon')
}

async function setUnknownWater(page: Page, id: number) {
  await openFact(page, id, "Accès à l'eau")
  await page.getByLabel('Je ne sais pas').check()
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText("« Accès à l'eau » enregistré.")).toBeVisible()
}

test.describe('T-01 : saisies non enregistrées protégées', () => {
  test('navigation interne : rester conserve la saisie, quitter l’abandonne sans rien enregistrer', async ({ page }) => {
    await register(page, 'Garde')
    const id = await createProject(page)
    await startUnsavedCulture(page, id)

    await page.getByRole('link', { name: 'Mon plan' }).click()
    const dialog = page.getByRole('dialog', { name: 'Modifications non enregistrées' })
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Rester sur la page' }).click()
    await expect(dialog).toHaveCount(0)
    await expect(page.getByLabel('Culture')).toHaveValue('Oignon')

    await page.getByRole('link', { name: 'Mon plan' }).click()
    await page.getByRole('button', { name: 'Quitter sans enregistrer' }).click()
    await expect(page.getByRole('heading', { name: 'Mon plan' })).toBeVisible()
    await page.goto(`/d/${id}/projet`)
    await expect(page.getByRole('link', { name: 'Compléter : Culture envisagée' })).toBeVisible() // rien d'enregistré
  })

  test('retour du navigateur bloqué, puis enregistrement sans confirmation superflue', async ({ page }) => {
    await register(page, 'Retour')
    const id = await createProject(page)
    await page.goto(`/d/${id}/projet`)
    await startUnsavedCulture(page, id)
    await page.goBack()
    await expect(page.getByRole('dialog', { name: 'Modifications non enregistrées' })).toBeVisible()
    await page.getByRole('button', { name: 'Rester sur la page' }).click()
    await expect(page.getByLabel('Culture')).toHaveValue('Oignon')
    await page.getByRole('button', { name: 'Enregistrer' }).click()
    await expect(page.getByText('« Culture envisagée » enregistré.')).toBeVisible()
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })

  test('rechargement ou fermeture : avertissement du navigateur seulement s’il reste une saisie', async ({ page }) => {
    await register(page, 'Recharge')
    const id = await createProject(page)
    await startUnsavedCulture(page, id)
    const kinds: string[] = []
    page.on('dialog', async (d) => {
      kinds.push(d.type())
      await d.dismiss() // l'utilisateur choisit de rester
    })
    // Fermeture avec exécution réelle du gestionnaire « beforeunload » du navigateur.
    await page.close({ runBeforeUnload: true })
    await expect.poll(() => kinds).toContain('beforeunload')
    expect(page.isClosed()).toBe(false)
    await expect(page.getByLabel('Culture')).toHaveValue('Oignon')

    // Après enregistrement, plus d'avertissement.
    await page.getByRole('button', { name: 'Enregistrer' }).click()
    await expect(page.getByText('« Culture envisagée » enregistré.')).toBeVisible()
    kinds.length = 0
    await page.close({ runBeforeUnload: true })
    await expect.poll(() => page.isClosed()).toBe(true)
    expect(kinds).toEqual([])
  })

  test('budget et messages protégés ; déconnexion confirmée', async ({ page }) => {
    await register(page, 'Formulaires')
    const id = await createProject(page)
    await page.goto(`/d/${id}/projet/budget`)
    await page.getByRole('button', { name: 'Ajouter un poste' }).click()
    await page.getByRole('textbox', { name: /^Poste/ }).fill('Semences')
    await page.getByRole('link', { name: 'Aujourd’hui' }).click()
    await expect(page.getByRole('dialog', { name: 'Modifications non enregistrées' })).toBeVisible()
    await page.getByRole('button', { name: 'Rester sur la page' }).click()
    await expect(page.getByRole('textbox', { name: /^Poste/ })).toHaveValue('Semences')

    await page.getByRole('button', { name: 'Se déconnecter' }).click()
    await expect(page.getByRole('dialog', { name: 'Modifications non enregistrées' })).toBeVisible()
    await page.getByRole('button', { name: 'Rester sur la page' }).click()
    await expect(page.getByRole('button', { name: 'Se déconnecter' })).toBeVisible() // toujours connecté

    await page.getByRole('button', { name: 'Annuler' }).click() // ferme le formulaire : plus rien à protéger
    await page.goto(`/d/${id}/relecture`)
    await page.getByRole('textbox', { name: 'Message' }).fill('Question en cours de rédaction')
    await page.getByRole('link', { name: 'Mon projet' }).click()
    await expect(page.getByRole('dialog', { name: 'Modifications non enregistrées' })).toBeVisible()
  })
})

test.describe('T-02 : dossiers archivés et différés', () => {
  test('archivé : consultation sans invitation à agir, nouvelle campagne possible, accueil non rouvert', async ({ page }) => {
    await register(page, 'Archive')
    const id = await createProject(page)
    await setUnknownWater(page, id)
    await page.goto(`/d/${id}/synthese`)
    await page.getByRole('button', { name: 'Archiver…' }).click()
    await page.getByRole('button', { name: "Confirmer l'archivage" }).click()

    await page.goto(`/d/${id}`)
    await expect(page.getByRole('heading', { name: 'Dossier archivé : consultation seulement' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Ma prochaine action' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: /Compléter|Voir les étapes/ })).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Points restés ouverts à l’archivage' })).toBeVisible()

    await page.goto(`/d/${id}/projet/eau`)
    await expect(page.getByRole('link', { name: /Poser une question/ })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Enregistrer' })).toHaveCount(0)

    // L'accueil ne rouvre pas un dossier archivé ; la liste le range à part.
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Dossiers archivés (consultation)' })).toBeVisible()

    // La saison suivante se prépare depuis le projet archivé.
    await page.goto(`/d/${id}/projet`)
    await page.getByRole('button', { name: 'Nouvelle campagne' }).click()
    await page.getByLabel(/^Campagne préparée/).fill('Saison suivante')
    await page.getByRole('button', { name: 'Créer la campagne' }).click()
    await expect(page.getByText('Campagne « Saison suivante » créée.')).toBeVisible()
    await page.getByRole('link', { name: 'Aujourd’hui' }).click() // pas de blocage : aucun état ne fuit d'un dossier à l'autre
    await expect(page.getByRole('heading', { name: 'Aujourd’hui' })).toBeVisible()
  })

  test('différé : décision et motif affichés, reprise possible', async ({ page }) => {
    await register(page, 'Differe')
    const id = await createProject(page)
    await setUnknownWater(page, id)
    await page.goto(`/d/${id}/relecture`)
    await page.getByRole('radio', { name: 'Différer' }).check()
    await page.getByRole('textbox', { name: /^Motifs/ }).fill('Eau non garantie en saison sèche.')
    await page.getByRole('button', { name: 'Enregistrer la décision' }).click()
    await expect(page.getByText('Décision enregistrée.')).toBeVisible()
    await page.goto(`/d/${id}`)
    await expect(page.getByRole('heading', { name: 'Projet différé' })).toBeVisible()
    await expect(page.getByText('Eau non garantie en saison sèche.')).toBeVisible()
    // La décision est rappelée avant la reprise ; une seule action principale.
    await expect(page.getByRole('heading', { name: 'Reprendre la préparation' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Enregistrer une nouvelle décision' })).toBeVisible()
  })
})

test.describe('T-03 : accompagnement selon le profil, même moteur', () => {
  test('débutant : guide et justifications visibles ; producteur : vue directe', async ({ page, browser }) => {
    await register(page, 'Initie')
    const id = await createProject(page)
    await setUnknownWater(page, id)
    await page.goto(`/d/${id}`)
    await expect(page.getByRole('heading', { name: 'Comment avancer' })).toBeVisible()
    await expect(page.getByText(/Sans eau identifiée.*Elle peut avancer en parallèle de la saisie\./)).toBeVisible()

    const ctx = await browser.newContext()
    const prod = await ctx.newPage()
    await register(prod, 'Direct')
    const pid = await createProject(prod, { situation: 'Je prépare ma prochaine campagne' })
    await setUnknownWater(prod, pid)
    await prod.goto(`/d/${pid}`)
    await expect(prod.getByRole('heading', { name: 'Comment avancer' })).toHaveCount(0)
    // Vue directe : l'information bloquante d'abord, la démarche reste accessible, sans justification.
    await expect(prod.getByRole('link', { name: 'Compléter cette information' })).toBeVisible()
    await expect(prod.getByRole('link', { name: "Identifier une source d'eau utilisable" })).toBeVisible()
    await expect(prod.getByText(/Sans eau identifiée/)).toHaveCount(0)
    await prod.goto(`/d/${pid}/plan`)
    // Même point à vérifier, justification repliée.
    await expect(prod.getByRole('heading', { name: "Source d'eau inconnue" })).toBeVisible()
    await expect(prod.getByText('Pourquoi ?', { exact: true })).toBeVisible()
    const why = prod.locator('details', { hasText: "La disponibilité de l'eau pendant toute la période" })
    await expect(why).toBeVisible()
    await expect(why).not.toHaveAttribute('open')
    await ctx.close()
  })
})
