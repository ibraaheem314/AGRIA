import { expect, test, type Page } from '@playwright/test'

/** Captures facultatives pour l'inspection visuelle : PROTOTYPE_CAPTURES=<dossier>. */
async function shot(page: Page, name: string) {
  const dir = process.env.PROTOTYPE_CAPTURES
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow, `Défilement horizontal : ${name}`).toBeLessThanOrEqual(0)
  if (!dir) return
  const p = test.info().project.name
  await page.screenshot({ path: `${dir}/${p}-${name}-ecran.png` })
  await page.screenshot({ path: `${dir}/${p}-${name}-page.png`, fullPage: true })
}

const ROLE = { awa: 'Awa — débutante', modou: 'Modou — producteur', ndiaye: 'Mme Ndiaye — conseillère' }
async function asRole(page: Page, role: keyof typeof ROLE) {
  await page.getByLabel('Voir comme').selectOption({ label: ROLE[role] })
}

async function demoTool(page: Page, name: string | RegExp) {
  await page.getByText('Outils de démonstration').click()
  await page.getByRole('button', { name }).click()
  await page.getByText('Outils de démonstration').click()
}

const nav = (page: Page, name: string) =>
  page.getByRole('navigation', { name: /Navigation principale/ }).filter({ visible: true })
    .getByRole('link', { name: new RegExp('^' + name + '( [0-9]+ en attente de votre réponse)?$') })

test('débutant, conseillère, retour au débutant : la boucle complète', async ({ page }) => {
  test.setTimeout(180_000)
  await page.goto('/')
  await expect(page.getByText(/Prototype UX1/)).toBeVisible()
  await expect(page).toHaveURL(/\/demarrer$/)
  await shot(page, '01-debutant-accueil')
  await page.getByRole('button', { name: 'Décrire mon projet' }).click()

  // Étape 1 : l'idée. « Je ne sais pas encore » pour la période.
  await page.getByLabel('En une phrase, que voulez-vous faire ?').fill('Cultiver des oignons près de chez moi pour les vendre au marché.')
  await page.getByLabel('Culture').fill('Oignon')
  await page.getByLabel('Région').selectOption('Thiès')
  await page.getByRole('radiogroup', { name: /Quand voudriez-vous commencer/ }).getByText('Je ne sais pas encore').click()
  await shot(page, '02-debutant-idee')
  await page.getByRole('button', { name: 'Continuer' }).click()

  // Étape 2 : trois points décisifs. Une réponse manquante est signalée, pas inventée.
  await page.getByRole('button', { name: 'Voir ma première synthèse' }).click()
  await expect(page.getByText(/Indiquez une réponse, ou choisissez/).first()).toBeVisible()
  await page.getByLabel('En discussion').check()
  await page.getByRole('radiogroup', { name: /D'où viendrait l'eau/ }).getByText('Je ne sais pas encore').click()
  await page.getByRole('radiogroup', { name: /À qui pensez-vous vendre/ }).getByText('Plus tard').click()
  await shot(page, '03-debutant-trois-points')
  await page.getByRole('button', { name: 'Voir ma première synthèse' }).click()

  // Première synthèse : connu, à éclaircir, démarches ; pas de diagnostic de faisabilité.
  const depart = page.getByRole('region', { name: 'Votre point de départ' })
  await expect(depart).toContainText('Ce n\'est pas un avis sur la faisabilité')
  await expect(depart).toContainText('Culture envisagée : Oignon')
  await expect(depart).toContainText("Source d'eau inconnue")
  await expect(depart).toContainText('Accès au terrain encore en discussion')
  await expect(depart).toContainText(/Pas encore abordé : .*Débouchés envisagés/)
  await expect(depart.getByRole('link', { name: "Identifier une source d'eau utilisable" })).toBeVisible()
  await expect(page.getByRole('region', { name: 'À faire maintenant' })).toHaveCount(1)
  await shot(page, '04-debutant-premiere-synthese')

  // Un sujet réunit informations, point ouvert, démarches et questions.
  await page.getByRole('link', { name: /^L'eau/ }).click()
  await expect(page.getByRole('heading', { level: 1, name: "L'eau" })).toBeVisible()
  await expect(page.getByText("Source d'eau inconnue").first()).toBeVisible()
  await shot(page, '05-debutant-sujet-eau')

  // Démarche : comprendre, réaliser, noter un résultat incertain.
  await nav(page, 'Projet').click()
  await page.getByRole('region', { name: 'À faire maintenant' }).getByRole('link').click()
  await expect(page.getByRole('heading', { level: 1, name: "Confirmer l'accès au terrain pour toute la campagne" })).toBeVisible()
  await expect(page.getByText(/non relues par un spécialiste/)).toBeVisible()
  await page.getByRole('button', { name: 'Commencer' }).click()
  await expect(page.getByText('En cours', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Noter le résultat' }).click()
  await page.getByRole('button', { name: 'Enregistrer le résultat' }).click()
  await expect(page.getByRole('alert')).toContainText('Décrivez le résultat réel')
  await page.getByLabel("Qu'avez-vous fait, appris ou obtenu ?").fill('Le propriétaire est d’accord sur le principe ; rien d’écrit.')
  await page.getByLabel(/^Incertain/).check()
  await page.getByRole('button', { name: 'Enregistrer le résultat' }).click()
  await expect(page.getByRole('heading', { name: 'Et maintenant : mettre le dossier à jour' })).toBeVisible()
  await shot(page, '06-debutant-resultat-incertain')

  // Actualisation explicite, résultat rappelé, recalcul expliqué.
  await page.getByRole('link', { name: 'Mettre à jour : Accès au terrain' }).click()
  await expect(page.getByRole('region', { name: 'Résultat de la démarche' })).toContainText('incertain')
  await page.getByLabel(/^Précisions/).fill('Accord oral, à confirmer par écrit')
  await page.getByLabel(/^Je l’affirme/).check()
  await shot(page, '07-debutant-mise-a-jour')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByRole('status')).toContainText('Point encore à éclaircir : Accès au terrain encore en discussion')

  // Reprise après interruption : l'état est conservé dans ce navigateur.
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: "Confirmer l'accès au terrain pour toute la campagne" })).toBeVisible()
  await expect(page.getByText('Terminée', { exact: true })).toBeVisible()

  // Budget partiel : un poste à examiner sans prix, un poste estimé ; l'inconnu ne vaut pas zéro.
  await nav(page, 'Budget').click()
  await page.getByRole('button', { name: 'Ajouter : Semences ou plants' }).click()
  await page.getByRole('link', { name: 'Ajouter un poste' }).click()
  await page.getByLabel(/^Poste/).fill('Location du terrain')
  await page.getByLabel(/^Quantité/).fill('1')
  await page.getByLabel('Unité').selectOption('forfait')
  await page.getByLabel(/^Prix estimé/).check()
  await page.getByLabel(/^Prix unitaire/).fill('25000')
  await page.getByLabel(/^D'où vient ce prix/).fill('Estimation personnelle (exemple fictif)')
  await page.getByRole('button', { name: 'Enregistrer le poste' }).click()
  await expect(page.getByRole('status')).toContainText('« Location du terrain » enregistré')
  const resume = page.getByRole('region', { name: 'Où en est le budget' })
  await expect(resume).toContainText('25')
  await expect(resume).toContainText('1 poste')
  await expect(resume).toContainText("le coût total n'est pas connu")
  await shot(page, '08-debutant-budget-partiel')

  // Sans conseiller : ce qui reste possible, aucune promesse.
  await nav(page, 'Conseiller').click()
  await expect(page.getByText("Aucun conseiller n'est attribué à ce dossier")).toBeVisible()
  await expect(page.getByText(/Aucune disponibilité, aucun délai ni aucune réponse ne peut être promis/)).toBeVisible()
  await page.getByRole('textbox', { name: 'Message' }).fill('Faut-il un accord écrit pour le terrain ?')
  await page.getByRole('button', { name: 'Envoyer', exact: true }).click()
  await expect(page.getByText(/Il sera visible par un conseiller s’il en est attribué un/)).toBeVisible()
  await page.getByRole('button', { name: 'Demander une relecture' }).click()
  await expect(page.getByText(/Relecture demandée le .* aucun avis reçu depuis/)).toBeVisible()
  await shot(page, '09-debutant-sans-conseiller')

  // Attribution (geste de l'équipe AGRIA, simulé), puis rôle conseillère.
  await demoTool(page, 'Attribuer Mme Ndiaye au dossier d\'Awa')
  await asRole(page, 'ndiaye')
  await expect(page).toHaveURL(/\/dossiers$/)
  const todo = page.getByRole('region', { name: /À traiter/ })
  await expect(todo).toContainText('Awa (fictive)')
  await expect(todo).toContainText('Question du porteur en attente de votre réponse')
  await expect(todo).toContainText('Relecture demandée')
  await shot(page, '10-conseillere-file')
  await todo.getByRole('link', { name: /Awa \(fictive\)/ }).click()
  await expect(page.getByRole('heading', { name: 'Votre intervention' })).toBeVisible()
  await expect(page.getByText('Accès au terrain encore en discussion').first()).toBeVisible()
  await expect(page.getByRole('link', { name: /^(Répondre|Modifier) :/ })).toHaveCount(0)
  await shot(page, '11-conseillere-dossier')

  // Réponse, question ciblée sur l'eau, avis avec réserves.
  await page.getByRole('complementary', { name: 'Votre intervention' }).getByRole('link', { name: 'Répondre' }).click()
  await page.getByLabel('Répondre').first().fill('Oui, un écrit simple daté et signé protège les deux parties.')
  await page.getByRole('button', { name: 'Envoyer la réponse' }).first().click()
  await expect(page.getByText('Vous avez répondu, question ouverte')).toBeVisible()
  await page.getByRole('link', { name: 'Vue d’ensemble' }).filter({ visible: true }).first().click()
  await page.getByRole('link', { name: /Consulter le sujet « L'eau »/ }).click()
  await page.getByRole('link', { name: /Poser une question au porteur/ }).click()
  await expect(page.getByText(/À propos de :/)).toContainText("Accès à l'eau")
  await page.getByRole('textbox', { name: 'Message' }).fill('Avez-vous demandé au voisin qui a un puits ?')
  await page.getByRole('button', { name: 'Envoyer', exact: true }).click()
  await expect(page.getByText('Message envoyé.')).toBeVisible()
  await page.getByRole('link', { name: 'Rédiger un avis' }).click()
  await page.getByLabel(/^Projet/).check()
  await page.getByLabel(/^Revu avec réserves/).check()
  await page.getByLabel(/^Avis/).fill('Le projet est clair ; l’eau et le terrain restent à confirmer.')
  await page.getByLabel(/^Réserves/).fill('Ne rien acheter avant un accord écrit sur le terrain.')
  await shot(page, '12-conseillere-avis')
  await page.getByRole('button', { name: "Enregistrer l'avis" }).click()
  await expect(page.getByRole('status')).toContainText('Avis enregistré')

  // Retour du débutant : réponse attendue en premier, puis modification, avis à réexaminer, décision.
  await asRole(page, 'awa')
  const highlight = page.getByRole('region', { name: 'À faire maintenant' })
  await expect(highlight).toContainText('Votre conseillère attend une réponse')
  await shot(page, '13-debutant-reponse-attendue')
  await highlight.getByRole('link', { name: 'Répondre' }).click()
  await page.getByLabel('Répondre').first().fill('Pas encore, je lui demande cette semaine.')
  await page.getByRole('button', { name: 'Envoyer la réponse' }).first().click()
  await nav(page, 'Projet').click()
  await page.getByRole('link', { name: /^L'eau/ }).click()
  await page.getByRole('link', { name: "Modifier : Accès à l'eau" }).click()
  await page.getByRole('radiogroup', { name: 'Votre réponse' }).getByText('Je réponds').click()
  await page.getByLabel(/^Source principale/).selectOption('puits')
  await page.getByLabel(/^Je l’affirme/).check()
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByRole('status')).toContainText("Point encore à éclaircir : Disponibilité de l'eau déclarée mais non vérifiée")
  await nav(page, 'Conseiller').click()
  await expect(page.getByText('À réexaminer')).toBeVisible()
  await page.getByLabel(/^Modifier le projet/).check()
  await page.getByLabel(/^Pourquoi/).fill('Confirmer l’eau et le terrain avant d’acheter quoi que ce soit.')
  await page.getByRole('button', { name: 'Enregistrer la décision' }).click()
  await expect(page.getByText('Décision enregistrée.')).toBeVisible()
  await shot(page, '14-debutant-conseiller-decision')
  await nav(page, 'Projet').click()
  await expect(page.getByText('Votre dernière décision')).toBeVisible()
  await shot(page, '15-debutant-synthese-apres')

  // La conseillère retrouve l'avis à réexaminer.
  await asRole(page, 'ndiaye')
  await expect(page.getByRole('region', { name: /À traiter/ })).toContainText('Avis à réexaminer')
})

test('producteur : préparer la campagne suivante depuis la précédente', async ({ page }) => {
  test.setTimeout(120_000)
  await page.goto('/')
  await asRole(page, 'modou')
  await expect(page).toHaveURL(/\/campagnes$/)
  await shot(page, '20-producteur-campagnes')
  await page.getByRole('button', { name: 'Créer et voir ce qui est repris' }).click()
  await expect(page.getByRole('heading', { level: 1, name: /Reprise de « Contre-saison 2026 »/ })).toBeVisible()
  await expect(page.getByText('À reconfirmer', { exact: true })).toHaveCount(3)
  await expect(page.getByText(/où l'information était « confirmé, source indiquée »/).first()).toBeVisible()
  await expect(page.getByText(/pas des prévisions/)).toBeVisible()
  await shot(page, '21-producteur-reprise')
  await page.getByRole('button', { name: 'Toujours vrai cette saison : Localisation du terrain' }).click()
  await page.getByRole('button', { name: 'Toujours vrai cette saison : Accès au terrain' }).click()
  await expect(page.getByText('À reconfirmer', { exact: true })).toHaveCount(1)
  await page.getByLabel(/Qu'allez-vous faire différemment/).fill('Récolter plus tôt et stocker à l’ombre.')
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).click()
  await expect(page.getByText('Récolter plus tôt et stocker à l’ombre.')).toBeVisible()
  await page.getByRole('link', { name: "A changé : modifier Accès à l'eau" }).click()
  await expect(page.getByText(/Repris de la campagne précédente/)).toBeVisible()
  await page.getByLabel(/^Précisions/).fill('Tours d’eau réduits cette saison')
  await page.getByLabel(/^Je l’affirme/).check()
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await expect(page.getByRole('status')).toContainText('Disponibilité de l\'eau déclarée mais non vérifiée')

  // Vue directe : pas de parcours d'initiation, démarches et budget accessibles.
  await nav(page, 'Projet').click()
  await expect(page.getByRole('region', { name: 'Votre point de départ' })).toHaveCount(0)
  await expect(page.getByRole('region', { name: 'À faire maintenant' })).toBeVisible()
  await shot(page, '22-producteur-projet')
  await nav(page, 'Budget').click()
  await expect(page.getByText('Aucun poste.').first()).toBeVisible()
  await nav(page, 'Conseiller').click()
  await expect(page.getByText("Aucun conseiller n'est attribué à ce dossier")).toBeVisible()

  // Campagne précédente : consultation, résultats présentés comme historique.
  await nav(page, 'Campagnes').click()
  await page.getByRole('link', { name: /Oignon — parcelle familiale — Contre-saison 2026/ }).click()
  await expect(page.getByText(/Campagne archivée : consultation seulement/)).toBeVisible()
  await expect(page.getByRole('region', { name: 'À faire maintenant' })).toHaveCount(0)
  await shot(page, '23-producteur-archive')
})

test('chargement, erreur, saisie abandonnée et réinitialisation', async ({ page }) => {
  await page.goto('/')
  await asRole(page, 'ndiaye')
  await page.getByRole('link', { name: /Coumba/ }).click()
  await page.getByText('Outils de démonstration').click()
  await page.getByLabel('Chargement (simulé)').check()
  await expect(page.getByRole('status', { name: 'Chargement (simulé)' })).toBeVisible()
  await page.getByLabel('Erreur de connexion (simulée)').check()
  await page.getByText('Outils de démonstration').click()
  await expect(page.getByRole('heading', { name: 'Dossier indisponible' })).toBeVisible()
  await shot(page, '30-erreur-simulee')
  await page.getByRole('button', { name: 'Réessayer' }).click()
  await expect(page.getByRole('heading', { name: 'Votre intervention' })).toBeVisible()

  // Saisie abandonnée : confirmation avant de quitter.
  await nav(page, 'Échanges et avis').click()
  await page.getByRole('link', { name: 'Rédiger un avis' }).click()
  await page.getByLabel(/^Avis/).fill('Brouillon')
  await nav(page, 'Dossiers').click()
  await expect(page.getByRole('button', { name: 'Rester sur la page' })).toBeVisible()
  await page.getByRole('button', { name: 'Rester sur la page' }).click()
  await expect(page.getByLabel(/^Avis/)).toHaveValue('Brouillon')

  // Réinitialisation : retour au jeu fictif.
  await page.getByLabel(/^Avis/).fill('')
  await page.getByText('Outils de démonstration').click()
  await page.getByRole('button', { name: 'Réinitialiser la démonstration' }).click()
  await page.getByRole('button', { name: 'Confirmer : tout effacer' }).click()
  await expect(page).toHaveURL(/\/dossiers$/)
})

test('clavier : lien d’évitement, choix de réponse et focus visible', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Le clavier physique concerne l’ordinateur')
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused()
  await page.getByRole('button', { name: 'Décrire mon projet' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { level: 1, name: 'Votre idée de projet' })).toBeVisible()

  // Choix « Je réponds / Je ne sais pas encore / Plus tard » : flèches du clavier, focus visible.
  const group = page.getByRole('radiogroup', { name: /Que voulez-vous cultiver/ })
  await group.getByRole('radio', { name: 'Je réponds' }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(group.getByRole('radio', { name: 'Je ne sais pas encore' })).toBeChecked()
  await expect(page.getByText(/Enregistré comme « Je ne sais pas encore »/).first()).toBeVisible()
  const outline = await group.locator('label', { hasText: 'Je ne sais pas encore' }).evaluate((el) => getComputedStyle(el).outlineStyle)
  expect(outline).not.toBe('none')
})
