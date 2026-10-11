import { expect, test, type Page } from '@playwright/test'
import { createProject, register } from './helpers'

async function fillLine(page: Page, { label, quantity, unit, price, status, source }: {
  label: string; quantity: string; unit: string; price?: string; status: 'Prix connu' | 'Prix estimé' | 'Prix manquant'; source?: string
}) {
  await page.getByRole('button', { name: 'Ajouter un poste' }).click()
  await page.getByRole('radio', { name: 'Dépense de la campagne' }).check()
  await page.getByRole('textbox', { name: /^Poste/ }).fill(label)
  await page.getByLabel('Quantité').fill(quantity)
  await page.getByLabel('Unité').selectOption({ label: unit })
  await page.getByRole('radio', { name: status }).check()
  if (price !== undefined) await page.getByLabel(/^Prix unitaire/).fill(price)
  if (source !== undefined) await page.getByLabel(/Source du prix|Sur quoi repose/).fill(source)
}

test('budget incomplet, validation, reprise réseau sans doublon et retrait historisé', async ({ page }) => {
  await register(page, 'Ibrahima')
  const id = await createProject(page)
  await page.goto(`/d/${id}/projet/budget`)
  await expect(page.getByText('Aucun poste chiffré pour l’instant.').first()).toBeVisible()

  // Prix connu sans date : refusé, saisie conservée.
  await fillLine(page, { label: 'Semences', quantity: '2,5', unit: 'kg', price: '15 000', status: 'Prix connu', source: 'Devis boutique' })
  await page.getByRole('button', { name: 'Enregistrer le poste' }).click()
  await expect(page.getByRole('alert')).toContainText('Non enregistré')
  await expect(page.getByText('Indiquez la date du prix')).toBeVisible()
  await expect(page.getByRole('textbox', { name: /^Poste/ })).toHaveValue('Semences')
  await page.getByLabel('Date du prix').fill('2026-10-01')
  await page.getByRole('button', { name: 'Enregistrer le poste' }).click()
  await expect(page.getByText('« Semences » ajouté au budget.')).toBeVisible()
  await expect(page.getByText(/= 37\s500\sFCFA/)).toBeVisible()

  // Poste sans prix, envoyé pendant une coupure (réponse perdue) puis renvoyé.
  await fillLine(page, { label: "Main-d'œuvre repiquage", quantity: '10', unit: 'jour', status: 'Prix manquant' })
  let first = true
  await page.route(`**/api/dossiers/${id}/budget`, async (route) => {
    if (route.request().method() === 'POST' && first) {
      first = false
      await route.fetch()
      await route.abort('connectionreset')
    } else {
      await route.continue()
    }
  })
  await page.getByRole('button', { name: 'Enregistrer le poste' }).click()
  await expect(page.getByRole('alert')).toContainText('Connexion au serveur impossible')
  await page.getByRole('button', { name: 'Réessayer' }).click()
  await expect(page.getByText("« Main-d'œuvre repiquage » ajouté au budget.")).toBeVisible()
  await expect(page.getByRole('heading', { name: "Main-d'œuvre repiquage" })).toHaveCount(1)

  // Le budget est annoncé incomplet ; le total n'est que celui des postes chiffrés.
  await expect(page.getByText(/^Budget incomplet : 1 poste\(s\) sans montant\. Les postes chiffrés totalisent 37\s500\sFCFA — ce n’est pas le coût total\.$/).first()).toBeVisible()

  // Retrait : le poste disparaît des totaux mais reste dans l'historique.
  await page.getByRole('button', { name: 'Retirer : Semences' }).click()
  await page.getByRole('button', { name: 'Confirmer le retrait' }).click()
  await expect(page.getByText('« Semences » retiré du budget')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Semences' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Voir l’historique du budget' }).click()
  await expect(page.getByText('Retrait : Semences')).toBeVisible()
  await expect(page.getByText('Ajout : Semences')).toBeVisible()
})
