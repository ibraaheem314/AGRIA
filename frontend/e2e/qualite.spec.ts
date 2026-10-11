import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { createProject, register } from './helpers'

/** Prépare un dossier réaliste par l'API (cookies du navigateur), pour contrôler tous les écrans remplis. */
async function seedDossier(page: Page, id: number) {
  const csrf = async () => (await page.context().cookies()).find((c) => c.name === 'csrftoken')?.value ?? ''
  const call = async (method: 'PUT' | 'POST', path: string, data: unknown) => {
    const response = await page.request.fetch(`/api/dossiers/${id}${path}`, {
      method,
      data,
      headers: { 'X-CSRFToken': await csrf() },
    })
    expect(response.ok(), `${method} ${path} → ${response.status()}`).toBeTruthy()
    return response.json()
  }
  await call('PUT', '/informations/eau', { status: 'inconnu', value: null, source: 'Demander au chef de village', expected_version: 0 })
  await call('PUT', '/informations/localisation', { status: 'declare', value: { region: 'Thiès', lieu: 'Pout' }, source: '', expected_version: 0 })
  await call('POST', '/budget', {
    category: 'campagne', label: 'Semences', quantity: '2,5', unit: 'kg', unit_price: '15 000',
    price_status: 'connu', source: 'Devis', price_date: '2026-10-01', request_id: crypto.randomUUID(),
  })
  await call('POST', '/budget', {
    category: 'investissement', label: 'Motopompe', quantity: '1', unit: 'unite', price_status: 'manquant',
    request_id: crypto.randomUUID(),
  })
  await call('POST', '/messages', { kind: 'question', body: 'Qui contacter ?', request_id: crypto.randomUUID() })
  const prep = await (await page.request.get(`/api/dossiers/${id}/preparation`)).json()
  return prep.actions[0].id as number
}

async function expectNoSeriousViolations(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  const summary = serious.map((v) => `${v.id} (${v.impact}) : ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)
  expect(summary, `Violations sur ${label}`).toEqual([])
}

async function expectNoHorizontalScroll(page: Page, label: string) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow, `Défilement horizontal sur ${label}`).toBeLessThanOrEqual(0)
}

test('accessibilité et largeur 360 px sur tous les écrans principaux', async ({ page }) => {
  test.setTimeout(120_000)
  await page.setViewportSize({ width: 360, height: 740 })

  for (const path of ['/connexion', '/inscription', '/aide']) {
    await page.goto(path)
    await expect(page.locator('h1')).toBeVisible()
    await expectNoSeriousViolations(page, path)
    await expectNoHorizontalScroll(page, path)
  }

  await register(page, 'Aissatou')
  await expectNoSeriousViolations(page, 'accueil sans projet')
  const id = await createProject(page)
  const actionId = await seedDossier(page, id)

  const pages = [
    '/dossiers',
    '/projets/nouveau',
    `/d/${id}`,
    `/d/${id}/projet`,
    `/d/${id}/projet/eau`,
    `/d/${id}/projet/budget`,
    `/d/${id}/plan`,
    `/d/${id}/plan/${actionId}`,
    `/d/${id}/relecture`,
    `/d/${id}/synthese`,
  ]
  for (const path of pages) {
    await page.goto(path)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByText('Chargement', { exact: false })).toHaveCount(0)
    await expectNoSeriousViolations(page, path)
    await expectNoHorizontalScroll(page, path)
  }
})
