import { expect, test, type Page } from '@playwright/test'

/*
 * Démonstration du suivi de campagne (route /suivi) : trois situations reliées dans une même
 * campagne fictive. Vérifie aussi qu'aucune requête ne sort du serveur de test local et que
 * l'état du prototype UX1/UX2 n'est pas touché.
 */

async function noOverflow(page: Page, name: string) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow, `Défilement horizontal : ${name}`).toBeLessThanOrEqual(0)
  const dir = process.env.PROTOTYPE_CAPTURES
  if (dir) await page.screenshot({ path: `${dir}/${test.info().project.name}-suivi-${name}.png`, fullPage: true })
}
const nav = (page: Page, name: string) => page.getByRole('navigation', { name: 'Navigation de la démonstration' }).getByRole('link', { name, exact: true })
const answer = (page: Page) => page.getByRole('region', { name: "Réponse de l'assistant" })

function watchRequests(page: Page) {
  const external: string[] = []
  page.on('request', (r) => {
    const url = new URL(r.url())
    if (url.hostname !== '127.0.0.1' && url.protocol !== 'data:') external.push(r.url())
  })
  return external
}

test('situations A, B et C reliées : observation, confirmation, suivi, bilan', async ({ page }) => {
  test.setTimeout(120_000)
  const external = watchRequests(page)
  await page.goto('/suivi')
  await expect(page.getByText('Démonstration fictive — réponses scénarisées')).toBeVisible()

  // A. Une aide compréhensible tout de suite : quoi vérifier, et pourquoi.
  await expect(page.getByRole('heading', { level: 1, name: 'Où en est ma culture ?' })).toBeVisible()
  const now = page.getByRole('region', { name: 'À vérifier maintenant' })
  await expect(now.getByRole('heading', { name: 'Observer les feuilles et les plants' })).toBeVisible()
  await expect(page.getByText('Aucun arrosage déclaré depuis le 8 octobre')).toBeVisible()
  await expect(page.getByText(/Ce n'est pas la preuve qu'il n'a pas eu lieu/)).toBeVisible()
  // Opération retardée et prévu distinct du réalisé.
  await expect(page.getByText(/réalisé le 15 septembre \(5 jours après la fenêtre\)/)).toBeVisible()
  await expect(page.getByText('« Pas encore déclaré » ne veut pas dire « pas fait ».', { exact: false })).toBeVisible()
  await noOverflow(page, 'a-campagne')

  // B. Problème sur les feuilles : photo d'exemple, questions utiles, mémoire du journal.
  await page.getByRole('link', { name: "J'observe un problème sur les feuilles" }).click()
  await page.getByRole('button', { name: "Utiliser l'image d'exemple" }).click()
  await expect(page.getByText(/Aucune analyse automatique/)).toBeVisible()
  await page.getByRole('button', { name: 'Continuer' }).click()
  await expect(page.getByRole('heading', { name: 'Ce que vous voyez' })).toBeFocused()
  await page.getByRole('button', { name: 'Continuer' }).click()
  await expect(page.getByRole('alert')).toContainText('Répondez aux quatre questions')
  await page.getByRole('radio', { name: 'Des taches' }).check()
  await page.getByRole('radio', { name: 'Les plus anciennes' }).check()
  await page.getByRole('radio', { name: 'Quelques plants' }).check()
  await page.getByRole('radio', { name: 'Je ne sais pas' }).last().check()
  await page.getByRole('button', { name: 'Continuer' }).click()
  await expect(page.getByText('Dernier arrosage noté le 8 octobre')).toBeVisible()
  await page.getByRole('radio', { name: 'Oui, comme d’habitude' }).check()
  await page.getByRole('button', { name: "Voir ce que l'assistant en dit" }).click()
  await expect(answer(page)).toContainText('Ce que je ne peux pas dire')
  await expect(answer(page)).toContainText('je ne propose ni cause, ni traitement')
  await expect(page.getByText("Rien n'est encore dans votre journal")).toBeVisible()
  await noOverflow(page, 'b-reponse')

  // Une proposition n'entre pas au journal sans confirmation : vérification en ouvrant le journal.
  const journal = await page.context().newPage()
  await journal.goto('/suivi/journal')
  await expect(journal.getByText('Problème sur les feuilles')).toHaveCount(0)
  await journal.close()

  await page.getByRole('button', { name: "Confirmer et enregistrer l'observation" }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Observation enregistrée. Avez-vous fait quelque chose ?' })).toBeVisible()

  // C. Action réalisée, vérifiée puis confirmée ; date future refusée.
  await page.getByRole('radio', { name: 'Retrait de feuilles ou de plants' }).check()
  await page.getByLabel('Date').fill('2026-10-20')
  await page.getByRole('button', { name: "Vérifier avant d'enregistrer" }).click()
  await expect(page.getByRole('alert')).toContainText('on ne déclare que ce qui est fait')
  await page.getByLabel('Date').fill('2026-10-13')
  await page.getByLabel(/^Ce que vous avez fait ou utilisé/).fill('Feuilles tachées retirées sur cinq plants')
  await page.getByRole('button', { name: "Vérifier avant d'enregistrer" }).click()
  await expect(page.getByText('Lié au problème observé le 13 octobre')).toBeVisible()
  await page.getByRole('button', { name: "Confirmer : je l'ai fait" }).click()
  await expect(answer(page)).toContainText("Une amélioration après une action ne prouve pas que l'action en est la cause")

  // Suivi du résultat : évolution déclarée, cas laissé ouvert.
  await page.getByRole('link', { name: "Faire l'observation de suivi" }).click()
  await page.getByRole('radio', { name: 'C’est stable' }).check()
  await page.getByRole('radio', { name: 'Non, continuer à suivre' }).check()
  await page.getByRole('button', { name: "Enregistrer l'observation de suivi" }).click()
  await expect(answer(page)).toContainText('Le cas reste ouvert')

  // Le cas ouvert devient la première chose à vérifier.
  await nav(page, 'Ma campagne').click()
  await expect(page.getByRole('region', { name: 'À vérifier maintenant' }).getByRole('heading')).toHaveText('Revoir le problème observé le 13 octobre')

  // Journal : tout ce qui a été confirmé, rien d'autre.
  await nav(page, 'Journal').click()
  await expect(page.getByText('13 octobre · Retrait de feuilles ou de plants')).toBeVisible()
  await expect(page.getByText('Tel que déclaré : Feuilles tachées retirées sur cinq plants')).toBeVisible()
  await expect(page.getByText(/Photo jointe \(image d'exemple/)).toBeVisible()

  // Bilan : faits déclarés, sans causalité.
  await nav(page, 'Bilan').click()
  await expect(page.getByText(/Évolution déclarée : évolution : c’est stable/i)).toBeVisible()
  await expect(page.getByText(/Il ne dit pas si une action a causé une évolution/)).toBeVisible()
  await expect(page.getByText(/Pas encore déclarée/)).toBeVisible()
  await noOverflow(page, 'bilan')

  expect(external, 'aucune requête hors du serveur local').toEqual([])
  // L'état du prototype UX1/UX2 n'est pas créé par la démonstration.
  expect(await page.evaluate(() => localStorage.getItem('agria.prototype.ux1'))).toBeNull()
})

test('contradiction clarifiée par la personne, plan recalé, opérations conservées', async ({ page }) => {
  await page.goto('/suivi/observer')
  await page.getByRole('radio', { name: 'Prêt à récolter' }).check()
  await page.getByRole('button', { name: "Enregistrer l'observation" }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Votre observation ne correspond pas à la date de repiquage' })).toBeVisible()
  await expect(answer(page)).toContainText('je ne choisis pas à votre place')

  // « Je ne sais pas » : noté à clarifier ; rien n'est tranché.
  await page.getByRole('radio', { name: /Je ne sais pas ; je vérifierai/ }).check()
  await page.getByRole('button', { name: 'Confirmer' }).click()
  const now = page.getByRole('region', { name: 'À vérifier maintenant' })
  await expect(now.getByRole('heading')).toHaveText('Clarifier une observation qui ne correspond pas à la date de repiquage')

  // Correction de la date : le prévu est recalé, l'historique garde l'ancienne date.
  await now.getByRole('link', { name: 'Clarifier' }).click()
  await page.getByRole('radio', { name: /Mon observation ; la date de repiquage est fausse/ }).check()
  await page.getByLabel('Date réelle du repiquage').fill('2026-07-01')
  await page.getByRole('button', { name: 'Confirmer' }).click()
  await expect(page.getByRole('alert')).toContainText('Indiquez une date entre le 1 août et aujourd')
  await page.getByLabel('Date réelle du repiquage').fill('2026-09-01')
  await page.getByRole('button', { name: 'Confirmer' }).click()
  await expect(page.getByRole('region', { name: 'À vérifier maintenant' }).getByText(/Clarifier une observation/)).toHaveCount(0)
  await expect(page.getByRole('region', { name: 'Contexte de la campagne' })).toContainText('1 septembre')

  await page.getByRole('link', { name: 'Journal', exact: true }).click()
  await expect(page.getByText('Repiquage : 15 septembre → 1 septembre, corrigé le 13 octobre (correction après une observation)')).toBeVisible()
  await expect(page.getByText('30 septembre · Désherbage')).toBeVisible()
})

test('assistant scénarisé : situations prises en charge, dose refusée, hors scénario explicite', async ({ page }) => {
  const external = watchRequests(page)
  await page.goto('/suivi/demander')
  await page.getByRole('button', { name: 'Combien d’engrais dois-je mettre ?' }).click()
  await expect(answer(page)).toContainText('Je ne donne ni dose, ni volume, ni produit')
  await page.getByLabel('Votre question').fill('Quel temps fera-t-il demain à Dakar ?')
  await page.getByRole('button', { name: 'Demander', exact: true }).click()
  await expect(answer(page)).toContainText('Cette question sort des trois situations')
  await page.getByLabel('Votre question').fill('Où en est ma culture ?')
  await page.getByRole('button', { name: 'Demander', exact: true }).click()
  await expect(answer(page)).toContainText("D'après votre journal, le repiquage date du 15 septembre")
  await expect(answer(page)).toContainText('Aucun arrosage n')
  await noOverflow(page, 'assistant')
  expect(external).toEqual([])

  // Le prototype UX1/UX2 reste intact et accessible à côté.
  await page.goto('/')
  await expect(page).toHaveURL(/\/demarrer$/)
})
