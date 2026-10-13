import { expect, test, type Page } from '@playwright/test'
import { createAdvisor, createProject, login, loginWith, manage, register, uniqueEmail } from './helpers'

/*
 * UX3-A : boucle du débutant sur les API réelles. Créer un projet → premières questions →
 * synthèse → démarche pertinente → résultat → actualisation explicite → reconnexion.
 */

const continueStep = (page: Page) => page.getByRole('button', { name: /^Enregistrer et (continuer|vérifier mes réponses)$/ })
const summary = (page: Page) => page.getByRole('region', { name: /Votre point de départ|Ce que vous avez indiqué/ })
const subjectRow = (page: Page, title: string) => page.getByRole('link', { name: new RegExp(`^${title}`) })

/** Toute requête de la page : aucune ne vise le prototype ni son serveur. */
function watchRequests(page: Page) {
  const urls: string[] = []
  page.on('request', (r) => urls.push(r.url()))
  return {
    urls,
    expectNoPrototype: () => expect(urls.filter((u) => /prototype|:517[67]\//.test(u))).toEqual([]),
  }
}

test('boucle complète : premières questions, synthèse, démarche, résultat incertain, actualisation, reconnexion', async ({ page }) => {
  const requests = watchRequests(page)
  const email = await register(page, 'Awa')
  const id = await createProject(page, { name: 'Oignons de Pout' })

  // Le débutant arrive sur les premières questions, pas sur un formulaire complet.
  await expect(page).toHaveURL(new RegExp(`/d/${id}/demarrer$`))
  await expect(page.getByRole('heading', { level: 1, name: 'Préparez votre première campagne' })).toBeVisible()
  await page.getByRole('button', { name: 'Commencer' }).click()
  await expect(page.getByText('Étape 1 sur 4 · Votre culture')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1, name: 'Quelques premières questions' })).toBeFocused()

  // Étape incomplète : rien n'est envoyé, la question manquante est signalée.
  await page.getByLabel('Culture').fill('Oignon')
  await continueStep(page).click()
  await expect(page.getByRole('alert')).toContainText('Répondez, ou choisissez « Je ne sais pas encore »')
  await page.getByLabel('Mois de début').fill('2027-01')
  await continueStep(page).click()
  await expect(page.getByText('Étape « Votre culture » enregistrée dans votre dossier.')).toBeVisible()

  await expect(page.getByText('Étape 2 sur 4 · Le lieu et le terrain')).toBeVisible()
  await page.getByLabel('Région').selectOption('Thiès')
  await page.getByLabel('Commune, village ou quartier (facultatif)').fill('Pout')
  await page.getByRole('radio', { name: 'En discussion' }).check()
  // Retour sans perte : l'étape 1 reprend ce qui est enregistré, la saisie de l'étape 2 reste.
  await page.getByRole('button', { name: 'Retour' }).click()
  await expect(page.getByLabel('Culture')).toHaveValue('Oignon')
  await continueStep(page).click()
  await expect(page.getByLabel('Région')).toHaveValue('Thiès')
  await continueStep(page).click()

  await expect(page.getByText('Étape 3 sur 4 · L’eau')).toBeVisible()
  await page.getByRole('radio', { name: 'Pluie seulement' }).check()
  await continueStep(page).click()

  // Interruption : une saisie non enregistrée est protégée, puis abandonnée volontairement.
  await expect(page.getByText('Étape 4 sur 4 · La vente')).toBeVisible()
  await page.getByLabel('Acheteurs envisagés').fill('Marché de Thiès')
  await page.getByRole('button', { name: 'Se déconnecter' }).click()
  await expect(page.getByRole('button', { name: 'Rester sur la page' })).toBeVisible()
  await page.getByRole('button', { name: 'Quitter sans enregistrer' }).click()
  await expect(page).toHaveURL(/\/connexion$/)

  // Reprise après reconnexion : ce qui est enregistré est conservé, la vente reste à faire.
  await login(page, email)
  await expect(page.getByRole('heading', { level: 1, name: 'Oignons de Pout' })).toBeVisible()
  await expect(summary(page)).toContainText('Culture envisagée : Oignon')
  await expect(summary(page)).toContainText('Débouchés envisagés : pas encore abordé')
  await expect(page.getByText('À faire maintenant · Renseigner le dossier')).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Terminer les premières questions (1 sans réponse)' })).toBeVisible()
  await page.getByRole('link', { name: 'Reprendre les premières questions' }).click()
  await expect(page.getByText('Étape 4 sur 4 · La vente')).toBeVisible()
  await expect(page.getByLabel('Acheteurs envisagés')).toHaveValue('')

  // « Répondre plus tard » n'enregistre rien ; le récapitulatif le dit.
  await page.getByRole('button', { name: 'Répondre plus tard' }).click()
  await expect(page.getByText(/Rien ne sera enregistré/)).toBeVisible()
  await continueStep(page).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Avant votre première synthèse' })).toBeVisible()
  const recap = page.getByRole('listitem')
  await expect(recap.filter({ hasText: 'Débouchés envisagés' })).toContainText('à répondre plus tard')
  await expect(recap.filter({ hasText: "Accès à l'eau" })).toContainText('Pluie seulement')
  await page.getByRole('button', { name: 'Voir ma première synthèse' }).click()

  // Synthèse : point de départ, une action principale, les sujets calculés par le serveur.
  await expect(page).toHaveURL(new RegExp(`/d/${id}\\?premiere=1$`))
  await expect(page.getByRole('heading', { level: 2, name: 'Votre point de départ' })).toBeVisible()
  await expect(page.getByText("Ce n'est pas un avis sur la faisabilité")).toBeVisible()
  await expect(page.getByText(/^À faire maintenant · /)).toHaveCount(1)
  await expect(subjectRow(page, 'La vente')).toContainText('Remis à plus tard')
  await expect(subjectRow(page, 'L’eau')).toContainText('Eau de pluie seulement : disponibilité à examiner localement')

  // Sujet « L'eau » : la démarche proposée ne parle pas d'un gestionnaire de source (contenu v2).
  await subjectRow(page, 'L’eau').click()
  await expect(page.getByRole('heading', { level: 1, name: 'L’eau' })).toBeVisible()
  await expect(page.getByText(/À éclaircir \(bloquant\) :/)).toBeVisible()
  await page.getByRole('link', { name: 'Faire examiner localement une campagne qui dépend de la pluie' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Faire examiner localement une campagne qui dépend de la pluie' })).toBeVisible()
  // Aucune étape n'invite à interroger un gestionnaire (l'explication dit seulement que ce n'est pas le cas).
  await expect(page.getByText(/Demander au gestionnaire|gestionnaire ou aux utilisateurs actuels/)).toHaveCount(0)
  await expect(page.getByText(/Une source qui dépend de la pluie ne se confirme pas auprès d'un gestionnaire/)).toBeVisible()

  // Résultat incertain : enregistré tel quel, l'information n'est pas modifiée.
  await page.getByRole('button', { name: 'Terminer et indiquer le résultat' }).click()
  await page.getByLabel('Résultat réel de la démarche').fill('Avis du conseiller : la pluie ne suffit pas en janvier ; un puits voisin serait à discuter.')
  await page.getByRole('radio', { name: /Incertain/ }).check()
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByText('Démarche terminée, résultat enregistré.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Et maintenant : mettre le dossier à jour' })).toBeVisible()

  // Actualisation explicite : le résultat est rappelé, rien n'est prérempli à partir de lui.
  await page.getByRole('link', { name: "Mettre à jour : Accès à l'eau" }).click()
  const result = page.getByRole('region', { name: /Résultat de la démarche/ })
  await expect(result).toContainText('résultat incertain')
  await expect(result).toContainText('un puits voisin serait à discuter')
  await expect(page.getByLabel('Déclaré')).toBeChecked()
  await expect(page.getByLabel('Source principale')).toHaveValue('pluie')
  await page.getByLabel('Source principale').selectOption('puits')
  await page.getByLabel(/^Précisions/).fill('Puits du voisin, accord à demander')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  // Recalcul du serveur affiché : un point reste ouvert, aucune validation automatique.
  await expect(page.getByText(/« Accès à l'eau » enregistré\. Point encore ouvert : /)).toBeVisible()
  await expect(page).toHaveURL(/\/plan\/\d+$/)

  // Reconnexion : tout est relu depuis le serveur.
  await page.getByRole('button', { name: 'Se déconnecter' }).click()
  await login(page, email)
  await expect(page.getByRole('heading', { level: 1, name: 'Oignons de Pout' })).toBeVisible()
  await expect(summary(page)).toContainText("Accès à l'eau : Puits · Puits du voisin, accord à demander")
  await subjectRow(page, 'L’eau').click()
  await expect(page.getByText('Terminée · résultat incertain')).toBeVisible()
  await expect(page.getByText('Puits du voisin, accord à demander')).toBeVisible()
  // Le sujet « Les moyens » reste à compléter dans sa fiche, avec retour au sujet.
  await page.getByRole('link', { name: 'Projet', exact: true }).click()
  await subjectRow(page, 'Les moyens').click()
  await page.getByRole('link', { name: 'Répondre : Temps disponible' }).click()
  await expect(page.getByRole('link', { name: '← Les moyens' })).toBeVisible()

  requests.expectNoPrototype()
  expect(requests.urls.some((u) => u.includes(`/api/dossiers/${id}/informations/eau`))).toBe(true)
})

test('« Je ne sais pas encore » est enregistré, « Répondre plus tard » ne l’est pas', async ({ page }) => {
  await register(page, 'Binta')
  const id = await createProject(page)
  await page.getByRole('button', { name: 'Commencer' }).click()
  await page.getByRole('button', { name: 'Je ne sais pas encore' }).first().click()
  await page.getByRole('button', { name: 'Répondre plus tard' }).nth(1).click()
  await expect(page.getByRole('button', { name: 'Je ne sais pas encore' }).first()).toHaveAttribute('aria-pressed', 'true')
  await continueStep(page).click()
  await expect(page.getByText('Étape 2 sur 4 · Le lieu et le terrain')).toBeVisible()
  await page.getByLabel('Région').selectOption('Kaolack')
  await page.getByRole('radio', { name: 'Terrain à moi ou à ma famille' }).check()
  await continueStep(page).click()
  await expect(page.getByText('Étape 3 sur 4 · L’eau')).toBeVisible()
  await page.getByRole('button', { name: 'Je ne sais pas encore' }).click()
  await continueStep(page).click()
  await expect(page.getByText('Étape 4 sur 4 · La vente')).toBeVisible()
  await page.getByRole('button', { name: 'Répondre plus tard' }).click()
  await continueStep(page).click()
  await page.getByRole('button', { name: 'Voir ma première synthèse' }).click()

  await expect(summary(page)).toContainText('Culture envisagée : vous ne savez pas encore')
  await expect(summary(page)).toContainText('Période envisagée : à répondre plus tard')
  await expect(summary(page)).toContainText("Accès à l'eau : vous ne savez pas encore")
  await expect(subjectRow(page, 'L’eau')).toContainText('Inconnu pour l’instant')
  await expect(subjectRow(page, 'La vente')).toContainText('Remis à plus tard')

  // Vue complète : inconnue = réponse enregistrée ; différée = non renseignée.
  await page.goto(`/d/${id}/projet`)
  const card = (label: string) => page.getByRole('listitem').filter({ has: page.getByRole('heading', { name: label, exact: true }) })
  await expect(card('Culture envisagée')).toContainText('Je ne sais pas')
  await expect(card('Période envisagée')).toContainText('Non renseigné')
  await expect(card('Débouchés envisagés')).toContainText('Non renseigné')
  await expect(card("Accès à l'eau")).toContainText('Je ne sais pas')

  // Une démarche est proposée pour l'eau inconnue.
  await page.goto(`/d/${id}/sujet/eau`)
  await expect(page.getByRole('link', { name: "Identifier une source d'eau utilisable" })).toBeVisible()
})

test('coupure réseau pendant une étape : rien n’est promis, nouvel essai sans doublon', async ({ page }) => {
  await register(page, 'Coumba')
  const id = await createProject(page)
  await page.getByRole('button', { name: 'Commencer' }).click()
  await page.getByLabel('Culture').fill('Gombo')
  await page.getByLabel('Mois de début').fill('2027-03')

  // La requête atteint le serveur mais la réponse se perd : l'étape n'est pas annoncée enregistrée.
  let lost = 0
  await page.route(`**/api/dossiers/${id}/informations/culture`, async (route) => {
    lost += 1
    await route.fetch()
    await route.abort('connectionreset')
  })
  await continueStep(page).click()
  await expect(page.getByRole('alert')).toContainText('Étape non enregistrée')
  await expect(page.getByText(/enregistrée dans votre dossier/)).toHaveCount(0)
  await expect(page.getByLabel('Culture')).toHaveValue('Gombo')
  await page.unroute(`**/api/dossiers/${id}/informations/culture`)

  // Nouvel essai : même version attendue, contenu identique, aucun conflit ni doublon.
  await page.getByRole('button', { name: 'Réessayer l’enregistrement' }).click()
  await expect(page.getByText('Étape « Votre culture » enregistrée dans votre dossier.')).toBeVisible()
  expect(lost).toBe(1)
  await page.goto(`/d/${id}/projet/culture`)
  await expect(page.getByRole('region', { name: 'Historique' }).getByRole('listitem')).toHaveCount(1)

  // Création du projet : un nouvel essai ne crée pas de second dossier.
  await page.goto('/dossiers')
  await expect(page.getByRole('link', { name: /Parcelle de test/ })).toHaveCount(1)
})

test('modification concurrente : refus explicite, saisie conservée, rechargement possible', async ({ page, context }) => {
  await register(page, 'Daba')
  const id = await createProject(page)
  await page.getByRole('button', { name: 'Commencer' }).click()
  await page.getByLabel('Culture').fill('Tomate')
  await page.getByLabel('Mois de début').fill('2027-02')
  await continueStep(page).click()
  await expect(page.getByText('Étape 2 sur 4 · Le lieu et le terrain')).toBeVisible()
  await page.getByRole('button', { name: 'Retour' }).click()
  await expect(page.getByLabel('Culture')).toHaveValue('Tomate')

  // Ailleurs (autre onglet), la culture change entre-temps.
  const other = await context.newPage()
  await other.goto(`/d/${id}/projet/culture`)
  await other.getByLabel('Culture').fill('Piment')
  await other.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(other.getByText(/« Culture envisagée » enregistré/)).toBeVisible()
  await other.close()

  await page.getByLabel('Culture').fill('Aubergine')
  await continueStep(page).click()
  await expect(page.getByRole('alert').filter({ hasText: 'Modification refusée' })).toBeVisible()
  await expect(page.getByLabel('Culture')).toHaveValue('Aubergine')
  await page.getByRole('button', { name: 'Recharger la version enregistrée' }).click()
  await expect(page.getByLabel('Culture')).toHaveValue('Piment')
})

test('accès : dossier d’un autre introuvable, conseiller en lecture par sujet, dossier archivé', async ({ page, browser }) => {
  await register(page, 'Fatou')
  const id = await createProject(page, { name: 'Projet de Fatou' })
  await page.getByRole('button', { name: 'Commencer' }).click()
  await page.getByLabel('Culture').fill('Oignon')
  await page.getByLabel('Mois de début').fill('2027-01')
  await continueStep(page).click()
  await page.getByLabel('Région').selectOption('Thiès')
  await page.getByRole('radio', { name: 'En discussion' }).check()
  await continueStep(page).click()
  await page.getByRole('radio', { name: 'Forage' }).check()
  await continueStep(page).click()

  // Une autre personne ne voit ni les questions, ni les sujets de ce dossier.
  const strangerCtx = await browser.newContext()
  const stranger = await strangerCtx.newPage()
  await register(stranger, 'Intrus')
  for (const path of ['/demarrer', '/sujet/eau', '']) {
    await stranger.goto(`/d/${id}${path}`)
    await expect(stranger.getByRole('heading', { name: 'Dossier introuvable' })).toBeVisible()
  }
  await strangerCtx.close()

  // Conseiller attribué : lecture par sujet, sans action d'écriture sur les informations.
  const advisorEmail = uniqueEmail('conseil-ux3')
  const password = createAdvisor(advisorEmail, 'Mme Ndiaye')
  manage('assign_advisor', '--dossier', String(id), '--email', advisorEmail)
  const ctx = await browser.newContext()
  const advisor = await ctx.newPage()
  await loginWith(advisor, advisorEmail, password)
  await advisor.goto(`/d/${id}`)
  await expect(advisor.getByRole('heading', { level: 1, name: 'Aujourd’hui' })).toBeVisible()
  await advisor.getByRole('link', { name: /^L’eau/ }).click()
  await expect(advisor.getByText('Déclaré par le porteur')).toBeVisible()
  await expect(advisor.getByRole('link', { name: "Confirmer la disponibilité de l'eau pendant la période envisagée" })).toBeVisible()
  await expect(advisor.getByRole('link', { name: /^(Répondre|Mettre à jour)/ })).toHaveCount(0)
  await expect(advisor.getByRole('link', { name: /Poser une question au porteur/ })).toBeVisible()
  await advisor.goto(`/d/${id}/demarrer`)
  await expect(advisor.getByText('Seul le porteur du projet répond à ces questions.')).toBeVisible()
  await expect(advisor.getByRole('button', { name: /Enregistrer/ })).toHaveCount(0)
  await ctx.close()

  // Archivé : synthèse au passé, aucune action d'écriture proposée.
  await page.goto(`/d/${id}/synthese`)
  await page.getByRole('button', { name: 'Archiver…' }).click()
  await page.getByRole('button', { name: "Confirmer l'archivage" }).click()
  await page.goto(`/d/${id}`)
  await expect(page.getByRole('heading', { level: 2, name: 'Ce qui était indiqué' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Les sujets à l’archivage' })).toBeVisible()
  await expect(page.getByText(/^À faire maintenant · /)).toHaveCount(0)
  await page.getByRole('link', { name: /^L’eau/ }).click()
  await expect(page.getByRole('link', { name: /^(Répondre|Mettre à jour)/ })).toHaveCount(0)
  await page.goto(`/d/${id}/demarrer`)
  await expect(page.getByText('Dossier archivé : consultation seulement.').first()).toBeVisible()
})
